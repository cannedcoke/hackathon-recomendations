const UserData = document.getElementById("loginForm")
UserData.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
    }

    // Si el servidor respondió bien, recargar a la URL que devolvió
    const data = await response.json();
    window.location.href = data.redirect;
});