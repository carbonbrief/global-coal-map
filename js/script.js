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
    2018: "Future"
}

map.on('load', function() {

    var year = 2017;

    // set up three different filters for the three different colours
    // plants about to close
    var filterYear1 = ['==', ['number', ['get', 'year2']], (year)];
    // main plants
    var filterStartYear2 = ['<', ['number', ['get', 'year1']], year];
    var filterEndYear2 = ['>', ['number', ['get', 'year2']], year];
    // plants newly opened
    var filterYear3 = ['==', ['number', ['get', 'year1']], year];
    // filter for plants planned
    var filterYear4 = ['>=', ['number', ['get', 'year1']], 2018];
    // filter to remove plants planned
    var filterYear5 = ['<', ['number', ['get', 'year1']], 2018];


   //var filterType = ['!=', ['string', ['get','type']], 'placeholder'];

   map.addLayer({
    id: 'closingsoon',
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
      'circle-color': '#ff8767',
      'circle-opacity': 0.45
        },
        'filter': ['all', filterYear1, filterYear5]
   })

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
          'circle-color': '#ffc83e',
        //   [
        //     'match',
        //     (['get', 'year1'] == year), '#ced1cc',
        //     (['get', 'year2'] == year), '#ea545c',
        //     /* other */ '#ffc83e'
        //   ],
          'circle-opacity': 0.45
        },
        'filter': ['all', filterStartYear2, filterEndYear2, filterYear5]    // filter for start and end year AND make sure that start year is less than 2018 (filterYear5)
      });

      map.addLayer({
        id: 'newlyopened',
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
          'circle-color': '#ced1cc',
          'circle-opacity': 0.45
            },
            'filter': ['all', filterYear3, filterYear5]
       })

       map.addLayer({
        id: 'planned',
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
          'circle-color': '#dd54b6',
          'circle-opacity': 0.45
            },
            'filter': ['all', filterYear4, filterYear3] // filter so that start year is greater than or equal to 2018 AND the slider is set to 2018
       })

      // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
        year = parseInt(e.target.value);
        // update the map filters
        filterYear1 = ['==', ['number', ['get', 'year2']], (year)];
        filterStartYear2 = ['<', ['number', ['get', 'year1']], year];
        filterEndYear2 = ['>', ['number', ['get', 'year2']], year];
        filterYear3 = ['==', ['number', ['get', 'year1']], year];
        // update the map
        map.setFilter('powerplants', ['all', filterStartYear2, filterEndYear2, filterYear5]); //the filter only applies to the powerplants layer
        map.setFilter('closingsoon', ['all', filterYear1, filterYear5]);
        map.setFilter('newlyopened', ['all', filterYear3, filterYear5]);
        map.setFilter('planned', ['all', filterYear4, filterYear3]);
  
        // update text in the UI
        document.getElementById('active-hour').innerText = getYear[year];
    });

    // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mouseenter', 'powerplants', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';

    var colorsArray = {
      "Coal": "#ced1cc",
      "Gas": "#4e80e5",
      "Solar": "#ffc83e",
      "Nuclear": "#dd54b6",
      "Oil": "#a45edb",
      "Hydro": "#43cfef",
      "Wind": "#00a98e",
      "Biomass": "#A7B734",
      "Waste": "#ea545c",
      "Other": "#cc9b7a"
    }

    var coordinates = e.features[0].geometry.coordinates.slice();
    var name = e.features[0].properties.plant;
    var capacity = e.features[0].properties.capacity;
    var coalType = e.features[0].properties.coalType;
    // match plant type to the color in colorsArray, so that the title of the tooltip changes color
    var plantColor = colorsArray[e.features[0].properties.type]; 

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates)
        .setHTML('<h3 style = "color: ' + plantColor + ';">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p>')
        .addTo(map);
    });

    map.on('mouseleave', 'powerplants', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

});