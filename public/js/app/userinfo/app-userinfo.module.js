define(['require', 'angular', 'ngload', 'userinfo/app-userinfo.router', 'components/moduleExtras', 'pagination', 'ng-img-crop', ], function (require, ng, ngload, routerCfg, moduleExtras) {
    var module = angular.module('app.userinfo', ['ui.router', 'ngImgCrop']);
	moduleExtras.call(module,routerCfg);
	return module;
})