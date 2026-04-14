function startApp() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}
async function uploadImage() {
  const input = document.getElementById("imageInput");
  const result = document.getElementById("result");

  if (!input.files.length) {
    result.innerText = "⚠️ Selecciona una imagen primero";
    return;
  }

  const file = input.files[0];

  // 🔗 Backend en Render
  const API_URL = "https://mi-detector-ia-backend.onrender.com";

  const formData = new FormData();
  formData.append("image", file);

  try {
    result.innerText = "🔍 Analizando imagen...";

    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error backend:", errorText);
      result.innerText = "❌ Error en el servidor";
      return;
    }

    const data = await response.json();
    console.log("Respuesta API:", data);

    // 🧠 Leer resultado de Sightengine
    const score = data?.type?.ai_generated;

    if (score === undefined) {
      result.innerText = "⚠️ No se pudo analizar la imagen";
      return;
    }

    const percentage = (score * 100).toFixed(2);

    if (score > 0.5) {
      result.innerText = `⚠️ Imagen probablemente generada por IA (${percentage}%)`;
    } else {
      result.innerText = `✅ Imagen probablemente real (${(100 - percentage).toFixed(2)}% confianza)`;
    }

  } catch (error) {
    console.error("Error conexión:", error);
    result.innerText = "❌ Error de conexión con el servidor";
  }
}
