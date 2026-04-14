// elementos
const input = document.getElementById("imageInput");
const preview = document.getElementById("previewImage");
const loader = document.getElementById("loader");
const analyzeBtn = document.getElementById("analyzeBtn");
const startBtn = document.getElementById("startBtn");

const API_URL = "https://mi-detector-ia-backend.onrender.com";

let currentImageURL = null;

// eventos
startBtn.addEventListener("click", startApp);
analyzeBtn.addEventListener("click", uploadImage);

// iniciar app
function startApp() {
document.getElementById("intro").style.display = "none";
document.getElementById("app").classList.remove("hidden");
}

// preview imagen
input.addEventListener("change", () => {
const file = input.files[0];

if (!file) return;

if (!file.type.startsWith("image/")) {
alert("Archivo no válido");
return;
}

if (file.size > 5 * 1024 * 1024) {
alert("Máximo 5MB");
return;
}

if (currentImageURL) {
URL.revokeObjectURL(currentImageURL);
}

const url = URL.createObjectURL(file);
currentImageURL = url;

preview.src = url;
preview.style.display = "block";

resetResult();
});

// analizar
async function uploadImage() {
if (!input.files.length) {
alert("Selecciona una imagen");
return;
}

const formData = new FormData();
formData.append("image", input.files[0]);

loader.classList.remove("hidden");
analyzeBtn.disabled = true;

try {
const res = await fetch(`${API_URL}/analyze`, {
method: "POST",
body: formData
});

```
if (!res.ok) throw new Error();

const data = await res.json();
const score = data?.type?.ai_generated;

if (score === undefined) throw new Error();

showResult(score);
```

} catch {
alert("Error al analizar");
} finally {
loader.classList.add("hidden");
analyzeBtn.disabled = false;
}
}

// mostrar resultado
function showResult(score) {
const box = document.getElementById("resultBox");
const label = document.getElementById("resultLabel");
const percent = document.getElementById("resultPercent");
const bar = document.getElementById("progressBar");

const percentage = (score * 100).toFixed(2);

box.classList.remove("hidden");

if (score >= 0.75) {
label.innerText = "⚠️ Probablemente IA";
label.style.color = "#f87171";
} else if (score <= 0.25) {
label.innerText = "✅ Probablemente real";
label.style.color = "#4ade80";
} else {
label.innerText = "🤔 Resultado incierto";
label.style.color = "#facc15";
}

percent.innerText = `${percentage}%`;

setTimeout(() => {
bar.style.width = `${percentage}%`;
}, 100);
}

// reset resultado
function resetResult() {
const box = document.getElementById("resultBox");
const bar = document.getElementById("progressBar");

box.classList.add("hidden");
bar.style.width = "0%";
}
