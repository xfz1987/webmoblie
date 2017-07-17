/* Common Javascript */
//vm检查
(function($){
	var el = $('<div style="height:0;width:1vw"></div>').appendTo('body');
	if(el.width() == $('body').width()){
		$('html').css('font-size', $(window).width() * 0.036);
	}
	el.remove();
})(jQuery);

//popalert组件
(function($){
	var pops={};
	//wait
	pops.waitstart = function(){
		var el = $('.waiting');
		if(el.length==0) el=$('<div class="waiting"><div><img src="../images/waiting.png" alt="" /></div></div>').appendTo('body');
		el.fadeIn();
	};
	pops.waitend = function(){
		$('.waiting').fadeOut();
	};
	//fade
	pops.fade = function(txt) {
		txt = txt || '出错啦';
		var el = $('.popalert');
		if(el.length==0) el=$('<div class="popalert">'+txt+'</div>').appendTo('body');
		el.text(txt).fadeIn(300);
		setTimeout(function () {
			el.fadeOut(300);
		}, 2000);
	};
	// alert
	pops.alert = function(title, content, html, callback){
		var el = $('.alert'),mask = $('.maskgray');
		if(!el.length) el = $('<div class="alert"><h1>提示</h1><p></p><div class="sure"></div></div>').appendTo('body');
		el.find('h1').text(title).end().find('p').html(content);
		if(html) el.find('button').before($(html));
		var els = mask.add(el).show().addClass('show');
		el.find('.sure').one('click',function(){
			els.addClass('hide');
			setTimeout(function(){
				els.hide().removeClass('show hide');
			},600);
		});	
	};
	window['popalert'] = pops;
})(jQuery);

/* business */
//该二维码是否参加过抽奖，是否参加过过活动 / 是否正在获取验证码
var JOINED = false,ISGETTINGCODE = false;

$(function(){
	/*  回执信息业务逻辑  */
	//该二维码是否参加国抽奖
	if(JOINED) popalert.alert('本二维码已参加过抽奖','请联系您身边的业务人员取得新的<br>二维码再进行抽奖',undefined);

	//获取验证码
	$('.receipt-info .check-code').click(function(){
		if(JOINED){
			popalert.alert('本二维码已参加过抽奖','请联系您身边的业务人员取得新的<br>二维码再进行抽奖',undefined);
			return false;
		}
		if(ISGETTINGCODE) return false;
		//电话检查
		var telTxt = trim($('.receipt-info .tel').val());
		if(!telTxt){
			popalert.fade('请输入电话');
			return false;
		}
		if(!/^1[3|4|5|7|8][0-9]{9}$/.test(telTxt)){
			popalert.fade('手机号格式不正确');
			return false;
		}
		var count = 60,$getCode = $('.receipt-info .check-code');
		ISGETTINGCODE = true;
		countRever();
		function countRever(){
        	if(count > 1){
        	    $getCode.text('剩余' + (--count) + '秒');
        	    setTimeout(countRever, 1000);
        	}else{
        	    $getCode.text('获取验证码');
        	    ISGETTINGCODE = false;
        	}
    	}
		//模拟获取验证码，并存入到验证码标签的属性中
		$getCode.prev('.code').attr('data-code', '1234');
		alert('验证码:1234');
	});

	//回执信息确认
	$('.receipt-info .btn-sure').click(function(){
		//该二维码是否参加国抽奖
		// if(JOINED){
		// 	popalert.alert('本二维码已参加过抽奖','请联系您身边的业务人员取得新的<br>二维码再进行抽奖',undefined);
		// 	return false;
		// }
		// var $info = $(this).prev();
		// //姓名检查
		// var nameTxt = trim($info.find('.name').val());
		// if(!nameTxt){
		// 	popalert.fade('请输入姓名');
		// 	return false;
		// }
		// //电话检查
		// var telTxt = trim($info.find('.tel').val());
		// if(!telTxt){
		// 	popalert.fade('请输入电话');
		// 	return false;
		// }
		// if(!/^1[3|4|5|7|8][0-9]{9}$/.test(telTxt)){
		// 	popalert.fade('手机号格式不正确');
		// 	return false;
		// }
		// //验证码检查
		// var $code = $info.find('.code'),
		// 	codeTxt = trim($code.val());
		// if(!codeTxt){
		// 	popalert.fade('请输入验证码');
		// 	return false;
		// }
		// if(codeTxt !== $code.attr('data-code')){
		// 	popalert.fade('验证码不正确');
		// 	return false;
		// }
		// //工号检查
		// var noTxt = trim($info.find('.agentno').val());
		// if(!noTxt){
		// 	popalert.fade('请输入寿险顾问工号');
		// 	return false;
		// }
		
		//模拟提交信息
		//提交信息
		popalert.waitstart();
		setTimeout(function(){
			popalert.waitend();
			//信息提交成功后，切换页面
			$('.front').addClass('hide');
			$('.backface').addClass('show');
			//当背面页动画完毕后，隐藏正面，防止事件点透
			setTimeout(function(){
				$('.front').css('display', 'none');
				setTimeout(function(){
					$('.machine').css('display','block').addClass('bounceInRight');
				}, 500);
			}, 500);
		}, 1000);




		//提示信息1
		//popalert.alert('每人每月可参与活动一次','您的手机号码已经参与过抽奖活动<br>请11日之后再试',undefined);
		//提示信息2
		//popalert.alert('本二维码已参加过抽奖','请联系您身边的业务人员取得新的<br>二维码再进行抽奖',undefined);
	});

	//去两边空格
	function trim(str){
		var reg = /(^\s+)|(\s+$)/g;
		return str.replace(reg,"");
	}

	//初始化老虎机
	var slot = Slot($('#tig-canvas')[0],['../images/pazz_1.png','../images/pazz_2.png','../images/pazz_3.png']);

	/*  抽奖业务逻辑   */
	//点击抽奖
	var SLOTSTATUS = '0';//抽奖状态 0 未抽奖 1 正在抽奖 2 已经抽过奖了
	$('.machine .hot-area').click(function(){
		if(SLOTSTATUS === '1') return false;
		if(SLOTSTATUS === '2'){
			popalert.alert('每人每月可参与活动一次','您的手机号码已经参与过抽奖活动<br>请11日之后再试',undefined);
			return false;
		}
		SLOTSTATUS = '1';
		var $machine = $('.machine');
		$machine.find('.go').addClass('show');
		//2s后开始抽奖
		
		setTimeout(function(){
			$machine.addClass('light');
			slot.start(function(txt1,txt2){
				SLOTSTATUS = '2';
				$machine.css({'webkitAnimationIterationCount':'1', 'animationIterationCount':'1'});
				popalert.alert(txt1, txt2 , undefined);
				// popalert.alert(txt1,'请联系您身边的华夏理财顾问领奖',undefined);
			});
			//模拟ajax请求中奖结果
			var time = new Date();
			setTimeout(function(){
				//说明: 当ajax请求失败时传参数为2
				slot.toEnd(parseInt('2'), (new Date()).getTime()-time.getTime());//0表示一等奖，1表示二等奖，2表示三等奖
			}, 0);
		}, 2000);
	});

});