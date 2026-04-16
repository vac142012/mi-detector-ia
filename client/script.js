document.addEventListener("DOMContentLoaded", () => {

  const els = {
    input: document.getElementById("imageInput"),
    preview: document.getElementById("previewImage"),
    result: document.getElementById("result"),
    loader: document.getElementById("loader"),
    resultBox: document.getElementById("resultBox"),
    donutFill: document.getElementById("donutFill"),
    donutPercent: document.getElementById("donutPercent"),
    resultLabel: document.getElementById("resultLabel"),
    intro: document.getElementById("intro"),
    app: document.getElementById("app")
  };

  const API_URL = "https://mi-detector-ia-backend.onrender.com";

  // =========================
  // CONFIG RANGOS PRO
  // =========================
  const RANGES = {
    VERY_AI: 0.85,
    PROB_AI: 0.65,
    UNCERTAIN: 0.35,
    PROB_REAL: 0.15
  };

  if (els.preview) els.preview.style.display = "none";

  // =========================
  // UI
  // =========================
  function showLoader() {
    els.loader?.classList.remove("hidden");
  }

  function hideLoader() {
    els.loader?.classList.add("hidden");
  }

  function resetUI() {
    els.result.innerText = "";
    els.resultBox?.classList.add("hidden");
  }

  function updateUI(score, percentage) {
    let color, label, text;

    if (score >= RANGES.VERY_AI) {
      color = "#991b1b";
      label = "IA muy probable";
      text = `🚨 IA casi segura (${percentage}%)`;

    } else if (score >= RANGES.PROB_AI) {
      color = "#dc2626";
      label = "Probablemente IA";
      text = `⚠️ Probablemente IA (${percentage}%)`;

    } else if (score >= RANGES.UNCERTAIN) {
      color = "#f59e0b";
      label = "Resultado incierto";
      text = `🤔 Resultado incierto (${percentage}%)`;

    } else if (score >= RANGES.PROB_REAL) {
      color = "#16a34a";
      label = "Probablemente real";
      text = `🟢 Probablemente real (${(100 - percentage).toFixed(2)}%)`;

    } else {
      color = "#166534";
      label = "Imagen real";
      text = `✅ Imagen real (${(100 - percentage).toFixed(2)}%)`;
    }

    const angle = percentage * 3.6;

    if (els.donutFill) {
      els.donutFill.style.background =
        `conic-gradient(${color} ${angle}deg, #e5e7eb ${angle}deg)`;
    }

    if (els.donutPercent) {
      els.donutPercent.innerText = `${percentage}%`;
    }

    if (els.resultLabel) {
      els.resultLabel.innerText = label;
      els.resultLabel.style.color = color;
    }

    els.result.innerText = text;
    els.result.style.color = color;

    els.resultBox?.classList.remove("hidden");
  }

  // =========================
  // EVENTOS
  // =========================
  els.input?.addEventListener("change", () => {
    const file = els.input.files[0];

    if (file && els.preview) {
      els.preview.src = URL.createObjectURL(file);
      els.preview.style.display = "block";
      resetUI();
    }
  });

  // =========================
  // FUNCIONES GLOBALES
  // =========================
  window.startApp = () => {
    els.intro.style.display = "none";
    els.app.classList.remove("hidden");
  };

  window.uploadImage = async () => {
    if (!els.input?.files.length) {
      els.result.innerText = "⚠️ Selecciona una imagen";
      return;
    }

    showLoader();

    const formData = new FormData();
    formData.append("image", els.input.files[0]);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      const score = data?.type?.ai_generated;

      if (score === undefined) throw new Error();

      const percentage = Number((score * 100).toFixed(2));

      updateUI(score, percentage);

    } catch (err) {
      console.error(err);
      els.result.innerText = "❌ Error al analizar";
    } finally {
      hideLoader();
    }
  };

});
