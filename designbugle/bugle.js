// DISABLE CONSOLE AND SUPPRESS ERRORS
// function silentErrorHandler() {return true;}
// window.onerror=silentErrorHandler;
// console.log = function() {};
//---END---

// document.addEventListener('DOMContentLoaded', function() {
//   // alert("Ready!");
//   $('.se-pre-con').fadeOut("slow");
// }, false);
new WOW().init();

// let iframeHeight = 768;
function onIframeLoaded() {
//   console.log("news loaded");
// $("#news").css("height", window.innerHeight-($("#footer").height()));
//   // o.style.height = o.contentWindow.document.body.scrollHeight+"px";
//   setTimeout(function(){
//     $('iframe').height($('iframe').contents().find('html').height());
//     // iframeHeight = $("#paperli").context.activeElement.scrollHeight;
//     iframeHeight = $(".layout-news-stream")[0].scrollHeight;
//     $(".news").height(iframeHeight);
    
    // $('.se-pre-con').fadeOut("slow");
//   },5000);
// post our message to the parent
console.log(document.body.scrollHeight)
window.parent.postMessage(
    // get height of the content
    document.body.scrollHeight
    // set target domain
    ,"*"
)
}
// browser compatibility: get method for event 
  // addEventListener(FF, Webkit, Opera, IE9+) and attachEvent(IE5-8)
  var myEventMethod = 
      window.addEventListener ? "addEventListener" : "attachEvent";
  // create event listener
  var myEventListener = window[myEventMethod];
  // browser compatibility: attach event uses onmessage
  var myEventMessage = 
      myEventMethod == "attachEvent" ? "onmessage" : "message";
  // register callback function on incoming message
  myEventListener(myEventMessage, function (e) {
      // we will get a string (better browser support) and validate
      // if it is an int - set the height of the iframe #my-iframe-id
      if (e.data === parseInt(e.data)) 
          document.getElementById('paperli').height = e.data + "px";
          // $('#news').css("height",e.data);
          // $('#paperli').css("height",e.data);
  }, false);
// all content including images has been loaded
// window.onload = function() {
//   // post our message to the parent
//   console.log(document.body.scrollHeight)
//   window.parent.postMessage(
//       // get height of the content
//       document.body.scrollHeight
//       // set target domain
//       ,"*"
//   )
//   };


/* Image protection code */

// Disable dragging of images
$("img").mousedown(function(){
  return false;
});
/* End of image protection code */
// Update copyright with current year
var d = new Date();
$("footer #date").text(d.getFullYear());