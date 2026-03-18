// Obtiene el formulario de login del HTML usando su id
const UserData = document.getElementById("loginForm")

// Escucha cuando el usuario envía el formulario
UserData.addEventListener("submit", async (e) => {

    // Evita que el formulario se envíe de la forma tradicional (recargando la página)
    e.preventDefault();

    // Obtiene el valor que el usuario escribió en el input de email
    const email = document.getElementById("email").value

    // Obtiene la contraseña que el usuario escribió
    const password = document.getElementById("password").value

    // Envía una petición al backend a la ruta /login
    // usando fetch con método POST
    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // indica que se envían datos en formato JSON
        body: JSON.stringify({ email, password }) // convierte los datos a JSON para enviarlos al servidor
    });

    // Si el servidor respondió con error (por ejemplo usuario o contraseña incorrectos)
    if (!response.ok) {

        // Convierte la respuesta del servidor a JSON
        const data = await response.json();

        // Muestra el mensaje de error que envía el backend
        alert(data.message);

        // Detiene la ejecución para no continuar con el login
        return;
    }

    // Si el servidor respondió correctamente, obtiene los datos de la respuesta
    const data = await response.json();

    // Muestra en consola la respuesta del servidor (para debug)
    console.log(data);

    // Punto de pausa para depuración en el navegador
    debugger;

    // Redirige al usuario a la página que envió el servidor
    // por ejemplo /mainPage o /userForm
    window.location.href = data.redirect;
});