import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// Permitir solicitudes desde Vercel
app.use(cors());

// Recibir imágenes crudas
app.use(express.raw({ type: "image/*", limit: "20mb" }));

app.post("/detect", async (req, res) => {
  try {
    console.log("Solicitud recibida en /detect");

    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      console.log("ERROR: Falta HF_TOKEN");
      return res.status(500).json({ error: "Falta HF_TOKEN" });
    }

    const buffer = req.body;

    if (!buffer || buffer.length === 0) {
      console.log("ERROR: No llegó imagen");
      return res.status(400).json({ error: "No se recibió imagen" });
    }

    console.log("Imagen recibida:", buffer.length, "bytes");

    // Modelo que SÍ acepta imágenes grandes
    const HF_MODEL = "HuggingFaceH4/idefics2-vision-alpha";

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
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
    console.log("Respuesta cruda de HuggingFace:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.log("ERROR: HuggingFace devolvió HTML o texto no JSON");
      return res.status(500).json({
        error: "La API devolvió un formato inválido",
        raw: text
      });
    }

    return res.json(result);

  } catch (error) {
    console.log("ERROR en backend:", error.message);
    return res.status(500).json({
      error: "Error interno en backend",
      detalle: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
