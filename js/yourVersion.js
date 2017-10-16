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
        lowLag.load(['bx_'+i+'.mp3','bx_'+i+'.ogg'],'bx_'+(14-i));
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
    $('#mclear').bind('click',resetdoos);
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
    var mb_no = GetURLParameter('mb_no');
    loadSong(mb_no);
    console.log(mb_no);
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
    iSongNr = parseInt(iSongNr);
    switch (iSongNr) {
        case 1: // O du lieber Augustin/Daar wordt aan de deur geklopt
            sampleSong=new Array("38,14","92,14","125,11","199,11","226,9","261,7","295,9","337,8","384,9","421,10","461,11","498,12","535,13","574,14","610,11","647,12","682,11","720,12","754,11","790,12","829,11","863,9");
            break;
        case 2: // Wilhelmus van Nassouwe
            sampleSong=new Array("72,6","158,6","194,8","240,6","291,4","346,4","397,7","501,8","553,11","581,8","630,6","683,7","760,8","804,6","860,6","894,3","951,3");
            break;
        case 3: // The Can-Can
            sampleSong=new Array("46,9","101,7","100,5","136,10","195,5","196,8","228,11","286,7","287,9","322,12","380,7","381,9","421,13","474,9","475,11","510,13","565,8","569,13","606,14","663,9","664,12","702,14","745,5","807,6","832,1","834,4","887,7","924,3","925,5","988,8","1023,3","1024,5");
            break;
        case 4: // wiegenlied brahms
            sampleSong=new Array("50.52000427246094,4","108.52000427246094,4","145.52000427246094,4","189.52000427246094,4","244.52000427246094,6","268.52000427246093,6","310.52000427246093,8","339.52000427246093,6","378.52000427246093,4","420.52000427246093,1","469.52000427246093,4","515.5200042724609,4","569.5200042724609,4","605.9999847412109,11","606.5200042724609,14","671.5200042724609,11","671.5200042724609,14","712.5200042724609,8","758.5200042724609,6","757.5200042724609,4","798.5200042724609,6","797.5200042724609,4","835.5200042724609,11","879.5200042724609,4","881.5200042724609,6","918.5200042724609,4","921.5200042724609,6","962.5200042724609,7","1019.5200042724609,5","1018.5200042724609,4","1054.520004272461,4","1055.520004272461,5");
            break;
        case 5:
            sampleSong=new Array("48,7","93,8","122,7","179,8","214,9","259,11","302,10","333,9","372,8","417,12","452,8","485,9","517,10","561,12","606,11","640,10","673,9","705,11","727,9","764,10","796,11","823,10","863,9","895,11","982,12");
            break;
        case 6: // tetris
            sampleSong=new Array("43.52000427246094,3","43.52000427246094,5","43.52000427246094,7","43.52000427246094,10","127.52000427246094,3","127.52000427246094,5","127.52000427246094,7","128.52000427246094,10","228.52000427246094,3","228.52000427246094,5","228.52000427246094,7","229.52000427246094,10","282.52000427246093,2","283.52000427246093,5","284.52000427246093,7","285.52000427246093,9","370.52000427246093,5","370.52000427246093,7","371.52000427246093,10","372.52000427246093,12","437.52000427246093,3","438.52000427246093,6","439.52000427246093,8","439.52000427246093,10","505.52000427246093,4","506.52000427246093,6","506.52000427246093,9","507.52000427246093,11","568.5200042724609,5","569.5200042724609,12","642.5200042724609,5","644.5200042724609,12","693.5200042724609,4","694.5200042724609,12","747.5200042724609,12","748.5200042724609,5","810.5200042724609,2","810.5200042724609,4","811.5200042724609,7","812.5200042724609,9","905.5200042724609,2","905.5200042724609,4","905.5200042724609,7","906.5200042724609,9","965.5200042724609,7","966.5200042724609,10","967.5200042724609,12","967.5200042724609,14");
            break;
        default: //Grit's Demo Song
            sampleSong=new Array("48,7","93,8","122,7","179,8","214,9","259,11","302,10","333,9","372,8","417,12","452,8","485,9","517,10","561,12","606,11","640,10","673,9","705,11","727,9","764,10","796,11","823,10","863,9","895,11","982,12");
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
        var left = crd[0] * windowWidth / 1350;
        $("body .your-version").append('<div name="nte'+mid+'" id="nte'+mid+'" style="left:'+(left)+'px;top:'+crd[1]*16+'px;" class="noot"></div>');//'+rnotes[notes[crd[1]]%12]+'
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
                x="";
            });

        }
    }
    $(window).resize(function() {
        cleardoos();
        windowWidth = $(window).width();
        for(i=0;i<sampleSong.length;i++){
            var mid=notelist.length;
            var crd=sampleSong[i].split(",");
            notelist.push(mid);
            var left = crd[0] * windowWidth / 1300;
            $("body .your-version").append('<div name="nte'+mid+'" id="nte'+mid+'" style="left:'+(left)+'px;top:'+crd[1]*16+'px;" class="noot"></div>');//'+rnotes[notes[crd[1]]%12]+'

        }

    });
}
function resetdoos(){
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
function cleardoos(){
    if(!$('#mclear').hasClass('disabled')){
        $('.noot').remove();
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
            TweenLite.to('#playhead',10,{x:endPosition,onUpdate:playTime,ease:'linear',onComplete:playDone})
        }
    }else{
        TweenLite.killTweensOf('#playhead');
        TweenLite.to('#playhead',.3,{x:0,opacity:0});
        playDone();
    }
}
function share(){
    //Scan before share it to social media

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
    //Scan before send it to database
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
                noterecord.push("\""+parseInt(p.left)+ ","+ note_num+"\"");
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
                noterecord.push("\""+parseInt(p.left)+ ","+ note_num+"\"");
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
    $.ajax({
        type: "POST",
        url: "./php/send2us.php",
        data: "music_record=" + noterecord.join(),
        success: function(data) {
            alert("success");
        }
    });
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



