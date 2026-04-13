import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.raw({ type: "image/*", limit: "20mb" }));

app.post("/detect", async (req, res) => {
  try {
    console.log("Solicitud recibida en /detect");

    const buffer = req.body;

    if (!buffer || buffer.length === 0) {
      console.log("ERROR: No llegó imagen");
      return res.status(400).json({ error: "No se recibió imagen" });
    }

    console.log("Imagen recibida:", buffer.length, "bytes");

    // MODELO REAL, EXISTENTE Y FUNCIONAL
    const response = await fetch(
      "https://fal.run/fal-ai/ai-image-detector",
      {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg"
        },
        body: buffer
      }
    );

    const text = await response.text();
    console.log("Respuesta cruda FAL:", text);

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.log("ERROR: FAL devolvió formato inválido");
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
