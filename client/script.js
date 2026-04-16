// elementos
const input = document.getElementById("imageInput");
const preview = document.getElementById("previewImage");
const result = document.getElementById("result");
const loader = document.getElementById("loader");

const API_URL = "https://mi-detector-ia-backend.onrender.com";

// ocultar preview al inicio
preview.style.display = "none";

// intro
function startApp() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("app").classList.remove("hidden");
}

// mostrar imagen
input.addEventListener("change", () => {
  const file = input.files[0];

  if (file) {
    const url = URL.createObjectURL(file);

    preview.src = url;
    preview.style.display = "block";

    result.innerText = "";
  }
});

// analizar imagen
async function uploadImage() {
  if (!input.files.length) {
    result.innerText = "Selecciona una imagen";
    return;
  }

  const formData = new FormData();
  formData.append("image", input.files[0]);

  loader.classList.remove("hidden");

  try {
    const response = await fetch(`${API_URL}/detect`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      loader.classList.add("hidden");
      result.innerText = "Error en el servidor";
      return;
    }

    const data = await response.json();

    loader.classList.add("hidden");

    const score = data?.type?.ai_generated;

    if (score === undefined) {
      result.innerText = "No se pudo analizar";
      return;
    }

    const percentage = (score * 100).toFixed(2);

    // ================================
    //  DONUT (AGREGADO, NO ROMPE NADA)
    // ================================
    const resultBox = document.getElementById("resultBox");
    const donutFill = document.getElementById("donutFill");
    const donutPercent = document.getElementById("donutPercent");
    const resultLabel = document.getElementById("resultLabel");

    resultBox.classList.remove("hidden");

    const angle = percentage * 3.6;

    donutFill.style.background =
      score > 0.5
        ? `conic-gradient(#b91c1c ${angle}deg, #e5e7eb ${angle}deg)`
        : `conic-gradient(#166534 ${angle}deg, #e5e7eb ${angle}deg)`;

    donutPercent.innerText = `${percentage}%`;

    resultLabel.innerText = score > 0.5 ? "IA detectada" : "Imagen real";
    resultLabel.style.color = score > 0.5 ? "#b91c1c" : "#166534";

    // ================================
    //  MANTENGO TU RESULTADO ORIGINAL
    // ================================
    if (score > 0.5) {
      result.innerText = `IA detectada (${percentage}%)`;
      result.style.color = "#b91c1c";
    } else {
      result.innerText = `Imagen real (${(100 - percentage).toFixed(2)}%)`;
      result.style.color = "#166534";
    }

  } catch (error) {
    console.error(error);
    loader.classList.add("hidden");
    result.innerText = "Error de conexión";
  }
}
