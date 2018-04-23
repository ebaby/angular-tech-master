define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'sethomework/sethomework.service'], function (require, ng, comfuns) {
	var module = ng.module('app.sethomework');
	module.controller('HolidayCtrl', ['$scope', '$state', 'setHomeWorkSrv', 'toastr', 'ngDialog', '$rootScope', function ($scope, $state, setHomeWorkSrv, toastr, ngDialog, $rootScope) {
	    //$scope.title = '布置作业';
	    var date = new Date();
	    var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        currentclassid: 0,
	        currenthwbid: 0,
	        currentdatatime: '',// date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
	        booklist: [],
	        datedisable: false,
	        enddatetime: '',//date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ' '  + week[date.getDay()]
	        currenthwindex: 0,
	        currentimgpageindex: 0,
	        selectedcount: 0,

	    }

	    $scope.imgoptions = {
	    }
	    $scope.pigaiItem = [];


	    $scope.getClassBook = _getClassBook;
	    $scope.resetCheck = _resetCheck;
	    $scope.selectBook = _selectBook;
	    $scope.nodeExtender = _nodeExtender;
	    $scope.setHomeWork = _setHomeWork;
	    $scope.editDatetime = _editDatetime;


	    $scope.vm.bookItems = [];
	    $scope.vm.tempArray = [];//装载练习册
	    $scope.vm.hwItems = [];

	    $scope.dateoption = {
	        zydatetiem: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
	        setDatetime: _setDatetime
	    }

	    initialize();
	    function initialize() {

	        _getTeacherClasslist();
	    }

	    function _getTeacherClasslist() {
	        var params = {
	            Token: $scope.vm.token,
	            classid: $scope.vm.currentclassid
	        }
	        setHomeWorkSrv.getTeacherClasslist(params).then(function (result) {
	            if (result.code === 0) {
	                if (result.data.length > 0) {

	                    $scope.vm.classlist = result.data;

	                    //if ($scope.vm.currentclassid === 0) {
	                    //    $scope.vm.currentclassid = result.data[0].classid;
	                    //}
	                } else {
	                    $scope.vm.classlist = [];
	                }
	            }
	        });


	    }

	    function _getClassBook(classinfo, checked) {

	        var flag = true;

	        //classinfo.checked = !classinfo.checked;


	        if ($scope.vm.tempArray.length > 0) {
	            if (checked) {
	                var isexist = false;
	                angular.forEach($scope.vm.tempArray, function (obj, index) {
	                    if (classinfo.gradename != obj.gradename) {

	                        if (classinfo == obj) { isexist = true; }

	                        var nestedConfirmDialog = ngDialog.openConfirm({
	                            template:
                                    '<div style="padding:1em;">' +
                                        '<p>请选择同一年级的来布置作业。</p>' +
                                        '<div class="ngdialog-buttons">' +
                                            //'<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消' +
                                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">确定</button>' +
                                        '</div>' +
                                        '</div>',
	                            plain: true,
	                            width: 400,
	                            scope: $scope,
	                            className: 'ngdialog-theme-default'
	                        });
	                        checked = false;
	                        flag = false;
	                        isexist = true;
	                        return;
	                    }
	                });

	                if (!isexist) {
	                    $scope.vm.tempArray.push(classinfo);
	                }


	            } else {
	                angular.forEach($scope.vm.tempArray, function (obj, index) {
	                    if (classinfo.classid === obj.classid) {
	                        $scope.vm.tempArray.splice(index, 1);
	                        return;
	                    }
	                });

	            }

	        } else {

	            $scope.vm.tempArray.push(classinfo)
	        }
	        classinfo.checked = checked;
	        if (flag) {

	            var classidlist = new Array()
	            angular.forEach($scope.vm.tempArray, function (o, i) {
	                classidlist.push({ ClassID: o.classid });
	            });
	            if (classidlist.length > 0) {
	                _getClassBooks(classidlist);
	            } else {
	                $scope.vm.hwbidlist = [];
	                $scope.vm.chapterlist = [];
	            }
	        }
	        //console.log($scope.vm.tempArray.length)
	    }

	    function _getClassBooks(classidlist) {
	        var params = {
	            Token: $scope.vm.token,
	            ClassList: classidlist
	        }
	        setHomeWorkSrv.getTeacherCanSetHomeWork(params).then(function (result) {
	            if (result.code === 0) {


	                $scope.vm.hwbidlist = result.data.bookslist;

	                //$scope.vm.booklist = [];
	                //var b = true;
	                //var classbooks = {
	                //    checked: classinfo.checked,
	                //    classid: classinfo.classid,
	                //    booklist: result.data[0].booklist
	                //};
	                //angular.forEach($scope.vm.bookItems, function (bo, index) {
	                //    if (classinfo.classid === bo.classid) {
	                //        bo.checked = classinfo.checked;
	                //        b = false;
	                //    }
	                //})
	                //if (b) {
	                //    $scope.vm.bookItems.push(classbooks);
	                //}

	                //angular.forEach($scope.vm.bookItems, function (cbo, index) {
	                //    if (cbo.checked) {
	                //        angular.forEach(cbo.booklist, function (bb, kindex) {
	                //            if (checkBookinlist(bb)) {
	                //                $scope.vm.booklist.push(bb);
	                //            }
	                //        })

	                //    }
	                //})
	            } 

	        });
	    }
	    function _resetCheck(classinfo) {
	        console.log(classinfo);
	    }


	    function checkBookinlist(book) {
	        var b = true;
	        angular.forEach($scope.vm.booklist, function (bb, kindex) {
	            if (book.hwbid == bb.hwbid) {
	                b = false;
	            }
	        })
	        return b;
	    }

	    function _selectBook(book) {

	        if ($scope.vm.tempArray.length > 0) {
	            if ($scope.vm.currenthwbid == 0) {
	                $scope.vm.currenthwbid = book.hwbid;
	            }
	            else {
	                $scope.vm.currenthwbid = 0;
	                $scope.vm.currenthwbid = book.hwbid;
	            }
	        }
	        else {
	            $scope.vm.currenthwbid = 0;
	        }

	        if ($scope.vm.currenthwbid != 0) {

	            var classidlist = new Array();
	            angular.forEach($scope.vm.tempArray, function (classinfo, index) {
	                classidlist.push({ClassID:classinfo.classid});
	            });

	            if ($scope.vm.currenthwbid != 0) {
	                var params = {
	                    Token: $scope.vm.token,
	                    HWBID: $scope.vm.currenthwbid,
	                    ClassList: classidlist
	                }
	                setHomeWorkSrv.getHomeWorkList(params).then(function (result) {
	                    if (result.code === 0) {
                            //暑假作业教辅
	                        $rootScope.holibook = book;
	                        $scope.vm.chapterlist = result.data.chapterlist;
	                        _getKSnum($scope.vm.chapterlist);
	                    }

	                });
	            }
	        } else {


	        }

	        $scope.vm.chapterlist = [];
	        $scope.vm.hwItems = [];
	    }
        //获取课时数量
	    function _getKSnum(charpterlist) {
	        $rootScope.holksnum = 0;
	        angular.forEach(charpterlist, function (ch, index) {
	            angular.forEach(ch.nodeidlist, function (cn, cnindex) {
	                var cnu = cn.lhidlist.length;
	                $rootScope.holksnum = $rootScope.holksnum + cnu;
	            })
	        })

	    }

	    function _nodeExtender(node) {

	        node.checked = !node.checked;
	        //console.log(2)
	    }
        	   
	    //布置作业
	    function _setHomeWork() {

	        var count = 0;
	        var hwidlist = new Array();
	        angular.forEach($scope.vm.chapterlist, function (home, index) {
	            angular.forEach(home.nodelist, function (oo, ii) {
	                angular.forEach(oo.lhlist, function (o, i) {
	                    if (o.isarrangement == 0) {
	                        hwidlist.push({ HWID: o.hwid, HomeWorkQuestion: [], IsAllArrangement: 1, HWType: 3 });
	                    } else {
	                        count += 1;
	                    }
	                });
	            });
	        });
	        if (count > 0) {
	            toastr.warning('已布置过，不能再布置', '');
	            return false;
	        }

	        var classidlist = new Array();
            //暑假作业班级
	        $rootScope.holiclasses = $scope.vm.tempArray;
	        angular.forEach($scope.vm.tempArray, function (classinfo, index) {
	            classidlist.push({ClassID:classinfo.classid});
	        });
	        $rootScope.holidatetime = $scope.vm.currentdatatime;
	        if (classidlist.length > 0) {
	            if ($scope.vm.currenthwbid != 0) {
	                if ($scope.vm.currentdatatime != '') {
	                    var params = {
	                        Token: $scope.vm.token,
	                        HWIDList: hwidlist,
	                        ClassList: classidlist,
	                        time: "\/Date(" + (new Date($scope.vm.currentdatatime.replace(/-/g, "/"))).getTime() + ")\/",
	                        isdaipi: 1
	                    }
	                    setHomeWorkSrv.setHomeWork(params).then(function (result) {
	                        if (result.code === 0) {
	                            toastr.success('布置成功', '');

	                            //_setUserGuidance();

	                            $state.go('app.sethomework.holidayfinsh', { pagesize: $scope.vm.hwItems.length });
	                            //_getTeacherClasslist();
	                        } 

	                    });
	                } else {
	                    toastr.error('请选择作业提交截止时间', '');
	                }
	                
	            }
	            else {
	                toastr.error('请选择教材', '');
	            }
	        } else {
	            toastr.error('请选择年级', '');
	        }
	    }

	    function _setDatetime(dt) {
	        //alert(dt);
	        $scope.vm.currentdatatime = dt;
	        //$scope.vm.datedisable = false;

	    }

	    function _editDatetime(day) {

	        if (day == 4) {

	            $scope.vm.enddatetime = '';
	            $scope.dateoption.zydatetiem = '';
	            $scope.vm.datedisable = true;
	        }
	        else {
	            var d = new Date();
	            d = (new Date(d.valueOf() + day * 24 * 60 * 60 * 1000));
	            var time = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
	            $scope.vm.currentdatatime = time;
	            //$scope.vm.enddatetime = time;

	            $scope.vm.datedisable = false;
	        }

	    }

	    //设置指导页已经查看 -- 创建班级
	    function _setUserGuidance() {
	        var params = {
	            Token: $scope.vm.token,
	            userguidance: [0301]

	        }
	        setHomeWorkSrv.setUserGuidance(params).then(function (result) {
	            if (result.code === 0) {


	            } 
	        });
	    }




	}]);

});