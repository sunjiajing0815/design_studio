$(document).ready(function(){	
	
    $("#sharebox").hide();
    $(".background").hide();
	var imgs = $('#imgs').find('li');
	imgs.click(function() {
		$(".MusicBoxList").hide();
		$(".searchbox").hide();
		var num = $(this).data('num');
        $("#box").show();
		$('.mb'+ num +'').show().siblings().hide();
	});
	$(".back-btn").click(function(){
        console.log("back");
        $(".MusicBoxList").show();
        $("#box").hide();
        $(".searchbox").show();
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