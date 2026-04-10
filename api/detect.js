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

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const formData = new FormData();
    const blob = new Blob([buffer], { type: "image/jpeg" });
    formData.append("image", blob, "image.jpg");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/falconsai/nsfw_image_detection",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`
        },
        body: formData
      }
    );

    const result = await response.json();
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      error: "Error en el backend",
      detalle: error.message
    });
  }
}
