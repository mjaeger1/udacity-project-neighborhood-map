/**
 * ViewModel and core functionality of application. Based on knockout.js
 * Some functions influenced by or borrowed from:
 * https://github.com/udacity/ud864/blob/master/Project_Code_5_BeingStylish.html
 */


var ViewModel = function() {

  var self = this;

  var highlightMarker, defaultMarker;
  var peakInfoWindow;

  // This function initially creates the markers
  self.createMapElements = function () {

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
      marker.addListener('click', function() {
        highlightPeak(this, highlightMarker, defaultMarker);
        showInfoWindow(this, peakInfoWindow);
      });

      markers.push(marker);

    });

    showPeaks();
  };

  // Handles showing/hiding of peak list
  // List initially visible
  self.showBox = ko.observable(true);

  // Function that toggles visibility
  self.toggleBox = function() {
      if (self.showBox() === true){
        self.showBox(false);
      }
      else {
        self.showBox(true);
      }
  };

  // Function handling clicks on peaks in list
  self.clickedPeak = function(peak) {
    var markerPos = peaksArray.indexOf(peak);
    highlightPeak(markers[markerPos], highlightMarker, defaultMarker);
    showInfoWindow(markers[markerPos], peakInfoWindow);
  };


  // SEARCH below inspired by: https://opensoul.org/2011/06/23/live-search-with-knockoutjs/

  // Observable Arrays of all peaks
  self.peaksObsArray = ko.observableArray(peaksArray);

  // Observable capturing search terms
  self.query = ko.observable('');

  self.search = function(value) {

    // remove all the current peaks, which removes them from the view
    self.peaksObsArray([]);

    var selectedPeakIndices = [];

    for(var i = 0; i < peaksArray.length; i++) {
      if(peaksArray[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        self.peaksObsArray.push(peaksArray[i]);
        selectedPeakIndices.push(i);
      }
    }
    showSelectedPeaks(selectedPeakIndices);
  };
};


// Initialising ViewModel
var peaksViewModel = new ViewModel();
ko.applyBindings(peaksViewModel);

// Registering subscription of changes to "query"
// If change, then call the search function
peaksViewModel.query.subscribe(peaksViewModel.search);



/**
 * All major map-related functionality below
 */

// This function creates markers with color as provided
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


// This function shows only the filtered peaks
function showSelectedPeaks(indices) {
  // Remove all markers
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  // Show markers filtered for
  for (var j = 0; j < indices.length; j++) {
    markers[indices[j]].setMap(map);
  }
}


// This function highlights one peak with different pin
function highlightPeak(marker, highlightmarker, defaultmarker) {

  // Set all markers to default
  for (var i = 0; i < markers.length; i++) {
    markers[i].setIcon(defaultmarker);
  }

  // Highlight one marker
  marker.setIcon(highlightmarker);
}


// This function shows the infowindow when the marker or the list is clicked.
// Info from wikipedia is added if the api call is successful
function showInfoWindow(marker, infowindow) {

  // Call MediaWiki to get a short description for the respective location
  $.ajax({
    type: "GET",
    url: `https://de.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${marker.title}`,
    dataType: 'jsonp',
    // If successful, add resulting title, snippet and URL
    success: function (x) {
      var wikiInfo = x.query.search[0].title + ': ' + x.query.search[0].snippet +
                  ' <a href="https://de.wikipedia.org/w/index.php?search=' + marker.title +
                  '" target="_blank">de.wikipedia.org</a>';
      createInfoWindow(wikiInfo);
    },
    // If unsuccessful, inform user there is no further information available
    error: function (x) {
      var wikiInfo = "no further information available.";
      createInfoWindow(wikiInfo);
    }
  });

  // This function displays the infowindow
  function createInfoWindow(wikiInfo) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>' +
                            '<div>' + marker.position + '</div>' +
                            '<div>' + wikiInfo + '</div>') ;
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }
}
