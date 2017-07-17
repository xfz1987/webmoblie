$(function(){
    var data = {
        list : [
                {src:'images/pz-iphone.png',name:'iphone6s'},
                {src:'images/pz-xyy.png',name:'喜羊羊赠险'},
                {src:'images/pz-iwatch.png',name:'iwatch'},
                {src:'images/pz-50y.png',name:'充值卡'},
                {src:'images/pz-jdcard.png',name:'京东代金券'},
                {src:'images/pz-iwatch.png',name:'iwatch'},
                {src:'images/pz-xyy.png',name:'喜羊羊赠险'},
                {src:'images/pz-50y.png',name:'充值卡'},
                {src:'images/pz-iphone.png',name:'iphone6s'},
                {src:'images/pz-xyy.png',name:'喜羊羊赠险'},
                {src:'images/pz-jdcard.png',name:'京东代金券'},
                {src:'images/pz-50y.png',name:'充值卡'}
            ],
        res : 6
    };

    var loadReady = function(){
        //创建临时图片数组临时变量
        for(var i=0,imgArr = [],list=data.list,len=list.length;i<len;imgArr.push(list[i].src),i++);

        var per = 100/len,n=0;

        while(imgArr.length !== 0){
            var img = new Image();
            img.src = imgArr.pop();
            img.onload = function(){
                // setTimeout(function(){$('.progress').width(++n * per +'%');},2000);
                $('.progress').width(++n * per +'%');
            };
        }

        //加载资源
        setTimeout(function(){$('.load').addClass('hide');},1000);
        return true;
    };

    loadReady();

    var clicked = false;

    var lot = Lottery($('#container'),{
        count : data.list.length,
        curClassName : 'prz-cur',
        index : 0,     //当前转动到哪个位置
        speed : 200,   //初始转动速度
        cycle : 50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
        prize : data.res,
        fn : function(){   //抽到奖后执行
            //插入奖品
            console.log(data.list[data.res].src);
            $('#result-prize').attr('src',data.list[data.res].src).next().text(data.list[data.res].name);

            $('.start-tip').removeClass('show');
            $('.mask').addClass('show');
            setTimeout(function(){
                $('.result').addClass('show');
            },200);
        }
    });

    //开始转
    $('#container').on('click','#pan-start',function(){
        if(clicked){
            $('.mask').addClass('show');
            setTimeout(function(){
                $('.result').addClass('show');
            },200);
            return;
        }
        clicked = true;
        $('.start-tip').addClass('show').addClass('ok');

        lot.start();

        $('.start-tip').removeClass('ok');
    });

    //关闭
    $('.result .close').click(function(){
        $('.mask').addClass('hide');
        var el = $(this).parent().addClass('hide');
        setTimeout(function(){
            el.add('.mask').removeClass('show').removeClass('hide');
        },1000);
    });


});

/**
 * 转盘类
 */
var Lottery = function(container,opts){
    var el = container,
        count = opts.count,
        index = opts.index || 0,
        speed = opts.speed || 100,
        cycle = opts.cycle || 50,
        prize = opts.prize,
        clc = opts.curClassName,
        times = 0, //转动次数
        timer = 0,
        fn = opts.fn;
        //初始化
        _init();

    function _init(){
        //按照转盘式正方形的，假设每边有4个小格子，那么一共是16个，但是要去掉四个角，
        //反过来就可以计算出上、下边有多少格子，左、右边的格子数=上边 - 2
        var n = (count+4)/4,//顶边格子数
            w = h = 1/n * 100;

        /*计算中间按钮占了多少个格子*/
        var hN = vN = n - 2,
            vW = w * hN,
            vH = h * vN;

        /*格子布局*/
        var bflag;
        for(var i=0,_html='',name=0;i<n;i++){
            for(var j=0;j<n;j++){
                bflag = false;
                if(i===0){
                    name = j;
                    bflag = true;
                }else if(i<n-1){
                    if(j===0){
                        name = count-i;
                        bflag = true;
                    }
                    if(j===n-1){
                        name = j+i;
                        bflag = true;
                    }
                }else{
                    name = count-i-j;
                    bflag = true;
                }

                bflag && (_html += '<div data-prize="item_' + name + '" style="position:absolute;width:' + w + '%;height:' + h + '%;top:' + i*h + '%;left:' + w*j + '%;"></div>');
            }
        }

        el.append($(_html));

        //添加中间按钮
        el.append($('<div id="pan-start" style="position:absolute;width:' + vW + '%;height:' + vH + '%;top:' + h + '%;left:' + w + '%;"></div>'));
    }

    function begin(){
        var arg = arguments[0];

        if(prize === undefined) randomPrize();
        el.find('>div[data-prize$="_' + index + '"]').addClass(clc);
        loop(fn);
    }

    function randomPrize(){
        prize = Math.floor(Math.random()*12);
    }

    function loop(){
        rotate();
        //转动停止
        if(++times > cycle+10 && prize == index){
            clearTimeout(timer);
            timer = null;
            fn && fn();
            return false;
        }

        if(times < parseInt(cycle/2)){
            speed -= 10;
        }else if(times < cycle){
            speed -= 20;
        }else{
            speed += 50;
        }

        if(speed<50) speed = 50;

        timer = setTimeout(loop,speed);

    }

    function rotate(){
        el.find('>div[data-prize$="_' + (index++) + '"]').removeClass(clc).end()
          .find('>div[data-prize$="_' + (index = index>count-1 ? 0 : index) + '"]').addClass(clc);
    }

    return {
        start : function(){
            begin();
        }
    };
};
