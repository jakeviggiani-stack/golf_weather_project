document.addEventListener("DOMContentLoaded", () => {
    console.log("Preferences script loaded");

    const form = document.querySelector("form");

    if (!form) {
        console.error("Preferences form not found!");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

    const user_id = localStorage.getItem("user_id");

    const temp_pref = document.querySelector("select[name='temp_pref']").value;
    const wind_pref = document.querySelector("select[name='wind_pref']").value;
    const humidity_pref = document.querySelector("select[name='humidity_pref']").value;

    const response = await fetch("http://localhost:3000/api/users/preferences", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({user_id, temp_pref, wind_pref, humidity_pref }),

});
    const data = await response.json();
    if (response.ok) {
        alert("Preferences saved successfully!");
        window.location.href = "courses.html";
    } else {
        alert(`Failed to save preferences: ${data.message}`);
    }
});
});
