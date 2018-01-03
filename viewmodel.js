
// Activates knockout.js


var ViewModel = function() {

  // Drop initial markers
  peaksArray.forEach(function(peak){
    console.log(peak.name);
  });
}

ko.applyBindings(new ViewModel());
