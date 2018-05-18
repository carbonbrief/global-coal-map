mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json',
    center: [8, 10],
    zoom: 2,
    maxZoom: 19,
    minZoom: 1
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

    // // filters for year

    // // plants about to close, which start before 2018
    // var filterYear1 = ['all', ['==', ['number', ['get', 'year2']], (year)], ['<', ['number', ['get', 'year1']], 2018]];
    // // main plants, which start before 2018. All = logical AND
    // var filterYear2 = ['all', ['<', ['number', ['get', 'year1']], year], ['>', ['number', ['get', 'year2']], year], ['<', ['number', ['get', 'year1']], 2018] ];
    // //var filterEndYear2 = ['>', ['number', ['get', 'year2']], year];
    // // plants newly opened, which start before 2018
    // var filterYear3 = ['all', ['==', ['number', ['get', 'year1']], year], ['<', ['number', ['get', 'year1']], 2018] ];
    // // filter for plants planned, ie. which start after 2018
    // var filterYear4 = ['all', ['==', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year1']], 2018]];

    // FILTERS

    // grab plants where the start year equals either start1 OR start 2
    var filterNew = ['any', ['==', ['number', ['get', 'start1']], year], ['==', ['number', ['get', 'start2']], year] ];

    // grab plants where the retire year is the year BEFORE closing
    var filterClosing = ['any', ['==', ['number', ['get', 'retire1']], (year-1)], ['==', ['number', ['get', 'retire2']], (year-1)] ];

    // FUTURE
    // filter for construction
    var filterConstruction = ['==', ['string', ['get', 'status']], 'Construction'];
    // filter for planned. Any = logical OR
    var filterPlanned = ['any', ['==', ['string', ['get', 'status']], 'Permitted'], ['==', ['string', ['get', 'status']], 'Pre-permit'], ['==', ['string', ['get', 'status']], 'Announced'] ];
    // link to slider
    // ensure that planned and construction colours only show on the future, ie. when the slider is at position 2018
    var filterFuture = ['all', ['==', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year1']], 2018]];

    // OPERATIONAL
    // grab plants that don't fit into any of the other categories
    var filterOperating = ['none', ['==', ['number', ['get', 'start1']], year], ['==', ['number', ['get', 'start2']], year], ['==', ['number', ['get', 'retire1']], (year-1)], ['==', ['number', ['get', 'retire2']], (year-1)], ['==', ['string', ['get', 'status']], 'Construction'], ['==', ['string', ['get', 'status']], 'Permitted'], ['==', ['string', ['get', 'status']], 'Pre-permit'], ['==', ['string', ['get', 'status']], 'Announced'] ];
    // link to slider
    // ensure that the slider year is between year1 and year2, and that it doesn't begin after 2018. using less then or equal operator because the filter above will remove those that need to be coloured for new or closing
    var filterOperating2 = ['all', ['<=', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year2']], year], ['<', ['number', ['get', 'year1']], 2018] ];

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
        'filter': ['all', filterClosing]
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
        'filter': ['all', filterOperating, filterOperating2]    // filter for start and end year AND make sure that start year is less than 2018 (filterYear5)
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
            'filter': ['all', filterNew]
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
            'filter': ['all', filterFuture, filterPlanned] 
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
        'filter': ['all', filterFuture, filterConstruction] 
       })



      // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {
        year = parseInt(e.target.value);
        // update the map filters
        // filterYear1 = ['all', ['==', ['number', ['get', 'year2']], year], ['<', ['number', ['get', 'year1']], 2018]];
        // filterYear2 = ['all', ['<', ['number', ['get', 'year1']], year], ['>', ['number', ['get', 'year2']], year] ];
        // filterYear3 = ['all', ['==', ['number', ['get', 'year1']], year], ['<', ['number', ['get', 'year1']], 2018] ];
        // filterFuture = ['all', ['==', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year1']], 2018]];
        // update any map filters containing the variable year
        var filterNew = ['any', ['==', ['number', ['get', 'start1']], year], ['==', ['number', ['get', 'start2']], year] ];
        var filterClosing = ['any', ['==', ['number', ['get', 'retire1']], (year-1)], ['==', ['number', ['get', 'retire2']], (year-1)] ];
        var filterFuture = ['all', ['==', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year1']], 2018]];
        var filterOperating = ['none', ['==', ['number', ['get', 'start1']], year], ['==', ['number', ['get', 'start2']], year], ['==', ['number', ['get', 'retire1']], (year-1)], ['==', ['number', ['get', 'retire2']], (year-1)], ['==', ['string', ['get', 'status']], 'Construction'], ['==', ['string', ['get', 'status']], 'Permitted'], ['==', ['string', ['get', 'status']], 'Pre-permit'], ['==', ['string', ['get', 'status']], 'Announced'] ];
        var filterOperating2 = ['all', ['<=', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year2']], year], ['<', ['number', ['get', 'year1']], 2018] ];

        // update the map
        map.setFilter('operating', ['all', filterOperating, filterOperating2]); //the filter only applies to the operating layer
        map.setFilter('closing', ['all', filterClosing]);
        map.setFilter('new', ['all', filterNew]);
        // four different layers for the different planned opacities
        map.setFilter('construction', ['all', filterFuture, filterConstruction]);
        map.setFilter('planned', ['all', filterFuture, filterPlanned]);
  
        // update text in the UI. Use getYear array to ensure that 2018 displays as 'future'
        document.getElementById('active-hour').innerText = getYear[year];
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