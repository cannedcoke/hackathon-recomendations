// Obtiene el formulario donde el usuario completa sus preferencias
const userFormForm = document.getElementById("userFormForm");

// Escucha cuando el usuario envía el formulario
userFormForm.addEventListener("submit", async (e) => {

    // Evita que el formulario recargue la página automáticamente
    e.preventDefault();

    // Obtiene el email del usuario desde el input
    const email    = document.getElementById("email").value;

    // Obtiene el actor favorito seleccionado
    const actor    = document.getElementById("actor").value;

    // Obtiene la película favorita seleccionada
    const pelicula = document.getElementById("movie").value;

    // Validación: si no eligió actor favorito muestra alerta
    if (!actor) { 
        alert("Por favor elegí tu actor favorito."); 
        return; 
    }

    // Validación: si no eligió película favorita muestra alerta
    if (!pelicula) { 
        alert("Por favor elegí tu película favorita."); 
        return; 
    }

    // Envía los datos al backend para guardar las preferencias del usuario
    const response = await fetch("/userForm", {

        // Método POST porque estamos enviando información al servidor
        method: "POST",

        // Indica que los datos enviados estarán en formato JSON
        headers: { "Content-Type": "application/json" },

        // Convierte los datos a JSON para enviarlos al backend
        body: JSON.stringify({ email, actor, pelicula })
    });

    // Si el servidor devuelve un error
    if (!response.ok) {

        // Convierte la respuesta del servidor a JSON
        const data = await response.json();

        // Muestra el mensaje de error enviado por el backend
        alert(data.message);

        // Detiene la ejecución
        return;
    }

    // Si todo salió bien, obtiene la respuesta del servidor
    const data = await response.json();

    // Redirige al usuario a la página indicada por el backend
    window.location.href = data.redirect;
});