define(['require','angular','components/moduleExtras'], function(require,ng,moduleExtras) { 
	var module=angular.module('app.utils',[]);
	//如果该模块是在app.js初始化加载，属于动态加载行为，必须重新初始化controller/filter/factory等服务；
	//否则找不到相应服务，也可以在每个模块中单独配置；
	moduleExtras.call(module);
	return module;
});