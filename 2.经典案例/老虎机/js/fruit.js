require.config({
	baseUrl:'js/lib',
	paths:{
		app:'../app',
		jquery:'jquery-3.1.0.min',
		jquerymigrate:'jquery-migrate-3.0.0.min',
		jquerymobile:'jquery.mobile-1.4.5.min',
		velocity:'velocity-1.3.0.min'
	}
});

require(['jquery','jquerymigrate','velocity'],function($){
	$(document).on('pagecreate','#fruit',function(){
		//DEFAULT
		var chance = 0,
		    pos = [0,1,0],
		    win = false,
		    prize=0,
		    $con1 = $('#roll_1 .con'),
		    $con2 = $('#roll_2 .con'),
		    $con3 = $('#roll_3 .con'),
		    itemH = $('#roll_1').height(),
		    count = 3,
		    baseCycle = 20,
		    clicked = false;

    	//模拟ajax请求数据 - 剩余机会次数
    	var request = true;
    	if(request){
    		chance = 2;
    	}
    	
    	/**相关参数初始化**/
    	//1.初始化剩余次数
    	$('.chance-tip span').text(chance);
    	if(!chance){
    		$('.fruit-pan p').css('color','#000').text('已结束');
    	}
    	
    	//2.初始化动画距离
    	var dis1 = dis2 = dis3 = 0;

    	//3.初始化水果位置
		var pos1 = initPos($con1),pos2 = initPos($con2),pos3 = initPos($con3);

		function getDistance(item,h,index){
			var n = baseCycle*count + index;
			item.height(h + (n+1)*itemH);
			return n*itemH;
		}
		function randomPos(){
			return Math.floor(Math.random()*count);
		}
        function initPos(item){
        	var pos = randomPos() * itemH;
           	item.css('transform','translateY(-'+ pos + 'px)');
           	item.css('webkitTransform','translateY(-'+ pos + 'px)');
        	return pos;
        }

		function checkReasult(){
			$('.mask').addClass('show');
			if(win){
				if(prize === 1){
					$('.greate').addClass('show').find('.result').text('一等奖');
				}
				if(prize === 2){
					$('.greate').addClass('show').find('.result').text('二等奖');
				}
				if(prize === 3){
					$('.greate').addClass('show').find('.result').text('三等奖');
				}
			}else{
				$('.sorry').addClass('show');
			}
		}

		function start(item,distance){
			item.css('transform','translateY(-'+ distance + 'px)');
           	item.css('webkitTransform','translateY(-'+ distance + 'px)');
           	if(item[0].id === 'show-result'){
           		item.on('transitionend webkitTransitionend',function(){
            		$('.fruit-pan p').velocity({color:'#d95900'},{
						duration:800,
						complete : function(){
							checkReasult();
							if(!chance) $('.fruit-pan p').css('color','#000').text('已结束');
							clicked = false;
						}
					});
        		});
           	}
		}

		$('.fruit-pan p').click(function(){
			if(clicked) return;
			if(!chance) return;
			clicked = true;
			$('.chance-tip span').text(--chance);

			//模拟ajax请求数据 - 中奖结果
			if(request){
				var data = {win:false,pos:[0,1,2],prize:0};
    				pos = data.pos;
    				win = data.win;
    				prize = data.prize;
			}

			dis1 += getDistance($con1,dis1,pos[0]);
			dis2 += getDistance($con2,dis2,pos[1]);
			dis3 += getDistance($con3,dis3,pos[2]);
			
			$(this).velocity({color:'#999'},{
				duration:1000,
				complete : function(){
					start($con1,dis1);
					setTimeout(function(){
						start($con2,dis2);
					},500);
					setTimeout(function(){
						start($con3,dis3);
					},1000);

				}
			});
		});

		$('.sorry button').click(function(){
			$(this).parent().removeClass('show');
			$('.mask').removeClass('show');
		});

		$('.greate i').click(function(){
			$(this).parent().removeClass('show');
			$('.mask').removeClass('show');
		});

		//提交
		$('.greate button').click(function(){
			var name = $('#gname').val(),
			    tel = $('#gtel').val();
			if(name === '' || tel === '') return;
			alert(name + ':' + tel);
			// $('greate').removeClass('show');
			// $('.mask').removeClass('show');
		});
		
	});

	require(['jquerymobile']);
});