// Importamos bcrypt para encriptar la contraseña antes de guardarla
const bcrypt = require("bcrypt");

// Importamos el modelo que contiene las funciones de la base de datos
const model = require("../models/model");


// Función que procesa el registro cuando el usuario envía el formulario
exports.signIn = (req, res) => {

    // usamos destructuring para obtener email y password
    const { email, password } = req.body;

    // buscamos si ya existe un usuario con ese email
    const usuarioExistente = model.encontrarUsuarioPorEmail(email);

    // si el usuario ya existe devolvemos un error
    if (usuarioExistente) {
        return res.status(409).json({
            message: "El usuario ya está registrado"
        });
    }

    // encriptamos la contraseña antes de guardarla
    // bcrypt.hashSync genera un hash seguro de la contraseña
    const password_hash = bcrypt.hashSync(password, 10);

    // creamos el usuario en la base de datos
    model.crearUsuario(email, password_hash);

    // después de registrarse enviamos al frontend la ruta
    // para que redirija al formulario de preferencias
    return res.json({
        redirect: "/userForm"
    });

};


// exportamos la función para que las rutas puedan usarla
module.exports = {
    signIn
};