var apiKey = "aafdf51e1ce59e920dbd97a4fbc2834c";
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-input");
var currentWeatherEl = document.querySelector("#current-weather");
var forecastDaysEl = document.querySelector("#forecast-days");
var searchHistoryEl = document.querySelector("#search-history");

// array to store the past searches of the user, with more recent searches coming first.
var pastSearches = [];

var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    getCoordinates(cityName);
    saveNewSearch(cityName);
    cityInputEl.value = "";
}

var buttonClickHandler = function(event) {
    var targetEl = event.target;
    if (targetEl.matches(".city-button")) {
        var cityName = targetEl.textContent;
        getCoordinates(cityName);
        saveNewSearch(cityName);
    }
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
    forecastDaysEl.innerHTML = "";

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

var loadSearches = function() {
    pastSearches = JSON.parse(localStorage.getItem("searches"));
    if (!pastSearches) {
        pastSearches = [];
    };
};

var saveNewSearch = function(cityName) {
    // check whether the new city has already been searched for
    var filteredPastSearches = pastSearches.filter(function(oldCity) {
        return oldCity !== cityName;
    });
    pastSearches = filteredPastSearches;
    pastSearches.unshift(cityName);

    // limit the number of stored past searches to 8
    if (pastSearches.length > 8) {
        pastSearches = pastSearches.slice(0, 8);
    };

    saveSearches();
}

var saveSearches = function() {
    localStorage.setItem("searches", JSON.stringify(pastSearches));
    displaySearches();
};

var displaySearches = function() {
    loadSearches();
    searchHistoryEl.innerHTML = "";
    var maxDisplayed = Math.min(8, pastSearches.length);
    for (i=0; i < maxDisplayed; i++) {
        cityForButton = pastSearches[i];

        var cityButtonEl = document.createElement("button");
        cityButtonEl.className = "btn btn-secondary city-button";
        cityButtonEl.setAttribute("data-city", cityForButton);
        cityButtonEl.textContent = cityForButton;

        searchHistoryEl.appendChild(cityButtonEl);
    }
}

displaySearches();

cityFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryEl.addEventListener("click", buttonClickHandler);