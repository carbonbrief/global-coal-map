mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json',
    center: [8, 10],
    zoom: 1.5
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// store an array to convert 2018 to 'planned'
var getYear = {
    2000: "2000",
    2001: "2001",
    2002: "2002",
    2003: "2003",
    2004: "2004",
    2005: "2005",
    2005: "2005",
    2006: "2006",
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

    // FILTERS

    // NEW
    // grab plants where the start year equals EITHER start1 OR start 2
    var filterNew = ['any', ['==', ['number', ['get', 'start1']], year], ['==', ['number', ['get', 'start2']], year] ];
    
    // CLOSING
    // grab plants where the slider year is the year BEFORE EITHER retire year
    var filterClosing = ['any', ['==', ['number', ['get', 'retire1']], (year+1)], ['==', ['number', ['get', 'retire2']], (year+1)] ];

    // FUTURE
    // filter for construction
    var filterConstruction = ['==', ['string', ['get', 'status']], 'Construction'];
    // filter for planned. Any = logical OR
    var filterPlanned = ['any', ['==', ['string', ['get', 'status']], 'Permitted'], ['==', ['string', ['get', 'status']], 'Pre-permit'], ['==', ['string', ['get', 'status']], 'Announced'] ];
    // link to slider
    // ensure that planned and construction colours only show on the future, ie. when the slider is at position 2018
    var filterFuture = ['all', ['==', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year1']], 2018]];

    // OPERATIONAL
    // grab plants that don't fit into closing or new categories
    var filterOperating = ['all', ['!=', ['number', ['get', 'start1']], year], ['!=', ['number', ['get', 'start2']], year], ['!=', ['number', ['get', 'retire1']], (year+1)], ['!=', ['number', ['get', 'retire2']], (year+1)]];
    // link to slider and make sure that not planned
    // ensure that the slider year is between year1 and year2, and that it doesn't begin after 2018. using less then or equal operator because the filter above will remove those that need to be coloured for new or closing
    var filterOperating2 = ['all', ['<=', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year2']], year], ['<', ['number', ['get', 'year1']], 2018] ];

    // set up filter for region
    var filterRegion = ['!=', ['string', ['get','regionLabel']], 'placeholder'];

   map.addLayer({
    id: 'closing',
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
        'filter': ['all', filterClosing, filterRegion]
   })

    map.addLayer({
        id: 'operating',
        type: 'circle',
        source: {
          type: 'geojson',
          data: './data/plants.geojson'
        },
        paint: {
            'circle-radius': {
                property: 'capacity',
                type: 'exponential',
                stops: [
                  [50, 4],
                  [6720, 30]
                ]
              },
          'circle-color': '#ffc83e',
          'circle-opacity': 0.45
        },
        'filter': ['all', filterOperating, filterOperating2, filterRegion]    // filter for start and end year AND make sure that start year is less than 2018 (filterYear5)
      });

      map.addLayer({
        id: 'new',
        type: 'circle',
        source: {
            type: 'geojson',
            data: './data/plants.geojson'
        },
        paint: {
            'circle-radius': {
                property: 'capacity',
                type: 'exponential',
                stops: [
                  [50, 4],
                  [6720, 30]
                ]
              },
          'circle-color': '#ff8767',
          'circle-opacity': 0.45
            },
            'filter': ['all', filterNew, filterRegion]
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
                type: 'exponential',
                stops: [
                  [50, 4],
                  [6720, 30]
                ]
              },
          'circle-color': '#a45edb',
          'circle-opacity': 0.35
            },
            'filter': ['all', filterFuture, filterPlanned, filterRegion] 
       })

       map.addLayer({
        id: 'construction',
        type: 'circle',
        source: {
            type: 'geojson',
            data: './data/plants.geojson'
        },
        paint: {
            'circle-radius': {
                property: 'capacity',
                type: 'exponential',
                stops: [
                  [50, 4],
                  [6720, 30]
                ]
              },
          'circle-color': '#dd54b6',
          'circle-opacity': 0.45
            },
        'filter': ['all', filterFuture, filterConstruction, filterRegion] 
       })



      // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {

        year = parseInt(e.target.value);
        
        // update any map filters containing the variable year
        filterNew = ['any', ['==', ['number', ['get', 'start1']], year], ['==', ['number', ['get', 'start2']], year] ];
        filterClosing = ['any', ['==', ['number', ['get', 'retire1']], (year+1)], ['==', ['number', ['get', 'retire2']], (year+1)] ];
        filterFuture = ['all', ['==', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year1']], 2018]];
        filterOperating = ['all', ['!=', ['number', ['get', 'start1']], year], ['!=', ['number', ['get', 'start2']], year], ['!=', ['number', ['get', 'retire1']], (year+1)], ['!=', ['number', ['get', 'retire2']], (year+1)]];
        filterOperating2 = ['all', ['<=', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year2']], year], ['<', ['number', ['get', 'year1']], 2018] ];

        // update the map
        map.setFilter('operating', ['all', filterOperating, filterOperating2, filterRegion]); //the filter only applies to the operating layer
        map.setFilter('closing', ['all', filterClosing, filterRegion]);
        map.setFilter('new', ['all', filterNew, filterRegion]);
        map.setFilter('construction', ['all', filterFuture, filterConstruction, filterRegion]);
        map.setFilter('planned', ['all', filterFuture, filterPlanned, filterRegion]);
  
        // update text in the UI. Use getYear array to ensure that 2018 displays as 'future'
        document.getElementById('active-hour').innerText = getYear[year];
    });

    document.getElementById('selectorRegion').addEventListener('change', function(e) {

        // update variables
        dropdown = e.target.value;
        // declare year variable again so that it doesn't default to 2017
        year = document.getElementById('slider').value;

        // update filter
        if (dropdown == "All") {
            filterRegion = ['!=', ['string', ['get', 'regionLabel']], "placeholder"];
        } else {
            filterRegion = ['==', ['string', ['get', 'regionLabel']], dropdown];
        }
        
        // update the map
        map.setFilter('operating', ['all', filterOperating, filterOperating2, filterRegion]); //the filter only applies to the operating layer
        map.setFilter('closing', ['all', filterClosing, filterRegion]);
        map.setFilter('new', ['all', filterNew, filterRegion]);
        map.setFilter('construction', ['all', filterFuture, filterConstruction, filterRegion]);
        map.setFilter('planned', ['all', filterFuture, filterPlanned, filterRegion]);

        // zoom to filtered markers
        if (dropdown == "All") {
            map.fitBounds([[-126.61, -58.18], [133.12, 70.23]]);
        } else if (dropdown == "China") {
            map.fitBounds([[56.35, 15.71], [145.99, 52.75]]);
        } else if (dropdown == "EU28") {
            map.fitBounds([[-31.05, 30.07], [43.47, 51.50]]);
        } else if (dropdown == "Former USSR") {
            map.fitBounds([[-8.90, 24.77], [133.12, 70.23]]);
        } else if (dropdown == "India") {
            map.fitBounds([[54.24, 2.2], [100.64, 32.92]]);
        } else if (dropdown == "Other") {
            map.fitBounds([[-126.61, -58.18], [133.12, 70.23]]);
        } else if (dropdown == "Other Asia") {
            map.fitBounds([[65.97, -21.35], [159.14, 46.26]]);
        } else {
            // do nothing
        }

    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // tried to create one function for all layers but referencing multiple layers doesn't seem possible
    map.on('mouseenter', 'operating', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.plant;
        var capacity = e.features[0].properties.capacity;
        var coalType = e.features[0].properties.coalType;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #ffc83e;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p>')
            .addTo(map);

    });

    map.on('mouseenter', 'closing', function(e) {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.plant;
        var capacity = e.features[0].properties.capacity;
        var coalType = e.features[0].properties.coalType;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #ced1cc;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p>')
            .addTo(map);

    });

    map.on('mouseenter', 'new', function(e) {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.plant;
        var capacity = e.features[0].properties.capacity;
        var coalType = e.features[0].properties.coalType;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #ff8767;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p>')
            .addTo(map);

    });

    map.on('mouseenter', 'construction', function(e) {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.plant;
        var capacity = e.features[0].properties.capacity;
        var coalType = e.features[0].properties.coalType;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #dd54b6;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p>')
            .addTo(map);

    });

    map.on('mouseenter', 'planned', function(e) {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.plant;
        var capacity = e.features[0].properties.capacity;
        var coalType = e.features[0].properties.coalType;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #a45edb;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p>')
            .addTo(map);

    });


    map.on('mouseleave', 'operating', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });

    map.on('mouseleave', 'closing', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });

    map.on('mouseleave', 'new', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });

    map.on('mouseleave', 'construction', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });

    map.on('mouseleave', 'planned', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });


});

// reset dropdown on window reload

$(document).ready(function () {
    $("select").each(function () {
        $(this).val($(this).find('option[selected]').val());
    });
})