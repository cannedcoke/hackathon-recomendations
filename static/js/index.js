const UserData = document.getElementById("userData")
UserData.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("nombre").value
    const password = document.getElementById("password").value

    await fetch("/login",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })

    })
    location.reload();

})