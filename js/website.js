document.addEventListener('DOMContentLoaded', function() {
    // alert("Ready!");
    $('.se-pre-con').fadeOut("slow");
}, false);

new WOW({
    mobile: true
}).init();

var myCallback = function() {
            //console.log("cover art trace complete");
            $('#coverart').addClass('animated fadeOut');
            $('#coverimage').addClass('animated fadeIn');
            $('#coverimage').removeClass('invisible');
            // Resizing the face
            setTimeout(function() {
                $('#coverimage').addClass('img-small');
                $('#coverart').addClass('img-small');
                $('body').addClass('bg'); 
                $('.navbar').removeClass('invisible');
                $('.page-footer').removeClass('invisible');
                $('#chatbox').removeClass('invisible');               
            }, 500); 
            // setTimeout(function() {
            //     $('.navbar').removeClass('invisible');
            //     $('.page-footer').removeClass('invisible');
            //     $('#chatbox').removeClass('invisible');
            // }, 1);           
        }
var myVivus = new Vivus('coverart', {
            type: 'async',
            delay: 50,
            duration: 150,  
            animTimingFunction: Vivus.EASE,       
            onReady: function (myVivus) {
                $('#coverart').removeClass('invisible');
            }
        }, myCallback);
// deferred call
// $.when(myVivus).then(function(){
//     // Making page content visible
//     console.log("Displaying the remaining content");
//     $('.navbar').removeClass('invisible');
//     $('.page-footer').removeClass('invisible');
//     $('#chatbox').removeClass('invisible');
// });
// Change title size for smaller devices
var vsep = $('<span>&emsp;|&emsp;</span>').addClass('v-sep d-inline-block');
// media query event handler
if (matchMedia) {
    const mq = window.matchMedia("(min-width: 768px)");
    mq.addListener(WidthChange);
    WidthChange(mq);
  }  
  // media query change
  function WidthChange(mq) {
    if (mq.matches) {
      // window width is at least 768px
      $('#name').removeClass('h1-responsive');
      $('#name').addClass('display-4');
      $('#credentials p').removeClass('d-block');
      $('#credentials p').addClass('d-inline-block');
      vsep.insertAfter('p.tag');
    } else {
      // window width is less than 768px
      $('#name').removeClass('display-4');
      $('#name').addClass('h1-responsive');
      $('#credentials p').removeClass('d-inline-block');
      $('#credentials p').addClass('d-block');
      $('#chatbox').remove('.v-sep');
    }  
  }

// Update copyright with current year
var d = new Date();
$("footer #date").text(d.getFullYear());