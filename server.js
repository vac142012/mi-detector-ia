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

    const token = process.env.REPLICATE_API_TOKEN;

    if (!token) {
      console.log("ERROR: Falta REPLICATE_API_TOKEN");
      return res.status(500).json({ error: "Falta REPLICATE_API_TOKEN" });
    }

    // Llamada al modelo AI OR NOT
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "a2e3f8b6f3c1f5e4b6a7d8c9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f", 
        input: {
          image: `data:image/jpeg;base64,${buffer.toString("base64")}`
        }
      })
    });

    const prediction = await response.json();
    console.log("Respuesta cruda Replicate:", prediction);

    if (prediction.error) {
      return res.status(500).json({ error: prediction.error });
    }

    // Esperar resultado final
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(r => setTimeout(r, 1000));

      const poll = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: { "Authorization": `Token ${token}` }
        }
      );

      result = await poll.json();
      console.log("Estado:", result.status);
    }

    if (result.status === "failed") {
      return res.status(500).json({ error: "El modelo falló" });
    }

    return res.json(result.output);

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
