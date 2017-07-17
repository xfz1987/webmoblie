$(function(){
    var data = [
        {name:'菜衣淋',img:'images/b-caiyilin.png'},
        {name:'饭饼饼',img:'images/b-fanbingbing.png'},
        {name:'糕圆圆',img:'images/b-gaoyuanyuan.png'},
        {name:'林智灵',img:'images/b-linzhiling.png'},
        {name:'李蚊',img:'images/b-liwen.png'},
        {name:'书奇',img:'images/b-shuqi.png'},
        {name:'汤味',img:'images/b-tangwei.png'},
        {name:'吴墨绸',img:'images/b-wumochou.png'},
        {name:'张漫裕',img:'images/b-zhangmanyu.png'},
        {name:'章紫姨',img:'images/b-zhangziyi.png'}
    ];

    var canShake = false;

    //出场动画
    $('.title').addClass('hide').on('transitionend webkitTransitionend',function(){

        $('.title1,.bottom1').addClass('show').on('transitionend webkitTransitionend',function(){
            $('.ballot').addClass('show');
            canShake = true;
        });

    });

    $('.title1').click(function(){
        doSomething();
    });

    function doSomething(){
        randomQian();
        $('.ballot').addClass('rock');
        $('.mask').addClass('show');

        // $('.qian').addClass('pro').on('animationend webkitAnimationEnd',function(){
        //     $('.page-2').addClass('show');
        // });

        $('.qian').addClass('pro');
        $('.page-2').addClass('show');

    }

    $('.share').click(function(){
        $('.share-pan').css('height',$(document).height()).addClass('show');
    });

    $('.share-pan').click(function(){
        $('.share-pan').removeClass('show');
    });

    function randomQian(){
        var result = data[Math.floor(Math.random()*10)];
        $('.qian>p').text(result.name);
        $('.page-2 .result').attr('src',result.img);
    }


    var shake=800,
        last_update=0,
        x=y=z=last_x=last_y=last_z=0;
    if(window.DeviceMotionEvent){
        window.addEventListener('devicemotion',deviceMotionHandler,false);
    }else{
        alert('本设备不支持devicemotion事件');
    }

    function deviceMotionHandler(eventData){
        if(!canShake) return;

        var acceleration = eventData.accelerationIncludingGravity,
            currTime=new Date().valueOf(),
            diffTime=currTime-last_update;

        if(diffTime>100){
            last_update=currTime;
            x=acceleration.x;
            y=acceleration.y;
            z=acceleration.z;
            var speed=Math.abs(x+y+z-last_x-last_y-last_z)/diffTime*10000;
            if(speed>shake){
                canShake = false;
                doSomething();
            }
            last_x = x;
            last_y = y;
            last_z = z;
        }
    }


});
