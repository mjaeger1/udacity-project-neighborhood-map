// Creating the map and markers on initial load

var map;
var markers = [];

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.715306, lng: 13.003693},
    zoom: 11
  });

  peaksViewModel.test();

  // Create a "highlighted location" marker color
  var highlightMarker = makeMarkerIcon('AD1457');

  // Default marker
  var defaultMarker = makeMarkerIcon('00BCD4');

  peaksArray.forEach(function(peak){
    var marker = new google.maps.Marker({
      position: {lat: peak.lat, lng: peak.lng},
      title: peak.name,
      animation: google.maps.Animation.DROP,
      icon: defaultMarker
    });
    markers.push(marker);
  });

  showPeaks();

  // This function will loop through the markers array and display them all.
  function showPeaks() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }


  // This function takes in a COLOR, and then creates a new marker
  // icon of that color. The icon will be 21 px wide by 34 high, have an origin
  // of 0, 0 and be anchored at 10, 34).
  // Source: /ud864/Project_Code_5_BeingStylish.html
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
    }


  // function highlightPeak(i) {
  //   console.log(i);
  // }
}
