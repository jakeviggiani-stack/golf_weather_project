console.log("Signup script loaded");
document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("input[placeholder='Username']").value;
    const password = document.querySelector("input[placeholder='Password']").value;
    const confirmPassword = document.querySelector("input[placeholder='Re-enter Password']").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
        alert("Signup successful!");
        window.location.href = "/login.html";
    } else {
        alert(`Signup failed: ${data.message}`);
    }
});
