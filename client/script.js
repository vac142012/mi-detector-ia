// elementos
const input = document.getElementById("imageInput");
const preview = document.getElementById("previewImage");
const result = document.getElementById("result");
const loader = document.getElementById("loader");

const API_URL = "https://mi-detector-ia-backend.onrender.com";

// intro
function startApp() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

// preview imagen
input.addEventListener("change", () => {
  const file = input.files[0];

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    result.innerText = "";
  }
});

// analizar imagen
async function uploadImage() {
  if (!input.files.length) {
    result.innerText = "⚠️ Selecciona una imagen";
    return;
  }

  const formData = new FormData();
  formData.append("image", input.files[0]);

  loader.classList.remove("hidden");

  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      result.innerText = "❌ Error en el servidor";
      loader.classList.add("hidden");
      return;
    }

    const data = await response.json();
    loader.classList.add("hidden");

    const score = data?.type?.ai_generated;

    if (score === undefined) {
      result.innerText = "⚠️ No se pudo analizar";
      return;
    }

    const percentage = (score * 100).toFixed(2);

    if (score > 0.5) {
      result.innerText = `⚠️ IA detectada (${percentage}%)`;
      result.style.color = "#f87171";
    } else {
      result.innerText = `✅ Imagen real (${(100 - percentage).toFixed(2)}%)`;
      result.style.color = "#4ade80";
    }

  } catch (error) {
    console.error(error);
    loader.classList.add("hidden");
    result.innerText = "❌ Error de conexión";
  }
}
