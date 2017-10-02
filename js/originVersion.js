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
var rnotes=new Array('c','c#','d','d#','e','f','f#','g','g#','a','a#','b');
var notes=new Array(56,58,60,61,63,65,67,68,70,72,73,75,77,79,80);
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
    lowLag.init({'debug':'false','urlPrefix':'snd/'    });

    for(i=0;i<15;i++){
        lowLag.load(['bx_'+i+'.mp3','bx_'+i+'.ogg'],'bx_'+i);
        //sounds.push(new buzz.sound("./snd/bx_"+i));
    }


    for(i=0;i<Math.round($(window).width()/16);i++){
        //console.log(i);
        $('#o_barsv').append('<div class="o_vbar" name="o_vbar'+i+'" id="o_vbar'+i+'"></div>');
        $('#o_vbar'+i).css({'left':i*16+'px','top':'0','height':16*notes.length+'px'});
    }
    for(i=0;i<notes.length;i++){
        //console.log(i);
        var nt=rnotes[notes[i]%12];
        $('#o_barsh').append('<div class="o_bar" name="o_bar'+i+'" id="o_bar'+i+'">'+nt+'</div>');
        $('#o_bar'+i).css({'left':0,'top':i*16+'px'});
    }
    //$('.controls').css('top',50+(i*16)+'px');
    loadOriginSong(1);
    $('#o_playhead').css('height',i*16+'px');
    $('#o_speel').bind('click',o_speeldoos);
    $('#o_mclear').bind('click',o_cleardoos);

    if(document.body.ontouchstart === undefined){
    }else{
        //
        $("#o_bars").bind('touchstart',function(e) {
            var orig = e.originalEvent;
            var pos = $(this).position();
            offset = {
                pageX: orig.changedTouches[0].pageX - pos.left,
                pageY: orig.changedTouches[0].pageY - pos.top
            };
            createNote(offset);
        });

    }
});
function loadOriginSong(iSongNr) {
    var sampleSong;
    console.log("================>origin load");
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
            sampleSong=new Array("48,7","93,6","122,7","180,6","215,5","259,3","302,4","333,5","372,6","417,2","452,6","485,5","517,4","561,2","606,3","640,4","673,5","705,3","727,5","764,4","796,3","823,4","863,5","895,3","982,2");
    }
    if($('#o_speel').hasClass('disabled')){
        $('#o_speel').removeClass('disabled');
        $('#o_mclear').removeClass('disabled');
    }
    for(i=0;i<sampleSong.length;i++){
        var mid=notelist.length;
        var crd=sampleSong[i].split(",");
        notelist.push(mid);
        $("body .origin-version").append('<div name="nte'+mid+'" id="o_nte'+mid+'" style="left:'+(crd[0])+'px;top:'+crd[1]*16+'px;" class="o_noot"></div>');//'+rnotes[notes[crd[1]]%12]+'

    }
}
function o_cleardoos(){
    if(!$('#o_mclear').hasClass('disabled')){
        $('.o_noot').remove();
        notelist=new Array();
    }
    $('.o_vbar').remove();
    for(i=0;i<Math.round($(window).width()/16);i++){
        //console.log(i);
        $('#o_barsv').append('<div class="o_vbar" name="o_vbar'+i+'" id="o_vbar'+i+'"></div>');
        $('#o_vbar'+i).css({'left':i*16+'px','top':'0','height':16*notes.length+'px'});
    }
}
function o_speeldoos(){
    if($('#o_speel').html()=="PLAY <i class=\"fa fa-play\"></i>"){
        //ttime=0;
        var blockPosition = $("body .origin-version").position();
        if(!$('#o_speel').hasClass('disabled')){
            endPosition = $(window).width()-blockPosition.left*2;//$(window).width()-parseInt($("body .origin-version").css("margin-right"))*2
            $('#o_speel').html("STOP <i class=\"fa fa-stop\"></i>");
            TweenLite.to('#o_playhead',.3,{x:0,opacity:.4,height:"240px"});
            TweenLite.to('#o_playhead',12,{x:endPosition,onUpdate:playOriginTime,ease:'linear',onComplete:o_playDone})
        }
    }else{
        TweenLite.killTweensOf('#o_playhead');
        TweenLite.to('#o_playhead',.3,{x:0,opacity:0});
        o_playDone();
    }
}
function playOriginTime(){
    var head=$('#o_playhead').position();
    //$('#cord').html(head.left);
    $( ".o_noot" ).each(function( index ) {
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
function o_playDone(){
    //ttimer++;
    $('.o_noot').removeClass('nplayed');
    $('#o_speel').html("PLAY <i class=\"fa fa-play\"></i>");

    TweenLite.to('#o_playhead',.5,{x:0,opacity:0});
    console.log(noterecord.join());
    noterecord.length = 0;

}
function pnot(){
    //ttime++;
    $( ".o_noot" ).each(function( index ) {
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
function onOriginDemoChange(){
    var i = +$("#o_demosongs").val(); // val() returns a string, use + to convert to integer
    $("#songnameid").val($("#o_demosongs option:selected").text());
    o_cleardoos();
    loadOriginSong(i);
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
    $("#o_cord").html(e.pageX);
    switch (e.type) {
        case 'touchstart': this.onTouchStart(event); break;
        case 'touchmove': this.onTouchMove(event); break;
        case 'touchend': this.onClick(event); break;
        case 'click': this.onClick(event); break;
        default:$("#o_cord").html(e.type);

    }
}

