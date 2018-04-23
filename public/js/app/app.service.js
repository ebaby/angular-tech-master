define(['require','angular'], function(require,ng) { 
	var srv=angular.module('app.service',[])
    .config([
			'$controllerProvider',
			'$compileProvider',
			'$filterProvider',
			'$provide',
			function( $controllerProvider, $compileProvider, $filterProvider, $provide){
				srv.controller = $controllerProvider.register;
				srv.directive  = $compileProvider.directive;
				srv.filter     = $filterProvider.register;
				srv.factory    = $provide.factory;
				srv.service    = $provide.service;
			}
    ]); 
	return srv;
});
