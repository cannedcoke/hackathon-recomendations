// importa el framework Express, que sirve para crear el servidor
const express = require("express");

// importa el módulo path para manejar rutas de archivos del sistema
const path = require("path");

// importa el motor de plantillas handlebars para renderizar vistas HTML dinámicas
const exphbs = require("express-handlebars");
const session = require("express-session");

// crea la aplicación servidor usando Express
const app = express();

// registra el motor de plantillas llamado "hbs" y define opciones
app.engine("hbs", exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts")
}));

// establece que el motor de vistas por defecto será "hbs"
app.set("view engine", "hbs");

// define la carpeta donde estarán los archivos de vistas
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret: "alguna-clave-secreta",
    resave: false,
    saveUninitialized: false,
}));

// MIDDLEWARES
app.use(express.json());

// sirve archivos estáticos
app.use("/css", express.static(path.join(__dirname, "static/css")));
app.use("/js", express.static(path.join(__dirname, "static/js")));
app.use("/img", express.static(path.join(__dirname, "static/img")));

// rutas externas
const recordRoutes = require("./routes/router");

// cuando alguien entra a "/", se ejecuta esta función
app.get("/", (req, res) => {
    res.render("index");
});

app.use("/", recordRoutes);

// inicia el servidor y lo pone a escuchar en el puerto 5000
app.listen(5000, () => {
    console.log("Server running http://localhost:5000");
});