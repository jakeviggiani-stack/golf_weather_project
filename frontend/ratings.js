document.addEventListener("DOMContentLoaded", async () => {
    const user_id = localStorage.getItem("user_id");
    const container = document.getElementById("ratingsContainer");

    if (!user_id) return;

    // Fetch prefrences from backend
    try {
        const prefs =await fetch(`/api/users/${user_id}/preferences`).then(r => r.json());

    //Fetch user courses from backend
        const courses = await fetch(`/api/users/${user_id}/courses`).then(r => r.json());

    //Create boxes for each course
        courses.forEach(async (course) => {
            const box = document.createElement("div");
            box.classList.add("rating-box");

            box.innerHTML = `
            <span class="course-name">${course.course_name}</span>
            <span class="course-rating" data-course-id="${course.course_id}">Loading...</span> 
            `;

            container.appendChild(box);

            //Fetch rating for each course based on user preferences

            const weather = await fetchWeather(course.lat, course.lon);
            const rating = calculateRating(weather, prefs);

            box.querySelector(".course-rating").textContent = `${rating} *`;
            });
    } catch (error) {
        console.error("Error loading ratings:", error);
    }
});

//Weather API fetch function
async function fetchWeather(lat, lon) {
    const apiKey = "8934e8262f7768d7f89db1a21187777c";

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }

    return await response.json();
}

//Ratings with 5 stars system
function calculateRating(weather, prefs) {
    const temp = weather.main.temp;
    const wind = weather.wind.speed;
    const humidity = weather.main.humidity;

    const tempScore = getTempScore(temp, prefs.temp_pref);
    const windScore = getWindScore(wind, prefs.wind_pref);
    const humidityScore = getHumidityScore(humidity, prefs.humidity_pref);

    const total = tempScore + windScore + humidityScore;
    const stars = (total / 9) * 5;

    return stars.toFixed(1);
}

function getTempScore(temp, pref) {

    if (pref === "Hot") {
        if (temp >= 86) return 3;
        if (temp >= 75) return 2;
        if (temp > 68) return 1;
        return 0;
    }

    if (pref === "Warm") {
        if (temp >= 75 && temp < 86) return 3;
        if (temp >= 68 && temp < 75) return 2;
        if (temp > 60 && temp < 68) return 1;
        return 0;
    }

    if (pref === "Cool") {
        if (temp >= 55 && temp <= 70) return 3;
        if (temp > 45 && temp <= 55) return 2;
        if (temp >= 35 && temp < 45) return 1;
        return 0;
    }

    if (pref === "Cold") {
        if (temp <= 40) return 3;
        if (temp <= 50) return 2;
        if (temp <= 60) return 1;
        return 0;
    }
    return 0;
}

function getWindScore(wind, pref) {
    if (pref === "No Breeze") {
        if (wind <= 3) return 3;
        if (wind <= 8) return 2;
        if (wind <= 12) return 1;
        return 0;
    }

    if (pref === "Light Breeze") {
        if (wind <= 3) return 3;
        if (wind <= 8) return 2;
        if (wind <= 15) return 1;
        return 0;
    }

    if (pref === "Breezy") {
        if (wind >= 10 && wind <=18) return 3;
        if (wind >18 && wind <=25) return 2;
        if (wind >25 && wind <=30) return 1;
        return 0;
    }

    return 0;
}

function getHumidityScore(humidity, pref) {
    if (pref === "Dry") {
        if (humidity <= 40) return 3;
        if (humidity <= 55) return 2;
        if (humidity <= 70) return 1;
        return 0;
    }

    if (pref === "Moderate") {
        if (humidity >40 && humidity <=60) return 3;
        if (humidity >60 && humidity <=75) return 2;
        if (humidity >75 && humidity <=85) return 1;
        return 0;
    }

    if (pref === "Humid") {
        if (humidity >=70) return 3;
        if (humidity >=60) return 2;
        if (humidity >=55) return 1;
        return 0;
    }
    return 0;
}