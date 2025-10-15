import express from "express";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import os from "os";
import fetch from "node-fetch";
import imghash from "imghash";
import Product from "../models/Product.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// helper: compute pHash of a local file (returns hex string)
function computeHash(filePath) {
  return new Promise((resolve, reject) => {
    // default options: bits=16 => 64-bit hash; you can change bits
    imghash.hash(filePath, 16, true, (error, data) => {
      if (error) return reject(error);
      resolve(data); // data is hex string
    });
  });
}

// helper: hamming distance between two hex strings
function hexToBinary(hex) {
  return hex.split("").map(c => parseInt(c, 16).toString(2).padStart(4, "0")).join("");
}
function hammingDistanceHex(a, b) {
  const ba = hexToBinary(a);
  const bb = hexToBinary(b);
  let dist = 0;
  for (let i = 0; i < Math.min(ba.length, bb.length); i++) if (ba[i] !== bb[i]) dist++;
  // if different lengths, count remainder
  dist += Math.abs(ba.length - bb.length);
  return dist;
}

// POST /api/search (multipart/form-data with 'file') OR POST { imageUrl: "..." }
router.post("/", upload.single("file"), async (req, res) => {
  let tmpPath;
  try {
    if (!req.file && !req.body.imageUrl) {
      return res.status(400).json({ ok: false, error: "Provide file upload (file) or imageUrl in body." });
    }

    if (req.file) {
      tmpPath = req.file.path;
    } else {
      // fetch the image to a temp file
      const url = req.body.imageUrl;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Failed to fetch image URL");
      const buffer = await resp.buffer();
      tmpPath = path.join(os.tmpdir(), `query_${Date.now()}.jpg`);
      await fs.writeFile(tmpPath, buffer);
    }

    // compute perceptual hash
    const queryHash = await computeHash(tmpPath);

    // load products that have image_hash computed
    const all = await Product.find({ image_hash: { $exists: true, $ne: null } }).lean();

    // compute hamming distances
    const scored = all.map(p => {
      const ph = p.image_hash;
      const dist = ph ? hammingDistanceHex(queryHash, ph) : Number.MAX_SAFE_INTEGER;
      return { product: p, distance: dist };
    });

    // sort ascending (smaller distance = more similar)
    scored.sort((a, b) => a.distance - b.distance);

    // return top 20 by default
    const topN = parseInt(req.query.limit || "20", 10);
    const results = scored.slice(0, topN).map(s => ({
      id: s.product.id,
      productDisplayName: s.product.productDisplayName,
      image_url: s.product.image_url,
      distance: s.distance
    }));

    // clean up
    try { await fs.unlink(tmpPath); } catch (e) {}

    res.json({ ok: true, queryHash, results });

  } catch (err) {
    console.error(err);
    try { if (tmpPath) await fs.unlink(tmpPath); } catch (_) {}
    res.status(500).json({ ok: false, error: err.message || "Server error" });
  }
});

export default router;
