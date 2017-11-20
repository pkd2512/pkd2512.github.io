document.addEventListener('DOMContentLoaded', function() {
    // alert("Ready!");
    $('.se-pre-con').fadeOut("slow");
}, false);
var myCallback = function() {
            //console.log("cover art trace complete");
            // $('#coverart').addClass('animated fadeOut');
            $('#coverimage').addClass('animated fadeIn');
            $('#coverimage').removeClass('invisible');
            // Resizing the face
            setTimeout(function() {
                $('#coverart').addClass('animated fadeOut');
                // $('#coverimage').addClass('animated fadeIn');
                // $('#coverimage').removeClass('invisible'); 
                $('#coverimage').addClass('img-small');
                $('#coverart').addClass('img-small');
                $('body').addClass('bg');               
            }, 500); 
            setTimeout(function() {
                $('.navbar').addClass('animated fadeInDown');
                $('.navbar').removeClass('invisible');
                $('.page-footer').removeClass('invisible');
            }, 550);   
            setTimeout(function() {
                $('#name').addClass('animated fadeIn');
                $('#name').removeClass('invisible');
                //$('#chatbox').removeClass('invisible');
            }, 600);  
            setTimeout(function() {
                $('#credentials').addClass('animated fadeIn');
                $('#credentials').removeClass('invisible');
                $('#chatbox').removeClass('invisible');
            }, 800); 
            setTimeout(function() {
                //$('#chatmsg').removeClass('invisible');
                loadChat();
            }, 2500);             
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

var chatList = document.getElementById('chatmsg');
var mainChat;
function loadChat() {
    d3.csv('chat-controller/main-chat.csv', function(error, data) {
        if (error) { alert("404: main-chat.csv not found"); }
        mainChat = data.map(function (d) {
            return {
                sl: +d.sl,
                hasReply: +d.hasReply,
                me: d.me,
                msg1: d.msg1,
                msg1_type: d.msg1_type,
                link1: d.link1,
                msg2: d.msg2,
                msg2_type: d.msg2_type,
                link2: d.link2,
                nextMsg: +d.nextMsg
            };
        });
        chatter();
    });
}
/* Chat code */
var msgCount = 0, gap = 4000;
var t = 0;
function chatter() {
    console.log("chat loaded");
    // let t = delay+1500*msgCount;
    // let lag = Math.floor((Math.random() * 10) + 1);
    var loc = 0;
    
    msgPrinter(loc, 0);
    loc++;
    setTimeout( function() {
        msgPrinter(loc, 0);
    }, 4000);

       

}
function msgPrinter(loc, delay) {
  //  setTimeout(function() {
       // let typ = document.getElementById('typing-template').content.cloneNode(true);
        // chatList.appendChild(typ);
       //$('chatmsg').append(typ);
  //  }, 6000+delay);
    
  //  setTimeout(function() {
        //$('.typing').delay(4000).remove();
        let msg = document.getElementById('mymsg-template').content;
        chatList.appendChild(document.importNode(msg, true));
        var $div = $('#chatmsg').find("div:last-child");
        //chatList.appendChild(msg); 
        //$('#chatmsg').delay(5000).append(msg);
        spinner = '\
        <div class="spinner">\
        <div class="bounce1 purple"></div>\
        <div class="bounce2 purple"></div>\
        <div class="bounce3 purple"></div>\
    </div>\
    ';
        // $div.find('span').html(spinner).fadeOut(2000, function() {
        //     $div.find('p').text(mainChat[loc].me);
        // });
        // $div.find('p').fadeIn(2000).text(mainChat[loc].me);
        //$('#chatmsg .card-body').html(spinner);
        //msg.querySelector('span').innerHTML = spinner;
        msg.querySelector('p').innerText = mainChat[loc].me;
    //    $('#chatmsg').delay(5000).append(msg);       
  //  }, 7500+delay);
    msgCount++;
}
