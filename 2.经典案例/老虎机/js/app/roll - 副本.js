define(['jquery'],function($){
    var _this = null;
    var Roll = function(container,opts,fn){
        this.$container = container;
        this.$con = this.$container.find(opts.conSelector),
        this.$item = this.$con.find(opts.itemSelector),
        this.active = opts.active;
        this.speed = opts.speed;
        this.itemH = this.$item.eq(0).height();
        this.cout = this.$item.length;
        this._init(fn);
    }
    Roll.prototype = {
        _init : function(fn){
           var num = this._randomPos();
           this.$con.css('margin-top',-num*this.itemH);
           _this = this;
           fn(_this);
           //return this;
        },
        _randomPos : function(){
            return Math.floor(Math.random()*this.cout);
        },
        _getActive : function(){
            return this.$container.find('li.active').index();
        },
        _move : function(){
            console.log(this.$con[0]);
            var top = this.$con.css('margin-top');
            // if(top <= -this.cout*this.itemH){
            //     this.$con.css('margin-top',0);
            // }
            // top -= 10;
            this.$con.css('margin-top',-2*this.itemH);
        },
        start : function(fn){
            this.loop();
            //fn && fn();
        },
        loop : function(){
            _this._move();

            setTimeout(_this.loop,_this.speed);
        }

    };
    Roll.init = function(container,opts,fn){
        var me = this;
        container.each(function(){
            new me($(this),opts,fn);
        });
    };
    return Roll;
});