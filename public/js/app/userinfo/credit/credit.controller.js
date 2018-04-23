define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'userinfo/userinfo.service'], function (require, ng, comfuns) {
	var module = ng.module('app.userinfo');
	
	module.controller('CreditCtrl', ['$scope', 'userinfoSrv', 'toastr', '$rootScope', 'ngDialog', function ($scope, userinfoSrv, toastr, $rootScope, ngDialog) {
		//$scope.title = '积分累积';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
		    pageindex: 1,
            pagesize:10,
		    tabindex: 0,
		}

		$scope.hdlistOptions = {
		    goNextpage: _goNextpageHd,
		    allpage: 0
		}
		$scope.splistOptions = {
		    goNextpage: _goNextpageSp,
		    allpage: 0
		}
		$scope.jllistOptions = {
		    goNextpage: _goNextpageJl,
		    allpage: 0
		}

		initialize();
		function initialize() {
		    
		    _getTeacherIntegral();
		}

		//var rootHandle = $rootScope.$watchCollection('teacherinfo', function (newvalue, oldvalue) {
		//    if (newvalue) {
		//        $scope.vm = $rootScope.teacherinfo;
		//        rootHandle();
		//    }

	    //})

		function _goNextpageHd(pageindex) {
		    $scope.vm.pageindex = pageindex;
		    _getTeacherIntegral();
		    //alert(pageindex);
		}

		function _goNextpageSp(pageindex) {
		    $scope.vm.pageindex = pageindex;
		    _getTeacherIntegralCanBuyProductList();
		    //alert(pageindex);
		}

		function _goNextpageJl(pageindex) {
		    $scope.vm.pageindex = pageindex;
		    _getTeacherIntegralBuyProductList();
		    //alert(pageindex);
		}

		$scope.getTeacherIntegral = _getTeacherIntegral;
		$scope.selectTab = _selectTab;
		$scope.buyDialog = _buyDialog;
		$scope.teacherBuyIntegralProduct = _teacherBuyIntegralProduct;


        //获得记录
		function _getTeacherIntegral() {
		    //console.log($scope.vm.mobilephone);
			var params = {
			    PageIndex: $scope.vm.pageindex,
			    PageSize: $scope.vm.pagesize,
			    Token: $scope.vm.token,
			}//setteacherpassword  
			userinfoSrv.getTeacherIntegral(params).then(function (result) {
			    if (result.code === 0) {
			       
			        $scope.vm.integralhistroy = result.data.integralhistroylist;
			        $scope.vm.integralsorce = result.data.integralscore;
			        $scope.hdlistOptions.allpage = result.data.pagecount;
			        //$scope.vm.classidlist = result.data[0].classidlist;
			        //$scope.vm.pigailist = result.data[0].pigailist;
			        if ($scope.vm.integralhistroy.length < 3) {

			            $scope.vm.classindex = 6;
			        } else {
			            $scope.vm.classindex = 12 / $scope.vm.integralhistroy.length;
			            if ($scope.vm.classindex < 3) {
			                $scope.vm.classindex = 3;
			            }
			        }

			        //angular.forEach($scope.vm.integralhistroy, function (i, j) {
			        //    angular.forEach($scope.vm.colorItems, function (k, l) {

			        //        if (j === l) {

			        //            i.bgcolor = k;
			        //            return false;
			        //        }

			        //    });

			        //});

			    } 
      		});
			
		}

	    //兑换记录
		function _getTeacherIntegralBuyProductList() {
		    //console.log($scope.vm.mobilephone);
			var params = {
			    PageIndex: $scope.vm.pageindex,
			    PageSize: $scope.vm.pagesize,
		        Token: $scope.vm.token,
			}//setteacherpassword  
			userinfoSrv.getTeacherIntegralBuyProductList(params).then(function (result) {
			    if (result.code === 0) {
			       
			        $scope.vm.convertproductlist = result.data.convertproductlist;
			        //$scope.vm.integralsorce = result.data[0].integralsorce;
			        $scope.jllistOptions.allpage = result.data.pagecount;
			        //$scope.vm.classidlist = result.data[0].classidlist;
			        //$scope.vm.pigailist = result.data[0].pigailist;
			        if ($scope.vm.convertproductlist.length < 3) {

			            $scope.vm.classindex = 6;
			        } else {
			            $scope.vm.classindex = 12 / $scope.vm.convertproductlist.length;
			            if ($scope.vm.classindex < 3) {
			                $scope.vm.classindex = 3;
			            }
			        }

			        //angular.forEach($scope.vm.convertproductlist, function (i, j) {
			        //    angular.forEach($scope.vm.colorItems, function (k, l) {

			        //        if (j === l) {

			        //            i.bgcolor = k;
			        //            return false;
			        //        }

			        //    });

			        //});

			    } 
      		});
			
		}

	    //兑换商品列表
		function _getTeacherIntegralCanBuyProductList() {
		    //console.log($scope.vm.mobilephone);
			var params = {
			    PageIndex: $scope.vm.pageindex,
			    PageSize: $scope.vm.pagesize,
			    Token: $scope.vm.token,
			}//setteacherpassword  
			userinfoSrv.getTeacherIntegralCanBuyProductList(params).then(function (result) {
			    if (result.code === 0) {
			       
			        $scope.vm.productlist = result.data.productlist;
			        //$scope.vm.integralsorce = result.data[0].integralsorce;
			        $scope.splistOptions.allpage = result.data.pagecount;
			        //$scope.vm.classidlist = result.data[0].classidlist;
			        //$scope.vm.pigailist = result.data[0].pigailist;
			        if ($scope.vm.productlist.length < 3) {

			            $scope.vm.classindex = 6;
			        } else {
			            $scope.vm.classindex = 12 / $scope.vm.productlist.length;
			            if ($scope.vm.classindex < 3) {
			                $scope.vm.classindex = 3;
			            }
			        }

			        //angular.forEach($scope.vm.productlist, function (i, j) {
			        //    angular.forEach($scope.vm.colorItems, function (k, l) {

			        //        if (j === l) {

			        //            i.bgcolor = k;
			        //            return false;
			        //        }

			        //    });

			        //});

			    } 
      		});
			
		}
	    //教师兑换商品询问框
		function _buyDialog(product) {
		    $scope.vm.currentProduct = product;
		    var nestedConfirmDialog = ngDialog.openConfirm({
		        template:
                        '<div style="padding:1em;">' +
                        '<p  class="font-six" style="margin:0px;text-align:center;">您兑换的商品<span style="color:#3598dc;font-size:18px;">' + product.productname + '</span>将消耗<span style="color:#3598dc;font-size:18px;">' + product.point + '</span>积分</p><br />' +
                        '<p class="font-minsong" style="margin:0px 0 10px;line-height:20px !important;" >注：兑换礼品，系统自动扣除对应积分，礼品市场人员会线下给您配送 ，点击“确定”兑换</p>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary btn-gray" ng-click="closeThisDialog()">取消</button>' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" style="background:#3fadf9;" ng-click="teacherBuyIntegralProduct()">确定</button>' +
                        '</div>' +
                        '</div>',
		        plain: true,
		        width: 400,
		        scope: $scope,
		        className: 'ngdialog-theme-default',
		    });
		}
	    //教师兑换商品
		function _teacherBuyIntegralProduct() {
		    
		    var params = {
		        Token: $scope.vm.token,
		        Products:angular.toJson( [$scope.vm.currentProduct.pid])

			}//setteacherpassword  
			userinfoSrv.teacherBuyIntegralProduct(params).then(function (result) {
			    if (result.code === 0) {
			        toastr.success('恭喜您，兑换成功', '');
			        _selectTab(2);

			        $rootScope.teacherinfo.integralsorce -= parseInt( $scope.vm.currentProduct.point);
			        ngDialog.closeAll();

			    } 
      		});
			
		}


		function _selectTab(tabIndex) {
		    $scope.vm.tabindex = tabIndex;
		    switch (tabIndex) {
		        case 0:
		            {
		                _getTeacherIntegral();
		            }
		            break;
		        case 1:
		            _getTeacherIntegralCanBuyProductList();
		            break;
		        case 2:
		            _getTeacherIntegralBuyProductList();
		            break;
		        default:
		            break;
		    }
		}


	}]);
});