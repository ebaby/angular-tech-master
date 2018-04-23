define(['require', 'angular', 'directives/com-directives'], function (require, ng) {
	var module = ng.module('app.layout');
	module.controller('SidebarCtrl', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
		$scope.vm = {
		    tabindex: 0,
		    childindex: 0,
		    tips:false,
		}


		var states = [{
		    "statename": "app",
		    "key": 0,
		    "childs": [
                //{
                //    "statename": "app.novice",
                //    "key": 0,
                //    "childs": []
                //},{
                //    "statename": "app.help",
                //    "key": 1,
                //    "childs": []
                //}
		    ]
		}, {
		    "statename": "app.sethomework",
		    "key": 1,
		    "childs": [{
		        "statename": "app.sethomework.sethw",
		        "key": 0,
		        "childs": []
		    }, {
		        "statename": "app.sethomework.sethwlog",
		        "key": 1,
		        "childs": []
		    }, {
		        "statename": "app.sethomework.setholidayhw",
		        "key": 2,
		        "childs": []
		    }]
		}, {
		    "statename": "app.checkhomework",
		    "key": 2,
		    "childs": [{
		        "statename": "app.checkhomework.unalreadyhw",
		        "key": 0,
		        "childs": []
		    }, {
		        "statename": "app.checkhomework.alreadyhw",
		        "key": 1,
		        "childs": []
		    }]
		}, {
		    "statename": "app.analyze",
		    "key": 3,
		    "childs": [
                {
                    "statename": "app.analyze.period",
                    "key": 0,
                    "childs": []
                }, {
                    "statename": "app.analyze.class",
                    "key": 1,
                    "childs": []
                }, {
                    "statename": "app.analyze.print",
                    "key": 2,
                    "childs": []
                }
		    ]
		}, {
		    "statename": "app.classmanage",
		    "key": 4,
		    "childs": [{
		        "statename": "app.classmanage.manage",
		        "key": 0,
		        "childs": []
		    }, {
		        "statename": "app.classmanage.create",
		        "key": 1,
		        "childs": []
		    }]
		}
		];
		$rootScope.selectTab = _selectTab;
		$scope.selectTab = _selectTab;

		initialize();
		function initialize(){
		    var initindex = getTabindex();
		    if (typeof (initindex.tabindex) !== 'undefined') {
		        $scope.selectTab(initindex.tabindex, initindex.childindex);
		    }

            //
		    var date = new Date();
		    var currentYear = date.getFullYear();
		    if (date.getTime() >= new Date(currentYear + '/8/25 00:00:00').getTime() && date.getTime() <= new Date(currentYear + '/9/25 23:59:59').getTime()) {
		        $scope.vm.tips = true;
		        $rootScope.tips = true;
		    }
		}


		function _selectTab(tabIndex, childIndex, nogo) {
		    //if ($scope.vm.tabindex == tabIndex) {
		    //    $scope.vm.tabindex = tabIndex;
		    //    $scope.vm.childindex = childIndex;
		    //    if (childIndex == undefined) {
		    //        $scope.vm.checked = !$scope.vm.checked;
		    //    }
		    //} else {
		    //    $scope.vm.tabindex = tabIndex;
		    //    $scope.vm.childindex = childIndex;
		    //    $scope.vm.checked = false;
		    //}

		    if (typeof (tabIndex) === 'undefined') {
		        tabIndex = 0;
		    }
		    $scope.vm.tabindex = tabIndex;
		    childIndex ? childIndex = childIndex : childIndex = 0;
		    $scope.vm.childindex = childIndex;
		    var router;
		    if (typeof (childIndex) !== 'undefined') {
		        if (states[tabIndex] != undefined) {
		            if (states[tabIndex].childs.length > 0) {
		                router = states[tabIndex].childs[childIndex].statename;
		            } else {
		                router = states[tabIndex].statename;

		            }
		        }
		    } else {
		        router = states[tabIndex].statename;
		    }
		    if (!nogo) {
		        $state.go(router);
		    }

		}

		function getTabindex(tostatename) {
		    var _tabindex, _childindex;
		    var currentRouter = $state.current.name;
		    if (currentRouter == 'app.novice') {
		        currentRouter = 'app';
		    }
		    if (tostatename) {
		        currentRouter = tostatename;
		    }
		    var routerArr = currentRouter.split(".");
		    if (routerArr.length > 3) {
		        currentRouter = routerArr[0] + "." + routerArr[1] + "." + routerArr[2];
		    }
		    angular.forEach(states, function (state, tabindex) {
		        if (currentRouter === state.statename) {
		            _tabindex = tabindex;
		            _childindex = 0;
		        }
		        if (state.childs.length > 0) {
		            angular.forEach(state.childs, function (child, childindex) {
		                if (currentRouter === child.statename) {
		                    _tabindex = tabindex;
		                    _childindex = childindex;
		                }
		            })
		        }
		    })
		    return {
		        tabindex: _tabindex,
		        childindex: _childindex
		    }
		}

		
	}])
});