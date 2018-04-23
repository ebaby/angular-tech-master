define(['require', 'angular', 'ngload', 'checkhomework/app-checkhomework.router', 'components/moduleExtras', 'pagination'], function (require, ng, ngload, routerCfg, moduleExtras) {
	var module = angular.module('app.checkhomework',['ui.router']);
	moduleExtras.call(module,routerCfg);
	return module;
})