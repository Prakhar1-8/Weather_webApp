async function getWeather() {
    const city = document.getElementById("city").value;
    if (city === "") return alert("Enter a city name");

    const apiKey = "3952ba225c19aba3561f40219dcfcd5a";

    const currentUrl = 
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const forecastUrl = 
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather
    const currentRes = await fetch(currentUrl);
    const currentData = await currentRes.json();

    if (currentData.cod === "404") return alert("City not found");

    // Update current weather UI
    document.getElementById("weather-box").classList.remove("hidden");
    document.querySelector(".forecast-title").classList.remove("hidden");

    document.getElementById("city-name").innerText = currentData.name;
    document.getElementById("temperature").innerText = `🌡 ${currentData.main.temp}°C`;
    document.getElementById("description").innerText = currentData.weather[0].description;
    document.getElementById("humidity").innerText = `💧 Humidity: ${currentData.main.humidity}%`;
    document.getElementById("wind").innerText = `🌬 Wind: ${currentData.wind.speed} km/h`;

    const icon = currentData.weather[0].icon;
    document.getElementById("weather-icon").src =
      `https://openweathermap.org/img/wn/${icon}@2x.png`;
    changeBackground(currentData.weather[0].main);

    // Fetch forecast
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    displayForecast(forecastData);
}

function displayForecast(data) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";
    forecastDiv.classList.remove("hidden");

    // Filter forecast to get 1 reading per day (12 noon)
    const filtered = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    filtered.forEach(day => {
        const icon = day.weather[0].icon;
        const temp = day.main.temp;
        const date = new Date(day.dt_txt).toDateString();

        const card = `
            <div class="card">
                <h4>${date.split(" ")[0]}</h4>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <p>${temp}°C</p>
                <p>${day.weather[0].main}</p>
            </div>
        `;
        forecastDiv.innerHTML += card;
    });
}

function changeBackground(weather) {
    let color;

    switch(weather) {
        case "Clear":
            color = "linear-gradient(to right, #f7b733, #f66d18ff)";
            break;
        case "Clouds":
            color = "linear-gradient(to right, #bdc3c7, #2c3e50)";
            break;
        case "Rain":
            color = "linear-gradient(to right, #4b79a1, #283e51)";
            break;
        case "Thunderstorm":
            color = "linear-gradient(to right, #141e30, #243b55)";
            break;
        case "Snow":
            color = "linear-gradient(to right, #e6dada, #274046)";
            break;
        default:
            color = "linear-gradient(to right, #4facfe, #00f2fe)";
    }

    document.body.style.background = color;
}
