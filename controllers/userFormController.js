// Importamos el modelo para acceder a la base de datos
const model = require("../models/database");

// Función que procesa el formulario de preferencias del usuario
exports.userForms = (req, res) => {

    // obtenemos los datos enviados desde el formulario
    const { email, actor, pelicula } = req.body;

    // buscamos al usuario en la base de datos
    const usuario = model.encontrarUsuarioPorEmail(email);

    // si el usuario no existe devolvemos error
    if (!usuario) {
        return res.status(404).json({
            message: "Usuario no encontrado"
        });
    }

    // guardamos el actor favorito y la película favorita
    model.actualizarPreferenciasUsuario(
        email,
        actor,
        pelicula
    );

    // después de guardar los datos enviamos al frontend
    // la ruta a la que debe redirigir
    return res.json({
        redirect: "/mainPage"
    });

};

module.exports = {
    userForms
};