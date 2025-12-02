console.log("courses.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
    const courseSelect = document.getElementById("courseSelect");
    const saveBtn = document.getElementById("saveCourseBtn");

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        alert("User not logged in. Please log in first.");
        window.location.href = "login.html";
        return;
    }

    //Load my courses from backend
    try {
        const response = await fetch("http://localhost:3000/api/users/courses")
        const courses = await response.json();

        courseSelect.innerHTML = "";    
        courses.forEach(course => {
            const option = document.createElement("option");
            option.value = course.course_id;
            option.textContent = course.course_name;
            courseSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading courses:", error);
        alert("Failed to load courses. Please try again later.");
        return;
    }

    //Save the selected courses for the user
    saveBtn.addEventListener("click", async () => {
        const selectedCourseIds = Array.from(courseSelect.selectedOptions).map(option => option.value);

        if (selectedCourseIds.length === 0) {
            alert("Please select at least one course.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/users/courses", {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user_id, course_ids: selectedCourseIds }),
            });
       
            const data = await response.json();

            if (response.ok) {
                alert("Course saved successfully!");
                window.location.href = "home.html";
            } else {
                alert(`Failed to save course: ${data.message}`);
            }
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Failed to save course. Please try again later.");
        }
    });
});
