import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Habilitar CORS para permitir requests desde Vercel
app.use(cors());

// Permitir recibir imágenes crudas
app.use(express.raw({ type: "image/*", limit: "20mb" }));

app.post("/detect", async (req, res) => {
  try {
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "Falta HF_TOKEN" });
    }

    const buffer = req.body;

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: "No se recibió imagen" });
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/unifiedai/image-moderation",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "image/jpeg"
        },
        body: buffer
      }
    );

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "La API devolvió HTML o formato inválido",
        raw: text
      });
    }

    return res.json(result);

  } catch (error) {
    return res.status(500).json({
      error: "Error en backend",
      detalle: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
