document.addEventListener('DOMContentLoaded', function() {
    // alert("Ready!");
    $('.se-pre-con').fadeOut("slow");
}, false);

new WOW().init();
    
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if ($(window).innerWidth() < 768) 
    {
        $("#top").hide();
    }
    else {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("top").style.display = "block";
        } 
        else {
            document.getElementById("top").style.display = "none";
        }
    }
    
}
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
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-0.15591514, 51.51830379],
    zoom: 15.5,
    bearing: 27,
    pitch: 45
});

var chapters = {
    'baker': {
        bearing: 27,
        center: [-0.15591514, 51.51830379],
        zoom: 15.5,
        pitch: 20
    },
    'aldgate': {
        duration: 6000,
        center: [-0.07571203, 51.51424049],
        bearing: 150,
        zoom: 15,
        pitch: 0
    },
    'london-bridge': {
        bearing: 90,
        center: [-0.08533793, 51.50438536],
        zoom: 13,
        speed: 0.6,
        pitch: 40
    },
    'woolwich': {
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

// On every scroll event, check which element is on screen
document.getElementById("features").onscroll = function() {
// window.onscroll = function() {
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
};

var activeChapterName = 'baker';
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
    return (bounds.top>=container.top && bounds.bottom<=window.innerHeight);
    console.log((bounds.top>=0 && bounds.bottom<=window.innerHeight));
    // console.log(bounds.top < bounds.height && bounds.bottom > 0);
    // return bounds.top < bounds.height && bounds.bottom > 0;

}

