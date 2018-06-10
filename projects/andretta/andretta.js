document.addEventListener('DOMContentLoaded', function() {
    // alert("Ready!");
    $('.se-pre-con').fadeOut("slow");
}, false);

new WOW().init();
    
// When the user scrolls down 20px from the top of the document, show the button
// window.onscroll = function() {scrollFunction()};
window.addEventListener('scroll', function()
{
    if ($(window).innerWidth() < 768) 
    {
        $("#top").hide();
    }
    else {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("top").style.display = "block";
        // console.log(document.body.scrollTop);
        } 
        else {
            document.getElementById("top").style.display = "none";
        }
    }
    
});
// Disable dragging of images
$("img").mousedown(function(){
    return false;
});
/* End of image protection code */
// Update copyright with current year
var d = new Date();
$("footer #date").text(d.getFullYear()); 

// Map code
mapboxgl.accessToken = 'pk.eyJ1IjoicGtkZGFwYWNpZmljIiwiYSI6ImNqZmk5eWdiMTJjMnMyeXBrbmJtMmx2cWgifQ.igtXLvbNt1qUSGJao6_qlw';

var wd = window,
d = document,
e = d.documentElement,
g = d.getElementsByTagName('body')[0],
w = wd.innerWidth || e.clientWidth || g.clientWidth,
h = wd.innerHeight|| e.clientHeight|| g.clientHeight;
var map;
if ($(window).innerWidth() < 768) {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/pkddapacific/cjftgscmo2pzt2rpgjky1aykh',
        center: [77.67555805096436, 23.16551504383851],
        zoom: 3.2,
        bearing: 0,
        pitch: 45,
        minZoom: 3
    });
}
else {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/pkddapacific/cjftgscmo2pzt2rpgjky1aykh',
        center: [78.365309, 20.225282],
        zoom: 5,
        bearing: 0,
        pitch: 45,
        minZoom: 5
    });
}
var chapters;
if ($(window).innerWidth() < 768) {
    chapters = {
        'opening': {
            bearing: -35,
            center: [75.68727914869692, 31.9584518165087],
            zoom: 6.5,
            pitch: 45,
            maxZoom: 12.1
        },
        'palampur': {
            bearing: -35,
            center: [76.61724697513705, 32.07697236483118],
            zoom: 10,
            pitch: 45,
            maxZoom: 12,
            speed: 0.69
        },
        'andretta': {
            bearing: 21,
            center: [76.56561167753148, 32.03723247076803],
            zoom: 15.4,
            pitch: 60,
            maxZoom: 16.5,
            speed: 0.69
        },
        'wah': {
            bearing: 28.8,
            center: [76.55348119511552, 32.091809775256934],
            zoom: 12,
            pitch: 45,
            maxZoom: 14,
            speed: 0.69

        },
        'ashapuri': {
            bearing: 9.6,
            center: [76.7056679896466, 31.85956834559414],
            zoom: 10,
            pitch: 35,
            maxZoom: 11.5,
            speed: 0.69
        },
        'baijnath': {
            bearing: 0,
            center: [76.63416322088835, 32.069179195570115],
            zoom: 12.2,
            pitch: 60,
            maxZoom: 13.5,
            speed: 0.69
        },
        'bir': {
            bearing: 40,
            center: [76.7301326957695, 32.05757235949123],
            zoom: 11.5,
            pitch: 40,
            maxZoom: 13,
            speed: 0.69
        }
    };
}
else {
    chapters = {
        'opening': {
            bearing: -35,
            center: [75.92305318958245, 31.74288500970745],
            zoom: 8.2,
            pitch: 45,
            maxZoom: 12.1
        },
        'palampur': {
            bearing: -35,
            center: [76.64597012574859, 32.07353259002102],
            zoom: 11,
            pitch: 45,
            maxZoom: 12,
            speed: 0.69
        },
        'andretta': {
            bearing: 21,
            center: [76.56615374230614, 32.03766792690715],
            zoom: 16.3,
            pitch: 60,
            maxZoom: 16.5,
            speed: 0.69
        },
        'wah': {
            bearing: 28.8,
            center: [76.55468340701486, 32.08059484693874],
            zoom: 13.6,
            pitch: 45,
            maxZoom: 14,
            speed: 0.69

        },
        'ashapuri': {
            bearing: 9.6,
            center: [76.6972066282583, 31.84099457082523],
            zoom: 11.4,
            pitch: 35,
            maxZoom: 11.5,
            speed: 0.69
        },
        'baijnath': {
            bearing: 0,
            center: [76.63541299172641, 32.08095014508136],
            zoom: 12.5,
            pitch: 60,
            maxZoom: 13.5,
            speed: 0.69
        },
        'bir': {
            bearing: 40,
            center: [76.73028711948291, 32.05158797135131],
            zoom: 12.3,
            pitch: 40,
            maxZoom: 13,
            speed: 0.69
        }
    };
}
// Preparing flight along route
var origin = [77.7066, 13.1986];
var destination1 = [77.1000, 28.5562];
var destination = [74.7989, 31.7072];

// A simple line from origin to destination.
var route = {
    "type": "FeatureCollection",
    "features": [{
    "type": "Feature",
    "geometry": {
    "type": "LineString",
    "coordinates": [
            origin, 
            destination1,
            destination
            ]
        }
    }]
};
var point = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
        "type": "Point",
        "coordinates": origin
        }
    }]
};
// Calculate the distance in kilometers between route start/end point.
var lineDistance = turf.lineDistance(route.features[0], 'kilometers');

var arc = [];
var animate;
// Draw an arc between the `origin` & `destination` of the two points
for (var i = 0; i < lineDistance; i++) {
  var segment = turf.along(route.features[0], i / 800 * lineDistance, 'kilometers');
  arc.push(segment.geometry.coordinates);
}

// Update the route with calculated arc coordinates
route.features[0].geometry.coordinates = arc;

// Used to increment the value of the point measurement against the route.
var counter = 0;
var rot = 0;
map.on('load', function() {
  // Add a source and layer displaying a point which will be animated in a circle.
  map.addSource('route', {
    "type": "geojson",
    "data": route
  });

  map.addSource('point', {
    "type": "geojson",
    "data": point
  });

  map.addLayer({
    "id": "route",
    "source": "route",
    "type": "line",
    "paint": {
      "line-width": 2,
      "line-color": "#ffc107",
      "line-opacity": 0.8,
      "line-blur": 1
    }
  });

  map.addLayer({
    "id": "point",
    "source": "point",
    "type": "symbol",
    "layout": {
      "icon-image": "airport-15",          
      "icon-allow-overlap": true
    }
  });

  animate = function() {
    // Update point geometry to a new position based on counter denoting
    // the index to access the arc.
    point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];

    // Update the source with this new data.
    map.getSource('point').setData(point);

    // Request the next frame of animation so long as destination has not
    // been reached.
    if (point.features[0].geometry.coordinates[0] !== destination[0]) { 
        if (point.features[0].geometry.coordinates[0]==77.10408471083429) 
            {          
            //console.log(map.bearing);
            //map.setBearing(-35.0, {duration:3000});
            map.setLayoutProperty('point', 'icon-rotate', -45);
            }   
        map.panTo(point.features[0].geometry.coordinates);
        requestAnimationFrame(animate);
    } 
    else {    
        // map.setCenter([75.4303987, 31.9476826]);
        map.flyTo(chapters['opening']);
        map.setLayoutProperty('point', 'icon-rotate', 25);
        
        // map.setStyle('mapbox://styles/mapbox/satellite-v9');
    } 

    counter = counter + 1;          
  }
  // Start the animation.
//   animate(counter);
// console.log("active opening")
});
/*
function getRoute() {
    var start = [74.8638046, 31.6532466];
    var end = [76.53622899999999, 32.110865];
    var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?geometries=geojson&access_token=' + mapboxgl.accessToken;
    $.ajax({
      method: 'GET',
      url: directionsRequest,
    }).done(function(data) {
      var route = data.routes[0].geometry;
      map.addLayer({
        id: 'palampurRoute',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: route
          }
        },
        paint: {
          'line-width': 2
        }
      });
      // this is where the code from the next step will go
    });
  }
*/
var activeChapterName = 'opening';
var openingDone = false;
// On every scroll event, check which element is on screen
// document.getElementById("features").onscroll = function() {
window.addEventListener('scroll', function() {
    // console.log("feature scrolling");
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen('opening')) {
            $.when(animate(counter)).then(setActiveChapter('opening'));   
            openingDone = true;
            // console.log(openingDone);
        }
        if (isElementOnScreen(chapterName) && openingDone) {
            setActiveChapter(chapterName);
            // console.log(chapterName);
            break;
        }
    }
});

function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;  
    map.setMaxZoom((chapters[chapterName]).maxZoom);    
    map.flyTo(chapters[chapterName]);

    document.getElementById(chapterName).classList.add('active');
    //document.getElementById(chapterName).style.visibility="visible";
    // document.getElementById(chapterName).lastElementChild.style.visibility="visible";
    document.getElementById(activeChapterName).classList.remove('active');

    activeChapterName = chapterName;
}
function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    return (bounds.top < bounds.height) && bounds.bottom > h/2;

}

/* Resources used to build the map content

// Google directions api
https://maps.googleapis.com/maps/api/directions/json?origin="***"&destination="***"&alternatives=false&key=***

// Google polyline to coordinates
https://jsfiddle.net/ivansams/tw7qLvh4/2/

http://zevross.com/blog/2014/09/23/convert-google-directions-to-geojson-points-or-polylines/

http://geojson.io/#map=18/32.05935/76.74115

https://www.gps-coordinates.net/
*/
