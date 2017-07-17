;(function adapt(designWidth){
	var dw=designWidth || 640,rate=100/dw,el=$('html').css('font-size',rate*100+'vw'),w=el.width();
	var elm=$('<div style="width:1vw;height:0"></div>').appendTo(el);
	if(elm.width()==w) {
		el.css('font-size',w*rate);
		$(window).resize(function(){
			el.css('font-size',el.width()*rate);
		});
	}
	elm.remove();
})();