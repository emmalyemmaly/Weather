var map;
var geoJSON;
var request;
var gettingData = false;
var openWeatherMapKey = "aa4cd61826e3e916de4912810297dddb"
function initialize() {
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(19.896766,-155.582782),
    styles: [
{
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#212121"
    }
  ]
},
{
  "elementType": "labels.icon",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#212121"
    }
  ]
},
{
  "featureType": "administrative",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "featureType": "administrative.country",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#9e9e9e"
    }
  ]
},
{
  "featureType": "administrative.land_parcel",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "administrative.locality",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#bdbdbd"
    }
  ]
},
{
  "featureType": "administrative.neighborhood",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "labels.text",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#181818"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#616161"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#1b1b1b"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#2c2c2c"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#8a8a8a"
    }
  ]
},
{
  "featureType": "road.arterial",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "road.arterial",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#373737"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#3c3c3c"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "labels",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "road.highway.controlled_access",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#4e4e4e"
    }
  ]
},
{
  "featureType": "road.local",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "road.local",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#616161"
    }
  ]
},
{
  "featureType": "transit",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#757575"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#000000"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#a27af3"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "labels.text",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#3d3d3d"
    }
  ]
}
]
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  // zorgt voor informatie over het weer
  google.maps.event.addListener(map, 'idle', checkIfDataRequested);
  // Dit zorgt voor de informatie als je op het icoontje klikt
  map.data.addListener('click', function(event) {
    infowindow.setContent(
     "<img src=" + event.feature.getProperty("icon") + ">"
     + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
     + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
     + "<br />" + event.feature.getProperty("weather")
     );
    infowindow.setOptions({
        position:{
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        },
        pixelOffset: {
          width: 0,
          height: -15
        }
      });
    infowindow.open(map);
  });
}
var checkIfDataRequested = function() {
  while (gettingData === true) {
    request.abort();
    gettingData = false;
  }
  getCoords();
};
// Zorgt voor de coordinaten
var getCoords = function() {
  var bounds = map.getBounds();
  var NE = bounds.getNorthEast();
  var SW = bounds.getSouthWest();
  getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
};
// Zorgt dat het weer weergegevn wordt
var getWeather = function(northLat, eastLng, southLat, westLng) {
  gettingData = true;
  var requestString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
                      + westLng + "," + northLat + "," //left top
                      + eastLng + "," + southLat + "," //right bottom
                      + map.getZoom()
                      + "&cluster=yes&format=json"
                      + "&APPID=" + openWeatherMapKey;
  request = new XMLHttpRequest();
  request.onload = proccessResults;
  request.open("get", requestString, true);
  request.send();
};
// Haalt de JSON resultaten op en verwerkt deze
var proccessResults = function() {
  console.log(this);
  var results = JSON.parse(this.responseText);
  if (results.list.length > 0) {
      resetData();
      for (var i = 0; i < results.list.length; i++) {
        geoJSON.features.push(jsonToGeoJson(results.list[i]));
      }
      drawIcons(geoJSON);
  }
};
var infowindow = new google.maps.InfoWindow();
// stuurt de data door naar geoJSON
var jsonToGeoJson = function (weatherItem) {
  var feature = {
    type: "Feature",
    properties: {
      city: weatherItem.name,
      weather: weatherItem.weather[0].main,
      temperature: weatherItem.main.temp,
      min: weatherItem.main.temp_min,
      max: weatherItem.main.temp_max,
      humidity: weatherItem.main.humidity,
      pressure: weatherItem.main.pressure,
      windSpeed: weatherItem.wind.speed,
      windDegrees: weatherItem.wind.deg,
      windGust: weatherItem.wind.gust,
      icon: "http://openweathermap.org/img/w/"
            + weatherItem.weather[0].icon  + ".png",
      coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
    },
    geometry: {
      type: "Point",
      coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
    }
  };
  // Zorgt voor de icoontjes
  map.data.setStyle(function(feature) {
    return {
      icon: {
        url: feature.getProperty('icon'),
        anchor: new google.maps.Point(25, 25)
      }
    };
  });
  // returns het object
  return feature;
};
// zorgt voor de markers op de kaart
var drawIcons = function (weather) {
   map.data.addGeoJson(geoJSON);
   gettingData = false;
};
var resetData = function () {
  geoJSON = {
    type: "FeatureCollection",
    features: []
  };
  map.data.forEach(function(feature) {
    map.data.remove(feature);
  });
};
google.maps.event.addDomListener(window, 'load', initialize);
