export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const ACCESS_KEY = process.env.HIVE_ACCESS_KEY;
    const SECRET_KEY = process.env.HIVE_SECRET_KEY;

    if (!ACCESS_KEY || !SECRET_KEY) {
      return res.status(500).json({ error: "Faltan claves en el backend" });
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const formData = new FormData();
    const blob = new Blob([buffer], { type: "image/jpeg" });
    formData.append("image", blob, "image.jpg");

    const hiveResponse = await fetch(
      "https://api.thehive.ai/api/v3/ai-generated-image/detect",
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${ACCESS_KEY}`
        },
        body: formData
      }
    );

    const data = await hiveResponse.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: "Error en el backend",
      detalle: error.message
    });
  }
}
