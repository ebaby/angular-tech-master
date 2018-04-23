define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'userinfo/userinfo.service'], function (require, ng, comfuns) {
	var module = ng.module('app.userinfo');
	
	module.controller('BaseInfoCtrl', ['$scope','userinfoSrv','toastr','$rootScope','$timeout', function($scope,userinfoSrv,toastr,$rootScope,$timeout){
		$scope.title = '基本信息';
		$scope.base = {
		   
		}
		$scope.vm = {
		    token: window.localStorage.tch_token,
		    teachertypes: [{ id: 1, name: "公立教师" }, { id: 2, name: "培训机构教师" }, { id: 3, name: "个人" }, { id: 4, name: "师范生" }],
			xdlist: [{ id: "x", name: "小学" }]
		   
		}

		initialize();
		function initialize(){				
		}
        

		//获取市
		$scope.getCity=_getCity;
		//获取区县
		$scope.getCounty=_getCounty;
		//获取学校列表
		$scope.getSchool = _getSchool;
		//保存教师基本信息
		$scope.saveBaseInfo=_saveBaseInfo;
		//保存教师任教信息
		$scope.saveTeachInfo=_saveTeachInfo;

		var rootHandle = $rootScope.$watchCollection('teacherinfo', function (newvalue, oldvalue) {
		    if (newvalue) {
		        $scope.base = $rootScope.teacherinfo;
		        $scope.vm.base = angular.copy($scope.base);
                
		        //$scope.vm.base.xkinfo = $scope.base.xklist[0].xkid;vm.base.teacher.subjectlist

		        angular.forEach($scope.vm.teachertypes, function (o,i) {
		            if (o.id == $scope.base.teacheridentity) {
		                $scope.vm.base.identityinfo = o;
		                return false;
		            }
		        });
		        _getProvince();
		        _getSubjectList();
		        rootHandle();
		    }
		    
		})
		
		//获取省
		function _getProvince(){
		    var params = {
		        Token: $scope.vm.token,

			};

		    userinfoSrv.getProvince(params).then(function (result) {
		        if (result.code === 0) {
		            $scope.vm.provinceItem = result.data;

		            angular.forEach($scope.vm.provinceItem, function (p, index) {
		                if (p.provincename == $scope.base.province) {
		                    $scope.vm.base.proinfo = $scope.vm.provinceItem[index];
		                    _getCity();
		                    return;
		                }
		            })

		            //console.log($scope.vm.provinceItem)


		        }
      		});
		}

		
		//获取市
		function _getCity(){
			//console.log($scope.vm.province);
		    if ($scope.vm.base.proinfo) {
				var params = {
				    province: $scope.vm.base.proinfo.provincename,
				    Token: $scope.vm.token,
				};
				userinfoSrv.getCity(params).then(function (result) {
				    if (result.code === 0) {
				        $scope.vm.schoolItem = [];
				        $scope.vm.countyItem = [];
				        $scope.vm.cityItem = result.data;
				        angular.forEach($scope.vm.cityItem, function (c, index) {
				            if (c.cityname == $scope.base.city) {
				                $scope.vm.base.cityinfo = $scope.vm.cityItem[index];
				                _getCounty();
				                return false;
				            }
				        })
				    }

	      		});
			}else{
				$scope.vm.cityItem = [];
			}
		}

		//获取区县
		function _getCounty() {
		    if ($scope.vm.base.proinfo && $scope.vm.base.cityinfo) {
		        var params = {
		            province: $scope.vm.base.proinfo.provincename,
		            city: $scope.vm.base.cityinfo.cityname,
		            Token: $scope.vm.token,
		        };
		        userinfoSrv.getCounty(params).then(function (result) {
		            if (result.code === 0) {
		                $scope.vm.schoolItem = [];
		                $scope.vm.countyItem = result.data;
		                angular.forEach($scope.vm.countyItem, function (c, index) {
		                    if (c.countyid == $scope.base.countyid) {
		                        $scope.vm.base.countyinfo = $scope.vm.countyItem[index];
		                        _getSchool();
		                        return false;
		                    }
		                })
		            }
		        });
		    } else {
		        $scope.vm.countyItem = [];
		    }
		}

		//获取学校列表
		function _getSchool(){
		    if ($scope.vm.base.proinfo && $scope.vm.base.cityinfo && $scope.vm.base.countyinfo) {
				var params = {
				    Province: $scope.vm.base.proinfo.provincename,
				    City: $scope.vm.base.cityinfo.cityname,
				    CountyID: $scope.vm.base.countyinfo.countyid,
				    CountyName: $scope.vm.base.countyinfo.countyname,
				    XD: 'x',//$scope.vm.base.teacher.xdid,
				    Token: $scope.vm.token,
				};
				userinfoSrv.getSchool(params).then(function (result) {
				    if (result.code === 0) {
				        $scope.vm.schoolItem = result.data;
                        
				        angular.forEach($scope.vm.schoolItem, function (s, index) {
				            if (s.schoolid == $scope.base.teacher.schoolid) {
				                $scope.vm.base.schoolinfo = $scope.vm.schoolItem[index];
				                
				                return false;
				            }
				        })
				        
				    } else { $scope.vm.schoolItem = []; }
	      		});
	      	}else{

	      		$scope.vm.schoolItem = [];
	      	}

		}

		//获取学科
		function _getSubjectList() {

		    var params = {
		        Token: $scope.vm.token,
		    };
		    userinfoSrv.getSubjectList(params).then(function (result) {
		        if (result.code === 0) {
		            $scope.vm.subjectItem = result.data;
		            
		            //angular.forEach($scope.vm.subjectItem, function (s, i) {
		            //    angular.forEach($scope.vm.base.teacher.subjectlist, function (t, j) {
		            //        if (s.subjectid == t.subjectid) {
		            //        $scope.vm.base.subjectinfo = s;

		            //            return false;
		            //        }
		            //    });
		            //});
		            angular.forEach($scope.vm.subjectItem, function (s, i) {
		                if (s.subjectid == 2) {
		                    $scope.vm.base.subjectinfo = s;

		                    return false;
		                }
		            });

		        } else { $scope.vm.subjectItem = []; }
		    });


		}

		//保存教师基本信息
		function _saveBaseInfo(){
		    //console.log($scope.vm.base);

		    if ($scope.vm.base.email) {
		        var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		        if (!reg.test($scope.vm.base.email)) {
		            toastr.warning('email格式不正确', '');
		            return false;
		        }
		    }

		    var params = {
		        TureName: $scope.vm.base.turename,
		        Sex: $scope.vm.base.sex,
		        Email: $scope.vm.base.email,
		        Token: $scope.vm.token,
		    };
			//$rootScope.teacherinfo.headpic='http://g.hiphotos.baidu.com/imgad/pic/item/a8773912b31bb051be533b24317adab44aede043.jpg';
			//console.log($rootScope.teacherinfo);

		    userinfoSrv.saveBaseInfo(params).then(function (result) {
        		if(result.code===0){        			
        		    $rootScope.turename = $scope.vm.base.turename;
        		    $rootScope.sex = $scope.vm.base.sex;
        		    $rootScope.email = $scope.vm.base.email;

        		    $scope.base.turename = $scope.vm.base.turename;
        			$scope.base.sex = $scope.vm.base.sex;
        			$scope.base.email = $scope.vm.base.email;

        			$scope.baseInfoVisible = !$scope.baseInfoVisible;
        			$scope.baseInfoEditVisible = !$scope.baseInfoEditVisible;

        			toastr.success('修改成功', '');
				}
      		});

		}

		//保存教师任教信息
		function _saveTeachInfo() {

		    if (!$scope.vm.base.proinfo) {
		        toastr.warning('请选择省', '');
		        return false;
		    }
		    if (!$scope.vm.base.cityinfo) {
		        toastr.warning('请选择市', '');
		        return false;
		    }
		    if (!$scope.vm.base.countyinfo) {
		        toastr.warning('请选择区县', '');
		        return false;
		    }
		    if (!$scope.vm.base.schoolinfo) {
		        toastr.warning('请选择学校', '');
		        return false;
		    }

		    var params = {
		        Province: $scope.vm.base.proinfo.provincename,
		        City: $scope.vm.base.cityinfo.cityname,
		        County: $scope.vm.base.countyinfo.countyid,
		        CountyName: $scope.vm.base.countyinfo.countyname,
		        XKs:[angular.toJson($scope.vm.base.subjectinfo.subjectid)],
		        SchoolID: $scope.vm.base.schoolinfo.schoolid,
		        SchoolName: $scope.vm.base.schoolinfo.schoolname,
		        TeacherIdentity: $scope.vm.base.identityinfo.id,
		        Address: $scope.vm.base.address,
		        XDID: $scope.vm.base.teacher.xdid,
		        Token: $scope.vm.token,
		    };
			
		    userinfoSrv.saveTeachInfo(params).then(function (result) {
      		    if (result.code === 0) {
      		        //$scope.vm.base = angular.copy($scope.base);


      		        $rootScope.province = $scope.vm.base.proinfo.provincename;
      		        $rootScope.city = $scope.vm.base.cityinfo.cityname;
      		        $rootScope.county = $scope.vm.base.countyinfo.countyid;
      		        $rootScope.countyname = $scope.vm.base.countyinfo.countyname;
      		        //$rootScope.xks = $scope.vm.base.xklist;
      		        $rootScope.schoolid = $scope.vm.base.schoolinfo.schoolid;
      		        $rootScope.schoolname = $scope.vm.base.schoolinfo.schoolname;
        			$rootScope.teacheridentity = $scope.vm.base.identityinfo.id;
        			$rootScope.address = $scope.vm.base.address;

        			$scope.base.province = $scope.vm.base.proinfo.provincename;
        			$scope.base.city = $scope.vm.base.cityinfo.cityname;
        			$scope.base.county = $scope.vm.base.countyinfo.countyid;
        			$scope.base.countyname = $scope.vm.base.countyinfo.countyname;
        			//$scope.base.xks = $scope.vm.base.xklist;
        			$scope.base.schoolid = $scope.vm.base.schoolid;
        			$scope.base.schoolname = $scope.vm.base.schoolname;
        			$scope.base.teacheridentity = $scope.vm.base.identityinfo.id;
        			$scope.base.address = $scope.vm.base.address;

        			$scope.teachInfoVisible = !$scope.teachInfoVisible;
        			$scope.teachInfoEditVisible = !$scope.teachInfoEditVisible;        			
        			
        			toastr.success('修改成功', '');
        		}
        	
      		});

		}


		//隐藏显示基本信息及编辑
		$scope.baseInfoVisible = true;
		$scope.baseInfoEditVisible = true;
		$scope.baseInfoToggle = _baseInfoToggle;
		function _baseInfoToggle(){
			
			$scope.baseInfoVisible=!$scope.baseInfoVisible;
			$scope.baseInfoEditVisible = !$scope.baseInfoEditVisible;

			//if ($scope.baseInfoEditVisible === false) {
			$scope.vm.base.turename = angular.copy($scope.base.turename);
			$scope.vm.base.sex = angular.copy($scope.base.sex);
			$scope.vm.base.email = angular.copy($scope.base.email);
			//}
		
		};

		//隐藏显示任教信息及编辑
		$scope.teachInfoVisible = true;
		$scope.teachInfoEditVisible = true;
		$scope.teachInfoToggle = _teachInfoToggle;
		function _teachInfoToggle(){
			
			$scope.teachInfoVisible=!$scope.teachInfoVisible;
			$scope.teachInfoEditVisible = !$scope.teachInfoEditVisible;

			//if ($scope.teachInfoEditVisible === false) {
			$scope.vm.base.province = angular.copy($scope.base.province);
			$scope.vm.base.city = angular.copy($scope.base.city);
			$scope.vm.base.countyname = angular.copy($scope.base.countyname);
			$scope.vm.base.xkname = angular.copy($scope.base.xkname);
			$scope.vm.base.schoolname = angular.copy($scope.base.schoolname);
			$scope.vm.base.address = angular.copy($scope.base.address);
			//}
		};



	}]);
});