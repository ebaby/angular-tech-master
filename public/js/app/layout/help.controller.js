define(['require','angular','directives/com-directives','layout/main.service'],function(require,ng){
	var module = ng.module('app.layout');
	module.controller('HelpCtrl', ['$scope', '$state', 'mainSrv', 'ngDialog', 'toastr', function ($scope, $state, mainSrv, ngDialog, toastr) {
		$scope.vm = {
		    tabindex: 0,
		    checked:false
		}
        
		$scope.selectTab = _selectTab;

		function _selectTab(tabIndex) {
		    if ($scope.vm.tabindex == tabIndex) {
		        $scope.vm.tabindex = tabIndex;
		        $scope.vm.checked = !$scope.vm.checked;
		    } else {
		        $scope.vm.tabindex = tabIndex;
		        $scope.vm.checked = false;
		    }
		}
		
		
	}])
});