//initialise variables for unit switch and local/search location
var count = 0;
var sType = "local"

//auto geolocate function
function initMap() {
  //initialisation of map for geolocation
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15
  });
  //call geolocation function to centre map on user's currently location
  var geocoder = new google.maps.Geocoder();
  //event handler for searching for location conditions instead of auto-geolocation
  document.getElementById('submitSearch').addEventListener('click', function() {
    //set location search to search for location search
    sType = "search"
    //call geolocation function
    geocodeAddress(geocoder, map);

  });
  //event handler for auto-geolocation
  document.getElementById('submitLocal').addEventListener('click', function() {
    //set location search type to local for user's current position
    sType = "local"
    //call non-geolocation function
    initMap();

  });
  //use if statement to direct the flow to the appropriate function if the unit switch has been made to ensure the appropriate location is used
  if (sType == "search") {
    geocodeAddress(geocoder, map);
  }
  var infoWindow = new google.maps.InfoWindow({
    map: map
  });
  //get geolocation data to position infowindow on map
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      map.setCenter(pos);
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      //used a coarse count to determine if celsius/metric or fahrenheit/imperial should be used, should make this more explicit and set the variable to metric/imperial, this selects the appropriate api url
      if (count === 0 || count % 2 === 0) {
        var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&appid=b6fd884ce44fb8a6197ffa56457f5197';
        var forecastApiUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&units=metric&appid=b6fd884ce44fb8a6197ffa56457f5197';
        var units = "degrees Celsius"
      } else {
        var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=b6fd884ce44fb8a6197ffa56457f5197';
        var forecastApiUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=b6fd884ce44fb8a6197ffa56457f5197';
        var units = "Fahrenheit"
      }
//api call and setup for infowindow output for current conditions
      $.ajax({
        url: weatherApiUrl,
        dataType: 'json',
        success: function(weather) {
          lat1 = weather.coord.lat;
          lon1 = weather.coord.lon;
          lat = lat1.toFixed(2);
          lon = lon1.toFixed(2);
          city1 = weather.name;
          country1 = weather.sys.country;
          conditions = weather.weather[0].description;
          temp1 = weather.main.temp
          temp = temp1.toFixed(1)
          windspeed = weather.wind.speed;
          winddir = windDirection(weather.wind.deg);
          weatherIcon = '<img src=\'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png\'>';
          infoWindow.setContent('Location found. ' + lat + ' degrees latitude ' + lon + ' degrees longitude. <br> The nearest weather station to your location is ' + city1 + '. <br>' + weatherIcon + '<br> The weather conditions in ' + city1 + ' are ' + temp + ' ' + units + ' with ' + conditions + ' and winds blowing at ' + windspeed + ' knots from the ' + winddir + '.');
        }

      });
//api call and setup for forecast panel output - calls function to reduce extra code
      $.ajax({
        url: forecastApiUrl,
        dataType: 'json',
        success: function(forecast) {
          window.onload = fcast(forecast)
        }
      });

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
    $(document).ready(function() {

    });

  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}
//function to convert degree based wind direction to compass based
function windDirection(dir) {
  var compass = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
  var direction = Math.floor(dir / 45);
  return compass[direction];
}
//function to switch between celsius and fahrenheit
function metricImperial() {
  count++;
  initMap();
  //use counter to determine text for button
  if (count % 2 === 0 || count === 0) {
    document.getElementById("unitswitch").value = "Change to Fahrenheit";
  } else {
    document.getElementById("unitswitch").value = "Change to Celsius";
  }

}
//function for using specified location to find weather conditions instead of geolocation
function geocodeAddress(geocoder, resultsMap) {
  sType = "search";
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15
  });
  var address = document.getElementById('address').value;
  var infoWindow = new google.maps.InfoWindow({
    map: map
  });
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      var lt = results[0].geometry.location.lat();
      var ln = results[0].geometry.location.lng();
      var lat = lt;
      var lon = ln;
      var pos = {
        lat: lt,
        lng: ln
      };
      infoWindow.setPosition(pos);
      map.setCenter(pos);

      if (count === 0) {
        var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&appid=b6fd884ce44fb8a6197ffa56457f5197';
        var forecastApiUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&units=metric&appid=b6fd884ce44fb8a6197ffa56457f5197';
        var units = "degrees Celsius"
      } else {
        if (count === 0 || count % 2 === 0) {
          var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&appid=b6fd884ce44fb8a6197ffa56457f5197';
          var forecastApiUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&units=metric&appid=b6fd884ce44fb8a6197ffa56457f5197';
          var units = "degrees Celsius"
        } else {
          var weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=b6fd884ce44fb8a6197ffa56457f5197';
          var forecastApiUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=b6fd884ce44fb8a6197ffa56457f5197';
          var units = "Fahrenheit"
        }
      }

      $.ajax({
        url: weatherApiUrl,
        dataType: 'json',
        success: function(weather) {
          lat1 = weather.coord.lat;
          lon1 = weather.coord.lon;
          lat = lat1.toFixed(2);
          lon = lon1.toFixed(2);
          city1 = weather.name;
          country1 = weather.sys.country;
          conditions = weather.weather[0].description;
          temp1 = weather.main.temp
          temp = temp1.toFixed(1)
          windspeed = weather.wind.speed;
          winddir = windDirection(weather.wind.deg);
          weatherIcon = '<img src=\'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png\'>';
          infoWindow.setContent('Location found. ' + lat + ' degrees latitude ' + lon + ' degrees longitude. <br> The nearest weather station to your location is ' + city1 + '. <br>' + weatherIcon + '<br> The weather conditions in ' + city1 + ' are ' + temp + ' ' + units + ' with ' + conditions + ' and winds blowing at ' + windspeed + ' knots from the ' + winddir + '.');
        }

      });

      $.ajax({
        url: forecastApiUrl,
        dataType: 'json',
        success: function(forecast) {
          window.onload = fcast(forecast)
        }
      });

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
//separate function to process forecast panel api call
function fcast(forecast) {
  var d = [];
  var tmin = [];
  var tmax = [];
  var icon = [];
  for (i = 0; i < forecast.list.length; i++) {
    d.push(new Date(forecast.list[i].dt * 1000))
    tmin.push((forecast.list[i].temp.min).toFixed(1))
    tmax.push((forecast.list[i].temp.max).toFixed(1))
    icon.push('<img src=\'http://openweathermap.org/img/w/' + forecast.list[i].weather[0].icon + '.png\'>')
    document.getElementById("todayp" + i).innerHTML = d[i].toDateString() + "<br>Min: " + tmin[i] + "<br>Max: " + tmax[i] + "<br>" + icon[i];
  }
}
