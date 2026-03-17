const bcrypt = require("bcrypt");
const { conectar } = require("./database");

const SALT_ROUNDS = 10;

// ─── encontrarUsuarioPorEmail ────────────────────────────────────────────────
// Devuelve el usuario completo o undefined si no existe.

function encontrarUsuarioPorEmail(email) {
  const db = conectar();
  const usuario = db
    .prepare("SELECT * FROM User WHERE email = ?")
    .get(email);
    console.log(usuario)
  db.close();
  return usuario;

}

// ─── crearUsuario ────────────────────────────────────────────────────────────
// Hashea la contraseña, inserta el usuario y devuelve su id.
function crearUsuario(email, password) {
  const password_hash = bcrypt.hashSync(password, SALT_ROUNDS);
  const username = email.split("@")[0]; // username por defecto

  const db = conectar();
  const resultado = db
    .prepare(
      "INSERT INTO User (username, email, password_hash) VALUES (?, ?, ?)"
    )
    .run(username, email, password_hash);
  db.close();

  return resultado.lastInsertRowid;
}

// ─── actualizarPreferenciasUsuario ───────────────────────────────────────────
// Recibe email, nombre de actor y título de película.
// Agrega ambos a los favoritos del usuario (ignora duplicados).
// Devuelve { actorAgregado, peliculaAgregada } con booleanos.
function actualizarPreferenciasUsuario(email, actor, pelicula) {
  const db = conectar();

  const usuario = db
    .prepare("SELECT id FROM User WHERE email = ?")
    .get(email);
  if (!usuario) {
    db.close();
    throw new Error(`Usuario con email "${email}" no encontrado`);
  }

  // — Actor favorito ——————————————————————————————————————————————————
  let actorAgregado = false;
  const actorRow = db
    .prepare("SELECT id FROM Actor WHERE name = ?")
    .get(actor);

  if (actorRow) {
    const existe = db
      .prepare(
        "SELECT 1 FROM UserFavoriteActor WHERE user_id = ? AND actor_id = ?"
      )
      .get(usuario.id, actorRow.id);

    if (!existe) {
      db.prepare(
        "INSERT INTO UserFavoriteActor (user_id, actor_id) VALUES (?, ?)"
      ).run(usuario.id, actorRow.id);
      actorAgregado = true;
    }
  }

  // — Película favorita ——————————————————————————————————————————————
  let peliculaAgregada = false;
  const peliculaRow = db
    .prepare("SELECT id FROM Movie WHERE title = ?")
    .get(pelicula);

  if (peliculaRow) {
    const existe = db
      .prepare(
        "SELECT 1 FROM UserFavoriteMovie WHERE user_id = ? AND movie_id = ?"
      )
      .get(usuario.id, peliculaRow.id);

    if (!existe) {
      db.prepare(
        "INSERT INTO UserFavoriteMovie (user_id, movie_id) VALUES (?, ?)"
      ).run(usuario.id, peliculaRow.id);
      peliculaAgregada = true;
    }
  }

  db.close();
  return { actorAgregado, peliculaAgregada };
}

module.exports = {
  encontrarUsuarioPorEmail,
  crearUsuario,
  actualizarPreferenciasUsuario,
};