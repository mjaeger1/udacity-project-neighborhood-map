
var ViewModel = function() {

  // Drop initial markers
  peaksArray.forEach(function(peak){
    // console.log(peak.name);
  });

  // Handles showing/hiding of content box

  this.showBox = ko.observable(true); // Box initially visible

  // Function that toggles  visible
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
    // console.log(peak);
    // console.log(peaksArray.indexOf(peak));
    highlightPeak(peaksArray.indexOf(peak));
  };


  this.test = function() {
    console.log("test");
  };

}

// Initialising ViewModel
var peaksViewModel = new ViewModel();
ko.applyBindings(peaksViewModel);


// All map related actions
