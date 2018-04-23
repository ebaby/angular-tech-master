define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'userinfo/userinfo.service'], function (require, ng, comfuns) {
	var module = ng.module('app.userinfo');
	
	module.controller('CertificateCtrl', ['$scope', 'userinfoSrv', 'toastr', 'ngDialog', '$rootScope', function ($scope, userinfoSrv, toastr,ngDialog, $rootScope) {
		$scope.title = '认证信息';

		$scope.vm={
			pwdold:'',
			pwd:'',
			verificationcode:''

		}
		$scope.openDialog = _openDialog;
		var rootHandle = $rootScope.$watchCollection('teacherinfo', function (newvalue, oldvalue) {
		    if (newvalue) {
		        $scope.vm.teacherinfo = $rootScope.teacherinfo;
		        rootHandle();
		    }

		})

		//教师资格认证
		$scope.teachAuth =_teachAuth;
		function _teachAuth(){
			
			var params = {
				

			}
			userinfoSrv.teachAuth(params).then(function (result) {
        		if(result.code===0)
        			toastr.success('修改成功', '');
        		
      		});
			
		}
		function _openDialog() {
		    var nestedConfirmDialog = ngDialog.openConfirm({
		        template:
                        '<div style="padding:1em;">' +
                        '<p>验证未开通，你可以联系我们：</p>' +
                        '<p>电话：010-84671595转80</p>' +
                        '<p>邮箱：doyin1018@163.com</p>' +
                        '<div class="ngdialog-buttons">' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">确定</button>' +
                        '</div>' +
                        '</div>',
		        plain: true,
		        width: 400,
		        scope: $scope,
		        className: 'ngdialog-theme-default',
		    });
		}
		//教师邮箱认证
		$scope.emailAuth =_emailAuth;
		function _emailAuth(){
			
			var params = {
				

			}
			userinfoSrv.emailAuth(params).then(function (result) {
        		if(result.code===0)
        			toastr.success('修改成功', '');
        		
      		});
			
		}

		//教师手机认证
		$scope.phoneAuth =_phoneAuth;
		function _phoneAuth(){
			
			var params = {
				

			}
			userinfoSrv.phoneAuth(params).then(function (result) {
        		if(result.code===0)
        			toastr.success('修改成功', '');
        		
      		});
			
		}
	}]);
});