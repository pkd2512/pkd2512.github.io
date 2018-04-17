document.addEventListener('DOMContentLoaded', function() {
    // alert("Ready!");
    $('.se-pre-con').fadeOut("slow");
}, false);

new WOW().init();
//CONTENT
var projects = [
    {'location': 'images/swift.png', 'title': '#1 Necklace or Neckless?', 'body': 'Drawing with machine randomness. The lines appear at random incremental positions, coupled with a rotation, giving an impression of needles spiralling out of an epicenter.'},
    {'location': 'images/divided.png', 'title': '#2 Divide and Conquer', 'body': 'Visualising with merge sort algorithm using a string of beads of random sizes and colours, created in the first row. The last two strings show the beads sorted by size in ascending order.'},
    {'location': 'images/poison.png', 'title': '#3 Eat me', 'body': 'Attempt at modifying Mandelbrot plot with a cubic function on the Argand plane. The colour bands are formed by the overlapping of the plots iteratively.'},
    {'location': 'images/long.png', 'title': '#5 How long is Forever?', 'body': 'The spirals are formed with arcs drawn with half the radius at every iteration, till they appear to form a tunnel to infinity.'},
    {'location': 'images/shy.png', 'title': '#7 Sh(y)ine', 'body': 'Semi-circular fractal pattern gives the impression of the heart, ready to open up to rise and shine.'},
    {'location': 'images/screech.png', 'title': '#9 Fast and Furious', 'body': 'A pair of lines moving along and turning, denoting wheels drifting along the tracks.'},
    {'location': 'images/gigantic.png', 'title': '#10 Noah\'s Ark', 'body': 'Using spiral fractals to draw Noah\'s arc and the flora and fauna of all sizes that it housed.'},
    {'location': 'images/run.png', 'title': '#11 Forest Gump', 'body': 'Keep running with your box of chocolates and people will come by. Blocks are drawn along a circular path and new dots are added at every revolution, till they culminate at the centre.'},
    {'location': 'images/shatter.png', 'title': '#12 Dreams in a bottle', 'body': 'A voronoi tessellation mapped to the colours of an image of a ship in a bottle to give the impression of shattered glass to the final painting.'},
    {'location': 'images/deep.png', 'title': '#20 Dance of Infinity', 'body': 'Circles are drawn with positions obtained using a combination of sinusoidal functions. The central part forms the dancing figures while the periphery creates the spiralling vortex.'},
    {'location': 'images/furious.png', 'title': '#21 The Freudian Mind', 'body': 'The central mesh is drawn with lines using random points on the circle, to represent \'id\'. The outer organised spiral of ellipses represents the rational \'ego\'. The image is coloured using a nebula-shader that gives the changing colours (moods) and white sparkles (synapses firing in the brain).'},
    {'location': 'images/blind.png', 'title': '#24 The Blinds have eyes', 'body': 'A simple circular pattern to represent an all-seeing eye, surveilling from behind the Venetian blinds.'},
    {'location': 'images/ship.png', 'title': '#25 Ship of Theseus', 'body': 'The planks are generated at the top row, which change at random, represented by the changing colours &mdash; darker the colour, more the number of changes that the plank has undergone. So, is the bottom row same as the top one? Is life greater than the sum of its components?'}
];
var imagesList = document.getElementById('images');

// Loop through each of the projects and add them to the projects list.
for (var i = 0; i < projects.length; i++) {
  var project = projects[i];
  var tmpl = document.getElementById('card-template').content.cloneNode(true);
  tmpl.querySelector('.img-fluid').src = project.location;
  tmpl.querySelector('.card-title').innerHTML = project.title;
  tmpl.querySelector('.card-text').innerHTML = project.body;
  imagesList.appendChild(tmpl);
}
//CONTENT END
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if ($(window).innerWidth() < 768) 
    {
        $("#top").hide();
        $('#title').removeClass('display-1');
        $('#title').addClass('h1');
    }
    else {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        document.getElementById("top").style.display = "block";
        } 
        else {
            document.getElementById("top").style.display = "none";
        }
        $('#title').addClass('display-1');
        $('#title').removeClass('h1');
    }    
}

// Update copyright with current year
var d = new Date();
$("footer #date").text(d.getFullYear()); 



