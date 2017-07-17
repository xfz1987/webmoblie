
define(['jquery','jquerymigrate','velocity'],function($){
	$(document).on('pagecreate','#pageqrcode',function(){
		$('#pageqrcode h1').click(function(event) {
			$(this).velocity({color:'#00ff00'},1000)
		});
	});

	
	
});