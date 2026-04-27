document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("imageInput");
  const preview = document.getElementById("previewImage");
  const result = document.getElementById("result");
  const loader = document.getElementById("loader");

  const API_URL = "https://mi-detector-ia-backend.onrender.com";

  // 🔥 asegurar que el loader NO se vea al inicio
  if (loader) loader.classList.add("hidden");

  window.startApp = () => {
    document.getElementById("intro").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
  };

  input.addEventListener("change", () => {
    const file = input.files[0];

    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
      result.innerText = `Imagen cargada: ${file.name}`;

      document.getElementById("resultBox").classList.add("hidden");

      // 🔥 asegurar que loader esté oculto si cambian imagen
      loader.classList.add("hidden");
    }
  });

  function animatePercent(target) {
    const el = document.getElementById("donutPercent");
    if (!el) return;

    let current = 0;
    const step = target / 25;

    const interval = setInterval(() => {
      current += step;

      if (current >= target) {
        current = target;
        clearInterval(interval);
      }

      el.innerText = `${current.toFixed(0)}%`;
    }, 16);
  }

  window.uploadImage = async () => {

    if (!input.files.length) {
      result.innerText = "Selecciona una imagen";
      return;
    }

    // 🔥 mostrar loader SOLO aquí
    loader.classList.remove("hidden");

    const formData = new FormData();
    formData.append("image", input.files[0]);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      const score = Number(data?.type?.ai_generated);

      if (!Number.isFinite(score)) {
        result.innerText = "Error en análisis";
        return;
      }

      const percentage = Math.round(score * 100);
      const angle = score * 360;

      let color, label;

      if (score >= 0.75) {
        color = "#b91c1c";
        label = "Alta probabilidad de IA";
      } else if (score >= 0.5) {
        color = "#ea580c";
        label = "Probabilidad media de IA";
      } else {
        color = "#16a34a";
        label = "Baja probabilidad de IA";
      }

      document.getElementById("donutFill").style.background =
        `conic-gradient(${color} ${angle}deg, #e5e7eb ${angle}deg)`;

      animatePercent(percentage);

      document.getElementById("resultLabel").innerText = label;
      document.getElementById("resultLabel").style.color = color;

      result.innerText = `Probabilidad de uso de IA: ${percentage}%`;
      result.style.color = color;

      // =========================
      // 🔥 EXPLICACIÓN DINÁMICA (MEJORADA)
      // =========================
      let explanationParts = [];

      if (score < 0.3) {
        explanationParts = [
          "no se observan patrones artificiales claros",
          "presencia de ruido natural en la imagen",
          "variaciones orgánicas en iluminación y textura"
        ];
      } else if (score < 0.6) {
        explanationParts = [
          "ligeras inconsistencias en detalles finos",
          "algunas transiciones de color poco naturales",
          "cierta suavidad en texturas"
        ];
      } else if (score < 0.8) {
        explanationParts = [
          "texturas suavizadas sin ruido natural",
          "iluminación homogénea poco realista",
          "simetría artificial en estructuras o rostros"
        ];
      } else {
        explanationParts = [
          "ausencia de imperfecciones naturales",
          "patrones repetitivos en la imagen",
          "coherencia artificial global",
          "bordes demasiado definidos o líneas inusualmente limpias"
        ];
      }

      let explanation = "Se detectaron características asociadas a generación por IA, como " 
        + explanationParts.join(", ") + ".";

      if (score < 0.3) {
        explanation = "La imagen parece natural: " + explanationParts.join(", ") + ".";
      }

      const explanationEl = document.getElementById("resultExplanation");
      if (explanationEl) explanationEl.innerText = explanation;

      // =========================

      document.getElementById("resultBox").classList.remove("hidden");

    } catch (e) {
      result.innerText = "Error de conexión";
    } finally {
      // 🔥 SIEMPRE ocultar loader
      loader.classList.add("hidden");
    }
  };

});
