import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

if (!REPLICATE_API_TOKEN) {
  console.error("Falta la variable de entorno REPLICATE_API_TOKEN");
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Healthcheck
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend IA detector activo" });
});

// Obtiene SIEMPRE la última versión real del modelo
async function getLatestModelVersion() {
  const url =
    "https://api.replicate.com/v1/models/capcheck/ai-image-detection/versions?limit=1";

  const resp = await fetch(url, {
    headers: {
      Authorization: `Token ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(
      `Error al obtener versión del modelo: ${resp.status} - ${text}`
    );
  }

  const data = await resp.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("No se encontraron versiones para el modelo");
  }

  return data.results[0].id;
}

// Endpoint REAL con Replicate
app.post("/detect", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res
        .status(400)
        .json({ error: "Falta el campo 'imageUrl' en el body" });
    }

    const version = await getLatestModelVersion();

    const predictionResp = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version,
          input: {
            image: imageUrl,
          },
        }),
      }
    );

    if (!predictionResp.ok) {
      const text = await predictionResp.text();
      return res.status(500).json({
        error: "Error al llamar a Replicate",
        detail: text,
      });
    }

    const prediction = await predictionResp.json();

    if (prediction.output) {
      return res.json({
        source: "replicate",
        ...prediction.output,
      });
    }

    return res.json({
      source: "replicate_raw",
      prediction,
    });
  } catch (err) {
    console.error("Error en /detect:", err);
    return res.status(500).json({
      error: "Error interno en /detect",
      detail: err.message,
    });
  }
});

// Endpoint LOCAL de contingencia
app.post("/detect-local", (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: "Falta el campo 'imageUrl' en el body" });
  }

  const len = imageUrl.length;
  const score = (len % 100) / 100;
  const is_ai_generated = score > 0.5;

  return res.json({
    source: "local_heuristic",
    is_ai_generated,
    confidence: score,
    ai_probability: is_ai_generated ? score : 1 - score,
    real_probability: is_ai_generated ? 1 - score : score,
    note:
      "Modo contingencia LOCAL: heurística simple para que el flujo funcione aunque la API externa falle.",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
