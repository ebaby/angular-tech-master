define(['require','angular','components/moduleExtras'], function(require,ng,moduleExtras) { 
	var module = angular.module('app.directives',[]);
	moduleExtras.call(module);
	return module
});