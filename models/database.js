const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "movies.db");

function conectar() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

function crearTablas() {
  const db = conectar();

  db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Actor (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Movie (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS Genre (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Mood (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS UserFavoriteActor (
      user_id  INTEGER NOT NULL REFERENCES User(id)  ON DELETE CASCADE,
      actor_id INTEGER NOT NULL REFERENCES Actor(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, actor_id)
    );

    CREATE TABLE IF NOT EXISTS UserFavoriteMovie (
      user_id  INTEGER NOT NULL REFERENCES User(id)  ON DELETE CASCADE,
      movie_id INTEGER NOT NULL REFERENCES Movie(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, movie_id)
    );

    CREATE TABLE IF NOT EXISTS MovieActor (
      movie_id INTEGER NOT NULL REFERENCES Movie(id) ON DELETE CASCADE,
      actor_id INTEGER NOT NULL REFERENCES Actor(id) ON DELETE CASCADE,
      PRIMARY KEY (movie_id, actor_id)
    );

    CREATE TABLE IF NOT EXISTS MovieGenre (
      movie_id INTEGER NOT NULL REFERENCES Movie(id) ON DELETE CASCADE,
      genre_id INTEGER NOT NULL REFERENCES Genre(id) ON DELETE CASCADE,
      PRIMARY KEY (movie_id, genre_id)
    );

    CREATE TABLE IF NOT EXISTS MovieMood (
      movie_id INTEGER NOT NULL REFERENCES Movie(id) ON DELETE CASCADE,
      mood_id  INTEGER NOT NULL REFERENCES Mood(id)  ON DELETE CASCADE,
      PRIMARY KEY (movie_id, mood_id)
    );
  `);

  db.close();
  console.log("Base de datos lista:", DB_PATH);
}

crearTablas();

module.exports = { conectar };