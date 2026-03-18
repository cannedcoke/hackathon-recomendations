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

function applyMoodColor(mood) {
    const colors = moodColors[mood];
    if (!colors) return;

    document.body.style.backgroundColor = colors.bg;
    document.body.style.backgroundImage = `
        radial-gradient(circle at 20% 30%, ${colors.glow} 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, ${colors.glow} 0%, transparent 45%)
    `;
    document.querySelector("button[type='submit']").style.background = colors.bg;
    document.querySelector("button[type='submit']").style.color = isLight(colors.bg) ? "#222" : "#fff";
}

// check if a hex color is light so we can flip the button text color
function isLight(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

// apply color as soon as user picks a mood
document.querySelectorAll('input[name="mood"]').forEach(radio => {
    radio.addEventListener("change", () => applyMoodColor(radio.value));
});

const moodForm = document.getElementById("moodForm");

moodForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.querySelector('input[name="userId"]').value;
    const moodSelected = document.querySelector('input[name="mood"]:checked');

    if (!moodSelected) {
        alert("Por favor seleccioná un estado de ánimo.");
        return;
    }

    const mood = moodSelected.value;

    const response = await fetch("/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, mood })
    });

    if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
    }

    const data = await response.json();
    renderRecommendations(data.movies, mood);
});

const moviePosters = {
    "La La Land":               "/img/IMG_PELIS/Lalaland.jpg",
    "El Rey León":              "/img/IMG_PELIS/El_Rey_Leon.jpg",
    "Mad Max: Fury Road":       "/img/IMG_PELIS/Mad_Max.jpg",
    "Eterno Resplandor de una Mente sin Recuerdos": "/img/IMG_PELIS/Eterno_Resplandor_de_una_mente_sin_recuerdos.jpg",
    "Forrest Gump":             "/img/IMG_PELIS/Forrest_Gump_.jpg",
    "Joker":                    "/img/IMG_PELIS/Joker.jpg",
    "Interstellar":             "/img/IMG_PELIS/Interstellar.jpg",
    "Coco":                     "/img/IMG_PELIS/Coco.jpg",
    "Titanic":                  "/img/IMG_PELIS/Titanic.jpg",
    "El Gran Lebowski":         "/img/IMG_PELIS/El_Gran_Lebowski.jpg",
    "John Wick":                "/img/IMG_PELIS/John_Wick.jpg",
    "La Lista de Schindler":    "/img/IMG_PELIS/La_Lista_de_Schindler.jpg",
    "Mamma Mia":                "/img/IMG_PELIS/Mamma_Mia.jpg",
    "Inception":                "/img/IMG_PELIS/Inception.jpg",
    "Amélie":                   "/img/IMG_PELIS/Amelie.jpg",
    "Her":                      "/img/IMG_PELIS/Her.jpg",
    "The Revenant":             "/img/IMG_PELIS/The_Revenant.jpg",
    "Chef":                     "/img/IMG_PELIS/Chef.jpg",
    "Lost in Translation":      "/img/IMG_PELIS/Lost_in_Translation.jpg",
    "La Sociedad de los Poetas Muertos": "/img/IMG_PELIS/La_Sociedad_de_los_Poetas_Muertos.jpg",
};

function renderRecommendations(movies, mood) {
    const section = document.getElementById("recommendations");
    const grid = section.querySelector(".cards-grid");
    const title = section.querySelector(".rec-title span");

    title.textContent = mood;
    grid.innerHTML = "";

    if (!movies || movies.length === 0) {
        grid.innerHTML = `<p style="color:#fff; opacity:0.7;">No se encontraron películas para este estado de ánimo.</p>`;
    } else {
        movies.forEach(movie => {
            const card = document.createElement("article");
            card.classList.add("movie-card");

            const posterSrc = moviePosters[movie.title];
            const posterHTML = posterSrc
                ? `<img src="${posterSrc}" alt="${movie.title}" class="poster" />`
                : `<div class="poster-placeholder">🎬</div>`;

            card.innerHTML = `
                ${posterHTML}
                <div class="card-body">
                    <div class="card-title">${movie.title}</div>
                    <span class="card-genre">${mood}</span>
                    ${movie.description ? `<p class="card-desc">${movie.description}</p>` : ""}
                </div>
            `;

            grid.appendChild(card);
        });
    }

    section.classList.remove("hidden");
    section.scrollIntoView({ behavior: "smooth" });
}


// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.redirected) {
                window.location.href = response.url;
                return;
            }

            window.location.href = "/login";
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión.");
        }
    });
}
