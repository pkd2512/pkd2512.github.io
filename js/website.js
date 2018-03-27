document.addEventListener('DOMContentLoaded', function() {
    // alert("Ready!");
    $('.se-pre-con').fadeOut("slow");
}, false);

// DISABLE CONSOLE AND SUPPRESS ERRORS
function silentErrorHandler() {return true;}
window.onerror=silentErrorHandler;
console.log = function() {};
//---END---

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
                loadProjects();
                loadBlog();
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
                //msg1_type: d.msg1_type,
                link1: d.link1,
                linkid1: +d.linkid1,
                target1: d.target1,
                msg2: d.msg2,
                //msg2_type: d.msg2_type,
                link2: d.link2,
                linkid2: +d.linkid2,
                target2: d.target2,
                nextMsg1: +d.nextMsg1,
                nextMsg2: +d.nextMsg2
            };
        });
        for (let i=0;i<mainChat.length;i++)
        {
            msgPrinter(i);
            replyPrinter(i);
        }
        chatter();
    });
}
// auto-scroll
function scrollSmoothToBottom () {
    var divHeight = parseInt($('footer').css("height"));
    $('html,#chatmsg').animate({
       scrollTop: document.body.scrollHeight-divHeight},"slow");
 }
 // link one click
 function clickAndDisable(link) {
    // disable subsequent clicks
    link.onclick = function(event) {
       event.preventDefault();
    }
  }  
// 
/* Chat code */
var msgCount = 0, gap = 1000;
var delay = 0;
function chatter() {
    console.log("chat loaded");
    // let t = delay+1500*msgCount;
    // let lag = Math.floor((Math.random() * 10) + 1);
    var loc = mainChat[0].sl-1;
    // adding smooth scroll to blog btn
    // $('.reply a#301').parent().addClass("smooth-scroll");
    // $('.reply a#301').parent().wrap('<div class="smooth-scroll"></div>').wrap('<div></div>');
    // making the btn point to blogFeed
    // $('.reply a#301')[0].href="";
    $('.reply a#301').bind('click',function() {
        console.log("#301 clicked");
        $('html,body').animate({
            scrollTop: $("#blogFeed").offset().top},"slow");
    });
    

    //set 1
     {
        $('.mymsg#m1:hidden').removeClass('hidden');
        msgCount++;
        setTimeout(function() {
            $('.mymsg#m2:hidden').removeClass('hidden');        
        }, gap*msgCount);            
        msgCount++;
        loc = mainChat[loc].nextMsg1-1;
        setTimeout(function() {
            $('.mymsg#m3:hidden').removeClass('hidden');        
        }, gap*msgCount);            
        loc = mainChat[loc].nextMsg1-1;
        // show buttons 1,2
        setTimeout(function() {
            $('.reply#r3:hidden').removeClass('hidden');
        }, gap*msgCount*2);
        //console.log(loc+'set1');
    }
   // flow1
    {
        setTimeout(function() {
            $('.reply a#1').bind('click',function() {
                console.log("#1 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                {// show buttons 3,4    
                    setTimeout(function() {
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1000);
                }
            }); 
        }, gap*msgCount*3);
        setTimeout(function() {
            $('#2').bind('click',function() {
                console.log("#2 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                {// show buttons 7,8    
                    setTimeout(function() {
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1000);
                }
            }); 
        }, gap*msgCount*3);
        msgCount++;
    }   
    // flow2
    {
        setTimeout(function() {
            $('.reply a#3').bind('click',function() {
                console.log("#3 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                    
                    }
                {// show buttons 3,4    
                    setTimeout(function() {
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
        
        setTimeout(function() {
            $('.reply a#4').bind('click',function() {
                console.log("#4 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                // show next msg in line if hasReply=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                }
                //console.log(loc+'flow11');
                {// show buttons 5,6    
                    setTimeout(function() {
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
    } 
    // Get in touch flow
    {
        setTimeout(function() {
            $('.reply a#201').bind('click',function() {
                console.log("#201 clicked");
                $('.mymsg#m'+(300)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');   
                {// show button    
                    setTimeout(function() {
                        $('.reply#r'+(300)+':hidden').removeClass('hidden');  
                        $('.reply a#0').addClass('hidden');      
                    }, 1500);
                }             
            }); 
        }, gap*msgCount*3);

        setTimeout(function() {
            $('.reply a#202').bind('click',function() {
                console.log("#202 clicked");
                $('.mymsg#m'+(300)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                {// show button    
                    setTimeout(function() {
                        $('.reply#r'+(300)+':hidden').removeClass('hidden');    
                        $('.reply a#0').addClass('hidden');    
                    }, 1500);
                }                
            }); 
        }, gap*msgCount*3);
        $('.reply a#301').bind('click',function() {
            console.log("#301 clicked");
            $(this).unbind('click');
            $(this).addClass('disabled');
        });
    }   
    // Check UI project flow
    {
        setTimeout(function() {
            $('.reply a#5').bind('click',function() {
                console.log("#5 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                    
                }
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 2000);
                }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 3000);
                }
            }); 
        }, gap*msgCount*3);
        setTimeout(function() {
            $('.reply a#6').bind('click',function() {
                console.log("#6 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                // show next msg in line if hasReply=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                }
                
                //console.log(loc+'flow11');
                {// show buttons 7,8   
                    setTimeout(function() {
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
    }
    // Check dataviz project flow
    {
        setTimeout(function() {
            $('.reply a#7').bind('click',function() {
                console.log("#7 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                    
                    }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
        setTimeout(function() {
            $('.reply a#8').bind('click',function() {
                console.log("#8 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                    
                    }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
    }
    // Check dataviz-art project flow
    {
        setTimeout(function() {
            $('.reply a#9').bind('click',function() {
                console.log("#9 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                    
                    }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
        setTimeout(function() {
            $('.reply a#10').bind('click',function() {
                console.log("#10 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                    
                    }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
    }
    // Check photography project flow
    {
        setTimeout(function() {
            $('.reply a#11').bind('click',function() {
                console.log("#11 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);               
                }
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 2500);
                }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 3500);
                }
            }); 
        }, gap*msgCount*3);
        setTimeout(function() {
            $('.reply a#12').bind('click',function() {
                console.log("#12 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                    
                    }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
    }
    // Check videography project flow
    {
        setTimeout(function() {
            $('.reply a#13').bind('click',function() {
                console.log("#13 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);               
                }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
        setTimeout(function() {
            $('.reply a#14').bind('click',function() {
                console.log("#14 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                    
                    }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
    }
    // Check end coffee flow
    {
        setTimeout(function() {
            $('.reply a#15').bind('click',function() {
                console.log("#15 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);               
                }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
        setTimeout(function() {
            $('.reply a#16').bind('click',function() {
                console.log("#16 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);
                    
                    }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
    }
    // Check music flow
    {
        setTimeout(function() {
            $('.reply a#17').bind('click',function() {
                console.log("#17 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);               
                }
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 2000);               
                }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 3500);
                }
            }); 
        }, gap*msgCount*3);
        setTimeout(function() {
            $('.reply a#18').bind('click',function() {
                console.log("#18 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);                    
                }
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 2000);                    
                }
                {// show buttons 7,8   
                    setTimeout(function() {
                        // console.log("reply#r"+(loc+1))
                        $('.reply#r'+(loc+1)+':hidden').removeClass('hidden');        
                    }, 3500);
                }
            }); 
        }, gap*msgCount*3);
    }
    // Check diary flow
    {
        setTimeout(function() {
            $('.reply a#19').bind('click',function() {
                console.log("#19 clicked");
                loc = mainChat[loc].nextMsg1-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg1-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);                    
                }
                {// show buttons 7,8   
                    setTimeout(function() {
                        $('.reply#r'+(300)+':hidden').removeClass('hidden');    
                        $('.reply a#0').addClass('hidden');    
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
        setTimeout(function() {
            $('.reply a#20').bind('click',function() {
                console.log("#20 clicked");
                loc = mainChat[loc].nextMsg2-1;
                $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                $(this).unbind('click');
                $(this).addClass('disabled');
                $(this).siblings().addClass('hidden');
                //console.log(loc+'flow11');
                // show next msg in line if hasRepy=0
                if (mainChat[loc].hasReply===0) {
                    setTimeout(function(){
                        loc = mainChat[loc].nextMsg2-1;
                        $('.mymsg#m'+(loc+1)+':hidden').removeClass('hidden');
                    }, 1000);                    
                }
                {// show buttons 7,8   
                    setTimeout(function() {
                        $('.reply#r'+(300)+':hidden').removeClass('hidden');    
                        $('.reply a#0').addClass('hidden');    
                    }, 1500);
                }
            }); 
        }, gap*msgCount*3);
    }
}
   
function msgPrinter(loc) {
        let msg = document.getElementById('mymsg-template').content;
        console.log(loc); 
        let cls = 'm'+(mainChat[loc].sl).toString();
        msg.querySelector('.mymsg').id = (cls);      
        msg.querySelector('.mymsg').classList.add('hidden');      
        msg.querySelector('p').innerHTML = mainChat[loc].me;
        chatList.appendChild(document.importNode(msg, true));
    //msgCount++;
}
function replyPrinter(loc) {
    if(mainChat[loc].hasReply!=0) {
        let rep = document.getElementById('reply-link-template').content;
        let cls = 'r'+(mainChat[loc].sl).toString();
        rep.querySelector('.reply').id = (cls);
        rep.querySelector('.reply').classList.add('hidden');
        console.log(loc);      
        rep.querySelector('.rp1 p').innerHTML = mainChat[loc].msg1;
        rep.querySelector('.rp1').href = mainChat[loc].link1;
        rep.querySelector('.rp1').id = mainChat[loc].linkid1;
        rep.querySelector('.rp1').target = mainChat[loc].target1;

        rep.querySelector('.rp2 p').innerHTML = mainChat[loc].msg2;
        rep.querySelector('.rp2').href = mainChat[loc].link2;
        rep.querySelector('.rp2').id = mainChat[loc].linkid2;
        rep.querySelector('.rp2').target = mainChat[loc].target2;
        chatList.appendChild(document.importNode(rep, true));
    //msgCount++;
    }
}

function loadProjects() {
    if ('content' in document.createElement('template')) {
        console.log('Templates are supported');
      // List of all projects and related data
      $("#recentProjects").removeClass("hidden");
      $("#footer").removeClass("hidden");
      var projects = [
        {'location': './projects/thumbs/dodata.jpg', 'title': 'DoData', 'body': 'Making knowledge available on the internet accessible to the underprivileged', 'url': '/projects/dodata/', 'target': '_blank', 'tags':['UI Design','Visual Identity']},
        {'location': './projects/thumbs/ack.jpg', 'title': 'Amar Chitra Katha', 'body': 'Redesigning the experience of India\'s largest selling comic book series website', 'url': 'https://www.behance.net/gallery/46120627/Amar-Chitra-Katha-Website-UX-re-design', 'target': '_blank', 'tags':['UX Design']},
        {'location': './projects/thumbs/warmingplanet.jpg', 'title': 'The Warming Planet', 'body': 'Visualising the global temperature changes to understand global warming - Work in Progress', 'url': 'http://prasantakrdutta.com/global-climate-dataviz/', 'target': '_blank', 'tags':['Data Visualisation','Infographic','Data Art']}
      ];
      //console.log(projects);
      // Get a reference to the comments list in the main DOM.
      var projectsList = document.getElementById('projects');
      
      // Loop through each of the projects and add them to the projects list.
      for (var i = 0; i < projects.length; i++) {
        var project = projects[i];
        var tmpl = document.getElementById('card-template').content.cloneNode(true);
        tmpl.querySelector('.img-fluid').src = project.location;
        tmpl.querySelector('.card-title').innerText = project.title;
        tmpl.querySelector('.card-text').innerText = project.body;
        tmpl.querySelector('.url').href = project.url;
        tmpl.querySelector('.url').target = project.target;
        for (var t=0; t < project.tags.length; t++) 
        {
            var tag = document.createElement('span');
            tag.innerText = project.tags[t];
            tag.setAttribute('class','tags text-font');
            tmpl.querySelector('.tags-row').appendChild(tag);
        }
        projectsList.appendChild(tmpl);
      }
      } 
      else {
        console.log('Templates are not supported');
      }
}
function loadArticles(title,url,img,body,tags) {
    if ('content' in document.createElement('template')) {
        console.log('Templates are supported');
      // List of all projects and related data
      $("#blogFeed").removeClass("hidden");
      //console.log(projects);
      // Get a reference to the comments list in the main DOM.
      var blogList = document.getElementById('blog');
      
        var tmpl = document.getElementById('article-template').content.cloneNode(true);
        tmpl.querySelector('.img-fluid').src = img;
        tmpl.querySelector('.card-title').innerText = title;
        tmpl.querySelector('.card-text').innerText = body;
        tmpl.querySelector('.url').href = url;
        tmpl.querySelector('.url').target = "_blank";
        // for (var t=0; t < 3; t++) 
        // {
        //     var tag = document.createElement('span');
        //     tag.innerText = tags[t];
        //     tag.setAttribute('class','tags text-font');
        //     tmpl.querySelector('.tags-row').appendChild(tag);
        // }
        blogList.appendChild(tmpl);
      } 
      else {
        console.log('Templates are not supported');
      }
}
/* Code courtesy Jason Matthew https://medium.jasonmdesign.com/display-medium-articles-on-your-site-d772b3b05779
*/
var articles=[];
function loadBlog() {
    var $content = $('#jsonContent');
	var data = {
		rss_url: 'https://medium.com/feed/diarium-da-pacific'
	};
    // console.log(data)
	$.get('https://api.rss2json.com/v1/api.json', data, function (response) {
		if (response.status == 'ok') {
            articles = response.items;
            console.log(articles);
            let it = [0,4,3];            
            for (let i=0; i<3; i++) {
                let title=articles[it[i]].title;
                let url=articles[it[i]].link;
                let img=articles[it[i]].thumbnail;

                let start = articles[it[i]].description.indexOf('<h4>')+4;
                let end = articles[it[i]].description.indexOf('</h4>');
                    end = end-start<120?end:start+120;
                let body=articles[it[i]].description.slice(start,end)+("...");
                let tags=articles[it[i]].categories;
                loadArticles(title,url,img,body,tags);
            }
        }
    });
}

// Scroll to section
// $(function () {
//     var currentHash = "#";
//     var blocksArr = $('.fullheight');
//     var lastScrollTop = 0;
//     var currentBlock = 0;
    
    
//     $(document).scroll(function () {
//        // debugger;
//       var st = $(this).scrollTop();
//       var hash;
//       console.log('ho');
          
//       if (st > lastScrollTop && currentBlock< blocksArr.length -1){
//       // downscroll code
//            hash = $(blocksArr[++currentBlock]).attr('id');
//            window.location.hash = (hash);
//       }
//       else 
//           if (st < lastScrollTop && currentBlock > 0){
//       // scrollup code
//           hash = $(blocksArr[--currentBlock]).attr('id');
//           window.location.hash = (hash);
//       }
  
//       lastScrollTop = $(this).scrollTop();
//     });
//   });