// Objeto que relaciona cada mood con un color de fondo y un color de brillo
// Se usa para cambiar visualmente la página según el estado de ánimo seleccionado
const moodColors = {
    feliz:      { bg: "#f5c800", glow: "rgba(245, 200, 0, 0.3)" },
    triste:     { bg: "#4a90d9", glow: "rgba(74, 144, 217, 0.3)" },
    romantico:  { bg: "#e8568a", glow: "rgba(232, 86, 138, 0.3)" },
    accion:     { bg: "#e84c1a", glow: "rgba(232, 76, 26, 0.3)" },
    relajado:   { bg: "#52c46a", glow: "rgba(82, 196, 106, 0.3)" },
    intrigado:  { bg: "#8b5cf6", glow: "rgba(139, 92, 246, 0.3)" },
    nostalgico: { bg: "#f97316", glow: "rgba(249, 115, 22, 0.3)" },
    inspirado:  { bg: "#06b6d4", glow: "rgba(6, 182, 212, 0.3)" },
    aburrido:   { bg: "#6b7280", glow: "rgba(107, 114, 128, 0.3)" },
};

// Función que aplica el color correspondiente al mood elegido
// Cambia el color de fondo del body y también el estilo del botón submit
function applyMoodColor(mood) {
    const colors = moodColors[mood];
    if (!colors) return;

    // Cambia el color de fondo principal de la página
    document.body.style.backgroundColor = colors.bg;

    // Agrega brillos decorativos usando gradientes radiales
    document.body.style.backgroundImage = `
        radial-gradient(circle at 20% 30%, ${colors.glow} 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, ${colors.glow} 0%, transparent 45%)
    `;

    // Busca el botón submit del formulario de moods
    const submitButton = document.querySelector("#moodForm button[type='submit']");
    if (submitButton) {

        // Cambia el color del botón según el mood
        submitButton.style.background = colors.bg;

        // Cambia el color del texto según si el fondo es claro u oscuro
        submitButton.style.color = isLight(colors.bg) ? "#222" : "#fff";
    }
}

// Función auxiliar que detecta si un color hexadecimal es claro
// Sirve para decidir si el texto debe ser oscuro o blanco
function isLight(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

// Agrega un listener a cada radio button de mood
// Cuando el usuario cambia de mood, se actualizan los colores de la página
document.querySelectorAll('input[name="mood"]').forEach((radio) => {
    radio.addEventListener("change", () => applyMoodColor(radio.value));
});

// Obtiene el formulario principal donde el usuario selecciona su mood
const moodForm = document.getElementById("moodForm");

// Verifica que el formulario exista antes de trabajar con él
if (moodForm) {

    // Escucha el envío del formulario
    moodForm.addEventListener("submit", async (e) => {

        // Evita que la página se recargue al enviar el form
        e.preventDefault();

        // Busca el input oculto con el userId
        const userIdInput = document.querySelector('input[name="userId"]');

        // Busca el mood que el usuario seleccionó
        const moodSelected = document.querySelector('input[name="mood"]:checked');

        // Si no eligió ningún mood, muestra alerta y corta la ejecución
        if (!moodSelected) {
            alert("Por favor seleccioná un estado de ánimo.");
            return;
        }

        // Obtiene el userId si existe, si no deja null
        const userId = userIdInput ? userIdInput.value : null;

        // Guarda el mood elegido
        const mood = moodSelected.value;

        // Hace una petición POST al backend para pedir recomendaciones
        const response = await fetch("/recommendations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, mood })
        });

        // Si el backend responde con error, muestra el mensaje
        if (!response.ok) {
            const data = await response.json();
            alert(data.message);
            return;
        }

        // Si todo sale bien, recibe la lista de películas y la renderiza
        const data = await response.json();
        renderRecommendations(data.movies, mood);
    });
}

// Objeto que relaciona títulos de películas con sus imágenes de portada
// Se usa para mostrar una imagen local si esa película existe en el mapeo
const moviePosters = {
    "La La Land": "/img/IMG_PELIS/Lalaland.jpg",
    "El Rey León": "/img/IMG_PELIS/El_Rey_Leon.jpg",
    "Mad Max: Fury Road": "/img/IMG_PELIS/Mad_Max.jpg",
    "Eterno Resplandor de una Mente sin Recuerdos": "/img/IMG_PELIS/Eterno_Resplandor_de_una_mente_sin_recuerdos.jpg",
    "Forrest Gump": "/img/IMG_PELIS/Forrest_Gump_.jpg",
    "Joker": "/img/IMG_PELIS/Joker.jpg",
    "Interstellar": "/img/IMG_PELIS/Interstellar.jpg",
    "Coco": "/img/IMG_PELIS/Coco.jpg",
    "Titanic": "/img/IMG_PELIS/Titanic.jpg",
    "El Gran Lebowski": "/img/IMG_PELIS/El_Gran_Lebowski.jpg",
    "John Wick": "/img/IMG_PELIS/John_Wick.jpg",
    "La Lista de Schindler": "/img/IMG_PELIS/La_Lista_de_Schindler.jpg",
    "Mamma Mia": "/img/IMG_PELIS/Mamma_Mia.jpg",
    "Inception": "/img/IMG_PELIS/Inception.jpg",
    "Amélie": "/img/IMG_PELIS/Amelie.jpg",
    "Her": "/img/IMG_PELIS/Her.jpg",
    "The Revenant": "/img/IMG_PELIS/The_Revenant.jpg",
    "Chef": "/img/IMG_PELIS/Chef.jpg",
    "Lost in Translation": "/img/IMG_PELIS/Lost_in_Translation.jpg",
    "La Sociedad de los Poetas Muertos": "/img/IMG_PELIS/La_Sociedad_de_los_Poetas_Muertos.jpg",
};

// Función que muestra en pantalla las recomendaciones recibidas del backend
function renderRecommendations(movies, mood) {

    // Busca la sección donde van a aparecer las recomendaciones
    const section = document.getElementById("recommendations");

    // Busca el contenedor donde se insertan las cards
    const grid = section.querySelector(".cards-grid");

    // Busca el span donde se muestra el mood elegido en el título
    const title = section.querySelector(".rec-title span");

    // Actualiza el título con el mood actual
    title.textContent = mood;

    // Limpia las recomendaciones anteriores antes de mostrar nuevas
    grid.innerHTML = "";

    // Limita la cantidad de películas mostradas a 4
    const limitedMovies = movies.slice(0, 4);

    // Si no hay películas, muestra un mensaje al usuario
    if (!limitedMovies || limitedMovies.length === 0) {
        grid.innerHTML = `<p style="color:#fff; opacity:0.7;">No se encontraron películas para este estado de ánimo.</p>`;
    } else {

        // Recorre las películas y crea una card para cada una
        limitedMovies.forEach((movie) => {
            const card = document.createElement("article");
            card.classList.add("movie-card");

            // Busca si existe una portada local para esa película
            const posterSrc = moviePosters[movie.title];

            // Si existe imagen, usa <img>; si no, muestra un placeholder
            const posterHTML = posterSrc
                ? `<img src="${posterSrc}" alt="${movie.title}" class="poster" />`
                : `<div class="poster-placeholder">🎬</div>`;

            // Construye el contenido HTML de la card
            card.innerHTML = `
                ${posterHTML}
                <div class="card-body">
                    <div class="card-title">${movie.title}</div>
                    <span class="card-genre">${mood}</span>
                    ${movie.description ? `<p class="card-desc">${movie.description}</p>` : ""}
                </div>
            `;

            // Inserta la card dentro del grid
            grid.appendChild(card);
        });
    }

    // Hace visible la sección de recomendaciones
    section.classList.remove("hidden");

    // Hace scroll suave hacia la sección para que el usuario la vea
    section.scrollIntoView({ behavior: "smooth" });
}

// logout

// Busca el botón de logout en la página
const logoutBtn = document.getElementById("logoutBtn");

// Verifica que el botón exista antes de agregarle eventos
if (logoutBtn) {

    // Escucha el click en el botón de logout
    logoutBtn.addEventListener("click", async () => {
        try {

            // Hace una petición POST al backend para cerrar sesión / salir
            const response = await fetch("/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            // Si el backend responde con redirect, navega a esa URL
            if (response.redirected) {
                window.location.href = response.url;
                return;
            }

            // Si no viene redirect explícito, manda al usuario al login
            window.location.href = "/login";
        } catch (error) {

            // Si ocurre un error en la petición, lo muestra en consola y alerta
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión.");
        }
    });
}