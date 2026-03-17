// El controlador necesita acceder a los datos de usuarios

// Esos datos están en el modelo (models/model.js)

// Entonces lo importamos para poder usar sus funciones

// En otras palabras Trae el archivo donde están las funciones que buscan usuarios

const model = require("../models/database");



// Función que procesa el login cuando el usuario envía el formulario
// Esta función se ejecuta cuando el usuario
// escribe su email
// escribe su contraseña
// presiona login
// El navegador envía esos datos al servidor
exports.login = (req, res) => {

    // req.body contiene los datos enviados desde el frontend
    // se usa destructuring para extraer email y password
    const { email, password } = req.body;


    // buscar el usuario en el modelo usando el email
    const user = model.encontrarUsuarioPorEmail(email);


    // si el usuario no existe
    if (!user) {

        // respondemos con error en formato JSON
        return res.status(401).json({
            message: "Usuario no encontrado"
        });
    }


    // si la contraseña no coincide con la guardada
    if (user.password !== password) {

        return res.status(401).json({
            message: "Contraseña incorrecta"
        });
    }

    // si el usuario ya tiene actor favorito y película favorita
    if (user.actor_favorito && user.pelicula_favorita) {
        return res.render("mainPage", { user: user });
    // si todavía no completó esos datos lo mandamos a userForms
    }else {
        res.render("userForms", { user: user });
    };


// exportamos las funciones para que las rutas puedan usarlas
}
module.exports = {login};