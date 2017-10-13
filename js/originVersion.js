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
    var mb_no = GetURLParameter('mb_no');
    loadOriginSong(parseInt(mb_no));
    loadMusicImg(mb_no);
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
function loadMusicImg(iSongNr){
    console.log("./img/mb1"+iSongNr+".jpg");

    $(".music-image img").attr("src","./img/notes"+iSongNr+".png");
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

