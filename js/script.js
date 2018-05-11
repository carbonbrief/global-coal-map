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

    // set different filters for different colours
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
    // filter for construction
    var filterStatus1 = ['==', ['string', ['get', 'status']], 'Construction'];
    // filter for permitted
    var filterStatus2 = ['==', ['string', ['get', 'status']], 'Permitted'];
    // filter for pre-permit
    var filterStatus3 = ['==', ['string', ['get', 'status']], 'Pre-permit'];
    // filter for announced
    var filterStatus4 = ['==', ['string', ['get', 'status']], 'Announced'];

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
                type: 'exponential',
                stops: [
                  [50, 4],
                  [6720, 30]
                ]
              },
          'circle-color': '#ffc83e',
          'circle-opacity': 0.45
        },
        'filter': ['all', filterStartYear2, filterEndYear2, filterYear5]    // filter for start and end year AND make sure that start year is less than 2018 (filterYear5)
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
          'circle-color': '#ced1cc',
          'circle-opacity': 0.45
            },
            'filter': ['all', filterYear3, filterYear5]
       })

       map.addLayer({
        id: 'planned1',
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
        'filter': ['all', filterYear4, filterYear3, filterStatus1] 
       })

       map.addLayer({
        id: 'planned2',
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
          'circle-opacity': 0.35
            },
            'filter': ['all', filterYear4, filterYear3, filterStatus2] 
       })

       map.addLayer({
        id: 'planned3',
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
          'circle-opacity': 0.25
            },
            'filter': ['all', filterYear4, filterYear3, filterStatus3] 
       })

       map.addLayer({
        id: 'planned4',
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
          'circle-opacity': 0.15
            },
            'filter': ['all', filterYear4, filterYear3, filterStatus4] 
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
        map.setFilter('closing', ['all', filterYear1, filterYear5]);
        map.setFilter('new', ['all', filterYear3, filterYear5]);
        // four different layers for the different planned opacities
        map.setFilter('planned1', ['all', filterYear4, filterYear3, filterStatus1]);
        map.setFilter('planned2', ['all', filterYear4, filterYear3, filterStatus2]);
        map.setFilter('planned3', ['all', filterYear4, filterYear3, filterStatus3]);
        map.setFilter('planned4', ['all', filterYear4, filterYear3, filterStatus4]);
  
        // update text in the UI. Use getYear array to ensure that 2018 displays as 'future'
        document.getElementById('active-hour').innerText = getYear[year];
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // tried to create one function for all layers but referencing multiple layers doesn't seem possible
    map.on('mouseenter', 'powerplants', function(e) {
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
            .setHTML('<h3 style = "color: #ff8767;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p>')
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
            .setHTML('<h3 style = "color: #ced1cc;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p>')
            .addTo(map);

    });

    map.on('mouseenter', 'planned1', function(e) {
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

    map.on('mouseenter', 'planned2', function(e) {
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

    map.on('mouseenter', 'planned3', function(e) {
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

    map.on('mouseenter', 'planned4', function(e) {
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

    map.on('mouseleave', 'powerplants', function() {

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

    map.on('mouseleave', 'planned1', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });

    map.on('mouseleave', 'planned2', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });

    map.on('mouseleave', 'planned3', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });

    map.on('mouseleave', 'planned4', function() {

        map.getCanvas().style.cursor = '';
        popup.remove();

    });


});