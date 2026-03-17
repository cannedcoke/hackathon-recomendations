const userFormForm = document.getElementById("userFormForm");

userFormForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email    = document.getElementById("email").value;
    const actor    = document.getElementById("actor").value;
    const pelicula = document.getElementById("movie").value;

    if (!actor) { alert("Por favor elegí tu actor favorito."); return; }
    if (!pelicula) { alert("Por favor elegí tu película favorita."); return; }

    const response = await fetch("/userForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, actor, pelicula })
    });

    if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
    }

    const data = await response.json();
    window.location.href = data.redirect;
});

