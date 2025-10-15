import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products?limit=50&page=1
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 500);
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const skip = (page - 1) * limit;
    const products = await Product.find().skip(skip).limit(limit).lean();
    res.json({ ok: true, count: products.length, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findOne({ id: parseInt(req.params.id, 10) }).lean();
    if (!p) return res.status(404).json({ ok: false, error: "Not found" });
    res.json({ ok: true, product: p });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
