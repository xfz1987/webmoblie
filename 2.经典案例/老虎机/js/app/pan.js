
define(['jquery','jquerymigrate','velocity'],function($){

	var prize=0;

	$(document).on('pagecreate','#pan',function(){
		$('#pan .prizepan .panbtn').click(function(e) {
			alert('start')
		});

		
	});

	// 倒计时
	function countdown(){
		alert(1);
	}

	// 转盘转动
	function rotate(){
		alert(2)
	}
	
});