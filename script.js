async function fetchWeather() {
    let CountryInput = document.getElementById("country-selection").value
    let SearchInput = document.getElementById("search").value
    const WeatherDataSelection = document.getElementById('weather-data')
    WeatherDataSelection.style.display = "block"
    const API_KEY = "";

    if (SearchInput === "" || CountryInput === "") {
        WeatherDataSelection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please enter a valid <u>city name</u> and select a <u>country</u></p>
        </div>
        `;
        return;
    }

    async function getLonAndLat() {
        const countryCode = CountryInput;
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${SearchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${API_KEY}`;
        const response = await fetch(geocodeURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();

        if (data.length == 0) {
            console.log("Something went wrong here.");
            WeatherDataSelection.innerHTML = `
            <div>
                <h2>Invalid Input: "${SearchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        } else {
            return data[0];
        }
    }

    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await fetch(weatherURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();

        console.log(data);
        WeatherDataSelection.innerHTML = `
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
            <div>
                <h2>${data.name}</h2>
                <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
                <p><strong>Description:</strong> ${data.weather[0].description}</p>
            </div>
            `;
    }

           document.getElementById("search").value = "";
           const geocodeData = await getLonAndLat();

           if (!geocodeData)
               return;
    
    await getWeatherData(geocodeData.lon, geocodeData.lat);
}