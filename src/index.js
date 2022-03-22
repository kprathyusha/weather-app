let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

function formatDate(timestamp) {
    let date = new Date(timestamp * 1000);

    let currentDay = days[date.getDay()];
    let currentMonth = months[date.getMonth()];
    let currentDate = date.getDate();
    let currentHour = date.getHours();
    let currentMinutes = date.getMinutes();
    let amPm = currentHour < 12 ? "a.m" : "p.m";
    if (currentHour > 12) {
        currentHour = currentHour - 12;
    } else if (currentHour === 0) {
        currentHour = 12;
    }
    if (currentMinutes < 10) {
        currentMinutes = "0" + currentMinutes;
    }
    let result = `${currentDay}, ${currentMonth} ${currentDate}, ${currentHour}:${currentMinutes} ${amPm}`;
    return result;
}

function formatDateAsUtc(timestamp) {
    let date = new Date(timestamp * 1000);

    let currentDay = days[date.getUTCDay()];
    let currentMonth = months[date.getUTCMonth()];
    let currentDate = date.getUTCDate();
    let currentHour = date.getUTCHours();
    let currentMinutes = date.getUTCMinutes();
    let amPm = currentHour < 12 ? "a.m" : "p.m";
    if (currentHour > 12) {
        currentHour = currentHour - 12;
    } else if (currentHour === 0) {
        currentHour = 12;
    }
    if (currentMinutes < 10) {
        currentMinutes = "0" + currentMinutes;
    }
    let result = `${currentDay}, ${currentMonth} ${currentDate}, ${currentHour}:${currentMinutes} ${amPm}`;
    return result;
}

function getForecastDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = `${months[date.getMonth()]} ${date.getDate()}`;
    return day;
}
function displayForecast(response) {
    let forecastElement = document.querySelector("#dailyForecast");
    let nextDays = response.data.daily;
    let forecastHtml = "";
    nextDays.forEach(function (day, index) {
        let upcomingDay = getForecastDay(day.dt);
        if (index == 0) {
            upcomingDay = "Tomorrow";
        }
        if (index < 6) {
            forecastHtml += ` <div class="col-sm-2">
          <h6 class="title">${upcomingDay}</h6>
          <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
          }@2x.png" alt="clear" width="45">
          <p>
            <span class="max-temperature" id="forecastTemperature">
            ${Math.round(day.temp.max)}°
            </span>
            <span class="min-temperature" id="forecastTemperature">
            ${Math.round(day.temp.min)}°
            </span>
          </p>
        </div>`;
        }
    });
    forecastElement.innerHTML = forecastHtml;
}

function getforecastData(coords) {
    let apiKey = "f64f24c2cb65bc7a2a8ea12b29366908";
    let unit = isCelsius ? "metric" : "imperial";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=${unit}`;
    console.log(apiUrl);
    axios.get(apiUrl).then(displayForecast);
}

function searchCity(event) {
    event.preventDefault();
    //let searchInputCity = document.querySelector("#searchInput");
    let cityName = searchInputCity.value;
    cityName = cityName.trim();
    if (!cityName) {
        alert("Please enter a valid city name");
        return;
    }

    searchWeather(cityName);
}
function searchWeather(city) {
    let unit = isCelsius ? "metric" : "imperial";
    let apiKey = "f64f24c2cb65bc7a2a8ea12b29366908";
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
    let url = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${unit}`;
    axios
        .get(url)
        .then(updateWeather)
        .catch(function (error) {
            alert("Something went wrong. Kindly check the city name.");
            console.log(`Error: ${error.message}`);
        });
}

function updateWeather(response) {
    let displayTemperature = Math.round(response.data.main.temp);
    let currentTempElement = document.querySelector("#degrees");
    currentTempElement.innerHTML = `${displayTemperature}`;

    let displayFeelslike = Math.round(response.data.main.feels_like);
    let currentFeelslikeElement = document.querySelector("#tempFeelslike");
    currentFeelslikeElement.innerHTML = `${displayFeelslike}°`;

    let displayHumidity = Math.round(response.data.main.humidity);
    let currentHumidityElement = document.querySelector("#humidityId");
    currentHumidityElement.innerHTML = `${displayHumidity}%`;

    let displayWindspeed = Math.round(response.data.wind.speed * 3.6);
    let currentWindspeedElement = document.querySelector("#windSpeed");
    currentWindspeedElement.innerHTML = `${displayWindspeed} km/h`;

    let displayDescription = response.data.weather[0].description;
    let currentDescriptionElement = document.querySelector(
        "#weatherDescription"
    );
    currentDescriptionElement.innerHTML = `${displayDescription}`;

    let displayCountry = response.data.sys.country;
    let currentCountryElement = document.querySelector("h4");
    currentCountryElement.innerHTML = `${displayCountry}`;

    let displayCity = response.data.name;
    let currentCityElement = document.querySelector("h1");
    currentCityElement.innerHTML = `${displayCity}`;

    let weatherIconElement = document.querySelector("#weatherIcon");
    weatherIconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

    let currDate = new Date();
    // let localTime = Math.floor(d.getTime() / 1000);
    // let localOffset = d.getTimezoneOffset() * 60;
    // let utc = localTime + localOffset;
    let utc = Math.floor(currDate.getTime() / 1000);
    let searchedCityTimestamp = utc + response.data.timezone;
    //let nDate = new Date(utc + 1000 * response.data.timezone);
    let searchedCityDateTime = formatDateAsUtc(searchedCityTimestamp);
    console.log(
        `UtcTimestamp: ${utc} -- 
        UtcDate: ${formatDateAsUtc(utc)} --
        LocalDate: ${formatDate(utc)} -- 
        d.toUtcString: ${currDate.toUTCString()} -- 
        TimestampInCity: ${searchedCityTimestamp} -- 
        DateInCity: ${searchedCityDateTime}  -- 
        ResponseTimeZone: ${response.data.timezone}`
    );

    let displayDateElement = document.getElementById("dateTime");
    displayDateElement.innerHTML = searchedCityDateTime;

    currentTemperature = displayTemperature;
    feelslikeTemperature = displayFeelslike;

    getforecastData(response.data.coord);
}
let searchElement = document.querySelector("#searchForm");
searchElement.addEventListener("submit", searchCity);

function currentLocation(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let unit = isCelsius ? "metric" : "imperial";
    let apiKey = "f64f24c2cb65bc7a2a8ea12b29366908";
    let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
    let url = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
    axios.get(url).then(updateWeather);
}
function getCurrentLocation(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(currentLocation);
}

let locationButton = document.querySelector("#locationBtn");
locationButton.addEventListener("click", getCurrentLocation);

function showFahrenheitTemperature(event) {
    event.preventDefault();

    if (fahrenheitLink.classList.contains("active")) {
        return;
    }
    fahrenheitLink.classList.add("active");
    celsiusLink.classList.remove("active");
    let temperatureElement = document.querySelector("#degrees");

    let fahrenheitTemperature = isCelsius
        ? (currentTemperature * 9) / 5 + 32
        : currentTemperature;
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

    let feelsLikeElement = document.querySelector("#tempFeelslike");
    let fahrenheitFeelsLike = isCelsius
        ? (feelslikeTemperature * 9) / 5 + 32
        : feelslikeTemperature;
    feelsLikeElement.innerHTML = `${Math.round(fahrenheitFeelsLike)}°`;

    currentTemperature = fahrenheitTemperature;
    feelslikeTemperature = fahrenheitFeelsLike;
    isCelsius = false;
    convertForecastTemperatures();
}
function showCelsiusTemperature(event) {
    event.preventDefault();

    if (celsiusLink.classList.contains("active")) {
        return;
    }
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
    let temperatureElement = document.querySelector("#degrees");

    let celsiusTemperature = isCelsius
        ? currentTemperature
        : ((currentTemperature - 32) * 5) / 9;
    temperatureElement.innerHTML = Math.round(celsiusTemperature);

    let feelsLikeElement = document.querySelector("#tempFeelslike");
    let celsiusFeelsLike = isCelsius
        ? feelslikeTemperature
        : ((feelslikeTemperature - 32) * 5) / 9;
    feelsLikeElement.innerHTML = `${Math.round(celsiusFeelsLike)}°`;

    currentTemperature = celsiusTemperature;
    feelslikeTemperature = celsiusFeelsLike;
    isCelsius = true;
    convertForecastTemperatures();
}

function convertForecastTemperatures() {
    let forecastTempElements = document.querySelectorAll(
        "#forecastTemperature"
    );
    forecastTempElements.forEach(function (element) {
        let temperature = parseInt(element.innerText);
        let convertedTemp = isCelsius
            ? ((temperature - 32) * 5) / 9
            : (temperature * 9) / 5 + 32;

        element.innerHTML = `${Math.round(convertedTemp)}°`;
    });
}

let isCelsius = true;
let currentTemperature = null;
let feelslikeTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheitUnit");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsiusUnit");
celsiusLink.addEventListener("click", showCelsiusTemperature);

const searchInputCity = document.querySelector("#searchInput");
let cityOptions = {
    types: ["(cities)"],
};
let autocomplete = new google.maps.places.Autocomplete(
    searchInputCity,
    cityOptions
);

searchWeather("Toronto");
