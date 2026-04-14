async function uploadImage() {
  const input = document.getElementById("imageInput");
  const result = document.getElementById("result");

  if (!input.files.length) {
    result.innerText = "⚠️ Selecciona una imagen primero";
    return;
  }

  const formData = new FormData();
  formData.append("image", input.files[0]);

  // 🔗 TU BACKEND EN RENDER
  const API_URL = "https://mi-detector-ia-backend.onrender.com";

  try {
    result.innerText = "🔍 Analizando imagen...";

    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      body: formData
    });

    // ❌ error del backend
    if (!response.ok) {
      const errText = await response.text();
      console.error("Error backend:", errText);
      result.innerText = "❌ Error en el servidor";
      return;
    }

    const data = await response.json();

    console.log("Respuesta API:", data);

    // 🧠 Ajusta según respuesta de Deep Detect
    const confidence = data.confidence
      ? (data.confidence * 100).toFixed(2)
      : "N/A";

    if (data.ai_generated === true) {
      result.innerText = `⚠️ Imagen GENERADA por IA (${confidence}%)`;
    } else if (data.ai_generated === false) {
      result.innerText = `✅ Imagen REAL (${confidence}%)`;
    } else {
      result.innerText = "⚠️ No se pudo determinar la imagen";
    }

  } catch (error) {
    console.error(error);
    result.innerText = "❌ Error de conexión con el servidor";
  }
}
