const { conectar } = require("./database");

const db = conectar();

// ── 1. Moods ──────────────────────────────────────────────────────────────────
const moods = ["feliz", "triste", "romantico", "accion", "relajado", "intrigado", "nostalgico", "inspirado", "aburrido"];

const insertMood = db.prepare(`INSERT OR IGNORE INTO Mood (name) VALUES (?)`);
for (const mood of moods) insertMood.run(mood);

// helper: get mood id by name
const getMood = db.prepare(`SELECT id FROM Mood WHERE name = ?`);

// ── 2. Genres ─────────────────────────────────────────────────────────────────
const genres = ["Comedia", "Drama", "Romance", "Acción", "Thriller", "Ciencia Ficción", "Animación", "Terror", "Documental", "Aventura"];

const insertGenre = db.prepare(`INSERT OR IGNORE INTO Genre (name) VALUES (?)`);
for (const genre of genres) insertGenre.run(genre);

const getGenre = db.prepare(`SELECT id FROM Genre WHERE name = ?`);

// ── 3. Actors ─────────────────────────────────────────────────────────────────
const actors = [
  "Tom Hanks", "Scarlett Johansson", "Leonardo DiCaprio", "Meryl Streep",
  "Denzel Washington", "Cate Blanchett", "Brad Pitt", "Natalie Portman",
  "Morgan Freeman", "Emma Stone", "Ryan Gosling", "Joaquin Phoenix",
  "Viola Davis", "Chris Evans", "Margot Robbie", "Timothée Chalamet"
];

const insertActor = db.prepare(`INSERT OR IGNORE INTO Actor (name) VALUES (?)`);
for (const actor of actors) insertActor.run(actor);

const getActor = db.prepare(`SELECT id FROM Actor WHERE name = ?`);

// ── 4. Movies ─────────────────────────────────────────────────────────────────
// Each entry: { title, description, moods: [], genres: [], actors: [] }
const movies = [
  {
    title: "La La Land",
    description: "Un músico y una actriz se enamoran en Los Ángeles mientras persiguen sus sueños.",
    moods: ["romantico", "inspirado", "nostalgico"],
    genres: ["Romance", "Drama"],
    actors: ["Ryan Gosling", "Emma Stone"]
  },
  {
    title: "El Rey León",
    description: "Un joven príncipe debe reclamar su lugar en el reino tras la muerte de su padre.",
    moods: ["feliz", "nostalgico", "inspirado"],
    genres: ["Animación", "Aventura"],
    actors: []
  },
  {
    title: "Mad Max: Fury Road",
    description: "En un mundo post-apocalíptico, una guerrera huye de un tirano a bordo de un camión blindado.",
    moods: ["accion", "intrigado"],
    genres: ["Acción", "Ciencia Ficción"],
    actors: []
  },
  {
    title: "Eterno Resplandor de una Mente sin Recuerdos",
    description: "Una pareja decide borrar sus recuerdos el uno del otro tras una ruptura dolorosa.",
    moods: ["triste", "romantico", "intrigado"],
    genres: ["Drama", "Ciencia Ficción"],
    actors: []
  },
  {
    title: "Forrest Gump",
    description: "La vida extraordinaria de un hombre de Alabama que sin querer protagoniza momentos históricos.",
    moods: ["feliz", "nostalgico", "inspirado"],
    genres: ["Drama", "Comedia"],
    actors: ["Tom Hanks"]
  },
  {
    title: "Joker",
    description: "Un comediante fracasado de Gotham City desciende lentamente a la locura.",
    moods: ["intrigado", "triste"],
    genres: ["Drama", "Thriller"],
    actors: ["Joaquin Phoenix"]
  },
  {
    title: "Interstellar",
    description: "Un grupo de astronautas viaja a través de un agujero de gusano en busca de un nuevo hogar para la humanidad.",
    moods: ["inspirado", "intrigado", "accion"],
    genres: ["Ciencia Ficción", "Aventura"],
    actors: []
  },
  {
    title: "Coco",
    description: "Un niño viaja accidentalmente a la tierra de los muertos y descubre la historia de su familia.",
    moods: ["feliz", "nostalgico", "triste"],
    genres: ["Animación", "Aventura"],
    actors: []
  },
  {
    title: "Titanic",
    description: "Una historia de amor imposible a bordo del famoso barco que se hundió en 1912.",
    moods: ["romantico", "triste", "nostalgico"],
    genres: ["Romance", "Drama"],
    actors: ["Leonardo DiCaprio"]
  },
  {
    title: "El Gran Lebowski",
    description: "Un hombre perezoso se ve envuelto en un caso de secuestro por error de identidad.",
    moods: ["aburrido", "feliz"],
    genres: ["Comedia"],
    actors: []
  },
  {
    title: "John Wick",
    description: "Un ex asesino a sueldo busca venganza tras la muerte de su perro.",
    moods: ["accion"],
    genres: ["Acción", "Thriller"],
    actors: []
  },
  {
    title: "La Lista de Schindler",
    description: "Un empresario alemán salva a más de mil judíos durante el Holocausto.",
    moods: ["triste", "inspirado"],
    genres: ["Drama"],
    actors: []
  },
  {
    title: "Mamma Mia",
    description: "Una joven invita a tres hombres a su boda para descubrir cuál es su padre.",
    moods: ["feliz", "romantico"],
    genres: ["Comedia", "Romance"],
    actors: ["Meryl Streep"]
  },
  {
    title: "Inception",
    description: "Un ladrón especializado en robar secretos del subconsciente recibe una misión imposible.",
    moods: ["intrigado", "accion"],
    genres: ["Ciencia Ficción", "Thriller"],
    actors: ["Leonardo DiCaprio"]
  },
  {
    title: "Amélie",
    description: "Una joven tímida de París decide mejorar la vida de los demás mientras busca su propio amor.",
    moods: ["feliz", "romantico", "relajado"],
    genres: ["Comedia", "Romance"],
    actors: []
  },
  {
    title: "Her",
    description: "Un hombre solitario se enamora de un sistema operativo con inteligencia artificial.",
    moods: ["romantico", "triste", "intrigado"],
    genres: ["Ciencia Ficción", "Drama"],
    actors: ["Joaquin Phoenix"]
  },
  {
    title: "The Revenant",
    description: "Un explorador sobrevive una brutal agresión de un oso y busca venganza en el salvaje oeste.",
    moods: ["accion", "intrigado"],
    genres: ["Acción", "Drama"],
    actors: ["Leonardo DiCaprio"]
  },
  {
    title: "Chef",
    description: "Un chef decide abrir un food truck tras perder su trabajo en un restaurante de lujo.",
    moods: ["relajado", "feliz", "inspirado"],
    genres: ["Comedia", "Drama"],
    actors: []
  },
  {
    title: "Lost in Translation",
    description: "Dos estadounidenses solos en Tokio forman una conexión inesperada y profunda.",
    moods: ["relajado", "nostalgico", "triste"],
    genres: ["Drama", "Romance"],
    actors: ["Scarlett Johansson"]
  },
  {
    title: "La Sociedad de los Poetas Muertos",
    description: "Un profesor inspira a sus alumnos a pensar por sí mismos en una rígida academia.",
    moods: ["inspirado", "nostalgico"],
    genres: ["Drama"],
    actors: []
  },
];

// ── 5. Insert movies + relations ──────────────────────────────────────────────
const insertMovie    = db.prepare(`INSERT OR IGNORE INTO Movie (title, description) VALUES (?, ?)`);
const insertMovieMood  = db.prepare(`INSERT OR IGNORE INTO MovieMood  (movie_id, mood_id)  VALUES (?, ?)`);
const insertMovieGenre = db.prepare(`INSERT OR IGNORE INTO MovieGenre (movie_id, genre_id) VALUES (?, ?)`);
const insertMovieActor = db.prepare(`INSERT OR IGNORE INTO MovieActor (movie_id, actor_id) VALUES (?, ?)`);
const getMovie = db.prepare(`SELECT id FROM Movie WHERE title = ?`);

const seedAll = db.transaction(() => {
  for (const movie of movies) {
    insertMovie.run(movie.title, movie.description);
    const movieId = getMovie.get(movie.title).id;

    for (const moodName of movie.moods) {
      const mood = getMood.get(moodName);
      if (mood) insertMovieMood.run(movieId, mood.id);
    }

    for (const genreName of movie.genres) {
      const genre = getGenre.get(genreName);
      if (genre) insertMovieGenre.run(movieId, genre.id);
    }

    for (const actorName of movie.actors) {
      const actor = getActor.get(actorName);
      if (actor) insertMovieActor.run(movieId, actor.id);
    }
  }
});

seedAll();

db.close();
console.log("✅ Base de datos poblada correctamente.");