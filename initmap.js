/**
 * Upon loading of Google Maps API, this function creates the map initially
 */

var map;

// Callback function for Google Map API call
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.715306, lng: 13.003693},
    zoom: 11,
    gestureHandling: 'cooperative'
  });

  peaksViewModel.createMapElements();
}

// Function handling errors while loading Google Map API -> onerror="mapNotLoadingError()"
function mapNotLoadingError() {
  document.getElementById('maperror').innerHTML =
                  "<p>Google Maps Error</p>" +
                  "<p>¯\\_(ツ)_/¯</p>" +
                  "<p>Try Reloading Page</p>";
}
