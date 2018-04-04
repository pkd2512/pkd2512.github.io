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
        console.log(document.body.scrollTop);
        } 
        else {
            document.getElementById("top").style.display = "none";
        }
    }
    
});
// changing the title size on mobile
$(window).resize(function() {
    if ($(window).innerWidth() < 768) 
    {
        $('.title').removeClass('display-1');
        $('.title').addClass('h1');
    }
    else {
        $('.title').addClass('display-1');
        $('.title').removeClass('h1');
    } 
});
// Update copyright with current year
var d = new Date();
$("footer #date").text(d.getFullYear()); 

// Map code
mapboxgl.accessToken = 'pk.eyJ1IjoicGtkZGFwYWNpZmljIiwiYSI6ImNqZmk5eWdiMTJjMnMyeXBrbmJtMmx2cWgifQ.igtXLvbNt1qUSGJao6_qlw';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [77.7066, 13.1986],
    zoom: 5,
    bearing: 0,
    pitch: 90
});
var chapters = {
    'opening': {
        bearing: -35,
        center: [75.92305318958245, 31.74288500970745],
        zoom: 8.2,
        pitch: 45
    },
    'palampur': {
        bearing: 90,
        center: [0.05991101, 51.48752939],
        zoom: 12.3
    },
    'gloucester': {
        bearing: 45,
        center: [-0.18335806, 51.49439521],
        zoom: 15.3,
        pitch: 20,
        speed: 0.5
    },
    'caulfield-gardens': {
        bearing: 180,
        center: [-0.19684993, 51.5033856],
        zoom: 12.3
    },
    'telegraph': {
        bearing: 90,
        center: [-0.10669358, 51.51433123],
        zoom: 17.3,
        pitch: 40
    },
    'charing-cross': {
        bearing: 90,
        center: [-0.12416858, 51.50779757],
        zoom: 14.3,
        pitch: 20
    }
};
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

// Draw an arc between the `origin` & `destination` of the two points
for (var i = 0; i < lineDistance; i++) {
  var segment = turf.along(route.features[0], i / 200 * lineDistance, 'kilometers');
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
      "line-color": "#007cbf"
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

  function animate() {
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
        map.setLayoutProperty('point', 'icon-rotate', 25);
        map.flyTo(chapters['opening']);
        // map.setStyle('mapbox://styles/mapbox/satellite-v9');
    } 

    counter = counter + 1;          
  }
  // Start the animation.
  animate(counter);
});

// On every scroll event, check which element is on screen
// document.getElementById("features").onscroll = function() {
window.addEventListener('scroll', function() {
    // console.log("feature scrolling");
    var chapterNames = Object.keys(chapters);
    for (var i = 0; i < chapterNames.length; i++) {
        var chapterName = chapterNames[i];
        if (isElementOnScreen(chapterName)) {
            setActiveChapter(chapterName);
            console.log(chapterName);
            break;
        }
    }
});

var activeChapterName = 'opening';
function setActiveChapter(chapterName) {
    if (chapterName === activeChapterName) return;

    map.flyTo(chapters[chapterName]);

    document.getElementById(chapterName).classList.add('active');
    document.getElementById(chapterName).style.visibility="visible";
    document.getElementById(chapterName).lastElementChild.style.visibility="visible";
    document.getElementById(activeChapterName).classList.remove('active');

    activeChapterName = chapterName;
}

function isElementOnScreen(id) {
    var element = document.getElementById(id);
    var bounds = element.getBoundingClientRect();
    var container = document.getElementById("features").getBoundingClientRect();
    // console.log("top="+bounds.top+" bottom="+bounds.bottom);
    // return (bounds.top>=container.top && bounds.bottom<=window.innerHeight);
    // console.log((bounds.top>=0 && bounds.bottom<=window.innerHeight));
    console.log(bounds.top < bounds.height && bounds.bottom > 0);
    return bounds.top < bounds.height && bounds.bottom > 0;

}