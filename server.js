import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend IA detector activo" });
});

app.post("/detect", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Falta el archivo de imagen" });
    }

    const base64 = req.file.buffer.toString("base64");
    const imageData = `data:${req.file.mimetype};base64,${base64}`;

    const predictionResp = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "latest",
        input: { image: imageData }
      }),
    });

    const prediction = await predictionResp.json();
    return res.json(prediction.output || prediction);

  } catch (err) {
    return res.status(500).json({ error: "Error interno", detail: err.message });
  }
});

app.listen(PORT, () => console.log("Servidor escuchando en puerto " + PORT));
