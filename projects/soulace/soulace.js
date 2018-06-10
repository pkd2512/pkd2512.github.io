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
// (function() { var v = document.getElementsByClassName("youtube-player"); for (var n = 0; n < v.length; n++) { v[n].onclick = function () { var iframe = document.createElement("iframe"); iframe.setAttribute("src", "//www.youtube.com/embed/" + this.dataset.id + "?autoplay=1&mute=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&rel="+ this.dataset.related +"&controls="+this.dataset.control+"&showinfo=" + this.dataset.info); iframe.setAttribute("frameborder", "0"); iframe.setAttribute("id", "youtube-iframe"); iframe.setAttribute("style", "width: 100%; height: 100%; position: absolute; top: 0; left: 0;"); if (this.dataset.fullscreen == 1){ iframe.setAttribute("allowfullscreen", ""); } while (this.firstChild) { this.removeChild(this.firstChild); } this.appendChild(iframe); }; } })();

// web-video play
// function webPlay() {
//     document.getElementById('web-video').innerHTML = '<iframe width="960" height="540" src="images/soulace-web.mp4" frameborder="0"></iframe>';
// }

/* Image protection code */

// Disable dragging of images
$("img").mousedown(function(){
    return false;
});
/* End of image protection code */

// Update copyright with current year
var d = new Date();
$("footer #date").text(d.getFullYear()); 

// When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//     document.body.scrollTop = 0; // For Chrome, Safari and Opera 
//     document.documentElement.scrollTop = 0; // For IE and Firefox
// }



