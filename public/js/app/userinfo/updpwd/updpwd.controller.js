define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'userinfo/userinfo.service'], function (require, ng, comfuns) {
	var module = ng.module('app.userinfo');
	
	module.controller('UpdPasswordCtrl', ['$scope', 'userinfoSrv', 'toastr', '$rootScope', function ($scope, userinfoSrv, toastr, $rootScope) {
		//$scope.title = '修改密码';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        msgstatus: 0,
	        //errormsg: '',
	        //succmsg:''
	        pwdold: '',
	        pwd: '',
	        pwdconfirm: '',
	        verificationcode: '',
	        verifycode: '',
	    }

	    $scope.refresh = _refresh;

		var rootHandle = $rootScope.$watchCollection('teacherinfo', function (newvalue, oldvalue) {
		    if (newvalue) {
		        $scope.vm.teacherinfo = $rootScope.teacherinfo;
		        _refresh();

		        rootHandle();
		    }

		});
		$scope.pwdReg = /^[A-Za-z0-9]+$/;

		$scope.keyDown = _keyDown;
		$scope.updPwd = _updPwd;

		function _updPwd(isValid) {
		    $scope.vm.submitted = true;
		    if (!isValid) return false;

		    if (_filterChart($scope.vm.pwd)) {
		        toastr.error('密码不允许含有特殊字符', '');
                return false;
		    }

		    if ($scope.vm.pwd != $scope.vm.pwdconfirm) {
		        return false;
		    } else {
		        var params = {
		            Token: $scope.vm.token,
		            Mobile: $scope.vm.teacherinfo.mobile,
		            PwdOld: $scope.vm.pwdold,
		            PwdNew: $scope.vm.pwd,
		            VerificationCode: $scope.vm.verificationcode,
		            SessionID: $scope.vm.guid,

		        }//setteacherpassword  
		        userinfoSrv.setTeacherPassword(params).then(function (result) {
		            if (result.code === 0) {
		                toastr.success('修改成功', '');
		                //$scope.vm.msgstatus = 2;
		                //$scope.vm.succmsg = '修改成功';
		            }
		        });
		    }
            		    
			
		}

		function _keyDown($event) {
		    $scope.vm.msgstatus = 0;
		}

		function _refresh() {
		    var guid = window.commfuns.uuid.generate();
		    var imgurl = window.globalConfig.curl + "?sessionid=" + guid + "&codetype=17&timestamp=" + (new Date()).getTime();

		    $scope.vm.verifycode = imgurl;
		    $scope.vm.guid = guid;
		}

		function _filterChart(str) {
		    var reg = /[~#^$@%&!?+=:;'"!{},<>*]/gi.test(str);
		    return reg;
		}


	}]);
});