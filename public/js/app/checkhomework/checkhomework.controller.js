define(['require','angular'],function(require,ng){
	var module = ng.module('app.checkhomework');
	module.controller('CheckHomeworkCtrl', ['$scope', function($scope){
		$scope.title = '布置作业';
		$scope.vm = {

		}
		$scope.alreadyhw = {

		}
		$scope.unalreadyhw = {
			
		}
		$scope.corrrect = {

		}

		//已批该作业
		$scope.checkOutques = _checkOutques;
		function _checkOutques(){}

		//未批改作业
		
		
		//批改小结
	}])
});