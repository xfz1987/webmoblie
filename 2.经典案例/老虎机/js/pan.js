requirejs.config({
	baseUrl:'js/lib',
	paths:{
		app:'../app',
		jquery:'jquery-3.1.0.min',
		jquerymigrate:'jquery-migrate-3.0.0.min',
		// jqueryrequest:'jquery.requestAnimationFrame-0.1.3pre.min',
		jquerymobile:'jquery.mobile-1.4.5.min',
		velocity:'velocity-1.3.0.min',
		less:'less-3.0.0pre3.min'
	},
	map:{
        '*':{
            css:'require-css-0.1.6.min'
        }
	},
	shim:{
		jquerymobile:{deps:['css!../../css/jquery.mobile-1.4.5.min.css']}
	}
});

requirejs(['jquery','less'],function($){
	requirejs(['app/pan']);

	
	require(['jquerymobile']);
});