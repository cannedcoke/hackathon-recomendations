// controllers/mainPageControllerSqlite.js

const {
  encontrarUsuarioPorId,
  obtenerPeliculasPorGeneros,
  obtenerPeliculasPorMood,
  obtenerPeliculasFallback,
} = require('../models/model');

// Mapeo mood -> géneros
const moodToGenres = {
  feliz:      ['Comedia', 'Aventura'],
  triste:     ['Drama'],
  romantico:  ['Romance', 'Drama'],
  enojado:     ['Acción', 'Thriller'],
  relajado:   ['Comedia'],
  intrigado:  ['Misterio', 'Ciencia ficción'],
  nostalgico: ['Drama', 'Romance'],
  inspirado:  ['Documental', 'Biopic'],
  aburrido:   ['Indie', 'Comedia'],
};

// ─────────────────────────────────────────────
// GET /  →  renderiza la página principal
// ─────────────────────────────────────────────

exports.getMainPage = (req, res) => {
  try {
    const userId = req.user?.id ?? req.session?.userId ?? null;
    let user = { name: 'Invitado', id: null };

    if (userId) {
      const row = encontrarUsuarioPorId(userId);
      if (row) user = row;
    }

    return res.render('mainPage', { user, movies: null, selectedMood: null });
  } catch (err) {
    console.error('getMainPage error:', err);
    return res.status(500).send('Error interno del servidor.');
  }
};

// ─────────────────────────────────────────────
// POST /recommendations  →  devuelve { movies, mood }
// ─────────────────────────────────────────────

exports.postRecommendations = (req, res) => {
  try {
    const payload  = req.body ?? {};
    const rawMood  = String(payload.mood ?? '').trim().toLowerCase();

    if (!moodToGenres[rawMood]) {
      return res.status(400).json({ message: 'Estado de ánimo inválido.' });
    }

    const genres = moodToGenres[rawMood];

    // Intento 1: por géneros mapeados
    let movies = obtenerPeliculasPorGeneros(genres);

    // Intento 2: por tabla Mood
    if (movies.length === 0) {
      movies = obtenerPeliculasPorMood(rawMood);
    }

    // Intento 3: fallback a Drama
    if (movies.length === 0) {
      movies = obtenerPeliculasFallback();
    }

    const moviesForClient = movies.map(m => ({
      id:          m.id,
      title:       m.title,
      description: m.description ?? '',
    }));

    return res.json({ movies: moviesForClient, mood: rawMood });
  } catch (err) {
    console.error('postRecommendations error:', err);
    return res.status(500).json({ message: 'Ocurrió un error al buscar recomendaciones.' });
  }
};

//LOGOUT 
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("logout error:", err);
      return res.status(500).send("No se pudo cerrar sesión.");
    }

    res.clearCookie("connect.sid");
    return res.redirect("/login");
  });
};
