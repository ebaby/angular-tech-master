define(['require', 'angular', 'components/com-funs', 'layout/header.service'], function (require, ng, comfuns) {
	var module = ng.module('app.layout');
	module.controller('HeaderCtrl', ['$scope', '$state', 'headerSrv', '$rootScope', 'toastr', 'ngDialog', '$timeout', function ($scope, $state, headerSrv, $rootScope, toastr, ngDialog, $timeout) {
	    
	    $scope.vm = {
	        token:window.localStorage.tch_token,
			tabindex:-1,
			childindex: 0,
			pageindex:1,
			pagesize: 6,
			allpage: 0
		}
		$scope.commentDialog = _commentDialog;
		$scope.closeDialog = _closeDialog;
		$scope.goToCredit = _goToCredit;
		$scope.setBaseinfo = _setBaseinfo;
		$scope.teacherLoginOutDialog = _teacherLoginOutDialog;
		$scope.teacherLoginOut = _teacherLoginOut;
		$scope.setTeachersMessageRecordRead = _setTeachersMessageRecordRead;
		        
		//$rootScope.uinfo = {name:"123"};  
		$rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {

            //alert(fromState.name + "===" + toState.name);
            $("body, html").animate({ scrollTop: 0 }, 0);
            if (toState.name == "app.checkhomework.unalreadyhw.undetail" || toState.name == "app.checkhomework.alreadyhw.result" || toState.name == "app.checkhomework.alreadyhw.detail") {
                $("#sidebar").css("display", "none");
            } else {
                $("#sidebar").css("display", "block");
            }

            ngDialog.closeAll();
            _getTeacherInfo(true);
            //var indexobj = getTabindex(toState.name);
            //if (indexobj) {
            //    _selectTab(indexobj.tabindex, indexobj.childindex, true);
            //}
            //console.log(toState);
        });


		//$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		//    $timeout(function () {
		//        $("#aboutfoot").hide();
		//    }, 1000);
		    
		//       fullScreen(toState);
	    //})


		initialize();
		function initialize(){
			//var initindex = getTabindex();
			//if(typeof(initindex.tabindex)!=='undefined'){
			//	$scope.selectTab(initindex.tabindex,initindex.childindex);
			//}
		    
			_getTeacherInfo();
			_getTeachersMessageRecordList();

		}
		function _closeDialog() {
		    ngDialog.closeAll();
		}
		function _commentDialog() {
		    ngDialog.open({
		        template: window.globalConfig.appPath + 'layout/messagedialog.html',
		        className: 'ngdialog-theme-default',
		        width: 800,
		        height: 200,
		        //plain: true,
		        scope: $scope
		    });
		}
        //批改作业时全屏
		function fullScreen(tostate) {
		    if (tostate.name == 'app.checkhomework.unalreadyhw.undetail' || tostate.name == 'app.checkhomework.alreadyhw.detail' || tostate.name == 'app.checkhomework.alreadyhw.result') {
		        $scope.vm.headershow = true;
		        
		    } else {
		        $scope.vm.headershow = false;
		    }
		}		

		function _setBaseinfo(notab){
		    $scope.vm.tabindex = notab;
		    $state.go('app.userinfo', {}, {reload:true});
		    //$state.reload('app.userinfo');
		}
		function _goToCredit() {
		    $scope.vm.tabindex = -2;
		    $state.go('app.userinfo.credit', {}, { reload: true });

		}

		//获取教师信息
		function _getTeacherInfo(statechange) {
		    var params = {
		        Token: $scope.vm.token,
		    };
		    headerSrv.getTeacherInfo(params).then(function (result) {
		        if (result.code === 0 && !statechange) {
		            //var data=result.data[0];
		            $rootScope.teacherinfo = result.data;
		            $rootScope.teacherinfo.sex = $.trim($rootScope.teacherinfo.sex);
		            //$scope.vm.base = data;
		            //$scope.vm.base = angular.copy($scope.base);
		            //console.log($rootScope.teacherinfo);

		        }
		        //else if (result.status === 512) {
		        //    window.location.href = "/static/index.html";
		        //}

		        //console.log(result.data)
		    });

		}

	    //注销
		function _teacherLoginOutDialog() {
		    var nestedConfirmDialog = ngDialog.openConfirm({
		        template:
                        '<div style="padding:1em;">' +
                        '<p>是否注销?</p>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消</button>' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="teacherLoginOut()">确定</button>' +
                        '</div>' +
                        '</div>',
		        plain: true,
		        width: 400,
		        scope: $scope,
		        className: 'ngdialog-theme-default',
		    });
		}
		function _teacherLoginOut() {
		    var params = {
		        Token: $scope.vm.token,

		    };
		    headerSrv.teacherLoginOut(params).then(function (result) {
		        if (result.code === 0) {
		            window.localStorage.tch_token = null;
		            
		            window.location.href = window.globalConfig.platformurl;

		        } 
		    });
		}

	    //$scope.listOptions = {
	    //    goNextpage: _goNextpage,
	    //    allpage:0
	    //}

	    function _goNextpage(pageindex) {
	        $scope.vm.pageindex = pageindex;
	        _getTeachersMessageRecordList();
	    }

	    //获取教师消息记录
	    function _getTeachersMessageRecordList() {
	        //$scope.vm.pageindex = $scope.vm.pageindex + 1;
	        var params = {
	            Token: $scope.vm.token,

	        };
	        //if ($scope.vm.allpage != 0 && $scope.vm.pageindex > $scope.vm.allpage) {
	        //    $scope.vm.pageindex = $scope.vm.allpage;
	        //    return;
	        //}
	        headerSrv.getTeachersMessageRecordList(params).then(function (result) {
	            if (result.code === 0) {
	                //$scope.listOptions.allpage = result.data[0].allpage;
	                $scope.vm.teachermessagelist = result.data;

	                //if (!$scope.vm.teachermessagelist) {
	                //    $scope.vm.teachermessagelist = [];
	                //}
	                var count = 0;
	                angular.forEach(result.data, function (dp, index) {
	                    if (dp.readstatus === 0) {
	                        count += 1;
	                    }
	                });
	                $scope.vm.messagecount = count;

	            }
	        });
	    }

	    //设置教师消息记录已阅读
		function _setTeachersMessageRecordRead(teacher) {
		    if (teacher.readstatus == 0) {
		        var params = {
		            MIDs: [parseInt(teacher.msgid)],
		            Token: $scope.vm.token,
		        };
		        headerSrv.setTeachersMessageRecordRead(params).then(function (result) {
		            if (result.code === 0) {

		                teacher.readstatus = 1;

		                $scope.vm.messagecount -= 1;
		                toastr.success('消息已阅', '');
		            }
		        });
		    } else {
		        toastr.warning('消息已阅', '');
		    }
		}


		
	}])
});