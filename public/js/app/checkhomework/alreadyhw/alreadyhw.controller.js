define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'checkhomework/checkhomework.service'], function (require, ng, comfuns) {
	var module = ng.module('app.checkhomework');
	module.controller('AlreadyCtrl', ['$scope', 'checkHomeWorkSrv', '$state', '$rootScope', 'toastr', function ($scope, checkHomeWorkSrv, $state, $rootScope, toastr) {
	    //$scope.title = '布置作业';
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        pageindex: 0,
	        pagesize: 10,
            allpage:0
	    }

	    $scope.yplistOptions = {
	        goNextpage: _goNextpage,
	        allpage: 0
	    }

	    $scope.goToSAnalyze = _goToSAnalyze;
	    $scope.goToStudents = _goToStudents;
	    $scope.goToStatistics = _goToStatistics;

	    initialize();
	    function initialize() {

	        _getCheckList();

	    }
	    $scope.pageOptions = {
	        scrollLoaddata: _getCheckList
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

	    function _goNextpage(pageindex) {
	        $scope.vm.pageindex = pageindex;
	        _getCheckList();
	        //alert(pageindex);
	    }
	    //获取作业列表
	    function _getCheckList() {
	        if ($state.current.name != "app.checkhomework.alreadyhw") return;
            
	        $scope.vm.pageindex = $scope.vm.pageindex + 1;
	        var params = {
	            Token: $scope.vm.token,
	            PageIndex: $scope.vm.pageindex,
	            Type: 1,
	            PageSize: $scope.vm.pagesize,
	            CheckType: 0,
	            ClassID:0

	        };
	        if ($scope.vm.allpage != 0 && $scope.vm.pageindex > $scope.vm.allpage) {
	            $scope.vm.pageindex = $scope.vm.allpage;
	            return;
	        }
	        checkHomeWorkSrv.getCheckList(params).then(function (result) {
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

	                //$scope.vm.classidlist = result.data[0].classidlist;
	                //if ($scope.vm.allpage == 0) {
	                //    $scope.vm.allpage = result.data[0].allpage;
	                //}
	                //$scope.vm.classidlist = result.data[0].classidlist;
	                //if (!$scope.vm.pigailist) {
	                //    $scope.vm.pigailist = [];
	                //}
	                //angular.forEach(result.data[0].pigailist, function (dp, index) {
	                //    $scope.vm.pigailist.push(dp);
	                //})
	                //if ($scope.vm.classidlist.length < 3) {

	                //    $scope.vm.classindex = 6;
	                //} else {
	                //    $scope.vm.classindex = 12 / $scope.vm.classidlist.length;
	                //    if ($scope.vm.classindex < 3) {
	                //        $scope.vm.classindex = 3;
	                //    }
	                //}
	                //angular.forEach($scope.vm.classidlist, function (i, j) {
	                //    angular.forEach($scope.vm.colorItems, function (k, l) {

	                //        if (j === l) {

	                //            i.bgcolor = k;
	                //            return false;
	                //        }

	                //    });

	                //});
	                //console.log($scope.vm.classidlist);
	            }

	            //console.log(result.data)
	        });
	    }

	    //重新批改作业
	    function _goToStudents(hw) {
	        $rootScope.tchwinfo = hw;
	        $state.go('app.checkhomework.alreadyhw.student', { tchwlogid: hw.tchwlogid });
	    }

	    //跳转学情分析
	    function _goToSAnalyze(hw) {
	        $rootScope.selectTab(3, 0, true);
	        $state.go('app.analyze.period.detail', { tchwlogid: hw.tchwlogid });
	    }

	    //设置提交截止时间 
	    function _updateSubendTime(time) {
	        var params = {
	            Token: $scope.vm.token,
	            TCHWLogID: $scope.vm.currenthw.tchwlogid,
	            SubEndTime: new Date(time.replace(/-/g, "/")).getTime() / 1000,//  "\/Date(" + (new Date(time.replace(/-/g, "/"))).getTime() + ")\/"

	        };
	        checkHomeWorkSrv.updateSubendTime(params).then(function (result) {
	            if (result.code === 0) {
	                toastr.success('设置成功', '');

	                $scope.vm.currenthw.subendtime = new Date(time.replace(/-/g, "/")).getTime() / 1000;
	            } 
	        });
	    }

	    //跳转到作业统计
	    function _goToStatistics(home) {
	        $rootScope.statisticshw = home;
	        $state.go('app.sethomework.statistics', { tchwlogid: home.tchwlogid });
	    }

	}]);
    //获取学生列表
	module.controller('AlreadystudentCtrl', ['$scope', '$state', '$rootScope', 'checkHomeWorkSrv', 'toastr', function ($scope, $state, $rootScope, checkHomeWorkSrv, toastr) {
	    //$scope.title = '布置作业';
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        tabindex: 0,
	        hwindex: 0,
	        tchwlogid: $state.params.tchwlogid
	    }

	    $scope.getHomeWorkSublog = _getHomeWorkSublog;
	    $scope.selectTab = _selectTab;
	    $scope.goToDetail = _goToDetail;

	    $scope.reSubmitWorkDialog = _reSubmitWorkDialog;
	    $scope.allChecked = _allChecked;
	    $scope.selectStudent = _selectStudent;
	    

	    $scope.pigaiItem = [];


	    var rootHandle = $rootScope.$watchCollection('tchwinfo', function (newvalue, oldvalue) {
	        if (newvalue) {
	            $scope.vm.tchwinfo = $rootScope.tchwinfo;
	            rootHandle();
	        }

	    })

	    initialize();
	    function initialize() {

	        _getHomeWorkSublog();

	    }

	    function _selectTab(tabIndex) {
	        $scope.vm.tabindex = tabIndex;

	    }
	    
	    function _allChecked() {
	        $scope.vm.allchecked = !$scope.vm.allchecked;
	        angular.forEach($scope.vm.sublogItems.uncommitlist, function (unst, index) {
	            unst.checked = $scope.vm.allchecked;
	        })
	        _getSelectnum();
	    }
	    function _selectStudent(s) {
	        s.checked = !s.checked;
	        _getSelectnum();
	        if ($scope.vm.num === $scope.vm.sublogItems.uncommitlist.length) {
	            $scope.vm.allchecked = true;
	        } else {
	            $scope.vm.allchecked = false;
	        }
	    }

	    function _getSelectnum() {
	        $scope.vm.num = 0;
	        angular.forEach($scope.vm.sublogItems.uncommitlist, function (unst, index) {
	            if (unst.checked) {
	                $scope.vm.num = $scope.vm.num + 1;
	            }
	        })
	    }
	    //获取学生列表
	    function _getHomeWorkSublog() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid

	        };

	        checkHomeWorkSrv.getHomeWorkSublog(params).then(function (result) {
	            if (result.code === 0) {

	                //$scope.vm.sublogItems = result.data.settinghomework;

	                $scope.vm.commitlist = result.data.commitlist;
	                $scope.vm.uncommitlist = result.data.uncommitlist;




	            } 
	        });
	    }
	    function _reSubmitWorkDialog(allstudent) {
	        _cuiSubmitworkpl(allstudent);
	        //$scope.vm.againreason = "";
	        //var nestedConfirmDialog = ngDialog.openConfirm({
	        //    template:
	        //            '<div style="padding:1em;">' +
	        //            '<p>提醒学生重新提交原因</p>' +
	        //            '<div><textarea ng-model="vm.againreason" style="width:100%;" placeholder="提醒学生重新提交原因"></textarea></div>' +
	        //            '<div class="ngdialog-buttons">' +
	        //                '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消' +
	        //                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="reSubmitWork(' + allstudent + ')">确定</button>' +
	        //            '</div>' +
	        //            '</div>',
	        //    plain: true,
	        //    width: 400,
	        //    scope: $scope,
	        //    className: 'ngdialog-theme-default',
	        //});
	    }

	    function _cuiSubmitworkpl(allstudent) {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid,
	            studentlist: []
	        }
	        angular.forEach($scope.vm.sublogItems.uncommitlist, function (su, index) {
	            if (su.checked) {
	                params.studentlist.push(su.upid);
	            }
	        })

	        checkHomeWorkSrv.cuiSubmitworkpl(params).then(function (result) {
	            if (result.code === 0) {
	                toastr.success("提醒成功", '');
	            } 
	        });
	    }
	    function _goToDetail(studen) { //app.checkhomework.unalreadyhw.unalreadyhwstudent
	        //studen
	        //$scope.vm.currentsublogid = hw.tchwlogid;
	        //$state.go('app.checkhomework.alreadyhw.detail', { tchwlogid: $scope.vm.tchwlogid, sublogid: studen.sublogid, upid: studen.upid });
	        $state.go('app.checkhomework.alreadyhw.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: studen.sublogid, upid: studen.upid, type: 2, cstatus: studen.correctstatus });
	    }



	}]);
    //获取重批作业信息
	module.controller('AlreadydetailCtrl', ['$scope', '$state', '$sce', 'checkHomeWorkSrv', 'toastr', 'ngDialog', '$rootScope', function ($scope, $state, $sce, checkHomeWorkSrv, toastr, ngDialog, $rootScope) {
	    var date = new Date();
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        tabindex: 0,
	        currenthwindex: 0,
	        tchwlogid: $state.params.tchwlogid,
	        sublogid: $state.params.sublogid,
	        upid: $state.params.upid,
	        currentimgpageindex: 1,
	        currentimgtotalcount: 0,
	        commentid: 0,
	        setdatetime: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
	        currentcomment: [],
	        againreason: ''
	    }

	    var rootHandle = $rootScope.$watchCollection('tchwinfo', function (newvalue, oldvalue) {
	        if (newvalue) {
	            $scope.vm.tchwinfo = $rootScope.tchwinfo;
	            rootHandle();
	        }

	    })

	    $scope.imgoptions = {
	    }
	    $scope.pigaiItem = [];

	    $scope.selectQuestion = _selectQuestion;
	    $scope.correctHomeWork = _correctHomeWork;
	    $scope.imgPrevPage = _imgPrevPage;
	    $scope.imgNextPage = _imgNextPage;
	    $scope.selectComment = _selectComment;
	    $scope.checkNextStudent = _checkNextStudent;
	    $scope.reSubmitWorkDialog = _reSubmitWorkDialog;
	    $scope.reSubmitWork = _reSubmitWork;
	    $scope.commentDialog = _commentDialog;
	    $scope.toHtml = _toHtml;
	    $scope.getHomeWorkQuestionCommoncClassList = _getHomeWorkQuestionCommoncClassList;
	    $scope.checkFinsh = _checkFinsh;
	    $scope.selectCommont = _selectCommont;
	    $scope.deleteComment = _deleteComment;
	    $scope.closeDialog = _closeDialog;

	    $scope.selectRemark = _selectRemark;
	    //$scope.submitRemarks = _submitRemarks;
	    $scope.selectSimpleremark = _selectSimpleremark;
	    $scope.getHomeWorkQuestionCommonList = _getHomeWorkQuestionCommonList

	    $scope.openRef = _openRef;
	    $scope.goHwresult = _goHwresult;

	    initialize();
	    function initialize() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid,//188,//640,//
	            sublogid: $scope.vm.sublogid,//143,//602,
	            qid: 0,
	            type: 1
                

	        };
	        _checkOutQuestionList(params);
	        //_getHomeWorkQuestionCommoncClassList();
	        _getSimpleremark();
	    }

	    function _openRef() {
	        $scope.vm.reopen = !$scope.vm.reopen;
	    }
	    function _goHwresult() {
	        $state.go('app.checkhomework.alreadyhw.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: $state.params.sublogid,upid: $state.params.upid });
	    }
	    function _closeDialog() {
	        ngDialog.closeAll();
	    }
	    function drawShape() {
	        $scope.imgoptions.cocyctx.drawImage($scope.imgoptions.img, 0, 0);

	        var ctx = $scope.imgoptions.cocyctx;
	        var p = {
	            width: $scope.currentPigaiItem.answer.width,
	            height: $scope.currentPigaiItem.answer.height,
	            left: $scope.currentPigaiItem.answer.left,
	            top: $scope.currentPigaiItem.answer.top,
	            picsrcwidth: $scope.currentPigaiItem.answer.picsrcwidth,
	            picsrcheight: $scope.currentPigaiItem.answer.picsrcheight
	        }

	        var width = parseInt(p.width * p.picsrcwidth);
	        var height = parseInt(p.height * p.picsrcheight);
	        var x = p.picsrcwidth * p.left;
	        var y = p.picsrcheight * p.top;
	        //var ctx = canvas.getContext('2d');
	        ctx.beginPath();
	        ctx.moveTo(x, y);
	        ctx.lineTo(x + width, y);
	        ctx.lineTo(x + width, y + height);
	        ctx.lineTo(x, y + height);
	        ctx.closePath();
	        ctx.lineWidth = 2;
	        ctx.lineCap = "round";
	        ctx.strokeStyle = 'rgba(6,148,234,0.8)';
	        ctx.stroke();

	        //绘制所有批改作业状态
	        angular.forEach($scope.vm.questioncorrectlist, function (pg, index) {
	            if (pg.answer.pid == $scope.currentPigaiItem.answer.pid) {
	                var p = pg.answer;
	                //if (pg.child.length > 0) {
	                //    p = pg.child[0].answer;
	                //}
	                var width = parseInt(p.width);
	                var height = parseInt(p.height);
	                var x = p.picsrcwidth * p.left;
	                var y = p.picsrcheight * p.top;
	                var ctx = document.getElementById('canvasimg').getContext('2d');
	                var startX = width / 2 + 30;
	                var startY = height / 2 - 10;
	                if (pg.correct.answerstatus == 3) {
	                    //错误
	                    ctx.beginPath()
	                    ctx.moveTo(x + startX, y + startY);
	                    ctx.lineTo(x + startX - 30, y + startY + 30);
	                    ctx.closePath();
	                    ctx.lineWidth = 3;
	                    ctx.strokeStyle = "red";
	                    ctx.lineCap = "round";
	                    ctx.stroke();
	                    ctx.beginPath()
	                    ctx.moveTo(x + startX - 30, y + startY);
	                    ctx.lineTo(x + startX, y + startY + 30);
	                    ctx.closePath();
	                    ctx.lineWidth = 3;
	                    ctx.strokeStyle = "red";
	                    ctx.lineCap = "round";
	                    ctx.stroke();
	                } else if (pg.correct.answerstatus == 2) {
	                    //半对
	                    ctx.beginPath()
	                    ctx.moveTo(x + startX, y + startY);
	                    ctx.lineTo(x + startX - 30, y + startY + 20);
	                    ctx.closePath();
	                    ctx.lineWidth = 3;
	                    ctx.strokeStyle = "red";
	                    ctx.lineCap = "round";
	                    ctx.stroke();
	                    ctx.beginPath()
	                    ctx.moveTo(x + startX - 40, y + startY + 5);
	                    ctx.lineTo(x + startX - 30, y + startY + 20);
	                    ctx.closePath();
	                    ctx.lineWidth = 3;
	                    ctx.strokeStyle = "red";
	                    ctx.lineCap = "round";
	                    ctx.stroke();
	                    ctx.beginPath()
	                    ctx.moveTo(x + startX - 20, y + startY + 2);
	                    ctx.lineTo(x + startX - 15, y + startY + 20);
	                    ctx.closePath();
	                    ctx.lineWidth = 3;
	                    ctx.strokeStyle = "red";
	                    ctx.lineCap = "round";
	                    ctx.stroke();
	                } else if (pg.correct.answerstatus == 1) {
	                    //正确
	                    ctx.beginPath()
	                    ctx.moveTo(x + startX, y + startY);
	                    ctx.lineTo(x + startX - 30, y + startY + 20);
	                    ctx.closePath();
	                    ctx.lineWidth = 3;
	                    ctx.strokeStyle = "red";
	                    ctx.lineCap = "round";
	                    ctx.stroke();
	                    ctx.beginPath()
	                    ctx.moveTo(x + startX - 40, y + startY + 5);
	                    ctx.lineTo(x + startX - 30, y + startY + 20);
	                    ctx.closePath();
	                    ctx.lineWidth = 3;
	                    ctx.strokeStyle = "red";
	                    ctx.lineCap = "round";
	                    ctx.stroke();
	                }

	            }
	        });

	    }

	    function drawImg(img) {

	        var cocv = document.getElementById('canvasimg');
	        cocyctx = cocv.getContext("2d");
	        cocv.onclick = function (event) {

	            var point = windowTocanvas(cocv, event.clientX, event.clientY)
	            var x = parseInt(point.x);
	            var y = parseInt(point.y);
	            //document.getElementById("input_window").value=event.clientX+"--"+event.clientY;
	            //document.getElementById("input_canvas").value=x+"--"+y;

	            //alert('w:' + event.clientX + ',' + event.clientY+'\r\n' + 'c:' + x + ','+y)
	            cimgOnceclick(point);
	        }


	        if (cocyctx) {
	            $scope.imgoptions.cocyctx = cocyctx;
	            $scope.imgoptions.img = img;
	            cocyctx.drawImage(img, 0, 0);
	            drawShape();
	            //drawShape(childans, pigalist, pid);
	        }
	    }

	    function windowTocanvas(canvas, x, y) {
	        var bbox = canvas.getBoundingClientRect();
	        return {
	            x: x - bbox.left * (canvas.width / bbox.width),
	            y: y - bbox.top * (canvas.height / bbox.height)
	        };

	    }
	    function _selectSimpleremark(sr) {
	        _selectCommont(sr, !sr.checked);
	    }
	    function _getSimpleremark() {
	        var params = {
	            Token: $scope.vm.token,
	        };
	        checkHomeWorkSrv.getSimpleremark(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.cidsimplelist = result.data;
	            } 
	        });
	    }
	    function cimgOnceclick(point) {
	        //if ($scope.vm.reimg) return;
	        $scope.$apply(function () {
	            // $scope.reRender = rerender;
	            for (var i = 0, len = $scope.vm.questioncorrectlist.length; i < len; i++) {
	                var ap = $scope.vm.questioncorrectlist[i];
	                if (ap.answer.pid == $scope.currentPigaiItem.answer.pid) {
	                    for (var j = 0, jlen = ap.bounds.length; j < jlen; j++) {
	                        if (ap.bounds[j].pid == $scope.currentPigaiItem.answer.pid) {
	                            if (point.x > ap.bounds[j].minx && point.x < ap.bounds[j].maxx && point.y > ap.bounds[j].miny && point.y < ap.bounds[j].maxy) {

	                                $("#checkcontrol").scrollTop(0);

	                                var quesinfo = $scope.vm.questioncorrectlist[i];
	                                //$scope.correct["selectcorrect"] = $scope.vm.sublogItems.pigailist[i];
	                                //$scope.imgzoomoption['quesinfo'] = quesinfo;
	                                //var childans = [], pid = null;
	                                //if (quesinfo.child && quesinfo.child.length > 0) {
	                                //    angular.forEach(quesinfo.child, function (ca, index) {
	                                //        if (!pid) {
	                                //            pid = ca.answer.pid;
	                                //            childans.push(ca.answer);
	                                //        } else if (pid == ca.answer.pid) {
	                                //            childans.push(ca.answer);
	                                //        }
	                                //    });
	                                //} else {
	                                //    childans.push(quesinfo.answer);
	                                //}
	                                //rerender($scope.correct["aninfo"].pigailist, childans, $scope.vm.imgpid);
	                                //alert(i)
	                                $scope.vm.currenthwindex = i;
	                                $scope.currentPigaiItem = $scope.vm.questioncorrectlist[i];
	                                _selectQuestion($scope.vm.questioncorrectlist[i], i);
	                                loadImage(drawImg);
	                                return;
	                            }
	                        }
	                    }
	                }
	            }
	        })


	    }

	    function setMinMaxPoint() {
	        //var pigailist = $scope.correct["aninfo"].pigailist;
	        var getBound = function (answer) {
	            //var ratio = zoomfactor / $scope.vm.initscale;
	            var minX = parseFloat(answer.picsrcwidth) * parseFloat(answer.left);
	            var minY = parseFloat(answer.picsrcheight) * parseFloat(answer.top);
	            var maxX = minX + parseFloat(answer.width * answer.picsrcwidth);
	            var maxY = minY + parseFloat(answer.height * answer.picsrcheight);
	            //$scope.vm["zoomfactor"] = zoomfactor;
	            if (parseFloat(answer.width) == 0 && parseFloat(answer.height) == 0) {
	                minX = 99999;
	                minY = 99999;
	                maxX = -99999;
	                maxY = -99999
	            }
	            return {
	                pid: answer.pid,
	                minx: minX,
	                miny: minY,
	                maxx: maxX,
	                maxy: maxY
	            }
	        }
	        angular.forEach($scope.vm.questioncorrectlist, function (p, index) {
	            p.bounds = [];

	            if (parseFloat(p.answer.width) != 0 && parseFloat(p.answer.height) != 0) {
	                var mainpoint = getBound(p.answer);
	                p.bounds.push(mainpoint);
	            }
	            //if (p.child.length > 0) {
	            //    angular.forEach(p.child, function (pc, index) {
	            //        var cbound = getBound(pc.answer);
	            //        p.bounds.push(cbound);
	            //        //if (cbound.minx < p.bound.minx) {
	            //        //    p.bound.minx = cbound.minx;
	            //        //}
	            //        //if (cbound.miny < p.bound.miny) {
	            //        //    p.bound.miny = cbound.miny;
	            //        //}
	            //        //if (cbound.maxx > p.bound.maxx) {
	            //        //    p.bound.maxx = cbound.maxx;
	            //        //}
	            //        //if (cbound.maxy > p.bound.maxy) {
	            //        //    p.bound.maxy = cbound.maxy;
	            //        //}
	            //    })

	            //}
	        })
	        //console.log($scope.correct["aninfo"]);
	    }

	    function loadImage(loadedCallback) {
	        //创建一个Image对象，实现图片的预下载    
	        img = new Image();
	        //绑定onload事件
	        img.onload = function () {
	            //避免循环加载
	            img.onload = null;
	            //预加载成功后执行回调函数
	            loadedCallback(img);
	        }
	        img.src = $scope.currentPigaiItem.answer.picsource;// imgurl;
	    }

	    //获取作业
	    function _checkOutQuestionList(params) {

	        checkHomeWorkSrv.checkOutQuestionList(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.settinghomework = result.data.settinghomework;
	                $scope.vm.studentinfo = result.data.studentinfo;
	                $scope.vm.correctpagelist = result.data.correctpagelist;
	                $scope.vm.submithomework = result.data.submithomework;
	                $scope.vm.questioncorrectlist = result.data.questioncorrectlist;




	                //$scope.vm.sublogid = result.data[0].sublogid;
	                //$scope.vm.upid = result.data[0].upid;
	                //$scope.vm.hwid = result.data[0].hwid;


	                //$scope.vm.currentimgtotalcount = result.data[0].correctpagelist.length;

	                $scope.currentPigaiItem = $scope.vm.questioncorrectlist[$scope.vm.currenthwindex];
	                _selectQuestion($scope.vm.questioncorrectlist[0], 0);
	                setMinMaxPoint();
	                loadImage(drawImg);

	            } else {

	                //调到作业学情分析
	                $state.go('app.analyze.period.detail', { tchwlogid: $scope.vm.tchwlogid });
	                //$state.go('app.checkhomework.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: $scope.vm.sublogid, upid: $scope.vm.upid });
	                
	            }
	        });
	    }

	    function _selectQuestion(item, index) {
	        $scope.vm.reopen = false;
	        $scope.vm.currenthwindex = index;
	        $scope.currentPigaiItem = item;

	        $scope.vm.currentcomment = [];

	        angular.forEach($scope.vm.correctpagelist, function (vs, index) {
	            if (item.answer.pid == vs.pid) {
	                $scope.vm.currentimgpageindex = index;
	            }
	        });
	        //angular.forEach($scope.vm.cidsimplelist, function (asc, index) {
	        //    asc.checked = false;
	        //})
	        ////$scope.currentPigaiItem.pigai.cidlist = [{ cid: 73, ctitle: "测试73" }, { cid: 74, ctitle: "测试74" }, { cid: 75, ctitle: "测试75" }];
	        //angular.forEach($scope.currentPigaiItem.pigai.cidlist, function (com, index) {

	        //    angular.forEach($scope.vm.cidsimplelist, function (sc, index) {
	        //        if (com.cid == sc.cid) {
	        //            sc.checked = true;
	        //        }
	        //    })

	        //    $scope.vm.currentcomment.push(com);
	        //})
	        //if (item.bounds) {
	        //    $(document).scrollTop(item.bounds[0].miny + 50);
	        //}
	        loadImage(drawImg);

	    }

	    //判题
	    function _correctHomeWork(answerstatus, isbatch, params) {
	        //var score = 0;
	        //switch (answerstatus) {
	        //    case 1:
	        //        score = $scope.currentPigaiItem.ques.maxscore;
	        //        break;
	        //    case 2:
	        //        score = ($scope.currentPigaiItem.ques.maxscore / 2).toFixed(0);
	        //        break;
	        //    case 3:
	        //        score = 0;
	        //        break;
	        //    default: break;

	        //}
	        var correcthomeworklist;
	        if (isbatch) {
	            correcthomeworklist = params;
	        } else {
	            correcthomeworklist = [
                    {
                        autoid: $scope.currentPigaiItem.correct.autoid,
                        qid: $scope.currentPigaiItem.question.qid,
                        answerstatus: answerstatus,
                        score: _getScore($scope.currentPigaiItem.question.maxscore, answerstatus),
                        //cidlist: []
                    }
	            ];
	            angular.forEach($scope.vm.questioncorrectlist, function (sp, index) {
	                if (sp.question.qid == $scope.currentPigaiItem.question.qid) {
	                    sp.correct.score = _getScore($scope.currentPigaiItem.question.maxscore, answerstatus);
	                    //sp.pigai.cidlist = $scope.vm.currentcomment;
	                }
	            })
	        }

	        var params = {
	            Token: $scope.vm.token,
	            TCHWLogID: $scope.vm.tchwlogid,
	            SubLogID: $scope.vm.sublogid,
	            UPID: $scope.vm.upid,
	            CorrectHomeWorkList: angular.toJson(correcthomeworklist)


	        };
	        checkHomeWorkSrv.correctHomeWork(params).then(function (result) {
	            if (result.code === 0) {
	                if (answerstatus) {
	                    $scope.currentPigaiItem.correct.answerstatus = answerstatus;
	                }
	                //$scope.vm.sublogItems.pigailist[$scope.vm.currenthwindex].pigai.answerstatus = answerstatus;
	                //loadImage(drawImg);

	                //$scope.vm.sublogItems.pigaistatus = parseInt(result.data[0].pigaistatus);
	                //$scope.vm.currentcomment = {};

	                //if (parseInt(result.data[0].pigaistatus) == 2) {
	                //    //_getHomeWorkResult();
	                //    $state.go('app.checkhomework.alreadyhw.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: $scope.vm.sublogid, upid: $scope.vm.upid });
	                //    //
	                //}
	                //S$scope.vm.sublogItems.mysorce = getStudentscore();
	                toastr.success("重批成功", '');
	                $state.go('app.checkhomework.alreadyhw.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: $scope.vm.sublogid, upid: $scope.vm.upid });
	            }
	        });
	    }


	    function getStudentscore() {
	        var score = 0;
	        angular.forEach($scope.vm.questioncorrectlist, function (sp, index) {
	            score = score + _getScore(sp.question.maxscore, sp.correct.answerstatus);
	        })
	        return score;
	    }

	    //获取更多评语
	    function _getHomeWorkQuestionList() {
	        var params = {
	            Token: $scope.vm.token,

	        };
	        checkHomeWorkSrv.getHomeWorkQuestionList(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.commentItems = result.data;//.cidlist;

	            } 
	        });
	    }

	    //图片上一页
	    function _imgPrevPage() {
	        if ($scope.vm.currentimgpageindex == 0) {
	            toastr.error('已经是第一页', '');
	            return false;
	        } else {
	            var b = true;
	            $scope.vm.currentimgpageindex -= 1;
	            var pid = $scope.vm.correctpagelist[$scope.vm.currentimgpageindex].pid;
	            angular.forEach($scope.vm.questioncorrectlist, function (pigai, index) {
	                if (pigai.answer.pid == pid && b) {
	                    $scope.vm.currenthwindex = index;
	                    $scope.currentPigaiItem = pigai;
	                    loadImage(drawImg);
	                    b = false;
	                }

	            });
	            //$scope.vm.currentimgpageindex--;
	        }
	    }
	    //图片下一_imgNextPage页
	    function _imgNextPage() {
	        if ($scope.vm.currentimgpageindex == $scope.vm.currentimgtotalcount - 1) {
	            toastr.error('已经是最后一页', '');
	            return false;
	        } else {
	            var b = true;
	            $scope.vm.currentimgpageindex += 1;
	            var pid = $scope.vm.correctpagelist[$scope.vm.currentimgpageindex].pid;
	            angular.forEach($scope.vm.questioncorrectlist, function (pigai, index) {
	                if (pigai.answer.pid == pid && b) {
	                    $scope.vm.currenthwindex = index;
	                    $scope.currentPigaiItem = pigai;
	                    loadImage(drawImg);
	                    b = false;
	                }

	            });
	            //$scope.vm.currentimgpageindex++;

	        }

	    }

	    //选择评论
	    function _selectComment(comment) {
	        //$scope.vm.commentid = comment.cid;
	        //$scope.vm.currentcomment = {cid:comment.cid,ctitle:comment.ctitle}
	        if ($scope.vm.currentcomment.length >= 3) {
	            if (comment.checked) {
	                angular.forEach($scope.vm.currentcomment, function (obj, index) {
	                    if (comment == obj) {
	                        $scope.vm.currentcomment.splice(index, 1);
	                        return;
	                    }
	                });
	                comment.checked = !comment.checked;
	            } else {
	                var nestedConfirmDialog = ngDialog.openConfirm({
	                    template:
                            '<div style="padding:1em;">' +
                                '<p style="pidding:">最多只能选3个评价。</p>' +
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
	            }

	        }
	        else {
	            if (comment.checked) {
	                angular.forEach($scope.vm.currentcomment, function (obj, index) {
	                    if (comment == obj) {
	                        $scope.vm.currentcomment.splice(index, 1);
	                        return;
	                    }
	                });
	            } else {

	                $scope.vm.currentcomment.push(comment);
	            }
	            comment.checked = !comment.checked;
	        }
	        //console.log($scope.vm.currentcomment.length)
	    }



	    //批改下一位同学
	    function _checkNextStudent() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid,//188,//640,//
	            sublogid: 0,//143,//602,
	            qid: 0,
	            type: 1


	        };
	        _checkOutQuestionList(params);
	        //_getHomeWorkSublog();
	    }

	    //学生重拍
	    function _reSubmitWorkDialog() {
	        var nestedConfirmDialog = ngDialog.openConfirm({
	            template:
                        '<div style="padding:1em;">' +
                        '<p>是否要让学生重拍</p>' +
                        '<div><textarea ng-model="vm.againreason" style="width:100%;" placeholder="请填写重拍原因"></textarea></div>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消</button>' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="reSubmitWork()">确定</button>' +
                        '</div>' +
                        '</div>',
	            plain: true,
	            width: 400,
	            scope: $scope,
	            className: 'ngdialog-theme-default',
	        });
	    }

	    //获取作业小结
	    function _getHomeWorkResult() {
	        var params = {
	            Token: $scope.vm.token,
	            sublogid: $scope.vm.sublogid
	        };
	        checkHomeWorkSrv.getHomeWorkResult(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.resultItems = result.data[0];
	            }

	        });
	    }
	    //计算得分
	    function _getScore(maxscore, answervalue) {
	        var score = 0;
	        var maxscore = parseInt(maxscore);
	        if (answervalue == 1) {
	            score = maxscore;
	        } else if (answervalue == 2) {
	            score = parseInt(maxscore / 2);
	        } else if (answervalue == 3) {
	            score = 0;
	        }
	        return score;
	    }
	    //批改完成
	    function _checkFinsh() {
	        var correcthomeworklist = [];
	        angular.forEach($scope.vm.questioncorrectlist, function (obj, index) {
	            //var correcthomeworklist = [
	            //    {
	            //        autoid: obj.pigai.autoid,
	            //        qid: obj.ques.qid,
	            //        answerstatus: 1,
	            //        score: obj.ques.maxscore,
	            //        cidlist: []
	            //    }
	            //];

	            //$scope.vm.sublogItems.pigailist[index].pigai.answerstatus = 1;
	            var evyhw = {
	                autoid: obj.correct.autoid,
	                qid: obj.question.qid,
	                answerstatus: 1,
	                score: 0,
	                //cidlist: obj.pigai.cidlist
	            }
	            if (obj.correct.answerstatus > 1) {
	                evyhw.answerstatus = obj.correct.answerstatus;
	            }
	            $scope.vm.questioncorrectlist[index].correct.answerstatus = evyhw.answerstatus;
	            evyhw.score = _getScore(obj.question.maxscore, evyhw.answerstatus);
	            correcthomeworklist.push(evyhw);
	        });
	        //console.log(correcthomeworklist);
	        _correctHomeWork(null, true, correcthomeworklist);
	    }

	    //获取学生列表
	    function _getHomeWorkSublog() {
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid

	        };

	        checkHomeWorkSrv.getHomeWorkSublog(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.commit = result.data[0].commitlist[0];

	                $state.go('app.checkhomework.unalreadyhw.undetail', { tchwlogid: $scope.vm.tchwlogid, sublogid: $scope.vm.commit.sublogid, upid: $scope.vm.commit.upid });


	            } 
	        });
	    }


	    function _reSubmitWork() {
	        if ($scope.vm.againreason == '') {
	            toastr.error('请添加重拍原因', '');
	        } else {
	            var params = {
	                Token: $scope.vm.token,
	                tchwlogid: $scope.vm.tchwlogid,
	                sublogid: $scope.vm.sublogid,
	                message: ''


	            };
	            checkHomeWorkSrv.reSubmitWork(params).then(function (result) {
	                if (result.code === 0) {
	                    toastr.success('重拍成功', '');

	                    ngDialog.closeAll();
	                } 
	            });
	        }
	    }

	    function _commentDialog(cclassinfo) {
	        $scope.vm.cclassinfo = cclassinfo;
	        ngDialog.open({
	            template: 'js/app.tch/checkhomework/unalreadyhw/commentdialog.html',
	            className: 'ngdialog-theme-default',
	            width: 800,
	            height: 400,
	            //plain: true,
	            scope: $scope
	        });

	        //_getHomeWorkQuestionCommonList(cclassinfo);
	        _getHomeWorkQuestionCommoncClassList();
	    }

	    function _toHtml(html) {
	        return $sce.trustAsHtml(html);
	    }

	    //单题评语分类列表
	    function _getHomeWorkQuestionCommoncClassList() {

	        var params = {
	            Token: $scope.vm.token,

	        };
	        checkHomeWorkSrv.getHomeWorkQuestionCommoncClassList(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.cclassidlist = result.data;

	                getCommentnum();
	                _getHomeWorkQuestionCommonList($scope.vm.cclassidlist[0]);
	            }

	        });

	    }

	    function _getHomeWorkQuestionCommonList(classinfo) {

	        var params = {
	            Token: $scope.vm.token,
	            cclassid: classinfo.cclassid

	        };
	        checkHomeWorkSrv.getHomeWorkQuestionCommonList(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.cidlist = result.data;
	                angular.forEach($scope.vm.currentcomment, function (cur, inxexcur) {
	                    angular.forEach($scope.vm.cidlist, function (cid, indexcid) {
	                        if (cid.cid === cur.cid) {
	                            cid.checked = true;
	                        }

	                    })
	                })
	            }

	        });

	    }
	    function _deleteComment(comment) {
	        angular.forEach($scope.vm.currentcomment, function (vc, index) {
	            if (comment.cid === vc.cid) {
	                $scope.vm.currentcomment.splice(index, 1);
	            }
	        })
	        var params = {
	            Token: $scope.vm.token,
	            tchwlogid: $scope.vm.tchwlogid,//188,//640,//
	            sublogid: $scope.vm.sublogid,//
	            upid: $scope.vm.upid,
	            hwid: $scope.vm.hwid,
	            answerid: $scope.currentPigaiItem.pigai.autoid,
	            ctitle: comment.ctitle,
	            cid: comment.cid,
	            type: 2
	        }
	        addSinglecomment(params);
	    }

	    function _selectRemark(c, checked) {
	        c.checked = !c.checked;
	    }

	    function _selectCommont(comment, checked) {
	        var type;
	        if ($scope.vm.currentcomment.length >= 3 && checked) {
	            //toastr.error('最多只能选3个评价', '');
	            //toastr.info('最多只能选3个评价', '');
	            toastr.warning('最多只能选3个评价', '');
	            comment.checked = false;
	            return;

	        }
	        else {
	            if (checked) {
	                //angular.forEach($scope.vm.currentcomment, function (obj, index) {


	                //});
	                $scope.vm.currentcomment.push(comment);
	            } else {
	                angular.forEach($scope.vm.currentcomment, function (vc, index) {
	                    if (comment.cid === vc.cid) {
	                        $scope.vm.currentcomment.splice(index, 1);
	                    }
	                })

	            }
	            comment.checked = checked;
	            checked ? type = 1 : type = 2;
	            var params = {
	                Token: $scope.vm.token,
	                tchwlogid: $scope.vm.tchwlogid,//188,//640,//
	                sublogid: $scope.vm.sublogid,//
	                upid: $scope.vm.upid,
	                hwid: $scope.vm.hwid,
	                answerid: $scope.currentPigaiItem.pigai.autoid,
	                ctitle: comment.ctitle,
	                cid: comment.cid,
	                type: type
	            }
	            addSinglecomment(params);
	        }

	    }
	    //显示分类选中子项
	    function getCommentnum() {
	        angular.forEach($scope.vm.cclassidlist, function (vcc, indexcc) {
	            vcc.num = 0;
	            angular.forEach($scope.vm.currentcomment, function (vcu, indexvc) {
	                if (vcc.cclassid == vcu.cclassid) {
	                    vcc.num = vcc.num + 1;
	                }
	            })
	        })
	    }
	    function addSinglecomment(params) {
	        checkHomeWorkSrv.addSinglecomment(params).then(function (result) {
	            if (result.code === 0) {
	                if (params.type == 1) {
	                    toastr.success('提交评语成功', '');
	                } else {
	                    toastr.success('删除评语成功', '');
	                }
	                angular.forEach($scope.vm.cidsimplelist, function (vc, index) {
	                    if (params.cid == vc.cid) {
	                        params.type == 1 ? vc.checked = true : vc.checked = false;
	                    }
	                })
	                getCommentnum();

	            } 

	        });
	    }

	}])
});