// JavaScript Document
/****************       common 公用         *****************/
var base = {
    isAjax : false,
    boss : null,
    per : 0.03125,
    guide : ''
};

$(function(){

    //vm支持检查
    vwCheck();

    //后退
    $(document).on('tap', '.header a', function() {
        history.go(-1);
    });

});

/*************** 公用的 pagecreate *****************/
$(document).on('pagecreate', function() {

    //检查是否为 android，如果是，将page设置为绝对定位
    pageCheck();

    //初始化时间框
    $('.timebar input').each(function(index, el) {
        var val = $(this).val();
        if (val === null || val === '') {
            $(this).next('span').show();
        } else {
            $(this).next('span').hide();
        }
    });
});

/**
 * vw支持检查
 */
function vwCheck(){
    var el = $('<div style="height:0;width:1vw"></div>').appendTo('body');
    if (el.width() == $('body').width()) {
        $('html').css('font-size', $(window).width() * 0.03125);
    }
    el.remove();
}

/**
 * 检查是否为 android，如果是，将page设置为绝对定位
 */
function pageCheck(){
    var userAgent = navigator.userAgent;

    if (userAgent.indexOf('Android') > -1) {
        $('section').addClass('android');
    }

    $('.page').not('[style]').css('min-height', $(window).height());
}

// 补齐时间中的0
function fullTime(n){
    return n<10 ? '0'+n : n;
}

// 当前时间（清确到分）
function timeLine(){
    var t=new Date();
    this.stamp=t.getTime();
    this.date=t.getFullYear()+'-'+fullTime(t.getMonth()+1)+'-'+fullTime(t.getDate());
    this.time=fullTime(t.getHours())+':'+fullTime(t.getMinutes());

    t.setDate(t.getDate()-1);
    this.yesterday=t.getFullYear()+'-'+fullTime(t.getMonth()+1)+'-'+fullTime(t.getDate());

    //return r;
}

$(document).on('change', '.timebar input', function() {
    var v = $(this).val();
    if (v===0 || v==='') {
      $(this).next('span:hidden').show();
    } else {
        $(this).next('span:visible').hide();
    }
});


/****************       login  登录        *****************/
$(document).on('pagecreate', '#login', function() {
   pageCheck();

   $('#login .red-btn').on('tap', function() {
        var el = $(this).addClass('gray').text('登陆中');

        setTimeout(function(){
            el.removeClass('gray').text('登  陆');

            base.boss = {
                id : 1,
                name : '疯子',
                loginState : true,
                position : '总经理'
            };
            localStorage.bossinfo = JSON.stringify(base.boss);
            $.mobile.changePage('#home',{
                transition: 'slide',
                changeHash: false
            });
        },1000);

   });
});

/****************       home  首页        *****************/
$(document).on('pagebeforeshow', '#home', function() {
    //1.引导页2s后消失
    setTimeout(function(){
        $('.first-view').fadeOut(function() {
            $(this).remove();
        });
    },2000);

    //2.判断是否登陆，如果未登陆，则返回到登陆页
    loginCheck();
});

/**
 * 登陆检查
 */
function loginCheck(){
    if(base.boss == null) {
        var info = localStorage.bossinfo;
        if(info == null){
            $.mobile.changePage('#login', {
                transition:'none',
                changeHash: false
            });

            return false;
        } else {
            base.boss = JSON.parse(info);
        }
    }
}

/****************       sex 性别修改        *****************/
$(document).on('pagecreate', '#sex', function() {
    $('#sex .item-list li').tap(function(){
        if($(this).hasClass('cur')){
            return false;
        }

        $(this).addClass('cur').siblings().removeClass('cur');

        $('#setup .item-list:eq(0) li:eq(2) p').text($(this).text());

        setTimeout(function(){
            history.go(-1);
        },500);

    });
});

/****************       setup  个人资料        *****************/
$(document).on('pagecreate', '#setup', function() {
    $('#setup .logout').tap(function(){
        base.boss = null;
        localStorage.removeItem('bossinfo');
        history.go(-2);
    });
});

/****************       overview 数据概览         *****************/
//数据展现
$(document).on('pagebeforeshow', '#overview', function() {
    //从后台获取数据，并将数据处理成 tempData 的结构

    //通过数据画图型
    var option = new lineOpt(tempData);

    chartsFunc('chart-overview',option);

});

// 选项卡切换
$(document).on('pagecreate', '#overview', function() {
    $('#overview .tab li').tap(function(){

        if($(this).hasClass('cur') || base.isAjax){
            return false;
        }

        $(this).addClass('cur').siblings().removeClass('cur');

        if($(this).index() < $(this).parent().children().length-1){

            base.isAjax = true;

            $('#overview .data-content').prev('.timebar:visible').slideUp();

            //从后台获取数据，并将数据处理成 tempData 的结构

            //通过数据画图型
            var option = new lineOpt(tempData);

            chartsFunc('chart-overview',option);

        }else{
            $('#overview .data-content').addClass('empty').prev('.timebar:hidden').slideDown();
        }
    });

    //自定义查询
    $('#overview .timebar button').tap(function(){
        if(base.isAjax){
            return false;
        }

        base.isAjax = true;
        $('#overview .data-content').addClass('load');

        //从后台获取数据，并将数据处理成 tempData 的结构

        //通过数据画图型
        var option = new lineOpt(tempData);

        chartsFunc('chart-overview',option);
    });
});


/****************       shoprank 门店排行         *****************/
$(document).on('pagebeforeshow', '#shoprank', function() {

    //进入时取首页
    $('#shoprank .rank-list').addClass('load');

    //模拟ajax
    setTimeout(function(){
        $('#shoprank .rank-list').removeClass('load empty');
    },1500);

});

$(document).on('pagecreate', '#shoprank', function() {

    $('#shoprank .tab li').tap(function(){

        if($(this).hasClass('cur') || base.isAjax){
            return false;
        }

        $(this).addClass('cur').siblings().removeClass('cur');

        $('#shoprank .data-content').prev('.timebar:visible').slideUp();

        if($(this).index() < $(this).parent().children().length-1){
            // 模拟ajax
            base.isAjax = true;

            $('#shoprank .data-content').addClass('load');

            setTimeout(function(){
                $('#shoprank .data-content').removeClass('load empty');
                base.isAjax = false;
            },1500);
        }else{
            $('#shoprank .data-content').addClass('empty').prev('.timebar:hidden').slideDown();
        }
    });

    //自定义查询
    $('#shoprank .timebar button').tap(function(){
        if(base.isAjax){
            return false;
        }

        base.isAjax = true;
        $('#shoprank .data-content').addClass('load');

        // 模拟ajax
        setTimeout(function(){
            $('#shoprank .data-content').removeClass('load empty');
            base.isAjax = false;
        },1500);
    });

    //底部选项卡切换
    $('#shoprank .tab-down li').tap(function(){

        if($(this).hasClass('cur') || base.isAjax){
            return false;
        }

        $(this).addClass('cur').siblings().removeClass('cur');

        if($('#shoprank .tab li:last-child').hasClass('cur') && $('#shoprank .data-content').hasClass('empty')){
            return false;
        }

        base.isAjax = true;

        $('#shoprank .data-content').addClass('load');

        // 模拟ajax
        setTimeout(function(){
            $('#shoprank .data-content').removeClass('load empty');
            base.isAjax = false;
        },1500);

    });

    //点击排行榜中的导购
    $('#shoprank .rank-list').on('tap', 'li', function() {
        //立利用存储技术解决传递参数的方法
        localStorage.paramguide = $(this).find('span').text();

        $.mobile.changePage('shopstatistics.html', {transition:'slide',changeHash: true});
    });

});

/****************       shopstatistics 门店统计 门店统计         *****************/
$(document).on('pagebeforeshow', '#shopstatistics', function() {
    //获取参数
    var parm = localStorage.getItem('paramguide') || '全部门店';
    //参数存储
    //localStorage.removeItem('paramguide');
    $('#shopstatistics .header h1').text(parm);
    base.guide = parm;

    var option = new lineOpt(tempData);
    chartsFunc('chart-shopstatistics',option);
});

$(document).on('pagebeforehide', '#shopstatistics', function() {
    localStorage.removeItem('paramguide');
});

$(document).on('pagecreate', '#shopstatistics', function() {

    $('#shopstatistics .tab li').tap(function(){

        if($(this).hasClass('cur') || base.isAjax){
            return false;
        }

        $(this).addClass('cur').siblings().removeClass('cur');

        if($(this).index() < $(this).parent().children().length-1){

            base.isAjax = true;

            $('#shopstatistics .data-content').prev('.timebar:visible').slideUp();

            //从后台获取数据，并将数据处理成 tempData 的结构

            //通过数据画图型
            var option = new lineOpt(tempData);

            chartsFunc('chart-shopstatistics',option);

        }else{
            $('#shopstatistics .data-content').addClass('empty').prev('.timebar:hidden').slideDown();
        }
    });

    //自定义查询
    $('#shopstatistics .timebar button').tap(function(){
        if(base.isAjax){
            return false;
        }

        base.isAjax = true;
        $('#shopstatistics .data-content').addClass('load');

        //从后台获取数据，并将数据处理成 tempData 的结构

        //通过数据画图型
        var option = new lineOpt(tempData);

        chartsFunc('chart-shopstatistics',option);
    });



});




/****************       echart 画图处理         *****************/
/**
 * 使用调用echarts插件公共方法
 */
function chartsFunc(id,opt){
    //初始化显示区域的大小
    var $el = $('#'+id).width($(window).width()).height($(window).width() * base.per * 16);

    var parent = $el.parent('.data-content').addClass('load');

    var myChart = echarts.init($el[0]);

    //myChart.setOption(option);;

    myChart.showLoading();

    //模拟ajax
    setTimeout(function(){
        parent.removeClass('load empty');
        myChart.hideLoading();
        myChart.setOption(opt);
        base.isAjax = false;
    },1500);
}

var tempData={
    legend : ['销售额','订单数','关注客户数','绑定客户','线下客户'],
    xaxis : ['周一','周二','周三','周四','周五','周六','周日'],
    series : [
        {
            name:'销售额',
            type:'line',
            stack: '总量',
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'订单数',
            type:'line',
            stack: '总量',
            data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
            name:'关注客户数',
            type:'line',
            stack: '总量',
            data:[150, 232, 201, 154, 190, 330, 410]
        },
        {
            name:'绑定客户',
            type:'line',
            stack: '总量',
            data:[320, 332, 301, 334, 390, 330, 320]
        },
        {
            name:'线下客户',
            type:'line',
            stack: '总量',
            data:[820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
};

/**
 * 线型图配置参数
 */
function lineOpt(data){
    var fw=$(window).width() * base.per;
    this.tooltip = {trigger : 'axis'};
        this.legend={
        textStyle: {fontSize:fw},
        itemWidth:fw*1.5,
        itemHeight:fw,
        itemGap:fw/2,
        top:'5%',
        data:data.legend
    };
    this.grid= {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:'20%',
        containLabel: true
    };
    this.xAxis={
        type: 'category',
        axisLabel:{textStyle: {fontSize:fw}},
        boundaryGap: false,
        data: data.xaxis
    };
    this.yAxis={
        axisLabel:{textStyle: {fontSize:fw}},
        type: 'value'
    };
    this.series=data.series;
}