var apiKey = "aafdf51e1ce59e920dbd97a4fbc2834c";
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-input");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastDaysEl = document.querySelector("#forecast-days");

var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    getCoordinates(cityName);
    cityInputEl.value = "";
}

var getCoordinates = function(cityName) {
    var cityAPIUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;
    fetch(cityAPIUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                getWeather(cityName, lat, lon);
            });
        } else {
            alert("There was a problem with your request.");
        }
    }).catch(function(error) {
        alert("Unable to connect to the weather API");
    });
}

var getWeather = function(cityName, lat, lon) {
    apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayWeather(cityName, data);
            });
        }
        else {
            alert("There was a problem getting the weather");
        };
    }).catch(function(error) {
        console.log(error);
        alert("Unable to connect to the Weather API");
    });
};

var displayWeather = function(cityName, data) {
    currentWeatherEl.innerHTML = "";
    // var weatherObj = {
    //     current: {
    //         icon: data.current.weather[0].icon,
    //         temp: data.current.temp,
    //         wind: data.current.wind_speed,
    //         humidity: data.current.humidity,
    //         uvIndex: data.current.uvi
    //     },
    //     daily: {
    //     }
    // };
    // for (i=1; i <= 5; i++) {
    //     weatherObj.daily[i] = {
    //         icon: data.daily[i].weather[0].icon,
    //         temp: data.daily[i].temp.max,
    //         wind: data.daily[i].wind_speed,
    //         humidity: data.daily[i].humidity
    //     };
    // };

    // current weather display
    currentWeatherHeaderEl = document.createElement("h2");
    var currentIconCode = data.current.weather[0].icon;
    // change date to be dynamically generated
    currentWeatherHeaderEl.innerHTML = cityName + " (3/18/2022)<img class='current-weather-icon' src='http://openweathermap.org/img/wn/" + currentIconCode + "@2x.png'>";
    currentWeatherEl.appendChild(currentWeatherHeaderEl);

    var currentTempEl = document.createElement("p");
    // &#8457 is the HTML code for the degrees Fahrenheit symbol
    currentTempEl.innerHTML = "Temp: " + data.current.temp + " &#8457";
    currentWeatherEl.appendChild(currentTempEl);

    var currentWindEl = document.createElement("p");
    currentWindEl.textContent = "Wind: " + data.current.wind_speed + "MPH";
    currentWeatherEl.appendChild(currentWindEl);

    var currentHumidityEl = document.createElement("p");
    currentHumidityEl.textContent = "Humidity: " + data.current.humidity + "%";
    currentWeatherEl.appendChild(currentHumidityEl);

    var currentUVIndexEl = document.createElement("p");
    currentUVIndexEl.innerHTML = "UV Index: <span class='uv-index text-white'>" + data.current.uvi + "</span>";
    currentWeatherEl.appendChild(currentUVIndexEl);
    
    
    // daily forecast
    for (i = 1; i <= 5; i++) {
        var forecastDayEl = document.createElement("div");
        forecastDayEl.className = "forecast-day text-white";
        forecastDayEl.setAttribute("data-days-ahead", i);
        
        var forecastDateEl = document.createElement("h4");
        // change date to be dynamically generated
        forecastDateEl.textContent = "3/19/2022";
        forecastDayEl.appendChild(forecastDateEl);

        var forecastIconCode = data.daily[i].weather[0].icon;
        var forecastIconEl = document.createElement("img");
        forecastIconEl.className = "daily-weather-icon";
        forecastIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + forecastIconCode + "@2x.png");
        forecastDayEl.appendChild(forecastIconEl);

        var forecastTempEl = document.createElement("p");
        forecastTempEl.innerHTML = "Temp: " + data.daily[i].temp.max + " &#8457";
        forecastDayEl.appendChild(forecastTempEl);

        var forecastWindEl = document.createElement("p");
        forecastWindEl.textContent = "Wind: " + data.daily[i].wind_speed + "MPH";
        forecastDayEl.appendChild(forecastWindEl);

        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";
        forecastDayEl.appendChild(forecastHumidityEl);

        forecastDaysEl.appendChild(forecastDayEl);
    }

};

cityFormEl.addEventListener("submit", formSubmitHandler);