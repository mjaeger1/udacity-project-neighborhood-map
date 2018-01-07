/**
 * Upon loading of Google Maps API, this function creates the map initially
 */

var map;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.715306, lng: 13.003693},
    zoom: 11,
    gestureHandling: 'cooperative'
  });

  peaksViewModel.createMapElements();
}
