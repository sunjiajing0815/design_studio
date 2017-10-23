$(document).ready(function(){	
	
    $("#sharebox").hide();
    $(".background").hide();
	var imgs = $('#imgs').find('li');
	imgs.click(function() {
		$(".MusicBoxList").hide();
		$(".box").hide();
		var num = $(this).data('num');
		$('.mb'+ num +'').show().siblings().hide();
	});
	$(".back-btn").click(function(){
        console.log("back");
        //$(this).parentsUntil(".item").hide();
        $(".box").hide();
        $(".MusicBoxList").show();

	});

    $(".share").click(function(){
        $("#sharebox").css("top","50vh").show();
        $(".background").show();
        }
    );
    $(".background").click(function(){
        $("#sharebox").hide();
        $(".background").hide();

    });

	
});