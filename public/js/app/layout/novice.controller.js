define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'layout/main.service'], function (require, ng, comfuns) {
	var module = ng.module('app.layout');
	module.controller('NoviceCtrl', ['$scope', '$state', 'mainSrv', 'ngDialog', 'toastr', function ($scope, $state, mainSrv, ngDialog, toastr) {
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        tabindex: 0,
	        checked: false,
	        tipsindex: -1,
	        classInfoItems:[]
	    }

	    $scope.selectTab = _selectTab;
	    $scope.selectTips = _selectTips;
	    $scope.closeTips = _closeTips;
	    $scope.toInt32 = _toInt32;
	    $scope.setUserGuidance = _setUserGuidance;

	    initialize();
	    function initialize() {
	        
	        _getTeacherClasslist();
	        _getCheckList();
	    }

        //获取班级列表
	    function _getTeacherClasslist() {
	        var params = {
	            Token: $scope.vm.token,
	            Type: 1,//-1：全部，0：不显示，1：显示
	        }
	        mainSrv.getTeacherClasslist(params).then(function (result) {
	            if (result.code === 0) {
	               
	                $scope.vm.classInfoItems = result.data;	                    
	                $scope.vm.currentclassinfo = result.data[0];

	            }
	        });


	    }

	    function _selectTab(tabIndex) {
	        if ($scope.vm.tabindex == tabIndex) {
	            $scope.vm.tabindex = tabIndex;
	            $scope.vm.checked = !$scope.vm.checked;
	        } else {
	            $scope.vm.tabindex = tabIndex;
	            $scope.vm.checked = false;
	        }
	        
	    }

	    function _selectTips(tipsIndex){
	        $scope.vm.tipsindex = tipsIndex;
	    }
		
	    function _closeTips() {
	        $scope.vm.tipsindex = -1;
	    }

	    //获取作业列表
	    function _getCheckList() {
	        var params = {
	            Token: $scope.vm.token,
	            PageIndex: 1,
	            Type: 0,
	            PageSize: 1,
	            CheckType: 0,
	            ClassID: 0,
	        };

	        mainSrv.getCheckList(params).then(function (result) {
	            if (result.code === 0) {
	                
	                $scope.vm.inteacherarrangelist = result.data.inteacherarrangelist;
	                $scope.vm.currrenthomework = result.data.inteacherarrangelist[0];


	            } 

	        });
	    }

	    function _toInt32(str)
	    {
	        if (isNaN)
	            return parseInt(str);
	        else
	            return 0;
	    }

	    

	    //设置指导页已经查看 -- 我会用易师啦
	    function _setUserGuidance() {
	        var params = {
	            Token: $scope.vm.token,
	            SetCheckPageFunctionList: [{ FeaturesPageCode: '0301' }, { FeaturesPageCode: '0601' }]

	        }
	        mainSrv.setUserGuidance(params).then(function (result) {
	            if (result.code === 0) {
	                $state.go('app');

	            } 
	        });
	    }
		
	}])
});