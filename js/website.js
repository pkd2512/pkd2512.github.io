document.addEventListener('DOMContentLoaded', function() {
    // alert("Ready!");
    $('.se-pre-con').fadeOut("slow");
}, false);

new WOW().init();

var myCallback = function() {
            //console.log("cover art trace complete");
            $('#coverart').addClass('animated fadeOut');
            $('#coverimage').addClass('animated fadeIn');
            $('#coverimage').removeClass('invisible');
            // Resizing the face
            setTimeout(() => {
                $('#coverimage').addClass('img-small');
                $('#coverart').addClass('img-small');
                $('body').addClass('bg');
                // Making page content visible
            $('.navbar').removeClass('invisible');
            $('.page-footer').removeClass('invisible');
            $('#chatbox').removeClass('invisible');
            }, 500);
            
            
        }
var myVivus = new Vivus('coverart', {
            type: 'async',
            delay: 50,
            duration: 100,  
            animTimingFunction: Vivus.EASE,       
            onReady: function (myVivus) {
                $('#coverart').removeClass('invisible');
            }
        }, myCallback);

// Update copyright with current year
var d = new Date();
$("footer #date").text(d.getFullYear());