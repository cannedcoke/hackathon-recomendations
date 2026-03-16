// El controlador necesita acceder a las funciones de la base de datos
// para poder buscar o crear usuarios
const model = require("../models/database");


// Función que procesa el registro cuando el usuario envía el formulario
// El usuario escribe:
// email
// contraseña
// y presiona registrarse
exports.signIn = (req, res) => {

    // req.body contiene los datos enviados desde el frontend
    const { email, password } = req.body;

    // verificamos si ya existe un usuario con ese email
    const usuarioExistente = model.encontrarUsuarioPorEmail(email);

    // si el usuario ya existe devolvemos un error
    if (usuarioExistente) {
        return res.status(409).json({
            message: "El usuario ya está registrado"
        });
    }

    // si el usuario no existe lo creamos en la base de datos
    const nuevoUsuario = model.crearUsuario(email, password);

    // después de crear el usuario lo mandamos al formulario userForms
    // le pasamos también el usuario por si la vista necesita usar sus datos
    res.render("userForms", { user: nuevoUsuario });

};


// exportamos la función para usarla en las rutas
module.exports = {
    signIn
};