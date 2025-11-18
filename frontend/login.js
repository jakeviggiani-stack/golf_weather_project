document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("input[placeholder='Username']").value;
    const password = document.querySelector("input[placeholder='Password']").value;

    const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        alert("Login successful!");
        window.location.href = "/index.html.html";
    } else {
        alert(`Login failed: ${data.message}`);
    }
});
