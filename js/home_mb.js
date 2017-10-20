$(function () {
    /*image position data*/
    var datas = [
        {'z-index': 6, opacity: 1, width: 290, height: 400, top: 40, left: 0},
        {'z-index': 4, opacity: 0.6, width: 200, height: 276, top:20, left: -170},
        {'z-index': 3, opacity: 0.4, width: 150, height: 207, top: 0, left: -80},
        {'z-index': 2, opacity: 0.2, width: 150, height: 207, top: -20, left: 50},
        {'z-index': 3, opacity: 0.4, width: 150, height: 207,  top: 0, left: 150},
        {'z-index': 4, opacity: 0.6, width: 200, height: 276, top:20, left: 250},
    ]
    move();

    function move() {
        /*image distribution*/
        for (var i = 0; i < datas.length; i++) {
            var data = datas[i];
            $('#slide ul li').eq(i).css('z-index',data['z-index']);
            $('#slide ul li').eq(i).stop().animate(data, 1200);
        }
    }

    /*left arrow event*/
    $('.prev').on('click', function () {
        var last = datas.pop();
        datas.unshift(last);
        move();
    })

    /*right arrow event*/
    function nextYewu(){
        var first = datas.shift();
        datas.push(first);
        move();
    }
    /*left arrow event*/
    $('.next').on('click', nextYewu);

    /*auto-play*/
    var timer = setInterval(function(){
        nextYewu();
    },2500);
    /*clear auto playing and show arrows when cursor covers slides*/
    $('#slide').on({
        mouseenter: function () {
            $('.arrow').css('display', 'block');
            clearInterval(timer);
        }, mouseleave: function () {
            $('.arrow').css('display', 'block');
            /*auto playing when cursor leaves*/
            clearInterval(timer);
            timer = setInterval(function(){
                nextYewu();
            },2500)
        }
    })
})

/*scrolling effect*/
$(document).ready(function(){
    //$(".mb").hide();
    $(".jump_arrow img").click(function(){
        //$(".mb").slideToggle();
        var offset = 0;
        console.log(offset);
        $('html, body').animate({
            scrollTop: $(".mb").offset().top+offset},1500);
    });
    $(".nav1 li:last-of-type").click(function(){
        //$(".mb").slideToggle();
        var offset = 0;
        console.log(offset);
        $('html, body').animate({
            scrollTop: $(".mb").offset().top+offset},1500);
    });
});