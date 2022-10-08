
// Determine color of marker
function chooseColor(depth) {
  switch (true) {
  case depth > 90:
      return "#FF0000";
  case depth > 70:
      return "#ff6600";
  case depth > 50:
      return "#FFCC00";
  case depth > 30:
      return "#FFFF00";
  case depth > 10:
      return "#99ff00";
  default:
      return "#00FF00";
  }
}

function createMap(earthquakes, legend) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

   // Create our map, giving it the streetmap and earthquakes layers to display on load.
   var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  legend.addTo(myMap);

}

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag} Depth: ${feature.geometry.coordinates[2]}</p>`);
  }
  // Determine size of marker
  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
}


// Function to Determine Style of Marker
function styleInfo(earthquake) {
    return {
      opacity: 1,
      fillOpacity: 0.7,
      fillColor: chooseColor(earthquake.geometry.coordinates[2]),
      color: "#000000",
      radius: markerSize(earthquake.properties.mag),
      weight: 0.25
    };
}

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Style marker based on magnitude and depth
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJson(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: onEachFeature
})
  // Send our earthquakes layer to the createMap function/
  return earthquakes
}


// Load the GeoJSON data.
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geojson;

// Get the data with d3.
d3.json(geoData).then(function(data) {

  // Create markers
  var features = createFeatures(data)

 // Set up the legend.
 var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    var labels = ['<strong>Earthquake Depth</strong>']
    var limits = [0, 10, 30, 50, 70, 90]

    for (var i = 0; i < limits.length; i++) {

            div.innerHTML += 
            labels.push(
                '<li class="circle" style="background-color:' + chooseColor(limits[i]) + '"></i> ' +
            (limits[i]));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };

 // Adding features and legend to the map
 createMap(features, legend)
 
});

