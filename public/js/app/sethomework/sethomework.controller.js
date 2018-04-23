define(['require','angular'],function(require,ng){
	var module = ng.module('app.sethomework');
	module.controller('SetHomeworkCtrl', ['$scope', function($scope){
		$scope.title = '布置作业';
	}])
});