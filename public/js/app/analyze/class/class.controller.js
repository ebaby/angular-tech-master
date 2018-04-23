define(['require', 'angular', 'components/com-funs', 'analyze/analyze.service', 'directives/com-directives'], function (require, ng, comfuns) {
	var module = ng.module('app.analyze');
	module.controller('ClassCtrl', ['$scope', '$state', '$timeout', '$interval', 'analyzeSrv', '$rootScope', function ($scope, $state, $timeout, $interval, analyzeSrv, $rootScope) {
	    //$scope.title = '学情分析';
        
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        pageindex: 1,
	        pagesize: 99999,
	        allpage:0,
	        currentclassid: $state.params.classid == '' ? 0 : $state.params.classid,
	        tabindex: -1,
	    }

	    $scope.selectClass = _selectClass;
	    $scope.selectDate = _selectDate;
	    $scope.goToStudent = _goToStudent;
	    $scope.goToPerson = _goToPerson;
	    $scope.goToKnown = _goToKnown;
	    $scope.prevHomeWork = _prevHomeWork;
	    $scope.nextHomeWork = _nextHomeWork;
	    $scope.goToHeightWrong = _goToHeightWrong;
	    $scope.checkTab = _checkTab;
	    $scope.removeHTMLTag = _removeHTMLTag;
		$scope.selectdatetime = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
	    $scope.lineEchartOptions = {
	        loadData: loadLineData,
	        id: 2
	    }
	    $scope.pieEchartOptions = {
	        loadData: loadPieData,
	        id: 1
	    }

	    function loadLineData(ec) {
	        $scope.vm.line_ec = ec;
	        _getTeacherClasslist();
	    }
	    function loadPieData(ec) {
	        $scope.vm.pie_ec = ec;
	        var timer = $interval(function () {
	            if ($scope.vm.currentclassid != 0) {
	                _getClassXueQingFenXiSorceLevel();
	                $interval.cancel(timer);
	            }

	        }, 300);
	    }

	    function _checkTab(tabIndex,node) {
	        if ($scope.vm.tabindex == tabIndex) {
	            $scope.vm.tabindex = tabIndex;
	            $scope.vm.checked = !$scope.vm.checked;
	            node.checked = !node.checked;
	        } else {
	            $scope.vm.tabindex = tabIndex;
	            $scope.vm.checked = false;
	            node.checked = true;
	        }

	    }

	    function _selectClass(classinfo, classindex) {
	        $scope.vm.classindex = classindex;
	        $scope.vm.currentclassid = classinfo.classid;
	        $scope.selectdatetime = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
	        _getTeacherClasslist();
	        _getClassXueQingFenXiSorceLevel();
	    }
	    
	    function _selectDate(date) {
	    	var newdate = new Date(date * 1000);
	    	$scope.selectdatetime = newdate.getFullYear() + "-" + (newdate.getMonth() + 1);
	    	_getClassXueQingFenXi();
	        _getClassHomeWorkList();
	        _getClassXueQingFenXiSorceLevel();
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
	                    
	                    if (!$scope.vm.classlist || $scope.vm.classlist.length == 0) {
	                        $scope.vm.classlist = result.data;
	                    }

	                    if ($scope.vm.currentclassid == 0) {
	                        $scope.vm.currentclassinfo = result.data[0];
	                        $scope.vm.currentclassid = result.data[0].classid;
	                    } else {
	                        angular.forEach(result.data, function (o, i) {
	                            if ($scope.vm.currentclassid == o.classid) {
	                                $scope.vm.currentclassinfo = o;
	                            }
	                        });
	                    }
	                    getDateList($scope.vm.currentclassinfo.createtime);
	                    _getClassXueQingFenXi();
	                    _getClassHomeWorkList();
	                    _getTeacherClassCharpterList();
	                    $scope.vm.tabindex = -1;                
	                } else {
	                    $scope.vm.classlist = [];
	                    $scope.vm.currentclassinfo = [];
	                }
	            }
	        });


	    }

	    //get date list
	    function getDateList(date) {
	        var beginDate = new Date(date * 1000);
	        var endDate = new Date();
	        var arry = [];
	        if (new Date(beginDate.getFullYear() + '/' + (beginDate.getMonth() + 1) + '/1 00:00:00').getTime() === new Date(endDate.getFullYear() + '/' + (endDate.getMonth() + 1) + '/1 00:00:00').getTime()) {
	            arry.push(endDate.getTime()/1000);
	        }
	        else{
	            var flag = true;
	            var count = 1;
	            arry.push(endDate.getTime() / 1000);
	            while (flag) {
	 
                  var preDate =new Date( endDate.setMonth(endDate.getMonth() - 1));
                  if (new Date(beginDate.getFullYear() + '/' + (beginDate.getMonth() + 1) + '/1 00:00:00').getTime() === new Date(preDate.getFullYear() + '/' + (preDate.getMonth() + 1) + '/1 00:00:00').getTime()||arry.length==5) {
                      
                      flag = false;
                  } 
                  arry.push(preDate.getTime() / 1000);
              }

	        }
	        //alert(arry.join(','))
	        $scope.vm.datelist = arry;

	    }
	    

	    //获取班级学情分析
	    function _getClassXueQingFenXiSorceLevel() {
	    	var begintime = changeDate($scope.selectdatetime).begintime;
			var endtime = changeDate($scope.selectdatetime).endtime;
	        var params = {
	            Token: $scope.vm.token,
	            classid: $scope.vm.currentclassid,
	            QueryBeginTime : begintime,
				QueryEndTime : endtime,
	            
	        }
	        analyzeSrv.getClassXueQingFenXiSorceLevel(params).then(function (result) {
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

	    //获取班级学情分析
	    function _getClassXueQingFenXi() {
	    	var begintime = changeDate($scope.selectdatetime).begintime;
			var endtime = changeDate($scope.selectdatetime).endtime;
	        var params = {
	            Token: $scope.vm.token,
	            classid:parseInt( $scope.vm.currentclassid),
	            QueryBeginTime : begintime,
				QueryEndTime : endtime,
	        }
	        analyzeSrv.getClassXueQingFenXi(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.classInfoItems = result.data;


	            }
	        });
	    }

	    //获取班级学情分析平均分总体趋势
	    function _getClassHomeWorkList() {
	    	var begintime = changeDate($scope.selectdatetime).begintime;
			var endtime = changeDate($scope.selectdatetime).endtime;
	        var params = {
	            Token: $scope.vm.token,
	            classid: parseInt($scope.vm.currentclassid),
	            PageIndex: $scope.vm.pageindex,
	            PageSize: $scope.vm.pagesize,
	            QueryBeginTime : begintime,
				QueryEndTime : endtime,
	        };
	        analyzeSrv.getClassHomeWorkList(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.homeworklist = result.data.homeworklist;//.reverse();
	                $scope.vm.allpage = result.data.pagecount;

	                var xdata = new Array();
	                var ydata = new Array();

	                $scope.vm.hwtotalcount = result.data.homeworklist.length;

	                angular.forEach($scope.vm.homeworklist, function (o, index) {
	                    var date = new Date(o.publishtime*1000);
	                    xdata.push((date.getMonth() + 1) + '/' + date.getDate());
//	                    xdata.push(o.lhname.length > 8 ? (o.lhname.substring(0,8)+'...') : o.lhname);
	                    ydata.push(o.averagescore);
	                });

//	                if ($scope.vm.homeworklist.length < 7) {
//	                    for (var i = 0; i < (7 - $scope.vm.homeworklist.length); i++) {
//	                        xdata.push('');
//	                        ydata.push(0);
//	                    }
//	                }

	                setLinecharts($scope.vm.line_ec, xdata, ydata);

	            }
	        });
	    }

	    function _goToStudent() {

	        $state.go('app.analyze.class.student', { classid: $scope.vm.currentclassid , date: $scope.selectdatetime});
	    }

	    function _goToPerson(student) {
	        $state.go('app.analyze.person', { upid: student.upid , date : $scope.selectdatetime ,createdate : $scope.vm.currentclassinfo.createtime});
	        //window.location.href = '/static/layout.html#/analyze/person/' + student.upid;
	    }
        	    
	    function setLinecharts(ec, xdata, ydata) {
	        var option = {
	            color: ["#84EBE5"],
	            grid: { x: 30, y: 10, x2: 20, y2: 30 },
	            tooltip: {
	                trigger: 'axis',
	                textStyle: {
						decoration: 'none',
						fontFamily: 'Verdana, sans-serif',
						fontSize: 15
					},
	                formatter: function(params) {
						var qs = $scope.vm.homeworklist[params[0].dataIndex];
//						return qs.lhname.split(" ")[0] + "<br/>平均分：" + qs.averagescore;
						return qs.lhname + "<br/>平均分：" + qs.averagescore;
					}
	            },
	            calculable: false,
	            xAxis: [
                {               	
                    type: 'category',
                    boundaryGap: false,
                    data: xdata
                }
	            ],
	            yAxis: [
                {
                	
                    type: 'value',
                    max:100,
                }
	            ],
	            series: [
                {
                    name: '得分',
                    type: 'line',
                    stack: '',
                    //itemStyle: { normal: { areaStyle: { type: 'default' } } },
                    data: ydata
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

	    function _goToKnown(chapter,known) {
	        $rootScope.known = known;
	        $state.go('app.analyze.class.known', { zsdid: known.zsdid, classid: $scope.vm.currentclassid, chapterid: chapter.chapterid });
	    }

	    function _prevHomeWork() {
	        $scope.vm.pageindex--;
	        _getClassHomeWorkList();
	    }

	    function _nextHomeWork() {

	        $scope.vm.pageindex++;
	        _getClassHomeWorkList();
	    }

	    //教师所教班级作业相关章列表 
	    function _getTeacherClassCharpterList() {
	        var params = {
	            Token: $scope.vm.token,
	            classid: parseInt($scope.vm.currentclassid)

	        };
	        analyzeSrv.getTeacherClassCharpterList(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.chapterlist = result.data;

	            }
	        });
	    }

	    //跳转获取班级学情分析章节对应高频错题的列表
	    function _goToHeightWrong(chapter) {
	        
	        $state.go('app.analyze.class.heightwrong', { classid: $scope.vm.currentclassid, chapterid: chapter.chapterid });
	    }

        //过滤html
	    function _removeHTMLTag(str) {
	        str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
	        str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
	        //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	        str = str.replace(/ /ig, '');//去掉 
	        return $.trim(str);
	    }
	    
	    //改变时间格式
		function changeDate(time){
			var begintime = time + "-1 00:00:00";
//			begintime = begintime.substring(0,19);
			begintime = begintime.replace(/-/g,'/'); 
			begintime = new Date(begintime).getTime();
			var index = time.indexOf("-");
			var nextmonth = parseInt(time.slice(index+1,time.length)) + 1;
			if(nextmonth >= 13){
				var endtime = time.slice(0,index) + "-" + (nextmonth-1) + "-31 23:59:59";
			}else{
				var endtime = time.slice(0,index) + "-" + nextmonth + "-1 00:00:00";
			}
//			endtime = endtime.substring(0,19);
			endtime = endtime.replace(/-/g,'/'); 
			endtime = new Date(endtime).getTime();
			return {
				begintime : begintime,
				endtime : endtime,
			}
		}



	}]);
	module.controller('ClassstudentCtrl', ['$scope', '$state', 'analyzeSrv', function ($scope, $state, analyzeSrv) {
	    //$scope.title = '学情分析';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        currentclassid: $state.params.classid,
	        selectdatetime:$state.params.date,
	    }
	    

	    initialize();
	    function initialize() {
	        _getClassXueQingFenXiSorceLevel();
	    }



	    //获取班级学情分析
	    function _getClassXueQingFenXiSorceLevel() {
	    	var begintime = changeDate($scope.vm.selectdatetime).begintime;
			var endtime = changeDate($scope.vm.selectdatetime).endtime;
	        var params = {
	            Token: $scope.vm.token,
	            classid: $scope.vm.currentclassid,
	            QueryBeginTime : begintime,
				QueryEndTime : endtime,
	        }
	        analyzeSrv.getClassXueQingFenXiSorceLevel(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.scorelevel = result.data.scorelevel;

	            }
	        });
	    }
	    
	    //改变时间格式
		function changeDate(time){
			var begintime = time + "-1 00:00:00";
//			begintime = begintime.substring(0,19);
			begintime = begintime.replace(/-/g,'/'); 
			begintime = new Date(begintime).getTime();
			var index = time.indexOf("-");
			var nextmonth = parseInt(time.slice(index+1,time.length)) + 1;
			if(nextmonth >= 13){
				var endtime = time.slice(0,index) + "-" + (nextmonth-1) + "-31 23:59:59";
			}else{
				var endtime = time.slice(0,index) + "-" + nextmonth + "-1 00:00:00";
			}
//			endtime = endtime.substring(0,19);
			endtime = endtime.replace(/-/g,'/'); 
			endtime = new Date(endtime).getTime();
			return {
				begintime : begintime,
				endtime : endtime,
			}
		}



	}]);
	module.controller('ClassknownCtrl', ['$scope', '$state', 'analyzeSrv', '$sce', function ($scope, $state, analyzeSrv, $sce) {
	    //$scope.title = '学情分析';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        zsdid: $state.params.zsdid,
	        classid: $state.params.classid,
	        chapterid: $state.params.chapterid,
	    }

	    $scope.toHtml = _toHtml;

	    initialize();
	    function initialize() {

	        _getHomeWorkClassAnalsysZsdQuestionList();
	    }



	    //获取班级学情分析知识点对应题的列表
	    function _getHomeWorkClassAnalsysZsdQuestionList() {
	        var params = {
	            Token: $scope.vm.token,
	            ZSDID: $scope.vm.zsdid,
	            classid: $scope.vm.classid,
	            ChapterList: [{ ChapterID: $scope.vm.chapterid }]
	        }
	        analyzeSrv.getHomeWorkClassAnalsysZsdQuestionList(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.questionlist = result.data.questionlist;

	            }
	        });
	    }

	    function _toHtml(html) {
	        return $sce.trustAsHtml(html);
	    }


	}]);
	module.controller('HeightWrongCtrl', ['$scope', '$state', 'analyzeSrv', '$sce', function ($scope, $state, analyzeSrv, $sce) {
	    //$scope.title = '学情分析';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        classid: $state.params.classid,
	        chapterid: $state.params.chapterid,
	        pageindex: 1,
	        pagesize: 10
	        
	    }

	    $scope.toHtml = _toHtml;
	    $scope.selectWrong = _selectWrong;
	    $scope.expendToggle = _expendToggle;

	    initialize();
	    function initialize() {
	        _getHomeWorkClassAnalsysCharpterIdUsuallyWrongList();
	    }

	    $scope.gplistOptions = {
	        goNextpage: _goNextpageGP,
	        allpage: 0
	    }

	    function _goNextpageGP(pageindex) {
	        $scope.vm.pageindex = pageindex;
	        _getHomeWorkClassAnalsysCharpterIdUsuallyWrongList();
	        //alert(pageindex);
	    }

	    //教师所教班级作业相关章列表 
	    function _getTeacherClassCharpterList() {
	        var params = {
	            Token: $scope.vm.token,
	            classid: parseInt($scope.vm.classid)

	        };
	        analyzeSrv.getTeacherClassCharpterList(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.chapterlist = result.data;

	                angular.forEach($scope.vm.chapterlist, function (obj,index) {
	                    if ($scope.vm.charpterid == obj.charpterid) {
	                        $scope.vm.charptermodel = obj;
	                    }
	                });

	                 _getHomeWorkClassAnalsysCharpterIdUsuallyWrongList();

	            }
	        });
	    }

	    //获取班级学情分析章节对应高频错题的列表
	    function _getHomeWorkClassAnalsysCharpterIdUsuallyWrongList() {
	        var params = {
	            Token: $scope.vm.token,
	            ClassID: $scope.vm.classid,
	            ChapterList: [parseInt( $scope.vm.chapterid) ],
	            PageIndex: $scope.vm.pageindex,
	            PageSize: $scope.vm.pagesize,

	        };
	        analyzeSrv.getHomeWorkClassAnalsysCharpterIdUsuallyWrongList(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.chapterwrong = result.data;
	                $scope.chapterwrong.wrongdata = [];
	                //$scope.vm.boxstatus = false;
	                $scope.gplistOptions.allpage = result.data.pagecount;

	                var chapters = [];
	                angular.forEach($scope.chapterwrong.questionlist, function (o, i) {
	                    //var temp = { charpterid: o.charpterid, charptername: '' };
	                    if (chapters.indexOf(o.chapterid) == -1) {
	                        chapters.push(o.chapterid);
	                    }
	                });


	                angular.forEach(chapters, function (ch, index) {
	                    var obj = {
	                        chapterid: ch,
	                        wronglist: []
	                    }
	                    angular.forEach(result.data.questionlist, function (cq, index) {
	                        if (obj.chapterid == cq.chapterid) {
	                            var wrong = {
	                                timuxushu: cq.timuxushu,
	                                wrongnum: cq.wrongnum,
	                                wrongrate: cq.wrongrate,
	                                xuanxiang: cq.xuanxiang,
	                                questiontypename: _getQuestionTypeName(cq.questiontype),
	                                difficultylevel: cq.difficultylevel,
	                                classanalysisuwqstudentlist: cq.classanalysisuwqstudentlist,
	                            }
	                            obj.chaptername = cq.chaptername;

	                            obj.wronglist.push(wrong);
	                        }
	                    })
	                    $scope.chapterwrong.wrongdata.push(obj)
	                });



	            }
	        });

	    }

	    //选择高频错题
	    function _selectWrong() {
	        $scope.vm.chapterid = $scope.vm.chaptermodel.charpterid;

	        _getHomeWorkClassAnalsysCharpterIdUsuallyWrongList();
	    }


	    function _toHtml(html) {
	        return $sce.trustAsHtml(html);
	    }


	    function _expendToggle(wrong) {
	        wrong.expend = !wrong.expend;
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

	}]);
});