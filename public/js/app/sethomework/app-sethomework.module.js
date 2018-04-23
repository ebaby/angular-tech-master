define(['require', 'angular', 'ngload', 'sethomework/app-sethomework.router', 'components/moduleExtras', 'pagination'], function (require, ng, ngload, routerCfg, moduleExtras) {
	var module = angular.module('app.sethomework',['ui.router']);
	moduleExtras.call(module,routerCfg);
	return module;
})