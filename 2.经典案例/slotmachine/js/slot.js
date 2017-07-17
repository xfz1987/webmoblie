//定义requestAnimationFrame
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback){window.setTimeout(callback, 1000 / 60);};
})();
//老虎机运行类
(function(){
	var Slot = function(el, pics){
		if(this instanceof Slot){
			this.el = el;
			this.ctx = el.getContext('2d');
			this.width = el.width;
			this.height = el.height;
			this.reel_w = Math.ceil(this.width/3);
			this.pics = pics;
			this.images = [undefined,undefined,undefined];
			this.maxSpeed = 30;
			this.up = 0.2;
			this.down = 0.2;
			this.result = [undefined, undefined, undefined];
			this.ended = false;
			this.timeout = 
			this.frame = this.maxSpeed/this.down;//150
			this.distance = this.down * this.frame * this.frame / 2 + 75;//2325
			this.hit = this.distance % (this.height * 3) - this.height;//-75
			this.reels = [
				{
					v: 0,complete:false,grids: [{index :0,pos: {x:0,y:0}},{index: 1,pos: {x:0,y:this.height}},{index: 2,pos: {x:0,y:2*this.height}}]
				},
				{
					v: 0,complete:false,grids: [{index :1,pos: {x:this.reel_w,y:0}},{index: 2,pos: {x:this.reel_w,y:this.height}},{index: 0,pos: {x:this.reel_w,y:2*this.height}}]
				},
				{
					v: 0,complete:false,grids: [{index :2,pos: {x:2*this.reel_w,y:0}},{index: 0,pos: {x:2*this.reel_w,y:this.height}},{index: 1,pos: {x:2*this.reel_w,y:2*this.height}}]
				}
			];
			this._init();
		}else{
			return new Slot(el, pics);
		}
	};
	Slot.prototype = {
		_init: function(){
			var _this = this,count = 0;
			for(var i=0,len=_this.pics.length;i<len;i++){
				(function(index){
					var image = new Image();
					image.src = _this.pics[index];
					image.onload = function(){
						_this.images[index] = image;
						count++;
						count === 3 && _this.render();
					};
				})(i);
			}
		},
		render: function(){
			for(var i=0,len=this.reels.length;i<len;i++){
				var v = this.reels[i].v,grids = this.reels[i].grids;
				for(var j=0,len1=grids.length;j<len1;j++){
					var pos = grids[j].pos,index = grids[j].index;
					this.ctx.drawImage(this.images[index],pos.x,pos.y);
				}
			}
		},
		start: function(callback){
			var _this = this;
			loop();
			function loop(){
				update();
				_this.ended || requestAnimFrame(loop);
			}
			function update(){
				//判断是否可以停止
				if(_this.checkComplete()){
					_this.ended = true;
					var txt1,txt2 = '请联系您身边的华夏理财顾问领奖';
					switch(_this.result[0]){
						case 0:
							txt1 = '一';
							txt2 = '您需本人<br>持身份证到公司领取';
							break;
						case 1:
							txt1 = '二';
							break;
						case 2:
							txt1 = '三';
							break;
					}
					callback && callback('恭喜您中得' + txt1 + '等奖项', txt2);
				}
				_this.ctx.clearRect(0,0, _this.width,_this.height);
				for(var i=0,len=_this.reels.length;i<len;i++){
					var v = _this.reels[i].v,grids = _this.reels[i].grids;					
					if(_this.result[i] !== undefined){
						v = v<=0 ? 0 : v-_this.down;
						if(v == 0){
							_this.reels[i].complete = true;
						}
					}else{
						v = v>=_this.maxSpeed ? _this.maxSpeed : v+_this.up;
					}
					_this.reels[i].v = v;
					for(var j=0,len1=grids.length;j<len1;j++){
						var x = grids[j].pos.x,y = grids[j].pos.y,index = grids[j].index;
						y += v;
						var b = y - _this.height;
						if(b >= 0) y = b - _this.height*2;
						grids[j].pos.y = y;
					}
				}
				_this.render();
			}
		},
		checkComplete: function(){
			var count = 0;
			for(var i=0,len=this.reels.length;i<len;i++){
				if(this.reels[i].complete) count++;
			}
			return count===3 ? true : false;
		},
		calcHit: function(row, prize){
			var grid = this.reels[row].grids,curIndex;
			for(var i=0,len=grid.length;i<len;i++){
				if(grid[i].index === prize){
					curIndex = i;
					grid[i].pos.y = this.hit;
					grid[(i+1)%3].pos.y = (this.hit + this.height) > 2*this.height ? (this.hit - 2*this.height) : (this.hit + this.height);
					grid[(i+2)%3].pos.y = (this.hit + 2*this.height) > 2*this.height ? (this.hit - this.height) : (this.hit + 2*this.height);
					break;
				}
			}
		},
		toEnd: function(prize, time){
			var _this = this;
			var _time = time > 5000 ? 0 : 5000;
			setTimeout(function(){
				_this.calcHit(0,prize);
				_this.result = [prize, undefined, undefined];
				setTimeout(function(){
					_this.calcHit(1,prize);
					_this.result = [prize, prize, undefined];
				}, 1000);
				setTimeout(function(){
					_this.calcHit(2,prize);
					_this.result = [prize, prize, prize];
				}, 2000);
			}, _time);
		}
	};
	window['Slot'] = Slot;
})();