document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("imageInput");
  const preview = document.getElementById("previewImage");
  const result = document.getElementById("result");
  const loader = document.getElementById("loader");

  const API_URL = "https://mi-detector-ia-backend.onrender.com";

  if (preview) preview.style.display = "none";

  // 👇 importante para HTML
  window.startApp = function () {
    document.getElementById("intro").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
  };

  if (input) {
    input.addEventListener("change", () => {
      const file = input.files[0];

      if (file && preview) {
        const url = URL.createObjectURL(file);
        preview.src = url;
        preview.style.display = "block";
        result.innerText = "";
      }
    });
  }

  window.uploadImage = async function () {
    if (!input || !input.files.length) {
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
        loader.classList.add("hidden");
        result.innerText = "❌ Error en el servidor";
        return;
      }

      const data = await response.json();
      loader.classList.add("hidden");

      const score = data?.type?.ai_generated;

      if (score === undefined) {
        result.innerText = "⚠️ No se pudo analizar";
        return;
      }

      const percentage = Number((score * 100).toFixed(2)); // 👈 FIX

      // donut
      const resultBox = document.getElementById("resultBox");
      const donutFill = document.getElementById("donutFill");
      const donutPercent = document.getElementById("donutPercent");
      const resultLabel = document.getElementById("resultLabel");

      if (resultBox) resultBox.classList.remove("hidden");

      const angle = percentage * 3.6;

      if (donutFill) {
        donutFill.style.background =
          score > 0.5
            ? `conic-gradient(#b91c1c ${angle}deg, #e5e7eb ${angle}deg)`
            : `conic-gradient(#166534 ${angle}deg, #e5e7eb ${angle}deg)`;
      }

      if (donutPercent) donutPercent.innerText = `${percentage}%`;

      if (resultLabel) {
        resultLabel.innerText = score > 0.5 ? "IA detectada" : "Imagen real";
        resultLabel.style.color = score > 0.5 ? "#b91c1c" : "#166534";
      }

      // lógica original
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
  };

});
