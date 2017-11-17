// window.onload(function() {
//     // Animate loader off screen
//     $('.se-pre-con').fadeOut("slow");
// });
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
// Update copyright with current year
var d = new Date();
$("footer #date").text(d.getFullYear()); 

// When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//     document.body.scrollTop = 0; // For Chrome, Safari and Opera 
//     document.documentElement.scrollTop = 0; // For IE and Firefox
// }



