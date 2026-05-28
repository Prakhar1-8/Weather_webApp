// ===============================
// 🌤️ Advanced Weather App JS
// ===============================

const apiKey = "3952ba225c19aba3561f40219dcfcd5a";

/* ===============================
   DOM Elements
================================ */

const cityInput = document.getElementById("city");

const searchBtn = document.getElementById("search-btn");

const locationBtn = document.getElementById("location-btn");

const themeBtn = document.getElementById("theme-btn");

const errorMsg = document.getElementById("error");

const loadingMsg = document.getElementById("loading");

const weatherBox = document.getElementById("weather-box");

const forecastContainer = document.getElementById("forecast");

const forecastTitle =
document.querySelector(".forecast-title");

/* ===============================
   Search Event
================================ */

searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value);
});

/* ===============================
   Enter Key Support
================================ */

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        getWeather(cityInput.value);
    }
});

/* ===============================
   Dark Mode Toggle
================================ */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        themeBtn.innerHTML = "☀️";

    }else{

        themeBtn.innerHTML = "🌙";
    }
});

/* ===============================
   Geolocation Weather
================================ */

locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(

        async(position) => {

            const lat =
            position.coords.latitude;

            const lon =
            position.coords.longitude;

            getWeatherByCoords(lat, lon);
        },

        () => {

            showError("Location access denied");
        }
    );
});

/* ===============================
   Get Weather By City
================================ */

async function getWeather(city){

    const cityName = city.trim();

    if(!cityName){

        showError("Please enter a city name");

        return;
    }

    showLoading(true);

    showError("");

    try{

        const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

        const weatherResponse =
        await fetch(weatherURL);

        const weatherData =
        await weatherResponse.json();

        const forecastResponse =
        await fetch(forecastURL);

        const forecastData =
        await forecastResponse.json();

        if(weatherData.cod != 200){

            showError("City not found!");

            showLoading(false);

            return;
        }

        updateUI(weatherData, forecastData);

    }catch(error){

        console.log(error);

        showError("Error fetching weather");

    }finally{

        showLoading(false);
    }
}

/* ===============================
   Get Weather By Coordinates
================================ */

async function getWeatherByCoords(lat, lon){

    showLoading(true);

    showError("");

    try{

        const weatherURL =
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const weatherResponse =
        await fetch(weatherURL);

        const weatherData =
        await weatherResponse.json();

        const forecastResponse =
        await fetch(forecastURL);

        const forecastData =
        await forecastResponse.json();

        updateUI(weatherData, forecastData);

    }catch(error){

        console.log(error);

        showError("Unable to fetch location weather");

    }finally{

        showLoading(false);
    }
}

/* ===============================
   Update UI
================================ */

function updateUI(weatherData, forecastData){

    /* --- Weather Data --- */

    document.getElementById("city-name").textContent =
    weatherData.name;

    document.getElementById("temperature").textContent =
    `${Math.round(weatherData.main.temp)}°C`;

    document.getElementById("description").textContent =
    weatherData.weather[0].description;

    document.getElementById("humidity").textContent =
    `💧 Humidity: ${weatherData.main.humidity}%`;

    document.getElementById("wind").textContent =
    `🌬️ Wind: ${weatherData.wind.speed} km/h`;

    /* --- Weather Icon --- */

    const iconCode =
    weatherData.weather[0].icon;

    const icon =
    document.getElementById("weather-icon");

    icon.src =
    `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    /* --- Animation --- */

    setWeatherAnimation(iconCode);

    /* --- Dynamic Background --- */

    changeBackground(weatherData.weather[0].main);

    weatherBox.classList.remove("hidden");

    /* ===============================
       Forecast
    ================================ */

    forecastContainer.innerHTML = "";

    const dailyData =
    forecastData.list.filter(item =>
    item.dt_txt.includes("12:00:00")
    );

    dailyData.forEach(day => {

        const date =
        new Date(day.dt_txt);

        const dayName =
        date.toLocaleDateString(
            "en-US",
            { weekday: "short" }
        );

        const month =
        date.toLocaleDateString(
            "en-US",
            { month: "short" }
        );

        const dayNumber =
        date.getDate();

        forecastContainer.innerHTML += `

        <div class="day">

            <h3>${dayName}</h3>

            <p>${month} ${dayNumber}</p>

            <img
            src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

            <h4>${Math.round(day.main.temp)}°C</h4>

            <p>${day.weather[0].main}</p>

        </div>
        `;
    });

    forecastTitle.classList.remove("hidden");

    forecastContainer.classList.remove("hidden");
}

/* ===============================
   Dynamic Background
================================ */

function changeBackground(weather){

    if(weather === "Clear"){

        document.body.style.background =
        "linear-gradient(135deg,#f7971e,#ffd200)";
    }

    else if(weather === "Clouds"){

        document.body.style.background =
        "linear-gradient(135deg,#757f9a,#d7dde8)";
    }

    else if(weather === "Rain"){

        document.body.style.background =
        "linear-gradient(135deg,#4b79a1,#283e51)";
    }

    else if(weather === "Snow"){

        document.body.style.background =
        "linear-gradient(135deg,#83a4d4,#b6fbff)";
    }

    else{

        document.body.style.background =
        "linear-gradient(135deg,#5b86e5,#8e54e9)";
    }
}

/* ===============================
   Weather Animation
================================ */

function setWeatherAnimation(iconCode){

    const icon =
    document.getElementById("weather-icon");

    icon.classList.remove(
        "sun",
        "cloud",
        "rain",
        "snow"
    );

    if(iconCode.includes("01")){

        icon.classList.add("sun");
    }

    else if(

        iconCode.includes("02") ||

        iconCode.includes("03") ||

        iconCode.includes("04")
    ){

        icon.classList.add("cloud");
    }

    else if(

        iconCode.includes("09") ||

        iconCode.includes("10")
    ){

        icon.classList.add("rain");
    }

    else if(iconCode.includes("13")){

        icon.classList.add("snow");
    }
}

/* ===============================
   Error Function
================================ */

function showError(message){

    if(message){

        errorMsg.textContent = message;

        errorMsg.classList.remove("hidden");

    }else{

        errorMsg.classList.add("hidden");
    }
}

/* ===============================
   Loading Function
================================ */

function showLoading(show){

    if(show){

        loadingMsg.classList.remove("hidden");

    }else{

        loadingMsg.classList.add("hidden");
    }
}

/* ===============================
   Default Weather On Load
================================ */

window.addEventListener("load", () => {

    cityInput.value = "Delhi";

    getWeather("Delhi");
});