define(['require','angular','ngload','classmanage/app-classmanage.router','components/moduleExtras'],function(require,ng,ngload,routerCfg,moduleExtras){
	var module = angular.module('app.classmanage',['ui.router']);
	moduleExtras.call(module,routerCfg);
	return module;
})