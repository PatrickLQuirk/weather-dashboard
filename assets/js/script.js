var apiKey = "aafdf51e1ce59e920dbd97a4fbc2834c";
// var cityName = "Chicago"
// var cityAPIUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;

var getWeather = function(lat, lon) {
    apiUrl = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            weatherObj = {
                current: {
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
                    property: i
                };
            };
        });
    });
    return weatherObj;
};

// fetch(cityAPIUrl).then(function(response) {
//     response.json().then(function(data) {
//         var lat = data[0].lat;
//         var lon = data[0].lon;
//         var weatherObj = getWeather(lat, lon);
//     });
// });