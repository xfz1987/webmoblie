;(function adapt(){
    var el=$('html').css('font-size','15.625vw'),w=el.width();
    var elm=$('<div style="width:1vw;height:0"></div>').appendTo(el);
    if(elm.width()==w) {
        el.css('font-size',w*0.15625);
        $(window).resize(function(){
            el.css('font-size',el.width()*0.15625);
        });
    }
    elm.remove();
})();
