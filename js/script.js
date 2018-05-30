var bounds = [
    [ -170, -70],[178, 80]
]

var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json',
    center: [8, 10],
    zoom: 1.5
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

var screenWidth = $(window).width();

// only include geolocate control on larger screens, to reduce clutter
if (screenWidth > 700) {
    map.addControl(new mapboxgl.GeolocateControl({
        fitBoundsOptions: {
            maxZoom: 5
        }
    }));
}

// map.addControl(new MapboxGeocoder({
//     accessToken: mapboxgl.accessToken
// }));

// resize map for the screen
map.fitBounds(bounds, {padding: 20});

var baseLayers = [{
    label: 'Dark',
    id: 'https://openmaptiles.github.io/dark-matter-gl-style/style-cdn.json'
  }, {
    label: 'Light',
    id: 'https://openmaptiles.github.io/klokantech-3d-gl-style/style-cdn.json'
  },{
    label: "Satellite",
    id: {
        "version": 8,
        "sources": {
            "simple-tiles": {
                "type": "raster",
                // point to our third-party tiles. Note that some examples
                // show a "url" property. This only applies to tilesets with
                // corresponding TileJSON (such as mapbox tiles). 
                "tiles": [
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                ],
                "tileSize": 256,
                attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.'
            }
        },
        "layers": [{
            "id": "simple-tiles",
            "type": "raster",
            "source": "simple-tiles",
            "minzoom": 0,
            "maxzoom": 22
        }]
    }
}];

var year = 2017;

// SET UP FILTERS

// NEW
// grab plants where the start year equals start 2...don't use start1 or all different units will show at once
var filterNew = ['==', ['number', ['get', 'start2']], year];

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
var filterOperating = ['all', ['!=', ['number', ['get', 'start2']], year], ['!=', ['number', ['get', 'retire1']], (year+1)], ['!=', ['number', ['get', 'retire2']], (year+1)]];
// link to slider and make sure that not planned
// ensure that the slider year is between year1 and year2, and that it is operating. using less then or equal operator because the filter above will remove those that need to be coloured for new or closing
var filterOperating2 = ['all', ['<=', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year2']], year], ['==', ['string', ['get', 'status']], "Operating"] ];

// set up filter for region
var filterRegion = ['!=', ['string', ['get','regionLabel']], 'placeholder'];

// store an array to convert 2018 to 'planned' in text label
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

function addDataLayers() {
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
                    [{zoom: 0, value: 50}, 1.5],
                    [{zoom: 0, value: 6720}, 20],
                    [{zoom: 3, value: 50}, 3],
                    [{zoom: 3, value: 6720}, 27],
                    [{zoom: 7, value: 50}, 4.5],
                    [{zoom: 7, value: 6720}, 32],
                    [{zoom: 12, value: 50}, 6],
                    [{zoom: 12, value: 6720}, 37],
                    [{zoom: 18, value: 50}, 8],
                    [{zoom: 18, value: 6720}, 42]
                ]
              },
          'circle-color': '#ced1cc',
          'circle-opacity': 0.5,
          'circle-stroke-color': '#ced1cc',
          'circle-stroke-width': 0.5,
          'circle-stroke-opacity': 0.8
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
                        [{zoom: 0, value: 50}, 1.5],
                        [{zoom: 0, value: 6720}, 20],
                        [{zoom: 3, value: 50}, 3],
                        [{zoom: 3, value: 6720}, 27],
                        [{zoom: 7, value: 50}, 4.5],
                        [{zoom: 7, value: 6720}, 32],
                        [{zoom: 12, value: 50}, 6],
                        [{zoom: 12, value: 6720}, 37],
                        [{zoom: 18, value: 50}, 8],
                        [{zoom: 18, value: 6720}, 42]
                    ]
                  },
                'circle-color': '#ffc23b',
                'circle-opacity': 0.5,
              'circle-stroke-color': '#ffc23b',
              'circle-stroke-width': 0.5,
              'circle-stroke-opacity': 0.8
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
                        [{zoom: 0, value: 50}, 1.5],
                        [{zoom: 0, value: 6720}, 20],
                        [{zoom: 3, value: 50}, 3],
                        [{zoom: 3, value: 6720}, 27],
                        [{zoom: 7, value: 50}, 4.5],
                        [{zoom: 7, value: 6720}, 32],
                        [{zoom: 12, value: 50}, 6],
                        [{zoom: 12, value: 6720}, 37],
                        [{zoom: 18, value: 50}, 8],
                        [{zoom: 18, value: 6720}, 42]
                    ]
                  },
              'circle-color': '#f97b62',
              'circle-opacity': 0.5,
              'circle-stroke-color': '#f97b62',
              'circle-stroke-width': 0.5,
              'circle-stroke-opacity': 0.8
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
                        [{zoom: 0, value: 50}, 1.5],
                        [{zoom: 0, value: 6720}, 21],
                        [{zoom: 3, value: 50}, 3],
                        [{zoom: 3, value: 6720}, 27],
                        [{zoom: 7, value: 50}, 4.5],
                        [{zoom: 7, value: 6720}, 32],
                        [{zoom: 12, value: 50}, 6],
                        [{zoom: 12, value: 6720}, 37],
                        [{zoom: 18, value: 50}, 8],
                        [{zoom: 18, value: 6720}, 42]
                    ]
                  },
              'circle-color': '#a45edb',
              'circle-opacity': 0.5,
              'circle-stroke-color': '#a45edb',
              'circle-stroke-width': 0.5,
              'circle-stroke-opacity': 0.8
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
                        [{zoom: 0, value: 50}, 1.5],
                        [{zoom: 0, value: 6720}, 21],
                        [{zoom: 3, value: 50}, 3],
                        [{zoom: 3, value: 6720}, 27],
                        [{zoom: 7, value: 50}, 4.5],
                        [{zoom: 7, value: 6720}, 32],
                        [{zoom: 12, value: 50}, 6],
                        [{zoom: 12, value: 6720}, 37],
                        [{zoom: 18, value: 50}, 8],
                        [{zoom: 18, value: 6720}, 42]
                    ]
                  },
              'circle-color': '#dd54b6',
              'circle-opacity': 0.5,
              'circle-stroke-color': '#dd54b6',
              'circle-stroke-width': 0.5,
              'circle-stroke-opacity': 0.8
                },
            'filter': ['all', filterFuture, filterConstruction, filterRegion] 
        })
}

map.on('load', function() {

    //addDataLayers();

    // update hour filter when the slider is dragged
    document.getElementById('slider').addEventListener('input', function(e) {

        year = parseInt(e.target.value);
        
        // update any map filters containing the variable year
        filterNew = ['==', ['number', ['get', 'start2']], year];
        filterClosing = ['any', ['==', ['number', ['get', 'retire1']], (year+1)], ['==', ['number', ['get', 'retire2']], (year+1)] ];
        filterFuture = ['all', ['==', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year1']], 2018]];
        filterOperating = ['all', ['!=', ['number', ['get', 'start2']], year], ['!=', ['number', ['get', 'retire1']], (year+1)], ['!=', ['number', ['get', 'retire2']], (year+1)]];
        filterOperating2 = ['all', ['<=', ['number', ['get', 'year1']], year], ['>=', ['number', ['get', 'year2']], year], ['==', ['string', ['get', 'status']], "Operating"] ];

        // update the map
        map.setFilter('operating', ['all', filterOperating, filterOperating2, filterRegion]); //the filter only applies to the operating layer
        map.setFilter('closing', ['all', filterClosing, filterRegion]);
        map.setFilter('new', ['all', filterNew, filterRegion]);
        map.setFilter('construction', ['all', filterFuture, filterConstruction, filterRegion]);
        map.setFilter('planned', ['all', filterFuture, filterPlanned, filterRegion]);
  
        // update text in the UI. Use getYear array to ensure that 2018 displays as 'future'
        document.getElementById('active-hour').innerText = getYear[year];

        updateTotal();

    });

    // update map when the region selector is changed
    document.getElementById('selectorRegion').addEventListener('change', function(e) {

        // update variables
        region = e.target.value;
        // declare year variable again so that it doesn't default to 2017
        year = document.getElementById('slider').value;

        // update filter
        if (region == "All") {
            filterRegion = ['!=', ['string', ['get', 'regionLabel']], "placeholder"];
        } else {
            filterRegion = ['==', ['string', ['get', 'regionLabel']], region];
        }
        
        // update the map
        map.setFilter('operating', ['all', filterOperating, filterOperating2, filterRegion]); //the filter only applies to the operating layer
        map.setFilter('closing', ['all', filterClosing, filterRegion]);
        map.setFilter('new', ['all', filterNew, filterRegion]);
        map.setFilter('construction', ['all', filterFuture, filterConstruction, filterRegion]);
        map.setFilter('planned', ['all', filterFuture, filterPlanned, filterRegion]);

        // zoom to filtered markers
        if (region == "All") {
            map.fitBounds([[-170, -70], [178,80]]);
        } else if (region == "Africa and Middle East") {
            map.fitBounds([[-29.69, -46.61], [54.43, 57.09]]);
        } else if (region == "China") {
            map.fitBounds([[36.35, 12.71], [145.99, 52.75]]);
        } else if (region == "EU28") {
            map.fitBounds([[-51.05, 35], [43.47, 60]]);
        } else if (region == "Former USSR") {
            map.fitBounds([[-80, 24.77], [175, 70.23]]);
        } else if (region == "India") {
            map.fitBounds([[54.24, -5], [80.64, 40]]);
        } else if (region == "Latin America") {
            map.fitBounds([[-140.16, -58], [-70.0, 40]]);
        } else if (region == "Non-EU Europe") {
            map.fitBounds([[-10, 30.56], [50, 45]]);
        } else if (region == "Other") {
            map.fitBounds([[-179, -70], [170, 88]]);
        } else if (region == "Other Asia") {
            map.fitBounds([[0, -21.35], [159.14, 56]]);
        } else if (region == "United States") {
            map.fitBounds([[-170.66, 19.40], [-56.38, 55]]);
        } else {
            // do nothing
        }

        // update text in the UI
        document.getElementById('region').innerText = [region];

        updateTotal();
        updateFuture();

    });

    document.getElementById("selectorStyle").addEventListener("change", function(e){
        // update variables
        dropdown = e.target.value;

       // get id from array using the dropdown variable
        var basemap = baseLayers.find(x => x.label === dropdown).id;

        console.log(basemap);

        map.setStyle(basemap);
    })

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
        var yearOpened = e.features[0].properties.startLabel;

        year = document.getElementById('slider').value;
        var firstStart = e.features[0].properties.start1;


        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #ffc83e;">' + name + '</h3><p><span class="label-title">Capacity: </span>' + capacity + ' MW</p><p><b>Type: </b>' + coalType + '</p><p><b>Year opened: </b>' + yearOpened + '</p><p><b>Age: </b>' + (year-firstStart) + ' year(s)</p>')
            .addTo(map);

    });

    map.on('mouseenter', 'closing', function(e) {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.plant;
        var capacity = e.features[0].properties.capacity;
        var coalType = e.features[0].properties.coalType;
        var yearOpened = e.features[0].properties.startLabel;

        year = document.getElementById('slider').value;
        var firstStart = e.features[0].properties.start1;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #ced1cc;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p><p>Year opened: <b>' + yearOpened + '</b></p><p>Age: <b>' + (year-firstStart) + ' year(s)</b></p>')
            .addTo(map);

    });

    map.on('mouseenter', 'new', function(e) {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.plant;
        var capacity = e.features[0].properties.capacity;
        var coalType = e.features[0].properties.coalType;
        var yearOpened = e.features[0].properties.startLabel;

        year = document.getElementById('slider').value;
        var firstStart = e.features[0].properties.start1;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #ff8767;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p><p>Year opened: <b>' + yearOpened + '</b></p><p>Age: <b>' + (year-firstStart) + ' year(s)</b></p>')
            .addTo(map);

    });

    map.on('mouseenter', 'construction', function(e) {
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var name = e.features[0].properties.plant;
        var capacity = e.features[0].properties.capacity;
        var coalType = e.features[0].properties.coalType;
        var yearOpened = e.features[0].properties.startLabel;

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
        var yearOpened = e.features[0].properties.startLabel;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates)
            .setHTML('<h3 style = "color: #a45edb;">' + name + '</h3><p>Capacity: <b>' + capacity + ' MW</b></p><p>Type: <b>' + coalType + '</b></p>')
            .addTo(map);

    });

    // remove popups on mouseleave
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

map.on('style.load', function () {
    // Triggered when `setStyle` is called.
    addDataLayers();
});

// reset dropdown on window reload

$(document).ready(function () {
    $("select").each(function () {
        $(this).val($(this).find('option[selected]').val());
    });
})

// TOGGLE BUTTON

$(".toggle").click(function() {
    $("#console").toggleClass('console-close console-open');
    $('.arrow-right-hidden').toggleClass('arrow-right');
    $('.arrow-left').toggleClass('arrow-left-hidden');
});

// sidebar open transitions appears after the loading message has finished above a certain screen size 

if (screenWidth < 640) {
    $("#console").removeClass('console-close');
    $("#console").addClass('console-open');
} else {
    setTimeout(() => {
        $("#console").removeClass('console-close');
        $("#console").addClass('console-open');
    }, 1700);
}

