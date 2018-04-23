define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'userinfo/userinfo.service'], function (require, ng, comfuns) {
	var module = ng.module('app.userinfo');
	
	module.controller('UpdHeadImgCtrl', ['$scope', '$rootScope', 'userinfoSrv', 'toastr',  function ($scope, $rootScope, userinfoSrv, toastr) {
	    //$scope.title = '修改头像';
	    $scope.obj = { src: "", selection: [], thumbnail: true };
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        selectedpic:false,
	    }

	    $scope.size = 'small';
	    $scope.type = 'circle';
	    $scope.imageDataURI = '';
	    $scope.resImageDataURI = '';
	    $scope.resImgFormat = 'image/png';
	    $scope.resImgQuality = 1;
	    $scope.selMinSize = 100;
	    $scope.resImgSize = 200;

	    //$scope.imgOptions = {
	    //    uploadImg: _uploadImg
	    //}

	    //$scope.uploadImgDialog = _uploadImgDialog;

	    
	    //$scope.saveBaseInfo = _saveBaseInfo;
	    $scope.uploadImage = _uploadImage;
	    $scope.handleFileSelect = _handleFileSelect;

        //裁切图片
	    function _handleFileSelect(evt) {
	        var file = evt.currentTarget.files[0];
	        var reader = new FileReader();
	        reader.onload = function (evt) {
	            $scope.$apply(function ($scope) {
	                $scope.imageDataURI = evt.target.result;
	            });
	        };
	        reader.readAsDataURL(file);

	        $scope.vm.selectedpic = true;
	    };

	    $scope.onChange = function ($dataURI) {
	        //console.log('onChange fired');
	    };
	    $scope.onLoadBegin = function () {
	        //console.log('onLoadBegin fired');
	    };
	    $scope.onLoadDone = function () {
	        //console.log('onLoadDone fired');
	    };
	    $scope.onLoadError = function () {
	        //console.log('onLoadError fired');
	    };
        
        //上传文件
	    function _uploadImage() {
	        if ($scope.vm.selectedpic) {

	            var formData = new FormData();

	            formData.append("file", comfuns.dataURLtoBlob($scope.resImageDataURI), $scope.vm.token + new Date().getTime() + '.png');
	            formData.append("useof", "IMG_TEA_HEAD");


	            $.ajax({
	                url: globalConfig.uploadPath,
	                type: 'POST',
	                data: formData,
	                // 告诉jQuery不要去处理发送的数据
	                processData: false,
	                // 告诉jQuery不要去设置Content-Type请求头
	                contentType: false,
	                beforeSend: function () {
	                    console.log("正在进行，请稍候");
	                },
	                success: function (responseStr) {
	                    if (responseStr.Code === 0) {

	                        _saveBaseInfo(responseStr.Data);

	                        //console.log("成功" + responseStr);
	                    } else {
	                        console.log("失败");
	                    }
	                },
	                error: function (responseStr) {
	                    console.log("error");
	                }
	            });



	        } else {
	            toastr.error('请先选择图片', '');
	        }
	    }

	    //保存教师头像
	    function _saveBaseInfo(url) {
	        
	        var params = {
	            HeadPicUrl: url,//$('#imgurl').attr('src'),
	            Token: $scope.vm.token,
	        };
	        userinfoSrv.saveBaseInfo(params).then(function (result) {
	            if (result.code === 0) {
	                $rootScope.teacherinfo.headpic = url;


	                toastr.success('修改成功', '');
	            }
	        });

	    }


	}]);
});