var myCallback = function() {
            console.log("cover art trace complete");
            $('#coverart').addClass('animated fadeOut');
            $('#coverimage').addClass('animated fadeIn');
            $('#coverimage').removeClass('invisible');
        }
var myVivus = new Vivus('coverart', {
            type: 'delayed',
            delay: 250,
            duration: 350,  
            animTimingFunction: Vivus.EASE,       
            onReady: function (myVivus) {
                $('#coverart').removeClass('invisible');
            }
        }, myCallback);