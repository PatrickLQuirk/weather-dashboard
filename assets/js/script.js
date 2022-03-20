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
    var cityAPIUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;
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
    apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
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
    
    // get current date as moment object
    // this moment object will be manipulated to display future dates in the daily forecast
    var dateForDisplay = moment();

    // current weather display
    currentWeatherHeaderEl = document.createElement("h2");
    var currentIconCode = data.current.weather[0].icon;
    // I am splitting the setting of the innerHTML into several lines in an effort to improve readability
    var currentImageLink = "https://openweathermap.org/img/wn/" + currentIconCode + "@2x.png";
    var currentImageHTML = "<img class='current-weather-icon' src=" + currentImageLink + ">";
    currentWeatherHeaderEl.innerHTML = cityName + " (" + dateForDisplay.format("M/D/YYYY") + ")" + currentImageHTML;
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
        
        dateForDisplay.add(1, "days");
        var forecastDateEl = document.createElement("h4");
        // change date to be dynamically generated
        forecastDateEl.textContent = dateForDisplay.format("M/D/YYYY");
        forecastDayEl.appendChild(forecastDateEl);

        var forecastIconCode = data.daily[i].weather[0].icon;
        var forecastIconEl = document.createElement("img");
        forecastIconEl.className = "daily-weather-icon";
        forecastIconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastIconCode + "@2x.png");
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