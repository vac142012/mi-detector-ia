Detector de Imágenes Generadas por Inteligencia Artificial
Proyecto Escolar – Tecnología / Computación
Este proyecto consiste en una página web capaz de analizar una imagen y estimar la probabilidad de que haya sido generada mediante Inteligencia Artificial (IA). Para lograrlo, se utiliza un servicio real llamado Hive AI, que ofrece modelos entrenados para detectar imágenes sintéticas.

¿Cómo funciona?
- El usuario sube una imagen desde su computador (JPG, PNG, etc.).
- La página envía esa imagen a un modelo de análisis alojado en la plataforma Hive AI.
- Hive procesa la imagen y devuelve un valor numérico llamado ai_generated_score, que representa la probabilidad de que la imagen sea artificial.
- La página muestra ese porcentaje de forma clara para que el usuario pueda interpretarlo.

Tecnologías utilizadas
- HTML5: estructura de la página.
- CSS: estilos básicos.
- JavaScript: lógica para leer la imagen, enviarla a la API y mostrar el resultado.
- Hive AI API (V3): servicio real que analiza la imagen.

¿Qué es una API?
Una API es una forma de que dos programas se comuniquen.
En este proyecto:
- La página web envía la imagen a Hive.
- Hive devuelve un análisis.
- La página muestra el resultado.

Seguridad y privacidad
- Las claves de acceso (Access Key y Secret Key) se usan para autenticar la petición.
- Este proyecto es educativo y no almacena imágenes ni datos del usuario.
- La imagen se envía solo a Hive para su análisis.

Limitaciones
- El resultado es una estimación, no una verdad absoluta.
- Los modelos pueden equivocarse, especialmente con imágenes editadas o comprimidas.
- El análisis depende de la calidad del modelo de Hive.

Cómo usar la página
- Abrir el archivo index.html en un navegador.
- Seleccionar una imagen.
- Presionar “Analizar imagen”.
- Leer el porcentaje mostrado.

Créditos
Proyecto realizado por: Victoria Aranguiz -  Victoria Prat
Asignatura: Tecnología
Año escolar: 2026
Tecnología de análisis: Hive AI – AI Generated Image Detection
