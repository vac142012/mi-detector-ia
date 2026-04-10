export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const HF_TOKEN = process.env.HF_TOKEN;

    if (!HF_TOKEN) {
      return res.status(500).json({ error: "Falta HF_TOKEN en Vercel" });
    }

    // Leer la imagen enviada desde el frontend
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: "No se recibió ninguna imagen" });
    }

    // Llamar al modelo REAL que sí funciona y sí devuelve JSON
    const response = await fetch(
      "https://api-inference.huggingface.co/models/falconsai/nsfw_image_detection",
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

    // Intentar parsear JSON
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "La API devolvió una respuesta no válida",
        raw: text
      });
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      error: "Error en el backend",
      detalle: error.message
    });
  }
}
