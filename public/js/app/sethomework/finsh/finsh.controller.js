define(['require', 'angular', 'sethomework/sethomework.service', 'directives/com-directives'], function (require, ng) {
    var module = ng.module('app.sethomework');
    module.controller('FinshCtrl', ['$scope', '$state', 'setHomeWorkSrv', 'ngDialog', 'toastr', function ($scope, $state, setHomeWorkSrv, ngDialog, toastr) {
	    //$scope.title = '布置作业记录';
        
	    //$scope.vm = {
	    //    pageindex: 1,
	    //    pagesize: $state.params.pagesize
	    //}
	    $scope.goToHwLog = _goToHwLog;

	    //initialize();
	    //function initialize() {

	    //    _getCheckList();
	    //}

	    //function _getCheckList() {
	    //    var params = {
	    //        page: $scope.vm.pageindex,
	    //        type: 2,
	    //        num: $scope.vm.pagesize
	    //    }
	    //    setHomeWorkSrv.getCheckList(params, '').then(function (result) {
	    //        if (result.status === 200) {
	                
	    //            $scope.vm.pigailist = result.data[0].pigailist;

	    //            $scope.vm.totalcount = parseInt($scope.vm.pigailist[0].weijiao) + parseInt($scope.vm.pigailist[0].wpg) + parseInt($scope.vm.pigailist[0].yijiao) + parseInt($scope.vm.pigailist[0].ypg);
	                
	    //            var arry = new Array();
	    //            angular.forEach(result.data[0].pigailist, function (o, i) {
	    //                var temp = { gradename: o.gradename, classname: o.classname };	                    
	    //                arry.push(temp);
	    //            });

	    //            $scope.vm.classlist = unique(arry);
	                

	    //        }
	    //    });
	    //}

	    //function unique(arr) {
	    //    var result = [], hash = {};
	    //    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
	    //        if (!hash[elem]) {
	    //            result.push(elem);
	    //            hash[elem] = true;
	    //        }
	    //    }
	    //    return result;
	    //}

        //布置作业记录
	    function _goToHwLog() {

	        $state.go('app.sethomework.sethwlog', {});
	    }


	}])
});