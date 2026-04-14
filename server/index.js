import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import cors from "cors";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

const API_KEY = process.env.DD_API_KEY;

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(req.file.path));
    form.append("action", "AI_GENERATED_DETECTION");

    const response = await fetch("https://deepdetect.app/api/analyze-image", {
      method: "POST",
      headers: {
        "dd-api-key": API_KEY
      },
      body: form
    });

    const data = await response.json();

    // eliminar archivo temporal
    fs.unlinkSync(req.file.path);

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error analyzing image" });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
