define(['require', 'angular', 'components/com-funs', 'sethomework/sethomework.service', 'directives/com-directives'], function (require, ng, comfuns) {
    var module = ng.module('app.sethomework');
    module.controller('StatisticsCtrl', ['$scope', '$state', 'setHomeWorkSrv', 'ngDialog', 'toastr', '$rootScope', function ($scope, $state, setHomeWorkSrv, ngDialog, toastr, $rootScope) {
	    //$scope.title = '布置作业记录';

        $scope.vm = {
            token: window.localStorage.tch_token,
            tchwlogid:$state.params.tchwlogid,
	        pageindex: 1,
            pagesize:10
	    }

        $scope.listOptions = {
            goNextpage: _goNextpage,
            allpage: 0
        }

	    initialize();
	    function initialize() {

	        _getHomeStatistics();
	    }

	    function _goNextpage(pageindex) {
	        $scope.vm.pageindex = pageindex;
	        _getHomeStatistics();
	        //alert(pageindex);
	    }

        //作业统计 
	    function _getHomeStatistics() {
	        var params = {
	            Token: $scope.vm.token,
	            TchwLogID: $scope.vm.tchwlogid,
	            PageIndex: $scope.vm.pageindex,
	            PageSize: $scope.vm.pagesize

	        };
	        setHomeWorkSrv.getHomeStatistics(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.listOptions.allpage = result.data.pagecount;

	                $scope.vm.hwstatisticslist = result.data.hwstatisticslist;
	            }

	        });
	    }


	}])
});