const API_KEY = "9a8e306334ab4978a8465054241603";
let celsius = 0;

const getCurrentWeather = async (location) => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`
    );
    const data = await response.json();
    return processCurrentData(data);
  } catch (e) {
    alert("Could not get weather for this location");
  }
};

const getForecastWeather = async (location) => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3`
    );
    const data = await response.json();
    return processForecastData(data);
  } catch (e) {
    alert("Could not get weather for this location");
  }
};

const processCurrentData = (data) => {
  const location = data.location;
  const curr = data.current;
  const currentDay = new Date().toDateString();

  const weatherData = {
    date: currentDay,
    city: location.name,
    region: location.region,
    country: location.country,
    temp_c: curr.temp_c,
    temp_f: curr.temp_f,
    condition: curr.condition.text,
    wind_mph: curr.wind_mph,
    humidity: curr.humidity,
    uv: curr.uv,
    feelslike_c: curr.feelslike_c,
    feelslike_f: curr.feelslike_f,
    precip: curr.precip_in,
  };

  return weatherData;
};

const processForecastData = (data) => {
  const weatherData = new Array();
  const days = data.forecast.forecastday;

  for (const day of days) {
    const currentDay = new Date(`${day.date}T00:00`).toDateString();
    const dayData = {
      date: currentDay,
      maxtemp_c: day.day.maxtemp_c,
      maxtemp_f: day.day.maxtemp_f,
      mintemp_c: day.day.mintemp_c,
      mintemp_f: day.day.mintemp_f,
      icon: day.day.condition.icon,
    };
    weatherData.push(dayData);
  }

  return weatherData;
};

const loadBaseUI = () => {
  loadSearchBar();
  const currentWeather = getCurrentWeather("Honolulu");
  currentWeather.then((data) => {
    loadWeather(data);
    loadInfo(data);
  });
  const forecastWeather = getForecastWeather("Honolulu");
  forecastWeather.then((data) => {
    loadForecast(data);
  });
};

const loadSearchBar = () => {
  const inputContainer = document.getElementById("input-container");
  const inputDiv = document.createElement("div");
  const input = document.createElement("input");
  const submitBtn = document.createElement("button");
  const toggleBtn = document.createElement("button");
  inputDiv.appendChild(input);
  inputDiv.appendChild(submitBtn);
  inputContainer.appendChild(inputDiv);
  inputContainer.appendChild(toggleBtn);

  input.type = "text";
  input.placeholder = "Search";
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      getCurrentWeather(input.value).then((data) => {
        loadWeather(data);
        loadInfo(data);
      });
      getForecastWeather(input.value).then((data) => {
        loadForecast(data);
      });
    }
  });
  submitBtn.textContent = "Go";
  submitBtn.onclick = () => {
    getCurrentWeather(input.value).then((data) => {
      loadWeather(data);
      loadInfo(data);
    });
    getForecastWeather(input.value).then((data) => {
      loadForecast(data);
    });
  };
  toggleBtn.textContent = "°F/°C";
  toggleBtn.onclick = () => handleToggleBtn();
};

const handleToggleBtn = () => {
  celsius === 0 ? (celsius = 1) : (celsius = 0);
  const city = document.getElementById("weather-city");
  getCurrentWeather(city.textContent).then((data) => {
    loadWeather(data);
    loadInfo(data);
  });
  getForecastWeather(city.textContent).then((data) => {
    loadForecast(data);
  });
};

const loadWeather = (weather) => {
  const weatherContainer = document.getElementById("weather-container");
  weatherContainer.textContent = "";
  const city = document.createElement("div");
  const temp = document.createElement("div");
  const description = document.createElement("div");
  city.id = "weather-city";
  weatherContainer.appendChild(city);
  weatherContainer.appendChild(temp);
  weatherContainer.appendChild(description);

  city.textContent = weather.city;
  temp.textContent = celsius ? `${weather.temp_c} °C` : `${weather.temp_f} °F`;
  description.textContent = weather.condition;
};

const loadForecast = (weather) => {
  const forecastContainer = document.getElementById("forecast-container");
  forecastContainer.textContent = "";

  for (const day of weather) {
    const dayContainer = document.createElement("div");
    const dayTxt = document.createElement("div");
    const tempContainer = document.createElement("div");
    const tempHigh = document.createElement("div");
    const tempLow = document.createElement("div");
    const icon = document.createElement("img");
    dayContainer.classList.add("weathercon");

    tempContainer.classList.add("tempcon");
    icon.classList.add("weathericon");
    dayContainer.appendChild(dayTxt);
    dayContainer.appendChild(tempContainer);
    tempContainer.appendChild(tempHigh);
    tempContainer.appendChild(tempLow);
    dayContainer.appendChild(icon);
    forecastContainer.appendChild(dayContainer);

    dayTxt.textContent = day.date.substring(0, 3);
    tempHigh.textContent = celsius
      ? `High: ${day.maxtemp_c} °C`
      : `High: ${day.maxtemp_f} °F`;
    tempLow.textContent = celsius
      ? `Low: ${day.mintemp_c} °C`
      : `Low: ${day.mintemp_f} °F`;
    icon.src = day.icon;
  }
};

const loadInfo = (weather) => {
  const infoContainer = document.getElementById("info-container");
  infoContainer.textContent = "";
  const precipDiv = document.createElement("div");
  const feelslikeDiv = document.createElement("div");
  const uvDiv = document.createElement("div");
  const windDiv = document.createElement("div");
  const humidityDiv = document.createElement("div");
  precipDiv.classList.add("infocon");
  feelslikeDiv.classList.add("infocon");
  uvDiv.classList.add("infocon");
  windDiv.classList.add("infocon");
  humidityDiv.classList.add("infocon");
  infoContainer.appendChild(precipDiv);
  infoContainer.appendChild(feelslikeDiv);
  infoContainer.appendChild(uvDiv);
  infoContainer.appendChild(windDiv);
  infoContainer.appendChild(humidityDiv);

  const precipIcon = document.createElement("i");
  precipIcon.classList.add("fa-solid", "fa-droplet");
  precipDiv.appendChild(precipIcon);
  const precipText = document.createElement("div");
  precipText.textContent = `Precipitation: ${weather.precip}`;
  precipDiv.appendChild(precipText);

  const feelslikeIcon = document.createElement("i");
  feelslikeIcon.classList.add("fa-solid", "fa-temperature-half");
  feelslikeDiv.appendChild(feelslikeIcon);
  const feelslikeText = document.createElement("div");
  feelslikeText.textContent = celsius
    ? `Feels Like: ${weather.feelslike_c} °C`
    : `Feels Like: ${weather.feelslike_f} °F`;
  feelslikeDiv.appendChild(feelslikeText);

  const uvIcon = document.createElement("i");
  uvIcon.classList.add("fa-solid", "fa-sun");
  uvDiv.appendChild(uvIcon);
  const uvText = document.createElement("div");
  uvText.textContent = `UV: ${weather.uv}`;
  uvDiv.appendChild(uvText);

  const windIcon = document.createElement("i");
  windIcon.classList.add("fa-solid", "fa-wind");
  windDiv.appendChild(windIcon);
  const windText = document.createElement("div");
  windText.textContent = `Wind: ${weather.wind_mph} mph`;
  windDiv.appendChild(windText);

  const humidityIcon = document.createElement("i");
  humidityIcon.classList.add("fa-solid", "fa-shower");
  humidityDiv.appendChild(humidityIcon);
  const humidityText = document.createElement("div");
  humidityText.textContent = `Humidity: ${weather.humidity}%`;
  humidityDiv.appendChild(humidityText);
};

loadBaseUI();
