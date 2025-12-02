console.log("courses.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
    const courseSelect = document.getElementById("courseSelect");
    const saveBtn = document.getElementById("saveCourseBtn");

    const user_id = localStorage.getItem("currentUserId");
    if (!user_id) {
        alert("User not logged in. Please log in first.");
        window.location.href = "login.html";
        return;
    }

    //Load my courses from backend
    try {
        const response = await fetch("http://localhost:3000/api/users/courses")
        const courses = await response.json();

        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.course_id;
            option.textContent = course.course_name;
            courseSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
        alert("Failed to load courses. Please try again later.");
    }

    //Save the selected courses for the user