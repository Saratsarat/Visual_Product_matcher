import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db.js";
import productsRouter from "./routes/products.js";
import searchRouter from "./routes/search.js";

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// health
app.get("/images", async (req, res) => {
  try {
    const images = await ImageModel.find(); // Replace ImageModel with your Mongoose model
    res.json(images);
  } catch (error) {
    res.status(500).send(error);
  }
});

// API
app.use("/api/products", productsRouter);
app.use("/api/search", searchRouter);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
