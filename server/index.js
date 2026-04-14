import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import cors from "cors";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

const USER = process.env.SE_USER;
const SECRET = process.env.SE_SECRET;

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const form = new FormData();
    form.append("media", fs.createReadStream(req.file.path));

    // 🚀 Sightengine API
    const url = `https://api.sightengine.com/1.0/check.json?models=genai&api_user=${USER}&api_secret=${SECRET}`;

    const response = await fetch(url, {
      method: "POST",
      body: form
    });

    const data = await response.json();

    fs.unlinkSync(req.file.path);

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo");
});
