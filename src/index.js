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
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];

  let currentMonth = months[date.getMonth()];
  let currentDate = date.getDate();
  let currentHour = date.getHours();
  let currentMinutes = date.getMinutes();
  let amPm = currentHour < 12 ? "a.m" : "p.m";
  if (currentHour > 12) {
    currentHour = currentHour - 12;
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
  //console.log(nextDays);
  let forecastHtml = "";
  nextDays.forEach(function (day, index) {
    //console.log(day);
    let upcomingDay = getForecastDay(day.dt);
    if (index == 0) {
      upcomingDay = "Tomorrow";
    }
    if (index < 6) {
      forecastHtml += ` <div class="col-2">
          <h6 class="title">${upcomingDay}</h6>
          <img src="http://openweathermap.org/img/wn/${
            day.weather[0].icon
          }@2x.png" alt="clear" width="45">
          <p>
            <span class="max-temperature"><strong>${Math.round(
              day.temp.max
            )}°</strong></span>
            <span class="min-temperature">${Math.round(day.temp.min)}°</span>
          </p>
        </div>`;
    }
  });
  forecastElement.innerHTML = forecastHtml;
}
function getforecastData(coords) {
  let apiKey = "f64f24c2cb65bc7a2a8ea12b29366908";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
function searchCity(event) {
  event.preventDefault();
  let searchInputCity = document.querySelector("#searchInput");
  let cityName = searchInputCity.value;
  searchWeather(cityName);
}
function searchWeather(city) {
  let unit = "metric";
  let apiKey = "f64f24c2cb65bc7a2a8ea12b29366908";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let url = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(url).then(updateWeather);
}

function updateWeather(response) {
  let displayTemperature = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#degrees");
  currentTemp.innerHTML = `${displayTemperature}`;

  let displayFeelslike = Math.round(response.data.main.feels_like);
  let currentFeelslike = document.querySelector("#tempFeelslike");
  currentFeelslike.innerHTML = `${displayFeelslike}°`;

  let displayHumidity = Math.round(response.data.main.humidity);
  let currentHumidity = document.querySelector("#humidityId");
  currentHumidity.innerHTML = `${displayHumidity}%`;

  let displayWindspeed = Math.round(response.data.wind.speed * 3.6);
  let currentWindspeed = document.querySelector("#windSpeed");
  currentWindspeed.innerHTML = `${displayWindspeed} km/h`;

  let displayDescription = response.data.weather[0].description;
  let currentDescription = document.querySelector("#weatherDescription");
  currentDescription.innerHTML = `${displayDescription}`;

  let displayCountry = response.data.sys.country;
  let currentCountry = document.querySelector("h4");
  currentCountry.innerHTML = `${displayCountry}`;

  let displayCity = response.data.name;
  let currentCity = document.querySelector("h1");
  currentCity.innerHTML = `${displayCity}`;

  let weatherIcon = document.querySelector("#weatherIcon");
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  let displayDate = document.getElementById("dateTime");
  displayDate.innerHTML = formatDate(response.data.dt * 1000);

  celsiusTemperature = displayTemperature;
  feelslikeTemperature = displayFeelslike;

  getforecastData(response.data.coord);
}
let search = document.querySelector("#searchForm");
search.addEventListener("submit", searchCity);

function currentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let unit = "metric";
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
  fahrenheitLink.classList.add("active");
  celsiusLink.classList.remove("active");
  let temperatureElement = document.querySelector("#degrees");

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);

  let feelsLikeElement = document.querySelector("#tempFeelslike");
  let fahrenheitFeelsLike = (feelslikeTemperature * 9) / 5 + 32;
  feelsLikeElement.innerHTML = `${Math.round(fahrenheitFeelsLike)}°`;
}
function showCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#degrees");

  temperatureElement.innerHTML = celsiusTemperature;

  let feelsLikeElement = document.querySelector("#tempFeelslike");
  feelsLikeElement.innerHTML = `${feelslikeTemperature}°`;
}

let celsiusTemperature = null;
let feelslikeTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheitUnit");
fahrenheitLink.addEventListener("click", showFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsiusUnit");
celsiusLink.addEventListener("click", showCelsiusTemperature);

searchWeather("Toronto");
