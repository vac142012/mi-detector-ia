async function uploadImage() {
  const input = document.getElementById("imageInput");
  const result = document.getElementById("result");

  if (!input.files.length) {
    result.innerText = "Selecciona una imagen";
    return;
  }

  const formData = new FormData();
  formData.append("image", input.files[0]);

  result.innerText = "Analizando...";

  try {
    const response = await fetch("http://localhost:3000/analyze", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.ai_generated) {
      result.innerText = `⚠️ Imagen generada por IA (${(data.confidence * 100).toFixed(2)}%)`;
    } else {
      result.innerText = `✅ Imagen real (${(data.confidence * 100).toFixed(2)}%)`;
    }

  } catch (error) {
    result.innerText = "Error al analizar";
  }
}
