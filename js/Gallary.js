$(document).ready(function(){	
	

	var imgs = $('#imgs').find('li');
	imgs.click(function() {
		$(".MusicBoxList").hide();
		var num = $(this).data('num');
		$('.mb'+ num +'').show().siblings().hide();
	});
	

	
});