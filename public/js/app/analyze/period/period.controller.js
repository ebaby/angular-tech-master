define(['require', 'angular', 'components/com-funs', 'analyze/analyze.service', 'directives/com-directives'], function (require, ng, comfuns) {
    var module = ng.module('app.analyze');
	module.controller('PeriodCtrl', ['$scope', '$state', 'analyzeSrv', '$rootScope', 'toastr', function ($scope, $state, analyzeSrv, $rootScope, toastr) {
	    //$scope.title = '学情分析';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        pageindex: 0,
	        pagesize: 10,
            allpage:0,
	        tabindex: 0,
	        currentclassid: 0
	        //classlist: []

	    }
	    $scope.kslistOptions = {
	        goNextpage: _goNextpage,
	        allpage: 0
	    }
	    $scope.selectClass = _selectClass;
	    $scope.loadMore = _loadMore;
	    $scope.goToDetail = _goToDetail;
	    $scope.goToStatistics = _goToStatistics;

	    $scope.pageOptions = {
	        scrollLoaddata: _getXueQingFenZuoYeIndexPage
	    }
	    $scope.dateoption = {
	        zydatetiem: "",
	        setDatetime: _setDatetime
	    }
	    $scope.editDatetime = _editDatetime;
	    function _setDatetime(dt) {
	        //alert(dt);
	        //var time = "\/Date(" + (new Date(dt.replace(/-/g, "/"))).getTime() + ")\/"
	        _updateSubendTime(dt);
	        $scope.vm.currenthw.editable = false;
	    }


	    function _editDatetime(hw) {
	        if ($scope.vm.currenthw) {
	            $scope.vm.currenthw.editable = false;
	        }
	        $scope.dateoption.zydatetiem = hw.subendtime;
	        $scope.vm.currenthw = hw;
	        hw.editable = !hw.editable;

	    }

	    initialize();
	    function initialize() {

	        _getTeacherClasslist();
	    }
	    function _goNextpage(pageindex) {
	        $scope.vm.pageindex = pageindex;
	        _getXueQingFenZuoYeIndexPage();
	        //alert(pageindex);
	    }
	    function _selectClass(classinfo) {
	        $scope.vm.homeworklist = null;
	        $scope.vm.pageindex = 0;
	        $scope.vm.allpage = 0;
	        $scope.vm.currentclassid = classinfo.classid;
	        _getTeacherClasslist();
	        //_getXueQingFenZuoYeIndexPage();
	    }


	    //获取班级列表
	    function _getTeacherClasslist() {
	        var params = {
	            Token: $scope.vm.token,
	            Type: 1,//-1：全部，0：不显示，1：显示
	        }
	        analyzeSrv.getTeacherClasslist(params).then(function (result) {
	            if (result.code === 0) {
	                if (result.data.length > 0) {
	                    
	                    if (!$scope.vm.classlist || $scope.vm.classlist.length==0) {
	                        $scope.vm.classlist = result.data;
	                    }

	                    if ($scope.vm.currentclassid == 0) {
	                        $scope.vm.currentclassid = result.data[0].classid;
	                        $scope.vm.currentclassinfo = result.data[0];
	                    } else {
	                        angular.forEach(result.data, function (o,i) {
	                            if (o.classid === $scope.vm.currentclassid) {
	                                $scope.vm.currentclassinfo = o;
	                            }
	                        });
	                    }
	                    
	                    _getXueQingFenZuoYeIndexPage();

	                } else {
	                    $scope.vm.classlist = [];
	                    $scope.vm.classInfoItems = [];
	                    $scope.vm.homeworklist = [];
	                }
	            }
	        });


	    }

	    //获取班级学情分析
	    function _getXueQingFenZuoYeIndexPage() {
	        $scope.vm.pageindex = $scope.vm.pageindex + 1;
	        var params = {
	            Token: $scope.vm.token,
	            PageIndex: $scope.vm.pageindex,
	            PageSize: $scope.vm.pagesize,
	            //classid: $scope.vm.currentclassid,
	            Type: 2,
	            CheckType: 0,
	            ClassID: $scope.vm.currentclassid,
	        }
	        if ($scope.vm.allpage != 0 && $scope.vm.pageindex > $scope.vm.allpage) {
	            $scope.vm.pageindex = $scope.vm.allpage;
	            return;
	        }
	        analyzeSrv.getXueQingFenZuoYeIndexPage(params).then(function (result) {
	            if (result.code === 0) {

	                if (!$scope.vm.homeworklist) {
	                    $scope.vm.homeworklist = [];
	                }
	                angular.forEach(result.data.inteacherarrangelist, function (dp, index) {
	                    $scope.vm.homeworklist.push(dp);
	                })

	                //$scope.vm.homeworklist = result.data.inteacherarrangelist;
	                if ($scope.vm.allpage == 0) {
	                    $scope.vm.allpage = result.data.pagecount;
	                }

	                //$scope.vm.allpage = result.data[0].allpage;
	                //$scope.vm.pigailist = result.data[0].pigailist;
	                //if ($scope.vm.allpage == 0) {
	                //    $scope.vm.allpage = result.data[0].allpage;
	                //}
	                ////$scope.vm.classidlist = result.data[0].classidlist;
	                //if (!$scope.vm.pigailist) {
	                //    $scope.vm.pigailist = [];
	                //}
	                //angular.forEach(result.data[0].pigailist, function (dp, index) {
	                //    $scope.vm.pigailist.push(dp);
	                //})
	            }
	        });
	    }

	    //
	    function _loadMore() {

	    }

	    //跳转详情
	    function _goToDetail(hw) {
	        //$rootScope.currenthw = hw;
	        //$rootScope.vm.hwInfoItems = hw;
	        $state.go('app.analyze.period.detail', { tchwlogid: hw.tchwlogid });
	    }

	    //设置提交截止时间 
	    function _updateSubendTime(time) {
	        var params = {
	            Token: $scope.vm.token,
	            TCHWLogID: $scope.vm.currenthw.tchwlogid,
	            SubEndTime: new Date(time.replace(/-/g, "/")).getTime() / 1000,// "\/Date(" + (new Date(time.replace(/-/g, "/"))).getTime() + ")\/"

	        };
	        analyzeSrv.updateSubendTime(params).then(function (result) {
	            if (result.code === 0) {
	                toastr.success('设置成功', '');

	                $scope.vm.currenthw.subendtime = new Date(time.replace(/-/g, "/")).getTime() / 1000;
	            } 
	        });
	    }

	    //跳转到作业统计
	    function _goToStatistics(home) {

	        $state.go('app.sethomework.statistics', { tchwlogid: home.tchwlogid });
	    }



	}]);
    //detail
	module.controller("PeriodDetailCtrl", ['$scope', '$state', '$timeout', 'analyzeSrv', 'ngDialog', 'toastr', '$rootScope', 'cfpLoadingBar', function ($scope, $state, $timeout, analyzeSrv, ngDialog, toastr, $rootScope, cfpLoadingBar) {

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        tchwlogid: $state.params.tchwlogid,
	        allchecked: false,
	        ischecked: false,
	        studentlist: []
	    }

	    $scope.goToKnown = _goToKnown;
	    $scope.goToStudent = _goToStudent;
	    $scope.goToWrong = _goToWrong;
	    $scope.goToCheckWrong = _goToCheckWrong;
	    $scope.noSubmitDialog = _noSubmitDialog;
	    $scope.goToWrongDetail = _goToWrongDetail;

	    //$scope.echartOptions = {
	    //    loadData: loadData
	    //}

	    $scope.allChecked = _allChecked;
	    $scope.promptedRedoWrongQuestion = _promptedRedoWrongQuestion;
	    $scope.promptedRedoDialog = _promptedRedoDialog;
	    $scope.selectStudent = _selectStudent;
	    $scope.prevHomeWork = _prevHomeWork;
	    $scope.nextHomeWork = _nextHomeWork;
	    $scope.convertRate = _convertRate;
	    $scope.promptedToStudentSubmit = _promptedToStudentSubmit;

	    $scope.pieEchartOptions = {
	        loadData: loadPieData,
	        id: 1
	    }
	    $scope.lineEchartOptions = {
	        loadData: loadLineData,
	        id: 2
	    }

	    function loadLineData(ec) {
	        $scope.vm.line_ec = ec;
	        _xueQingFenXi();
	    }
	    function loadPieData(ec) {
	        $scope.vm.pie_ec = ec;
	        _xueQingFenXiSorceLevel();
	    }

	    //function initialize() {

	    //    _xueQingFenXi();
	    //}

	    //获取学情分析作业
	    function _xueQingFenXi() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid
	        }
	        analyzeSrv.xueQingFenXi(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.hwInfoItems = result.data;
	                //$rootScope.hwInfo = result.data[0];
	                //$scope.vm.allpage = result.data[0].allpage;

	                var xdata = new Array();
	                var ydata = new Array();
	                angular.forEach($scope.vm.hwInfoItems.tilist, function (o, index) {
	                    xdata.push(o.qnum);
	                    ydata.push((parseInt(o.wrongnum) + parseInt(o.halfright)) / parseInt(o.answernum) * 100);
	                });

	                setLinecharts($scope.vm.line_ec, xdata, ydata);
                    
	            }
	        });


	    }

	    //获取课时学情分析学生列表 
	    function _xueQingFenXiSorceLevel() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid
	        }
	        analyzeSrv.xueQingFenXiSorceLevel(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.scorelevel = result.data.scorelevel;
                    
	                var xdata = new Array();
	                var ydata = new Array();
	                var ucount = 0;
	                angular.forEach($scope.vm.scorelevel, function (o, index) {
	                    if (o.userlist.length > 0) {
	                        xdata.push({ "value": o.userlist.length, "name": o.title });

	                        if (o.title.indexOf('优秀') != -1) {
	                            ydata.push('#e5cf0d');
	                        }
	                        if (o.title.indexOf('良好') != -1) {
	                            ydata.push('#2ec8ca');
	                        }
	                        if (o.title.indexOf('一般') != -1) {
	                            ydata.push('#ffb880');
	                        }
	                        if (o.title.indexOf('不及格') != -1) {
	                            ydata.push('#d77b80');
	                        }

	                    }
	                    //ydata.push(o.title);
	                    ucount += o.userlist.length;
	                });
	                $scope.vm.ucount = ucount;
	                setPiecharts($scope.vm.pie_ec, xdata, ydata);

	            }
	        });
	    }

	    function _goToKnown(known) {
	        $rootScope.known = known;
	        $state.go('app.analyze.period.known', { zsdid: known.zsdid, tchwlogid: $scope.vm.tchwlogid, tgl: known.tgl });
	    }

	    function _goToStudent() {
	        $rootScope.hwinfo = $scope.vm.hwInfoItems.settinghomeworkexpand;
	        $state.go('app.analyze.period.student', { tchwlogid: $scope.vm.tchwlogid });
	    }

	    function _goToWrong(wrong) {
	        $rootScope.wronginfo = wrong;
	        $state.go('app.analyze.period.wrong', { upid: wrong.upid,tchwlogid:$scope.vm.tchwlogid });
	    }

	    //function loadData(ec) {
	    //    $scope.vm.ec = ec;
	    //    //console.log(ec);
	    //    initialize();

	    //}

	    function setLinecharts(ec, xdata, ydata) {
	        var option = {
	            //title: {
	            //    text: '某地区蒸发量和降水量',
	            //    subtext: '纯属虚构'
	            //},
	            tooltip: {
	                trigger: 'axis',
	                textStyle: {
	                    decoration: 'none',
	                    fontFamily: 'Verdana, sans-serif',
	                    fontSize: 15
	                },
	                formatter: function (params) {
	                    var ti = $scope.vm.hwInfoItems.tilist[params[0].dataIndex];
	                    return "答对人数：" + ti.rightanswernum + "<br/>答错人数：" + ti.wrongnum + "<br/>半对人数：" + ti.halfright + '<br />错误率：' + (((parseInt(ti.wrongnum) + parseInt(ti.halfright)) / (parseInt(ti.rightanswernum) + parseInt(ti.wrongnum) + parseInt(ti.halfright))) * 100).toFixed(0) + '%';
	                }
	            },
	            //legend: {
	            //    data: ['蒸发量', '降水量']
	            //},
	            toolbox: {
	                //show: true,
	                feature: {
	                    mark: { show: true },
	                    dataView: { show: true, readOnly: false },
	                    magicType: { show: true, type: ['line', 'bar'] },
	                    restore: { show: true },
	                    saveAsImage: { show: true }
	                }
	            },
	            calculable: true,
	            xAxis: [
                    {
                        type: 'category',
                        data: xdata
                    }
	            ],
	            yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    }
	            ],
	            series: [
                    {
                        name: '答对人数',
                        type: 'bar',
                        data: ydata
                        //markPoint: {
                        //    data: [
                        //        { type: 'max', name: '最大值' },
                        //        { type: 'min', name: '最小值' }
                        //    ]
                        //},
                        //markLine: {
                        //    data: [
                        //        { type: 'average', name: '平均值' }
                        //    ]
                        //}
                    }
	            ]
	        };

	        $timeout(function () {
	            var domMain = document.getElementById("hwbar");
	            //var labelfromatter = labelFromatter(option.color);
	            //var _option = huanOption(labelfromatter, option);
	            if (domMain) {
	                var myChart = ec.init(domMain);
	                myChart.setOption(option, true);

	                window.onresize = function () {
	                    myChart.resize();

	                };

	            }
	        }, 200);
	    }
	    function setPiecharts(ec, xdata, ydata) {
	        var labelTop = {
	            normal: {
	                label: {
	                    show: true,
	                    position: 'center',
	                    formatter: '{b}',
	                    textStyle: {
	                        baseline: 'top'
	                    }
	                },
	                labelLine: {
	                    show: false
	                }
	            }
	        };
	        var labelFromatter = {
	            normal: {
	                label: {
	                    formatter: function (params) {
	                        return (100 - params.value).toFixed(2) + '%'
	                    },
	                    textStyle: {

	                        baseline: 'bottom'
	                    }
	                }
	            },
	        }
	        var labelBottom = {
	            normal: {
	                color: '#ccc',
	                label: {
	                    show: true,
	                    position: 'center',
	                    textStyle: {
	                        fontSize: 20,
	                        baseline: 'bottom'
	                    }
	                },
	                labelLine: {
	                    show: false
	                }
	            },
	            emphasis: {
	                color: 'rgba(0,0,0,0)'
	            }
	        };

	        var optionpie = {
	            tooltip: {
	                trigger: 'item',
	                formatter: "{a} <br/>{b} : {c} ({d}%)"
	            },
	            color: ydata,
	            calculable: false,
	            series: [
                    {
                        name: '成绩分布',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true
                                },
                                labelLine: {
                                    show: true
                                }
                            }
                        },
                        data: xdata
                    }
	            ]
	        };

	        $timeout(function () {
	            var domMain = document.getElementById("levelpie");
	            if (domMain) {
	                var myChart = ec.init(domMain, 'macarons');
	                myChart.setOption(optionpie, true);

	                window.onresize = function () {
	                    myChart.resize();

	                };
	            }
	        }, 200);
	    }

	    function _allChecked() {

	        //$scope.vm.allchecked = !flag;
	        //if ($scope.vm.hwInfoItems.cuotifenxi.length > 0) {

	        //    angular.forEach($scope.vm.hwInfoItems.cuotifenxi, function (obj, index) {
	        //        obj.checked = $scope.vm.allchecked;
	        //    });


	        //}
	        $scope.vm.allchecked = !$scope.vm.allchecked;
	        angular.forEach($scope.vm.hwInfoItems.wrongquesanalysis, function (obj, index) {
	            if (obj.isalert != 1) {
	                obj.checked = $scope.vm.allchecked;
	            }
	            if ($scope.vm.allchecked) {
	                $scope.vm.selectnum = _getCuotifenxiLen();
	            } else {
	                $scope.vm.selectnum = 0;
	            }
	        });

	    }
        //获取错题分析长度，不包括已提醒的
	    function _getCuotifenxiLen() {
	        var len = 0;
	        angular.forEach($scope.vm.hwInfoItems.wrongquesanalysis, function (obj, index) {
	            if (obj.isalert != 1) {
	                len = len + 1;
	            }
	        });
	        return len;
	    }
	    
	    function _promptedRedoDialog() {
	        
	        var list = [];
	        angular.forEach($scope.vm.hwInfoItems.wrongquesanalysis, function (ct, index) {
	            //if (ct.wqreform==0) {
	                list.push(ct.upid);
	            //}

	        });
	        if (list.length == 0) {
	            toastr.warning("没有可提醒的学生", '');
	            return false;
	        }


	        var nestedConfirmDialog = ngDialog.openConfirm({
	            template:
                        '<div style="padding:1em;">' +
                        '<p>是否要提示学生交重做错题</p>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消</button>' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="promptedRedoWrongQuestion()">确定</button>' +
                        '</div>' +
                        '</div>',
	            plain: true,
	            width: 400,
	            scope: $scope,
	            className: 'ngdialog-theme-default',
	        });
	    }

	    //提示学生交重做错题
	    function _promptedRedoWrongQuestion() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid,
	            classhourname: $scope.vm.hwInfoItems.settinghomeworkexpand.lhname,
	            studentlist: []

	        }
	        angular.forEach($scope.vm.hwInfoItems.wrongquesanalysis, function (ct, index) {
	            //if (ct.checked) {
	                params.studentlist.push(ct.upid);
	            //}

	        });
	        
	        analyzeSrv.promptedRedoWrongQuestion(params).then(function (result) {
	            if (result.code === 0) {
	                ngDialog.closeAll();
	                toastr.success('提醒成功', '');

	                angular.forEach($scope.vm.hwInfoItems.wrongquesanalysis, function (ct, index) {
	                    if (ct.checked) {
	                        $scope.vm.allchecked = false;
	                        $scope.vm.selectnum = 0;
	                        ct.isalert = 1;
	                    }

	                });

	            }

	        });
	        
	    }


	    function _prevHomeWork() {
	        $scope.vm.pageindex--;
	        _xueQingFenXi();
	    }

	    function _nextHomeWork() {

	        $scope.vm.pageindex++;
	        _xueQingFenXi();
	    }

	    function _convertRate(newvalue) {
	        var num = new Number(newvalue);
	        return num == 0 ? 0 : num.toFixed(0);
	    }

	    //跳转到批改错题
	    function _goToCheckWrong() {
	        var count = 0;
	        angular.forEach($scope.vm.hwInfoItems.wrongquesanalysis, function (o, i) {
	            if (o.wqreform > 0) {
	                count += 1;
	            }
	        });
	        if (count == 0) {
	            toastr.warning("暂无学生提交错题", '');
	            return false;
	        }

	        $state.go('app.analyze.period.checkwrong', { tchwlogid: $scope.vm.tchwlogid });
	    }

	    //跳转到错题详细
	    function _goToWrongDetail() {

	        $state.go('app.analyze.period.wrongdetail', { tchwlogid: $scope.vm.tchwlogid });
	    }


	    //跳转到未交作业
	    function _noSubmitDialog() {

	        if ($scope.vm.hwInfoItems.settinghomeworkexpand.nosubmitcount == 0) {
	            toastr.warning("没有未交的学生", '');
	            return false;
	        }

	        ngDialog.open({
	            template: window.globalConfig.appPath + 'analyze/period/nosubmit.html',
	            className: 'ngdialog-theme-default',
	            width: 800,
	            height: 400,
	            //showClose: false,
	            scope: $scope
	        });
	        _getHomeWorkSublog();
	    }


	    //获取学生列表
	    function _getHomeWorkSublog() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid

	        };

	        analyzeSrv.getHomeWorkSublog(params).then(function (result) {
	            if (result.code === 0) {

	                //$scope.vm.commitlist = result.data.commitlist;
	                $scope.vm.uncommitlist = result.data.uncommitlist;
                    
	            }
	        });
	    }
	    function _allChecked() {
	        $scope.vm.allchecked = !$scope.vm.allchecked;
	        angular.forEach($scope.vm.uncommitlist, function (unst, index) {
	            unst.checked = $scope.vm.allchecked;
	        })
	        _getSelectnum();
	    }
	    function _selectStudent(s) {
	        s.checked = !s.checked;
	    }
	    function _promptedToStudentSubmit() {
	        
	        var list = [];
	        angular.forEach($scope.vm.uncommitlist, function (o,i) {
	            if (o.checked) {
	                list.push({ upid: o.upid });
	            }
	        });
	        if (list.length==0) {
	            toastr.warning("请选择学生", '');
	            return false;
	        }

	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid,
	            studentlist: list
	        }
	        //if (allstudent.upid) {
	        //    params.studentlist = [{ upid: allstudent.upid }];
	        //} else {
	        //    angular.forEach($scope.vm.uncommitlist, function (su, index) {
	        //        if (su.checked && su.isalert == 2) {
	        //            params.studentlist.push({ upid: su.upid });
	        //        }
	        //    })
	        //}

	        analyzeSrv.promptedToStudentSubmit(params).then(function (result) {
	            if (result.code === 0) {
	                //$scope.vm.allchecked = false;
	                //$scope.vm.num = 0;
	                //angular.forEach($scope.vm.uncommitlist, function (su, i) {
	                //    angular.forEach(params.studentlist, function (ps, j) {
	                //        if (ps.upid == su.upid) {
	                //            su.isalert = 1;
	                //        }
	                //    })
	                //})
	                toastr.success("提醒成功", '');
	                ngDialog.closeAll();
	            }
	        });
	    }

	}])
    
	module.controller('PeriodStudentCtrl', ['$scope', '$state', 'analyzeSrv', '$rootScope', function ($scope, $state, analyzeSrv, $rootScope) {
	    //$scope.title = '学情分析';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        tchwlogid: $state.params.tchwlogid

	    }


	    //var rootHandle = $rootScope.$watchCollection('hwinfo', function (newvalue, oldvalue) {
	    //    if (newvalue) {
	    //        $scope.vm.hwinfo = $rootScope.hwinfo;


	    //        rootHandle();
	    //    }

	    //})

	    initialize();
	    function initialize() {

	        _xueQingFenXiSorceLevel();
	    }

	    $scope.levelConvert = _levelConvert;

	    //获取课时学情分析学生列表 
	    function _xueQingFenXiSorceLevel() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid
	        }
	        analyzeSrv.xueQingFenXiSorceLevel(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.scorelevel = result.data.scorelevel;

	            }
	        });
	    }

	    function _levelConvert(name) {
	        var n = '';
	        switch (name) {
	            case '优秀':
	                n = '90-100分数段人数';
	                break;
	            case '良好':
	                n = '80-89分数段人数';
	                break;
	            case '一般':
	                n = '60-69分数段人数';
	                break;
	            case '不及格':
	                n = '59分数段人数';
	                break;
	            default:
	                break;
	        }
	        return n;
	    }


	}]);
	module.controller('WrongCtrl', ['$scope', '$state', 'analyzeSrv', '$rootScope', 'toastr', '$sce', function ($scope, $state, analyzeSrv, $rootScope, toastr, $sce) {
	    //$scope.title = '学情分析';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        pageindex: 1,
	        pagesize: 10,
	        tchwlogid: $state.params.tchwlogid,
	        upid: $state.params.upid,
            currentindex:0
	    }

	    $scope.dianZanXueSheng = _dianZanXueSheng;
	    $scope.subPiGaiWrongTi = _subPiGaiWrongTi;
	    $scope.toHtml = _toHtml;
	    
	    initialize();
	    function initialize() {

	        _getListPiGaiWrongTi();
	    }


	    //获取待批改错题
	    function _getListPiGaiWrongTi() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid:$scope.vm.tchwlogid,
	            PageIndex: $scope.vm.pageindex,
	            PageSize: $scope.vm.pagesize,
	            upid: $scope.vm.upid,
	            ClassID:0
	        }
	        analyzeSrv.getListPiGaiWrongTi(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.ctzanstatus = result.data.ctzanstatus;
	                $scope.vm.pigaiwronglist = result.data.pigaiwronglist;
	                   
	            }
	        });


	    }

	    //错题教师点赞 
	    function _dianZanXueSheng() {
	        var params = {
	            Token: $scope.vm.token,
	            ToUPID: $scope.vm.upid,
	            zancase: '',
	            tchwlogid: $state.params.tchwlogid
	        }
	        analyzeSrv.dianZanXueSheng(params).then(function (result) {
	            if (result.code === 0) {

	                toastr.success('点赞成功', '');
	                //$scope.vm.currentindex = 1;
	                $scope.vm.ctzanstatus = 1;
	            } 
	        });


	    }

	    //提交判题
	    function _subPiGaiWrongTi(wrong,flag) {
	        var params = {
	            Token: $scope.vm.token,
	            wtid: wrong.wtid,
	            upid: $scope.vm.upid,
	            wrongtisublogid: wrong.wrongtisublogid,
	            answerstatus: flag,
	            iscontinue: 1


	        };
	        analyzeSrv.subPiGaiWrongTi(params).then(function (result) {
	            if (result.code === 0) {

	                toastr.success('判题成功', '');
	                wrong.wrongtistatus = flag;
	                wrong.pigaistatus = 2;
	                
	            }
	        });

	    }

	    function _toHtml(html) {
	        return $sce.trustAsHtml(html.replace('"','\\"'));
	    }

	}]);
	module.controller('KnownCtrl', ['$scope', '$state', '$sce', 'analyzeSrv', function ($scope, $state, $sce, analyzeSrv) {
	    //$scope.title = '学情分析';
        
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        tchwlogid: $state.params.tchwlogid,
	        zsdid: $state.params.zsdid
	    }

	    $scope.toHtml = _toHtml;
	    
	    initialize();
	    function initialize() {

	        _getHomeWorkAnalsysZsdQuestionList();
	    }


	    //获取课时学情分析知识点对应题的列表
	    function _getHomeWorkAnalsysZsdQuestionList() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid,
	            zsdid: $scope.vm.zsdid
	        }
	        analyzeSrv.getHomeWorkAnalsysZsdQuestionList(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.questionlist = result.data;

	            }
	        });
	    }

	    function _toHtml(html) {
	        return $sce.trustAsHtml(html);
	    }

	    


	}]);
	module.controller('PeriodCheckWrongCtrl', ['$scope', '$state', '$sce', 'analyzeSrv', 'toastr', function ($scope, $state, $sce, analyzeSrv, toastr) {
	            
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        pageindex: 0,
	        pagesize: 10,
	        allpage: 0,
	        tchwlogid: $state.params.tchwlogid,
	        upid: 0,
	        currentindex: 0,
            checkbox :false,
	    }

	    $scope.singleStudent = _singleStudent;
	    $scope.dianZanXueSheng = _dianZanXueSheng;
	    $scope.subPiGaiWrongTi = _subPiGaiWrongTi;
	    $scope.checkBox = _checkBox;
	    $scope.toHtml = _toHtml;

	    $scope.pageOptions = {
	        scrollLoaddata: _getListPiGaiWrongTi
	    }
	    
	    initialize();
	    function initialize() {

	        _xueQingFenXi();
	    }

	    //获取学情分析作业
	    function _xueQingFenXi() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid
	        }
	        analyzeSrv.xueQingFenXi(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.wrongquesanalysis = [];// result.data.wrongquesanalysis;

	                angular.forEach(result.data.wrongquesanalysis, function (o,i) {
	                    if (o.wqreform > 0) {
	                        $scope.vm.wrongquesanalysis.push(o);
	                    }
	                });

	                if ($scope.vm.wrongquesanalysis && $scope.vm.wrongquesanalysis.length > 0) {
	                    $scope.vm.wrongquesanalysis[0].checked = true;
	                    $scope.vm.upid = $scope.vm.wrongquesanalysis[0].upid;
	                    $scope.vm.currentstudent = $scope.vm.wrongquesanalysis[0];
	                    _getListPiGaiWrongTi();
	                }

	            }
	        });


	    }

	    //
	    function _singleStudent(student) {
	        angular.forEach($scope.vm.wrongquesanalysis, function (o,i) {
	            if (o.upid == student.upid) {
	                o.checked = true;
	            } else {
	                o.checked = false;
	            }
	        });

	        $scope.vm.upid = student.upid;
	        $scope.vm.currentstudent = student;
	        _getListPiGaiWrongTi(true);
	    }

	    //获取待批改错题
	    function _getListPiGaiWrongTi(ischangest) {
	    	if (ischangest) {
	    		$scope.vm.pigaiwronglist = [];
	    	}else{
	    		$scope.vm.pageindex = $scope.vm.pageindex + 1;
	    	}
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid,
	            PageIndex: $scope.vm.pageindex,
	            PageSize: $scope.vm.pagesize,
	            upid: $scope.vm.upid,
	            ClassID: 0
	        }

	        if ($scope.vm.allpage != 0 && $scope.vm.pageindex > $scope.vm.allpage) {
	            $scope.vm.pageindex = $scope.vm.allpage;
	            return;
	        }

	        analyzeSrv.getListPiGaiWrongTi(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.ctzanstatus = result.data.ctzanstatus;
	                //$scope.vm.pigaiwronglist = result.data.pigaiwronglist;


	                if (!$scope.vm.pigaiwronglist) {
	                    $scope.vm.pigaiwronglist = [];
	                }
	                angular.forEach(result.data.pigaiwronglist, function (o,i) {
	                    $scope.vm.pigaiwronglist.push(o);
	                });
	                if ($scope.vm.allpage == 0) {
	                    $scope.vm.allpage = result.data.pagecount;
	                }



	            }
	        });


	    }

	    //错题教师点赞 
	    function _dianZanXueSheng() {
	        var params = {
	            Token: $scope.vm.token,
	            ToUPID: $scope.vm.upid,
	            zancase: '',
	            tchwlogid: $state.params.tchwlogid
	        }
	        analyzeSrv.dianZanXueSheng(params).then(function (result) {
	            if (result.code === 0) {

	                toastr.success('点赞成功', '');
	                //$scope.vm.currentindex = 1;
	                $scope.vm.ctzanstatus = 1;
	            }
	        });


	    }

	    //提交判题
	    function _subPiGaiWrongTi(wrong, flag) {
	        var params = {
	            Token: $scope.vm.token,
	            wtid: wrong.wtid,
	            upid: $scope.vm.upid,
	            wrongtisublogid: wrong.wrongtisublogid,
	            answerstatus: flag,
	            iscontinue: 1


	        };
	        analyzeSrv.subPiGaiWrongTi(params).then(function (result) {
	            if (result.code === 0) {

	                toastr.success('判题成功', '');
	                wrong.wrongtistatus = flag;
	                wrong.pigaistatus = 2;

	            }
	        });

	    }

	    function _checkBox() {
	        if ($scope.vm.checkbox) {
	            $(".moref").css({ "height": "90px" });
	        } else {
	            $(".moref").css({ "height": "auto" });
	        }
	        $scope.vm.checkbox = !$scope.vm.checkbox;

	    }

	    function _toHtml(html) {
	        return $sce.trustAsHtml(html);
	    }

	    


	}]);
	module.controller('PeriodWrongDetailCtrl', ['$scope', '$state', '$sce', 'analyzeSrv', function ($scope, $state, $sce, analyzeSrv) {
	            
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        tchwlogid: $state.params.tchwlogid,
	    }

	    $scope.toHtml = _toHtml;
	    $scope.expendToggle = _expendToggle;
	    
	    initialize();
	    function initialize() {

	        _getHWWrongQList();
	    }


	    //作业错题列表
	    function _getHWWrongQList() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid,
	        }
	        analyzeSrv.getHWWrongQList(params).then(function (result) {
	            if (result.code === 0) {
	                
	                $scope.vm.hwclasswrongqlist = [];

	                var chapters = [];
	                angular.forEach(result.data.hwclasswrongq_list, function (o, i) {	                    
	                    if (chapters.indexOf(o.chapterid) == -1) {
	                        chapters.push(o.chapterid);
	                    }
	                });


	                angular.forEach(chapters, function (ch, index) {
	                    var obj = {
	                        chapterid: ch,
	                        wronglist: []
	                    }
	                    angular.forEach(result.data.hwclasswrongq_list, function (cq, index) {
	                        if (obj.chapterid == cq.chapterid) {
	                            var wrong = {
	                                timuxushu: cq.timuxushu,
	                                wrongnum: cq.wrongnum,
	                                wrongrate: cq.wrongrate,
	                                xuanxiang: cq.xuanxiang,
	                                questiontypename: _getQuestionTypeName(cq.questiontype),
	                                difficultylevel: cq.difficultylevel,
	                                stulist: cq.stu_list,
	                            }
	                            obj.chaptername = cq.chaptername;

	                            obj.wronglist.push(wrong);
	                        }
	                    })
	                    $scope.vm.hwclasswrongqlist.push(obj)
	                });

	            }
	        });
	    }
	    function _getQuestionTypeName(n) {
	        var name = '';
	        switch (n) {//1、单选题 2、多选题 3、填空题 4、解答题 5、综合题 6、判断题	
	            case 1:
	                name = '单选题';
	                break;
	            case 2:
	                name = '多选题';
	                break;
	            case 3:
	                name = '填空题';
	                break;
	            case 4:
	                name = '解答题';
	                break;
	            case 5:
	                name = '综合题';
	                break;
	            case 6:
	                name = '判断题';
	                break;
	            default:
	                break;
	        }
	        return name;
	    }

	    function _expendToggle(wrong) {
	        wrong.expend = !wrong.expend;
	    }
        
	    function _toHtml(html) {
	        return $sce.trustAsHtml(html);
	    }

	    


	}]);

});