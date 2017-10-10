/*
    o2:
    g+   56
    a+   58

    o3:
    c      60
    c+   61
    d+   63
    f      65
    g     67
    g+  68
    a+  70

    o4:
    c     72
    c+  73
    d+  75
    f     77
    g    79
    g+  80
    */
var rnotes=new Array('c','c#','d','d#','e','f','f#','g','g#','a','a#','b');//old("b","a#","a","g#","g","f#","f","e","d#","d","c#","c")
var notes=new Array(56,58,60,61,63,65,67,68,70,72,73,75,77,79,80);//new(80,79,77,75,73,72,70,68,67,65,63,61,60,58,56)
var drag="";
var coords=new Array(0,0,0);
var notelist=new Array();
var startCoords = {}, endCoords = {};
var sounds=new Array();
var dragplay=0;
var removing=false;
var iv,track,ttime;
var noterecord = new Array();




$(document).ready(function () {
    //lowLag.init({'debug':'false','urlPrefix':'snd/'    });
    //for(i=0;i<15;i++){
    //    lowLag.load(['bx_'+i+'.mp3','bx_'+i+'.ogg'],'bx_'+i);
        //sounds.push(new buzz.sound("./snd/bx_"+i));
    //}
    lowLag.init({'debug':'false','urlPrefix':'snd/'    });
    $('.music-image').hide();

    for(i=0;i<15;i++){
        lowLag.load(['bx_'+i+'.mp3','bx_'+i+'.ogg'],'bx_'+i);
        //sounds.push(new buzz.sound("./snd/bx_"+i));
    }

    $.fn.draggable = function() {
        var offset = null;
        var start = function(e) {
            drag=$(this).attr('id').substr(3);

            removing=true;
            iv=setInterval(function(){clearInterval(iv);removing=false},400);

            var orig = e.originalEvent;
            var pos = $(this).position();
            offset = {
                x: orig.changedTouches[0].pageX - pos.left,
                y: orig.changedTouches[0].pageY - pos.top
            };
        };
        var moveMe = function(e) {
            //$("#cord").html("asd"+$(this).attr('id').substr(3));
            e.preventDefault();
            var orig = e.originalEvent;
            //
            coords[0]=(orig.changedTouches[0].pageX - offset.x)-8;
            coords[1]=Math.round(((orig.changedTouches[0].pageY - offset.y)-8)/16)*16;
            //$('cord').html(coords[1]);
            if(coords[2]!=coords[1]){
                dragplay=1;
            }
            if(dragplay==1){
                dragplay=0;
                //lowLag.play('bx_'+Math.round(coords[1]/32));
                //sounds[Math.round(coords[1]/32)].play();
                coords[2]=coords[1];
            }
            //
            $(this).css({
                top: Math.round((orig.changedTouches[0].pageY - offset.y)/16)*16,
                left: orig.changedTouches[0].pageX - offset.x
            });
            checkGone(this);
        };
        this.bind("touchstart", start);
        this.bind("touchmove", moveMe);
    };

    $('#speel').bind('click',speeldoos);
    $('#mclear').bind('click',cleardoos);
    $('#share').bind('click',share);
    $('#send2us').bind('click',send2us);
    if(document.body.ontouchstart === undefined){
        // desktop

        $('body .your-version').bind("mousemove", function (e) {
            //e.preventDefault();
            //$("#cord").html(drag);
            var blockPosition = $("body .your-version").position();
            blockOffsetX = parseInt($("body .your-version").css('margin-left'));
            blockOffsetY = blockPosition.top+parseInt($("body .your-version").css('margin-left'));
            coords[0]=e.pageX-8-blockPosition.left;
            coords[1]=Math.round((e.pageY-8-blockOffsetY)/16)*16;
            if(drag!=""){
                if(coords[2]!=coords[1]){
                    dragplay=1;
                }
                if(dragplay==1){
                    dragplay=0;
                    //console.log(Math.min((notes.length-1)*32,Math.round(coords[1]/32)));
                    lowLag.play('bx_'+Math.round(Math.min((notes.length-1)*16,coords[1])/16));
                    //sounds[Math.round(Math.min((notes.length-1)*32,coords[1])/32)].play();
                    coords[2]=coords[1];
                }


                $("#nte"+drag).css({'left':coords[0]+'px'});
                $("#nte"+drag).css({'top':Math.round(coords[1]/16)*16+'px'});
                //console.log("<div>" + msg + "</div>");
                checkGone("#nte"+drag);
            }
        });
        //}
        $(document).bind("mouseup", function (e) {
            if($("#nte"+drag).html()=="x" || removing==true){
                clearInterval(iv);
                $("#nte"+drag).remove();
                // leave array intact because of unique ID
            }
            drag="";
        });
    }else{
        // on mobile
    }

    for(i=0;i<Math.round($(window).width()/16);i++){
        //console.log(i);
        $('#barsv').append('<div class="vbar" name="vbar'+i+'" id="vbar'+i+'"></div>');
        $('#vbar'+i).css({'left':i*16+'px','top':'0','height':16*notes.length+'px'});
    }
    for(i=0;i<notes.length;i++){
        //console.log(i);
        var nt=rnotes[notes[i]%12];
        $('#barsh').append('<div class="bar" name="bar'+i+'" id="bar'+i+'">'+nt+'</div>');
        $('#bar'+i).css({'left':0,'top':i*16+'px'});
    }
    //$('.controls').css('top',50+(i*16)+'px');
    loadSong(1);
    $('#playhead').css('height',i*16+'px');

    if(document.body.ontouchstart === undefined){
        $(".bar").bind('mousedown',function(e) {
            createNote(e);
        });
    }else{
        //
        $("#bars").bind('touchstart',function(e) {
            var orig = e.originalEvent;
            var pos = $(this).position();
            offset = {
                pageX: orig.changedTouches[0].pageX - pos.left,
                pageY: orig.changedTouches[0].pageY - pos.top
            };
            createNote(offset);
        });

    };

    $('.scroll-handle').click(function(){
        $('.music-image').slideToggle();
    });
});
function loadSong(iSongNr) {
    var sampleSong;
    switch (iSongNr) {
        case 2: // O du lieber Augustin/Daar wordt aan de deur geklopt
            sampleSong=new Array("48,7","93,6","122,7","180,6","215,5","259,3","302,4","333,5","372,6","417,2","452,6","485,5","517,4","561,2","606,3","640,4","673,5","705,3","727,5","764,4","796,3","823,4","863,5","895,3","982,2");break;
        case 3: // Wilhelmus van Nassouwe
            sampleSong=new Array("32,4", "96,7", "96,0", "96,2", "96,4", "160,7", "160,2", "160,0", "160,5", "224,8", "224,0", "224,3", "224,5", "256,9", "288,10", "288,6", "288,4", "288,3", "320,8", "352,9", "352,7", "352,4", "352,0", "352,2", "416,8", "416,4", "416,1", "416,6", "448,9", "480,10", "480,5", "480,3", "480,0", "544,9", "544,4", "544,6", "608,8", "608,3", "608,5", "608,0", "608,1", "640,7", "672,8", "672,6", "672,4", "672,1", "736,7", "736,4", "736,0", "736,2");break;
        case 4: // The Can-Can
            sampleSong=new Array("32,7", "32,0", "64,4", "64,2", "96,0", "96,7", "128,2", "128,4", "160,8", "160,6", "192,10", "192,4", "192,3", "224,9", "224,6", "256,8", "256,4", "256,3", "288,11", "288,0", "320,2", "320,4", "352,11", "352,0", "384,4", "384,2", "416,11", "416,0", "448,12", "448,2", "448,4", "480,9", "480,0", "512,10", "512,4", "512,2", "544,8", "544,6", "576,4", "576,3", "608,8", "608,6", "640,3", "640,4", "672,8", "672,6", "704,10", "704,4", "704,3", "736,9", "736,6", "768,8", "768,4", "768,3", "800,7", "800,0", "800,2", "800,4", "832,14", "864,13", "896,12", "928,11", "960,10", "992,9", "1024,8", "1056,7", "1056,0");break;
        case 5: // wiegenlied brahms
            sampleSong=new Array("32,9", "64,9", "96,11", "96,0", "160,2", "160,4", "224,9", "256,9", "288,11", "288,0", "352,2", "352,4", "416,9", "448,11", "480,0", "480,14", "544,13", "544,2", "544,4", "640,12", "672,6", "672,12", "736,11", "736,4", "736,3", "800,8", "832,9", "864,6", "864,10", "928,4", "928,3", "928,8", "992,8", "1024,9", "1056,6", "1056,10", "1120,4", "1120,3", "1184,8", "1216,9", "1248,13", "1248,6", "1280,12", "1312,3", "1312,4", "1312,11", "1376,13", "1440,0", "1440,14");break;
        case 6: // tetris
            sampleSong=new Array("32,9", "32,6", "96,6", "128,7", "128,5", "160,8", "160,6", "224,7", "224,5", "256,6", "288,5", "288,2", "352,5", "352,2", "384,7", "416,9", "416,5", "480,8", "480,6", "512,7", "512,5", "544,6", "608,6", "640,7", "640,5", "672,8", "672,6", "736,9", "736,6", "800,7", "800,5", "864,5", "864,2", "928,2", "928,5");break;
        case 7: // happy birthday
            sampleSong=new Array("16,4", "40,2", "48,11", "80,9", "80,4", "112,7", "144,6", "144,4", "176,5", "176,3", "208,10", "232,5", "240,4", "240,9", "273,7", "304,8", "312,4", "320,6", "336,7", "336,2", "244,9", "352,11", "360,14");break;
        case 8: // stille nacht
            sampleSong=new Array("32,0", "32,2", "32,7", "32,11", "96,4", "128,12", "128,5", "128,3", "160,7", "160,11", "160,2", "160,4", "224,0", "224,7", "224,9", "224,4", "288,4", "352,7", "416,0", "416,2", "416,4", "416,7", "416,11", "480,4", "512,12", "512,3", "512,5", "544,7", "544,11", "544,4", "544,2", "608,0", "608,4", "608,7", "608,9", "672,4", "736,7", "800,4", "800,8", "800,3", "864,8", "928,6", "928,4", "928,3", "928,8", "992,4", "992,8", "992,13", "1056,10", "1120,11", "1184,0", "1184,7", "1184,10", "1184,14", "1248,4", "1312,7", "1312,10", "1312,14", "1376,0", "1376,2", "1376,11");break;
        case 9: // youp van 't hek flappie
            sampleSong=new Array("32,4", "64,7", "96,8", "128,9", "128,0", "160,4", "192,7", "224,4", "256,8", "288,4", "320,11", "352,4", "384,9", "384,0", "416,7", "448,14", "480,13", "512,12", "512,3", "544,7", "576,14", "608,10", "640,0", "640,11", "672,7", "704,9", "736,7", "768,7", "832,8", "864,3", "896,9", "896,0");break;
        case 10: //marines' hymn
            sampleSong=new Array("32,7", "64,9", "96,11", "96,0", "96,2", "96,4", "160,11", "224,11", "224,6", "224,4", "224,3", "288,11", "352,4", "352,2", "352,0", "352,11", "448,14", "480,11", "544,9", "576,10", "608,11", "608,0", "608,2", "608,4", "672,11", "736,10", "736,6", "736,4", "736,3", "768,8", "864,7", "864,0", "864,2", "864,4", "928,4", "928,0", "928,2", "992,4", "992,0", "992,2");break;
        default: //Grit's Demo Song
            sampleSong=new Array("48,7","93,8","122,7","179.99998474121094,8","214.99998474121094,9","258.99998474121093,11","301.99998474121093,10","332.99998474121093,9","371.99998474121093,8","416.99998474121093,12","451.99998474121093,8","484.99998474121093,9","516.9999847412109,10","560.9999847412109,12","605.9999847412109,11","639.9999847412109,10","672.9999847412109,9","704.9999847412109,11","726.9999847412109,9","763.9999847412109,10","795.9999847412109,11","822.9999847412109,10","862.9999847412109,9","894.9999847412109,11","981.9999847412109,12"
            );
    }
    if($('#speel').hasClass('disabled')){
        $('#speel').removeClass('disabled');
        $('#mclear').removeClass('disabled');
        $('#mprint').removeClass('disabled');
    }
    for(i=0;i<sampleSong.length;i++){
        var mid=notelist.length;
        var crd=sampleSong[i].split(",");
        notelist.push(mid);
        $("body .your-version").append('<div name="nte'+mid+'" id="nte'+mid+'" style="left:'+(crd[0])+'px;top:'+crd[1]*16+'px;" class="noot"></div>');//'+rnotes[notes[crd[1]]%12]+'
        drag="";

        if(document.body.ontouchstart === undefined){
            // no tablet mode:
            $("#nte"+mid).bind("mousedown", function (e) {
                lowLag.play('bx_'+Math.round(coords[1]/16));
                //sounds[Math.round(coords[1]/32)].play();
                drag=this.id.substr(3);
                removing=true;
                iv=setInterval(function(){clearInterval(iv);removing=false},400);
                //$("#cord").html("trg:"+drag);
            });

        }else{
            $("#nte"+mid).draggable();
            $("#nte"+mid).bind('touchend',function(e) {
                //alert($("#nte"+drag).id);
                //$("#cord").html(removing);
                if($("#nte"+drag).html()=="x" || removing==true){
                    clearInterval(iv);
                    $("#nte"+drag).remove();
                }
                drag="";
            });

        }
    }
}
function cleardoos(){
    if(!$('#mclear').hasClass('disabled')){
        $('.noot').remove();
        loadSong(1);//reset
    }
    $('.vbar').remove();
    for(i=0;i<Math.round($(window).width()/16);i++){
        //console.log(i);
        $('#barsv').append('<div class="vbar" name="vbar'+i+'" id="vbar'+i+'"></div>');
        $('#vbar'+i).css({'left':i*16+'px','top':'0','height':16*notes.length+'px'});
    }
}
function speeldoos(){
    if($('#speel').html()=="PLAY <i class=\"fa fa-play\"></i>"){
        var blockPosition = $("body .your-version").position();
        //ttime=0;
        if(!$('#speel').hasClass('disabled')){
            endPosition = $(window).width()-blockPosition.left*2;//$(window).width()-parseInt($("body .your-version").css("margin-right"))*2;//$(window).width()
            $('#speel').html("STOP <i class=\"fa fa-stop\"></i>");
            TweenLite.to('#playhead',.3,{x:0,opacity:.4,height:"240px"});
            TweenLite.to('#playhead',12,{x:endPosition,onUpdate:playTime,ease:'linear',onComplete:playDone})
        }
    }else{
        TweenLite.killTweensOf('#playhead');
        TweenLite.to('#playhead',.3,{x:0,opacity:0});
        playDone();
    }
}
function share(){
    if($('#speel').html()=="STOP <i class=\"fa fa-stop\"></i>"){
        alert("Please stop playing to share the music.");
    }else{
        var blockPosition = $("body .your-version").position();
        //ttime=0;
        if(!$('#speel').hasClass('disabled')){
            endPosition = $(window).width()-blockPosition.left*2;//$(window).width()-parseInt($("body .your-version").css("margin-right"))*2;//$(window).width()
            TweenLite.to('#playhead',.3,{x:0,opacity:.4,height:"240px"});
            TweenLite.to('#playhead',1,{x:endPosition,onUpdate:scanTime,ease:'linear',onComplete:scanDone})
        }
    }
}
function send2us(){
    if($('#speel').html()=="STOP <i class=\"fa fa-stop\"></i>"){
        alert("Please stop playing to share the music.");
    }else{
        var blockPosition = $("body .your-version").position();
        //ttime=0;
        if(!$('#speel').hasClass('disabled')){
            endPosition = $(window).width()-blockPosition.left*2;//$(window).width()-parseInt($("body .your-version").css("margin-right"))*2;//$(window).width()
            TweenLite.to('#playhead',.3,{x:0,opacity:.4,height:"240px"});
            TweenLite.to('#playhead',1,{x:endPosition,onUpdate:scanTime,ease:'linear',onComplete:scan2sendDone})
        }
    }
}
function playTime(){
    var head=$('#playhead').position();
    //$('#cord').html(head.left);
    $( ".noot" ).each(function( index ) {
        if(!$(this).hasClass('nplayed')){
            var p=$(this).position();
            //console.log(head.left);
            if(head.left>p.left){
                //sounds[Math.round(Math.min((notes.length-1)*16,p.top)/16)].stop();
                $(this).addClass('nplayed');
                //$(this).css('background-color','#ffcc66');
                var note_num = Math.round(Math.min((notes.length-1)*16,p.top)/16);
                lowLag.play('bx_'+note_num);
                console.log("X: "+p.left+ "   Y: "+ note_num);
                noterecord.push("\""+p.left+ ","+ note_num+"\"");
                //sounds[Math.round(Math.min((notes.length-1)*32,p.top)/32)].play();
            }
        }
        //console.log( index + ": " + $(this).attr('id')+":"+p.left+":"+p.top );

    });
}
function scanTime(){
    var head=$('#playhead').position();
    //$('#cord').html(head.left);
    $( ".noot" ).each(function( index ) {
        if(!$(this).hasClass('nscanned')){
            var p=$(this).position();
            //console.log(head.left);
            if(head.left>p.left){
                //sounds[Math.round(Math.min((notes.length-1)*16,p.top)/16)].stop();
                $(this).addClass('nscanned');
                //$(this).css('background-color','#ffcc66');
                var note_num = Math.round(Math.min((notes.length-1)*16,p.top)/16);
                noterecord.push("\""+p.left+ ","+ note_num+"\"");
            }
        }
    });
}
function playDone(){
    //ttimer++;
    $('.noot').removeClass('nplayed');
    $('#speel').html("PLAY <i class=\"fa fa-play\"></i>");
    TweenLite.to('#playhead',.5,{x:0,opacity:0});
    console.log(noterecord.join());
    noterecord.length = 0;
}
function scanDone(){
    //ttimer++;
    $('.noot').removeClass('nscanned');
    TweenLite.to('#playhead',.5,{x:0,opacity:0});
    console.log(noterecord.join());

    //Insert share method here:
    console.log("shared!");

    noterecord.length = 0;
}

function scan2sendDone(){
    //ttimer++;
    $('.noot').removeClass('nscanned');
    TweenLite.to('#playhead',.5,{x:0,opacity:0});
    console.log(noterecord.join());

    //Insert send method here:
    console.log("send!");

    noterecord.length = 0;
}
function pnot(){
    //ttime++;
    $( ".noot" ).each(function( index ) {
        var p=$(this).position();
        lowLag.play('bx_'+Math.round(Math.min((notes.length-1)*16,coords[1])/16));
        //sounds[Math.round(Math.min((notes.length-1)*32,p.top)/32)].play(p.left/10);

        //console.log( index + ": " + $(this).attr('id')+":"+p.left+":"+p.top );

    });
}
function checkGone(mc){
    var ypos=$(mc).css('top').replace("px","")*1;
    //$("#cord").html("y:"+ypos);
    if(ypos>(notes.length-1)*16){
        $(mc).css('background-color',"red");
        //$(mc).html("x");
    }else{
        //$(mc).css('background-color',"#ff6600");
        $(mc).addClass("nmoved");
        //$(mc).html(rnotes[notes[ypos/32]%12]);
    }
}

function createNote(e){
    var blockPosition = $("body .your-version").position();
    blockOffsetX = parseInt($("body .your-version").css('margin-left'));
    blockOffsetY = blockPosition.top+parseInt($("body .your-version").css('margin-left'));
    //blockOffsetX = parseInt($("body .your-version").css('margin-left'));
    //blockOffsetY = parseInt($("body .your-version").css('margin-top'));
    //console.log(blockOffsetX);
    console.log(createNote);
    coords[0]=e.pageX-8-blockPosition.left;
    coords[1]=e.pageY-8-blockOffsetY;
    var mid=notelist.length;
    notelist.push(mid);
    if($('#speel').hasClass('disabled')){
        $('#speel').removeClass('disabled');
        $('#mclear').removeClass('disabled');
        $('#mprint').removeClass('disabled');
    }
    $("body .your-version").append('<div name="nte'+mid+'" id="nte'+mid+'" style="left:'+(coords[0])+'px;top:'+Math.round(coords[1]/16)*16+'px;" class="noot"></div>');
    drag="";
    lowLag.play('bx_'+Math.round(coords[1]/16));
    //sounds[Math.round(coords[1]/32)].play();
    //$("#nte"+mid).html( rnotes[notes[Math.round(coords[1]/32)]%12] );

    //$("#nte"+mid).draggable();
    //$('#nte0').click(function(){alert('sf')});
    //$("#nte"+mid).draggable();
    if(document.body.ontouchstart === undefined){
        // no tablet mode:
        $("#nte"+mid).bind("mousedown", function (e) {
            lowLag.play('bx_'+Math.round(coords[1]/16));
            //sounds[Math.round(coords[1]/16)].play();
            drag=this.id.substr(3);
            removing=true;
            iv=setInterval(function(){clearInterval(iv);removing=false},400);
            //$("#cord").html("trg:"+drag);
        });

    }else{
        $("#nte"+mid).draggable();
        $("#nte"+mid).bind('touchend',function(e) {
            //alert($("#nte"+drag).id);
            //$("#cord").html(removing);
            if($("#nte"+drag).html()=="x" || removing==true){
                clearInterval(iv);
                $("#nte"+drag).remove();
            }
            drag="";
        });

    }
}
function printsong(){
    $('.formnotes').remove();
    $( ".noot" ).each(function( index ) {
        var p=$(this).position();
        $('#soundform').append('<input name="fnote['+index+']" type="hidden" class="formnotes" value="'+p.left+','+Math.round(p.top/16)+'">');
        //sounds[Math.round(Math.min((notes.length-1)*32,p.top)/32)].stop();
    });
    $('#soundform').submit();
}
function onDemoChange(){
    var i = +$("#demosongs").val(); // val() returns a string, use + to convert to integer
    $("#songnameid").val($("#demosongs option:selected").text());
    cleardoos();
    loadSong(i);
}
function showPop(txt){
    $('#popcontent p').html(txt);
    TweenLite.to($('.popinModal'), .3, {opacity:1});
}
function hidePop(){
    TweenLite.to( $('.popinModal'), .3, {opacity:0,onComplete:function(){
        lowLag.play('bx_0');
        $('.popinModal').css("visibility", "hidden");
    }});
}
function tch(e){
    $("#cord").html(e.pageX);
    switch (e.type) {
        case 'touchstart': this.onTouchStart(event); break;
        case 'touchmove': this.onTouchMove(event); break;
        case 'touchend': this.onClick(event); break;
        case 'click': this.onClick(event); break;
        default:$("#cord").html(e.type);

    }
}
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}
/*
function wer(){
    $(".bar").on('touchend',function(e){
        console.log("add");
      //coords[0]=e.pageX;
      //coords[1]=e.pageY;
        var mid=notelist.length;
        notelist.push(mid);
        $("body").append('<div id="nte'+mid+'" style="left:'+(coords[0]-8)+'px;top:'+Math.round((coords[1]-8)/16)*16+'px;" class="noot"></div>');
        drag="";
        $('#nte'+mid).on('touchstart',function(e){
            $("#cord").html(e.pageX);

             //var tl1 = new TimelineLite();
             //my_media.play();
             drag=this;
             $(this).style('background-color', 'red');
             //LowLatencyAudio.play('background');
             //TweenLite.to($(this), 0, {scaleX:.97, scaleY:.97});
         });

    });
*/
/*
 $("body").on('touchend',function(){
      drag="";
     $('.noot').style('background-color', '#ff6600');
//var tl1 = new TimelineLite();
                //TweenLite.to($(this), .1, {delay:.1,scaleX:1, scaleY:1});
});
*/
/*
$('.noot').tap(function() {
    // affects "span" children/grandchildren
    console.log(this);
    $(this).style('background-color', 'red');
});
*/
//};

//document.body.addEventListener('touchmove', function(e){e.preventDefault()}, false);



