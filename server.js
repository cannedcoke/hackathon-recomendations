// importa el framework Express, que sirve para crear el servidor
const express = require("express");

// importa el módulo path para manejar rutas de archivos del sistema
const path = require("path");

// importa el motor de plantillas handlebars para renderizar vistas HTML dinámicas
const exphbs = require("express-handlebars");

// crea la aplicación servidor usando Express
const app = express(); 



// registra el motor de plantillas llamado "hbs" y define opciones
app.engine("hbs", exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",                          // uses views/layouts/main.hbs
    layoutsDir: path.join(__dirname, "views/layouts") // where layouts live
}));

// establece que el motor de vistas por defecto será "hbs"
app.set("view engine", "hbs");

// define la carpeta donde estarán los archivos de vistas
app.set("views", path.join(__dirname, "views"));

const session = require("express-session");

app.use(session({
    secret: "alguna-clave-secreta",
    resave: false,
    saveUninitialized: false,
}));

// MIDDLEWARES


// permite que Express entienda JSON en el body de las solicitudes
app.use(express.json());


// sirve archivos estáticos desde la carpeta /js cuando alguien accede a /js en la URL
app.use("/css", express.static(path.join(__dirname, "static/css")));
app.use("/js",  express.static(path.join(__dirname, "static/js")));
// __dirname = carpeta actual del archivo
// path.join une rutas correctamente según el sistema operativo


// rutas externas

// importa las rutas definidas en ./routes/record
const recordRoutes = require("./routes/router");

// todas las rutas definidas en recordRoutes estarán bajo /records
// ejemplo: /records/add , /records/delete




// cuando alguien entra a "/", se ejecuta esta función
app.get("/", (req, res) => {
    res.render("index")
})

app.use("/", recordRoutes);


// inicia el servidor y lo pone a escuchar en el puerto 5000
app.listen(5000, ()=>{

    // se ejecuta cuando el servidor arranca correctamente
    console.log("Server running http://MoodVie");
});
