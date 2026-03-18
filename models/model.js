const bcrypt = require("bcrypt");
const { conectar } = require("./database");

const SALT_ROUNDS = 10;

// ─── encontrarUsuarioPorEmail ────────────────────────────────────────────────
function encontrarUsuarioPorEmail(email) {
  const db = conectar();
  const usuario = db.prepare("SELECT * FROM User WHERE email = ?").get(email);
  db.close();
  return usuario;
}

// ─── encontrarUsuarioPorId ───────────────────────────────────────────────────
function encontrarUsuarioPorId(id) {
  const db = conectar();
  const usuario = db
    .prepare("SELECT id, username AS name, email FROM User WHERE id = ?")
    .get(id);
  db.close();
  return usuario;
}

// ─── crearUsuario ────────────────────────────────────────────────────────────
function crearUsuario(email, password) {
  const password_hash = bcrypt.hashSync(password, SALT_ROUNDS);
  const username = email.split("@")[0];

  const db = conectar();
  const resultado = db
    .prepare("INSERT INTO User (username, email, password_hash) VALUES (?, ?, ?)")
    .run(username, email, password_hash);
  db.close();

  return resultado.lastInsertRowid;
}

// ─── actualizarPreferenciasUsuario ───────────────────────────────────────────
function actualizarPreferenciasUsuario(email, actor, pelicula) {
  const db = conectar();

  const usuario = db.prepare("SELECT id FROM User WHERE email = ?").get(email);
  if (!usuario) {
    db.close();
    throw new Error(`Usuario con email "${email}" no encontrado`);
  }

  let actorAgregado = false;
  const actorRow = db.prepare("SELECT id FROM Actor WHERE name = ?").get(actor);
  if (actorRow) {
    const existe = db
      .prepare("SELECT 1 FROM UserFavoriteActor WHERE user_id = ? AND actor_id = ?")
      .get(usuario.id, actorRow.id);
    if (!existe) {
      db.prepare("INSERT INTO UserFavoriteActor (user_id, actor_id) VALUES (?, ?)").run(usuario.id, actorRow.id);
      actorAgregado = true;
    }
  }

  let peliculaAgregada = false;
  const peliculaRow = db.prepare("SELECT id FROM Movie WHERE title = ?").get(pelicula);
  if (peliculaRow) {
    const existe = db
      .prepare("SELECT 1 FROM UserFavoriteMovie WHERE user_id = ? AND movie_id = ?")
      .get(usuario.id, peliculaRow.id);
    if (!existe) {
      db.prepare("INSERT INTO UserFavoriteMovie (user_id, movie_id) VALUES (?, ?)").run(usuario.id, peliculaRow.id);
      peliculaAgregada = true;
    }
  }

  db.close();
  return { actorAgregado, peliculaAgregada };
}

// ─── obtenerTodosLosActores ──────────────────────────────────────────────────
function obtenerTodosLosActores() {
  const db = conectar();
  const actores = db.prepare("SELECT * FROM Actor").all();
  db.close();
  return actores;
}

// ─── obtenerTodasLasPeliculas ────────────────────────────────────────────────
function obtenerTodasLasPeliculas() {
  const db = conectar();
  const peliculas = db.prepare("SELECT * FROM Movie").all();
  db.close();
  return peliculas;
}

// ─── obtenerPeliculasPorGeneros ──────────────────────────────────────────────
// Busca películas que coincidan con al menos uno de los géneros dados.
function obtenerPeliculasPorGeneros(generos) {
  const db = conectar();
  const placeholders = generos.map(() => "?").join(",");
  const sql = `
    SELECT DISTINCT m.id, m.title, m.description
    FROM Movie m
    JOIN MovieGenre mg ON mg.movie_id = m.id
    JOIN Genre g       ON g.id = mg.genre_id
    WHERE lower(g.name) IN (${placeholders})
    ORDER BY RANDOM()
    LIMIT 12
  `;
  const peliculas = db.prepare(sql).all(...generos.map(g => g.toLowerCase()));
  db.close();
  return peliculas;
}

// ─── obtenerPeliculasPorMood ─────────────────────────────────────────────────
// Busca películas vinculadas al mood por nombre en la tabla Mood.
function obtenerPeliculasPorMood(moodName) {
  const db = conectar();

  const moodRow = db
    .prepare("SELECT id FROM Mood WHERE lower(name) = ?")
    .get(moodName.toLowerCase());

  if (!moodRow) {
    db.close();
    return [];
  }

  const sql = `
    SELECT m.id, m.title, m.description
    FROM Movie m
    JOIN MovieMood mm ON mm.movie_id = m.id
    WHERE mm.mood_id = ?
    ORDER BY RANDOM()
    LIMIT 12
  `;
  const peliculas = db.prepare(sql).all(moodRow.id);
  db.close();
  return peliculas;
}

// ─── obtenerPeliculasFallback ────────────────────────────────────────────────
// Devuelve películas de Drama como último recurso.
function obtenerPeliculasFallback() {
  const db = conectar();
  const sql = `
    SELECT DISTINCT m.id, m.title, m.description
    FROM Movie m
    JOIN MovieGenre mg ON mg.movie_id = m.id
    JOIN Genre g       ON g.id = mg.genre_id
    WHERE lower(g.name) = 'drama'
    ORDER BY RANDOM()
    LIMIT 8
  `;
  const peliculas = db.prepare(sql).all();
  db.close();
  return peliculas;
}
function usuarioTienePreferencias(userId) {
  const db = conectar();
  const actor = db
    .prepare("SELECT 1 FROM UserFavoriteActor WHERE user_id = ?")
    .get(userId);
  const pelicula = db
    .prepare("SELECT 1 FROM UserFavoriteMovie WHERE user_id = ?")
    .get(userId);
  db.close();
  return !!(actor && pelicula);
}

module.exports = {
  encontrarUsuarioPorEmail,
  encontrarUsuarioPorId,
  crearUsuario,
  actualizarPreferenciasUsuario,
  obtenerTodosLosActores,
  obtenerTodasLasPeliculas,
  obtenerPeliculasPorGeneros,
  obtenerPeliculasPorMood,
  obtenerPeliculasFallback,
  usuarioTienePreferencias
};