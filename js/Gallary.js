$(document).ready(function(){	
	

	var imgs = $('#imgs').find('li');
	imgs.click(function() {
		$(".MusicBoxList").hide();
		$(".box").hide();
		var num = $(this).data('num');
		$('.mb'+ num +'').show().siblings().hide();
	});
	$(".back-btn").click(function(){
        console.log("back");
        $(this).parentsUntil(".item").hide();
        $(".MusicBoxList").show();
        $(".box").show();


	})
	

	
});