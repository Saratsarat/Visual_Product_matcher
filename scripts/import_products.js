import fs from "fs/promises";
import path from "path";
import os from "os";
import fetch from "node-fetch";
import imghash from "imghash";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/visual_matcher";
const productsFile = path.resolve("./products_250.json");

// connect mongoose
await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Product = (await import("../src/models/Product.js")).default;

// helper to compute hash (wrap callback)
function computeHash(filePath) {
  return new Promise((resolve, reject) => {
    imghash.hash(filePath, 16, true, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

async function fetchToTmp(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed fetching ${url}: ${res.status}`);
  const buffer = await res.buffer();
  const tmp = path.join(os.tmpdir(), `import_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`);
  await fs.writeFile(tmp, buffer);
  return tmp;
}

async function main() {
  console.log("Reading", productsFile);
  const raw = await fs.readFile(productsFile, "utf8");
  const items = JSON.parse(raw);
  console.log(`Found ${items.length} items.`);

  let i = 0;
  for (const it of items) {
    i++;
    try {
      if (!it.image_url) {
        console.log(`#${i}: skipping id ${it.id} (no image URL)`);
        continue;
      }
      // download image
      const tmp = await fetchToTmp(it.image_url);
      const hash = await computeHash(tmp);
      await fs.unlink(tmp).catch(()=>{});
      // upsert into DB
      await Product.updateOne({ id: it.id }, { $set: { ...it, image_hash: hash } }, { upsert: true });
      console.log(`#${i}: imported id ${it.id} hash=${hash}`);
    } catch (err) {
      console.warn(`#${i}: failed id ${it.id} - ${err.message}`);
    }
  }
  console.log("Done import.");
  process.exit(0);
}

main().catch(err => {
  console.error("Import error", err);
  process.exit(1);
});
