
var ViewModel = function() {

  var highlightMarker, defaultMarker;
  var peakInfoWindow;

  // This function initially creates the markers
  this.createMapElements = function () {

    // Create a "highlighted location" marker
    highlightMarker = makeMarkerIcon('AD1457');

    // Create default marker
    defaultMarker = makeMarkerIcon('00BCD4');

    // Create InfoWindow
    peakInfoWindow = new google.maps.InfoWindow();

    // Drop initial markers
    peaksArray.forEach(function(peak){

      var marker = new google.maps.Marker({
        position: {lat: peak.lat, lng: peak.lng},
        title: peak.name,
        animation: google.maps.Animation.DROP,
        icon: defaultMarker
      });

      // Create an onclick event to open the large infowindow at each marker.
      // TODO: map interactions currently don't work because of z-index... 
      marker.addListener('click', function() {
        highlightPeak(this, highlightMarker, defaultMarker);
        showInfoWindow(this, peakInfoWindow);
      });

      markers.push(marker);

    });

    showPeaks();

  };


  // Handles showing/hiding of content box
  // Box initially visible
  this.showBox = ko.observable(true);

  // Function that toggles  visibility
  this.toggleBox = function() {
      if (this.showBox() === true){
        this.showBox(false);
      }
      else {
        this.showBox(true);
      }
  };

  // Function handling clicks on peaks in list
  this.clickedPeak = function(peak) {
    var markerPos = peaksArray.indexOf(peak);
    highlightPeak(markers[markerPos], highlightMarker, defaultMarker);
    showInfoWindow(markers[markerPos], peakInfoWindow);
  };

}


// Initialising ViewModel
var peaksViewModel = new ViewModel();
ko.applyBindings(peaksViewModel);




// ***************************** //
// All map related functionality //
// ***************************** //


// This function creates marker with color provided
// Source: /ud864/Project_Code_5_BeingStylish.html
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34), // 21px wide, 34 px high
    new google.maps.Point(0, 0), // origin 0,0
    new google.maps.Point(10, 34), // anchored at 10,34
    new google.maps.Size(21,34));
  return markerImage;
  }


// This function loops through the markers array and display them all
function showPeaks() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}


// This function highlights one peak with different pin and infowindow
function highlightPeak(marker, highlightmarker, defaultmarker) {

  // Set all markers to default
  for (var i = 0; i < markers.length; i++) {
    markers[i].setIcon(defaultmarker);
  }

  // Highlights one marker
  marker.setIcon(highlightmarker);
  // map.setCenter(marker.position);

}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function showInfoWindow(marker, infowindow) {

  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>' +
                          '<div>' + marker.position + '</div>');
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}
