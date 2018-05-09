mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json',
    center: [0, 10],
    zoom: 2
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// store an array to convert 2018 to 'planned'
var getYear = {
    2007: "2007",
    2008: "2008",
    2009: "2009",
    2010: "2010",
    2011: "2011",
    2012: "2012",
    2013: "2013",
    2014: "2014",
    2015: "2015",
    2016: "2016",
    2017: "2017",
    2018: "Planned"
}

map.on('load', function() {

    var filterStartYear = ['<=', ['number', ['get', 'year1']], 2017];
    var filterEndYear = ['>=', ['number', ['get', 'year2']], 2017];
   //var filterType = ['!=', ['string', ['get','type']], 'placeholder'];

    map.addLayer({
        id: 'powerplants',
        type: 'circle',
        source: {
          type: 'geojson',
          data: './data/plants.geojson'
        },
        paint: {
            'circle-radius': {
                property: 'capacity',
                type: 'exponential', // exponential scales in mapbox default to 1 which is a linear scale
                // found that a linear scale seemed to work better for this than for the UK power map
                stops: [
                  [50, 4],
                  [6720, 30]
                ]
              },
          'circle-color': [
            'match',
            ['get', 'type'],
            "Coal", "#ced1cc",
            "Gas", "#4e80e5",
            "Solar", "#ffc83e",
            "Nuclear", "#dd54b6",
            "Oil", "#a45edb",
            "Hydro", "#43cfef",
            "Wind", "#00a98e",
            "Biomass", "#A7B734",
            "Waste", "#ea545c",
            "Other", "#cc9b7a",
            /* other */ '#ffc83e'
          ],
          'circle-opacity': 0.45
        },
        'filter': ['all', filterStartYear, filterEndYear]
      });

      // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
        var year = parseInt(e.target.value);
        // update the map
        filterStartYear = ['<=', ['number', ['get', 'year1']], year];
        filterEndYear = ['>=', ['number', ['get', 'year2']], year];
        map.setFilter('powerplants', ['all', filterStartYear, filterEndYear]); //the filter only applies to the powerplants layer
  
        // update text in the UI
        document.getElementById('active-hour').innerText = getYear[year];
    });

});