const UserData = document.getElementById("userData")
UserData.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("nombre").value
    const password = document.getElementById("password").value

    const response = await fetch("/signIn",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })

    })
        if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
    }

        // Si el servidor respondió bien, recargar a la URL que devolvió
    const data = await response.json();
    window.location.href = data.redirect;

})