define(['require', 'angular', 'components/com-funs', 'analyze/analyze.service', 'directives/com-directives'], function (require, ng, comfuns) {
	var module = ng.module('app.analyze');
	module.controller('PersonCtrl', ['$scope', '$state', '$timeout', 'analyzeSrv', function ($scope, $state, $timeout, analyzeSrv) {
	    //$scope.title = '学情分析';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        upid: $state.params.upid,
	        pageindex: 1,
	        pagesize:99999,
	        allpage:0,
	        selectdatetime :$state.params.date,
	        createdate :$state.params.createdate,
	    }
	
	    $scope.prevHomeWork = _prevHomeWork;
	    $scope.nextHomeWork = _nextHomeWork;
	    $scope.checkTab = _checkTab;
	    $scope.goToKnown = _goToKnown;
	    $scope.selectDate = _selectDate;
	    
	    $scope.echartOptions = {
	        loadData: loadData
	    }

	    initialize();
	    function initialize() {       
	        _getStusentAnalysis();
	    }
	    //选择时间
		 function _selectDate(date) {
	    	var newdate = new Date(date * 1000);
	    	$scope.vm.selectdatetime = newdate.getFullYear() + "-" + (newdate.getMonth() + 1);
	    	_getStusentAnalysis();
	    	_getStusentAnalysisHistroy();
	    }
	    function _checkTab(tabIndex, node) {
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
        
	    //获取班级学情分析
	    function _getStusentAnalysis() {
	    	if ($scope.vm.selectdatetime) {
	    		var begintime = changeDate($scope.vm.selectdatetime).begintime;
				var endtime = changeDate($scope.vm.selectdatetime).endtime;
	        	var params = {
	            	Token: $scope.vm.token,
	            	upid: $scope.vm.upid,
	            	QueryBeginTime : begintime,
					QueryEndTime : endtime,

	        	}
	    	} else{
	        	var params = {
	            	Token: $scope.vm.token,
	            	upid: $scope.vm.upid,
	        	}
	        	$(".showtime").css("display","none");
	    	}
	    	
	        analyzeSrv.getStusentAnalysis(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.personItems = result.data;
	            }
	        });
	        if ($scope.vm.createdate) {
	        	getDateList($scope.vm.createdate);
	        }
	        
	    }

	    //获取个人学情分析历史作业
	    function _getStusentAnalysisHistroy() {
	    	if ($scope.vm.selectdatetime) {
	    		var begintime = changeDate($scope.vm.selectdatetime).begintime;
				var endtime = changeDate($scope.vm.selectdatetime).endtime;
	        	var params = {
	            	Token: $scope.vm.token,
	            	UPID: $scope.vm.upid,
	            	PageIndex: $scope.vm.pageindex,
	            	PageSize: $scope.vm.pagesize,
	            	QueryBeginTime : begintime,
					QueryEndTime : endtime,

	        	};
	    	} else{
	    		var params = {
	            	Token: $scope.vm.token,
	            	UPID: $scope.vm.upid,
	            	PageIndex: $scope.vm.pageindex,
	            	PageSize: $scope.vm.pagesize,
	        	};
	        	$(".showtime").css("display","none");
	    	}
	    	
	        analyzeSrv.getStusentAnalysisHistroy(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.homeworkilist = result.data.homeworklist.reverse();
	                $scope.vm.allpage = result.data.pagecount;

	                var xdata = new Array();
	                var ydata = new Array();
	                angular.forEach($scope.vm.homeworkilist, function (o, index) {
	                    var date = new Date(o.publishtime*1000);
	                    xdata.push((date.getMonth() + 1) + '/' + date.getDate());
//	                    xdata.push(o.lhname);
	                    ydata.push(o.score);
	                });

	                setLinecharts($scope.vm.ec, xdata, ydata);

	            }
	        });
	    }
	    
	    //get date list
	    function getDateList(date) {
	        var beginDate = new Date(date * 1000);
	        var endDate = new Date();
	        var arry = [];
	        if (new Date(beginDate.getFullYear() + '-' + (beginDate.getMonth() + 1)).getTime() === new Date(endDate.getFullYear() + '-' + (endDate.getMonth() + 1)).getTime()) {
	            arry.push(endDate.getTime()/1000);
	        }
	        else{
	            var flag = true;
	            var count = 1;
	            arry.push(endDate.getTime() / 1000);
	            while (flag) {
	 
                  var preDate =new Date( endDate.setMonth(endDate.getMonth() - 1));
                  if (new Date(beginDate.getFullYear() + '-' + (beginDate.getMonth() + 1)).getTime() === new Date(preDate.getFullYear() + '-' + (preDate.getMonth() + 1)).getTime()||arry.length==5) {
                      
                      flag = false;
                  } 
                  arry.push(preDate.getTime() / 1000);
              }

	        }
	        //alert(arry.join(','))
	        $scope.vm.datelist = arry;

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

	    function loadData(ec) {
	        $scope.vm.ec = ec;
	        //console.log(ec);
	        _getStusentAnalysisHistroy();

	    }

	    function _scoreDesc(n) {
	        var name = ''
	        if (n < 60)
	        { name = '不及格'; }
	        else if (n >= 60 && n < 80) {
	            name = '一般';
	        } else if (n >= 80 && n < 90) {
	            name = '良好';
	        } else if (n >= 90 && n <= 100) {
	            name = '优秀';
	        }

	        return name;
	    }

	    function setLinecharts(ec, xdata, ydata) {
	        option = {
	            color: ["#84EBE5"],
	            grid: { x: 30, y: 10, x2: 20, y2: 30 },
	            tooltip: {
	                trigger: 'axis',
	                formatter: function(params) {
						var qs = $scope.vm.homeworkilist[params[0].dataIndex];
//						return qs.lhname.split(" ")[0] + "<br/>平均分：" + qs.score;
						return qs.lhname + "<br/>平均分：" + qs.score;
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
                    max: 100,
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


	    function _prevHomeWork() {
	        $scope.vm.pageindex--;
	        _getStusentAnalysisHistroy();
	    }

	    function _nextHomeWork() {

	        $scope.vm.pageindex++;
	        _getStusentAnalysisHistroy();
	    }


	    function _goToKnown(chapter, known) {
	        $rootScope.known = known;
	        $state.go('app.analyze.class.known', { zsdid: known.zsdid, classid: $scope.vm.currentclassid, chapterid: chapter.chapterid });
	    }

	}]);
});