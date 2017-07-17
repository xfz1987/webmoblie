jQuery(function(){
    jQuery.noConflict();//把jQuery的控制权让给zepto

    //开场动画
    jQuery('.girl').addClass('show').on('transitionend webkitTransitionend',function(){

        jQuery('.wz').addClass('show').on('transitionend webkitTransitionend',function(){
            jQuery('.title').addClass('show').on('transitionend webkitTransitionend',function(){
                jQuery(this).addClass('rock');

                jQuery('.star').addClass('flash');
            });
        });

    });


    //点击音乐图标，控制音乐播放效果
    jQuery('#music').on('click',function(){
        var audio = jQuery('audio')[0];
        if(audio.paused){
            audio.play();
            this.className = 'play';
        }else{
            audio.pause();
            this.className = '';
        }
    });

    //更多说明展开与隐藏
    jQuery('.more').on('click',function(){
        jQuery(this).prev().slideToggle();
    });


    //当滚动条拖动到奖品大变身时，数据进度效果
    var data = {
        all : 10000,
        persent : 6000
    };

    jQuery(window).scroll(function(){
        var prize = jQuery('.prize'),
            ph = jQuery('.prize')[0].offsetTop + 200,
            top = jQuery(window).scrollTop() + jQuery(window).height();

        var per = (data.persent/data.all)*100 + '%';

        if(top>ph) jQuery('.col').css('width',per);
    });

    //旋转木马
    var carousel = new Carousel(jQuery('#carousel'), {
        items: [
            {imgSrc:'images/prize1c.png',text:'快来买吧<br>钻石1号'},
            {imgSrc:'images/prize2c.png',text:'快来买吧<br>钻石1号'},
            {imgSrc:'images/prize3c.png',text:'快来买吧<br>钻石3号'}
        ],
        initalStyle : {
            'width':'1.44rem',
            'height':'2.25rem',
            'border':'2px solid #f9e1e6',
            'border-radius':'.1rem',
            'background-color':'#efefef',
            'left':0,
            'right':0,
            'top':'.2rem',
            'margin':'0 auto',
            'color':'#333'
        },
        textStyle : {
            'margin' : '.18rem',
            'font-size':'.18rem',
            'line-height':'.25rem'
        }
    });

    //旋转木马
    $('#carousel').swipeLeft(function(){
        carousel.run('left');
    }).swipeRight(function(){
        carousel.run('right');
    });

    jQuery('.test1').on('click',function(){
        carousel.run('left');
    });

    jQuery('.test2').on('click',function(){
        carousel.run('right');
    });

    console.log(-1%3);

});

/**
 * 3d旋转木马
 */
var Carousel = function(el,opts){
    this.items = opts.items;//图片集
    this.num = this.items.length;//图片数
    this.root = el;//场景元素
    this.spinner = el.find('#spinner');
    this.angle = 0;
    this.rotate = 360 / this.num;//角度
    this.curIndex = 0;
    this.opts = opts;
    this._init();
};
Carousel.prototype = {
    _init : function(){
        var i=0,len=this.num,str='';
        for(;i<len;i++){
            str += '<div style="transform:rotateY(' + i*this.rotate + 'deg) translateZ(2rem) scaleY(.9);position:absolute;">'
                     + '<img src="' + this.items[i].imgSrc + '" style="display:block;width:100%;height:100%;">'
                     + '<p>' + this.items[i].text + '</p>'
                 + '</div>';
        }
        this.spinner.append(jQuery(str));
        this.spinner.find('>div').css(this.opts.initalStyle).find('p').css(this.opts.textStyle);
        this.spinner.find('>div').eq(0).addClass('item-first');
        return this;
    },
    //旋转
    run : function(direct,fn){
        console.log(this.curIndex);
        var cur = direct === 'right' ? this.num - Math.abs(++this.curIndex%this.num===0?this.num:this.curIndex%this.num) : Math.abs(--this.curIndex%this.num);

        this.spinner.find('>div').siblings().removeClass('item-first').eq(cur).addClass('item-first');
        this.angle = this.curIndex * this.rotate;

        this.spinner.css({
            '-webkit-transform' : 'rotateY(' + this.angle + 'deg)',
            'transform' : 'rotateY(' + this.angle + 'deg)',
            '-webkit-transition' : 'all 1s',
            '-moz-transition' : 'all 1s',
            'transition' : 'all 1s'
        }).one('transitionend webkitTransitionend',function(){
                //去掉transition保留在样式,照成的缩放元素会有动画变化
                jQuery(this).css({
                    '-webkit-transition':'',
                    '-moz-transition':'',
                    'transition':''
                });
            fn && fn();
        });
    }
};


