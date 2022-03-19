var apiKey = "aafdf51e1ce59e920dbd97a4fbc2834c";
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-input");

var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    // before submitting this to the onecall api, we need to get the coordinates of the city
    // To do this, we will 
    cityAPIUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;
    fetch(cityAPIUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                var lat = data[0].lat;
                var lon = data[0].lon;
                getWeather(lat, lon);
            });
        } else {
            alert("There was a problem with your request.");
        }
    }).catch(function(error) {
        alert("Unable to connect to the weather API");
    });
}

var getWeather = function(lat, lon) {
    apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var weatherObj = {
                    current: {
                        icon: data.current.weather[0].icon,
                        temp: data.current.temp,
                        wind: data.current.wind_speed,
                        humidity: data.current.humidity,
                        uvIndex: data.current.uvi
                    },
                    daily: {
                    }
                };
                for (i=1; i <= 5; i++) {
                    weatherObj.daily[i] = {
                        icon: data.current.weather[0].icon,
                        temp: data.daily[i].temp.max,
                        wind: data.daily[i].wind_speed,
                        humidity: data.daily[i].humidity
                    };
                };
                console.log(weatherObj);
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

cityFormEl.addEventListener("submit", formSubmitHandler);