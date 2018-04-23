define(['require', 'angular', 'components/moduleExtras', 'layout/app-layout.router', 'pagination'], function (require, ng, moduleExtras, routersCfg) {
	var module = angular.module('app.layout',['ui.router']);
	moduleExtras.call(module,routersCfg);
	return module;
});