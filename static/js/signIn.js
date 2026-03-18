// Obtiene el formulario de registro usando su id del HTML
const UserData = document.getElementById("userData")

// Escucha cuando el usuario envía el formulario
UserData.addEventListener("submit", async (e) => {

    // Evita que el formulario se envíe de la manera tradicional (recargando la página)
    e.preventDefault();

    // Obtiene el email que el usuario escribió en el input
    const email = document.getElementById("email").value

    // Obtiene la contraseña ingresada por el usuario
    const password = document.getElementById("password").value

    // Envía una petición al backend a la ruta /signIn para registrar al usuario
    const response = await fetch("/signIn",{

        // Método POST porque estamos enviando datos al servidor
        method:"POST",

        // Indicamos que los datos se enviarán en formato JSON
        headers: { "Content-Type": "application/json" },

        // Convertimos el email y password a JSON para enviarlos al backend
        body: JSON.stringify({ email, password })

    })

    // Si el servidor responde con error (por ejemplo usuario ya existe)
    if (!response.ok) {

        // Convierte la respuesta del servidor a JSON
        const data = await response.json();

        // Muestra el mensaje de error que envía el backend
        alert(data.message);

        // Detiene la ejecución
        return;
    }

    // Si el registro fue exitoso, obtiene los datos que devolvió el servidor
    const data = await response.json();

    // Muestra en consola la URL a la que se redirigirá al usuario
    console.log("redirect:", data.redirect);

    // Redirige al usuario a la página que indicó el backend
    window.location.href = data.redirect;

})