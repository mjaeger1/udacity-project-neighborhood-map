// Creating the map and markers on initial load

var map;
var markers = [];

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 47.715306, lng: 13.003693},
    zoom: 11
  });

  peaksArray.forEach(function(peak){
    var marker = new google.maps.Marker({
      position: {lat: peak.lat, lng: peak.lng},
      title: peak.name,
      animation: google.maps.Animation.DROP
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


}
