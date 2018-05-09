mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json',
    center: [0, 10],
    zoom: 2
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Store an array of quantiles
var max = 6720;
var fifth = 6720 / 5;
var quantiles = [];
for (i = 0; i < 5; i++) {
  var quantile = (fifth + i) * fifth;
  quantiles.push(quantile);
}

map.on('load', function() {

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
                stops: [
                  [60, 4],
                  [6720, 30]
                ]
              },
            // 'circle-radius': [
            //     'interpolate',
            //     ['linear'],
            //     ['number', ['get', 'capacity']],
            //     // first number is the capacity and second is the size
            //     0, 1,
            //     10, 3,
            //     100, 6,
            //     1000, 9,
            //     10000, 12
            //     ],
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
        }
        //'filter': ['all', filterStartYear, filterEndYear, filterType]
      });

});