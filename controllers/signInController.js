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

    // si el usuario no existe lo creamos en la base de datos
    model.crearUsuario(email, password);

    // después de crear el usuario lo mandamos al formulario userForms
    // le pasamos también el usuario por si la vista necesita usar sus datos
    return res.json({ redirect: `/userForm?email=${email}` });

};


