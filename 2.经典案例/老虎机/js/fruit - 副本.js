require.config({
	baseUrl:'js/lib',
	paths:{
		app:'../app',
		jquery:'jquery-3.1.0.min',
		jquerymigrate:'jquery-migrate-3.0.0.min',
		jquerymobile:'jquery.mobile-1.4.5.min',
		velocity:'velocity-1.3.0.min',
		less:'less-3.0.0pre3.min',
	}
});

// require(['jquery','jquerymigrate','velocity','less','app/roll'],function($,jqm,vel,less,Roll){
// 	$(document).on('pagecreate','#fruit',function(){
// 		var roll1 = new Roll($('#roll_1'),{conSelector : '.con',itemSelector : '>li',active : 0,speed : 50});
// 		var roll2 = new Roll($('#roll_2'),{conSelector : '.con',itemSelector : '>li',active : 0,speed : 50});
// 		var roll3 = new Roll($('#roll_3'),{conSelector : '.con',itemSelector : '>li',active : 0,speed : 50});
		
// 		$('.fruit-pan p').click(function() {
// 			roll1.start(function(){
// 				console.log('1转完了');
// 			});
// 			// setTimeout(function(){
// 			// 	roll2.start(function(){
// 			// 		console.log('2转完了');
// 			// 	});
// 			// },500);
// 			// setTimeout(function(){
// 			// 	roll3.start(function(){
// 			// 		console.log('3转完了');
// 			// 	});
// 			// },1000);
// 		});

// 	});

// 	require(['jquerymobile']);
// });


require(['jquery','jquerymigrate','velocity','less'],function($){
	$(document).on('pagecreate','#fruit',function(){
		window.requestAnimFrame = (function () {
        	return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60)
                }
    	})();

    	//模拟ajax请求还可以参与抽奖机会的次数
    	var chance = 2;
    	$('.chance-tip span').text(chance);
    	if(!chance){
    		$('.fruit-pan p').css('color','#000').text('已结束');
    	}

    	var clicked = false;

		var $con1 = $('#roll_1 .con'),$con2 = $('#roll_2 .con'),$con3 = $('#roll_3 .con'),
       		itemH = $('#roll_3 .con>li').eq(0).height(),count = $('#roll_3 .con>li').length-1,
     		maxPos = count * itemH,ospeed = 1,og = 0.1,minSpeed = 1,
     		pos1 = 0,pos2 = 0,pos3 = 0,
    		speed1 = 0,g1=0,toEnd1 = false,maxSpeed1 = 15,end1 = false,
    		speed2 = 0,g2=0,toEnd2 = false,maxSpeed2 = 20,end2 = false,
    		speed3 = 0,g3=0,toEnd3 = false,maxSpeed3 = 25,end3 = false;

    	var resIndex1 = 0;resIndex2 = 1;resIndex3 = 1;
    	var resPos1=resIndex1*itemH,resPos2=resIndex2*itemH,resPos3=resIndex3*itemH;

		var pos1 = initPos($con1),pos2 = initPos($con2),pos3 = initPos($con3);

		function randomPos(){
			return Math.floor(Math.random()*count);
		}
        function initPos(item){
        	var pos = randomPos() * itemH;
           	item.css('transform','translateY(-'+ pos + 'px)');
           	item.css('webkitTransform','translateY(-'+ pos + 'px)');
        	return pos;
        }
      
		function start(item){
			switch(item[0].id){
				case 'con1':
					loop1();
					break;
				case 'con2':
					loop2();
					break;
				case 'con3':
					loop3();
					break;			
			}
		}

		function loop1(){
			move1();
			end1 || requestAnimFrame(loop1);
		}

		function loop2(){
			move2();
			end2 || requestAnimFrame(loop2);	
		}

		function loop3(){
			move3();
			end3 || requestAnimFrame(loop3);
		}

		function move1(){
			if(!toEnd1){
				if(speed1 >= maxSpeed1) g1 = -og;
				
				speed1 += g1;
				
				if(g1 <0 && speed1 < 1.1 * minSpeed){
					speed1 = minSpeed;
					toEnd1 = true;
				}

			}else{
				if(pos1 === Math.floor(resPos1)) end1 = true;			
			}

			pos1 += speed1;
			if(pos1 >= maxPos) pos1 = 0;
				
			$con1.css('transform','translateY(-'+ pos1 + 'px)');
           	$con1.css('webkitTransform','translateY(-'+ pos1 + 'px)');
		} 

		function move2(){
			if(!toEnd2){
				if(speed2 >= maxSpeed2) g2 = -og;
				
				speed2 += g2;
				
				if(g2 <0 && speed2 < 1.1 * minSpeed){
					speed2 = minSpeed;
					toEnd2 = true;
				}

			}else{
				if(end1 && pos2 === Math.floor(resPos2)) end2 = true;
			}

			pos2 += speed2;
			if(pos2 >= maxPos) pos2 = 0;
				
			$con2.css('transform','translateY(-'+ pos2 + 'px)');
           	$con2.css('webkitTransform','translateY(-'+ pos2 + 'px)');
		} 

		function move3(){
			if(!toEnd3){
				if(speed3 >= maxSpeed3) g3 = -og;
				
				speed3 += g3;
				
				if(g3 <0 && speed3 < 1.1 * minSpeed){ 
					speed3 = minSpeed;
					toEnd3 = true;
				}

			}else{
				if(end2 && pos3 === Math.floor(resPos3)){
					end3 = true;		
					$('.fruit-pan p').velocity({color:'#d95900'},{
						duration:1000,
						complete : function(){
							if(end1 && end2 && end3) clicked = false;
							if(!chance) $('.fruit-pan p').css('color','#000').text('已结束');
							checkReasult();
						}
					})
				} 
			}

			pos3 += speed3;
			if(pos3 >= maxPos) pos3 = 0;
				
			$con3.css('transform','translateY(-'+ pos3 + 'px)');
           	$con3.css('webkitTransform','translateY(-'+ pos3 + 'px)');
		}

		function checkReasult(){
			$('.mask').addClass('show');
			if(resIndex1 === 0 && resIndex2 === 0 && resIndex3 === 0){
				$('.greate').addClass('show').find('.result').text('一等奖');
			}else if(resIndex1 === 1 && resIndex2 === 1 && resIndex3 === 1){
				$('.greate').addClass('show').find('.result').text('二等奖');
			}else if(resIndex1 === 2 && resIndex2 === 2 && resIndex3 === 2){
				$('.greate').addClass('show').find('.result').text('三等奖');
			}else{
				$('.sorry').addClass('show');
			}
		}

		$('.fruit-pan p').click(function(){
			if(clicked) return;
			if(!chance) return;
			clicked = true;
			$('.chance-tip span').text(--chance);
			$(this).velocity({color:'#999'},{
				duration:1000,
				complete : function(){
					//初始化相关参数
					speed1 = speed2 = speed3 = ospeed;
					g1 = g2 = g3 = og;
					end1 = end2 = end3 = false;
					toEnd1 = toEnd2 = toEnd3 = false;

					//ajax模拟中奖情况
					var res = [2,2,2];
					resIndex1 = res[0];
					resIndex2 = res[1];
					resIndex3 = res[2];
					resPos1=resIndex1 * itemH;
					resPos2=resIndex2 * itemH;
					resPos3=resIndex3 * itemH;
					
					start($con1);
					setTimeout(function(){
						start($con2);
					},500);
					setTimeout(function(){
						start($con3);
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