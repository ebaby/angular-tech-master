define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'checkhomework/checkhomework.service'], function (require, ng, comfuns) {
    var module = ng.module('app.checkhomework');
    module.controller('UnAlreadyCtrl', ['$scope', '$state', 'checkHomeWorkSrv', 'toastr', '$rootScope', 'ngDialog', function ($scope, $state, checkHomeWorkSrv, toastr, $rootScope, ngDialog) {
        //$scope.title = '布置作业';
        $scope.vm = {
            token: window.localStorage.tch_token,
            pageindex: 0,
            pagesize: 10,
            tabindex: 0,
            hwindex: 0,
            allpage: 0
        }

        //$scope.wplistOptions = {
        //    goNextpage: _goNextpage,
        //    allpage:0
        //}
        $scope.pageOptions = {
            scrollLoaddata: _getCheckList
        }
        $scope.goToUnStudents = _goToUnStudents;
        $scope.goToStatistics = _goToStatistics;
        $scope.deleteHomeWork = _deleteHomeWork;
        $scope.deleteHwDialog = _deleteHwDialog;

        $scope.editDatetime = _editDatetime;
        function _editDatetime(hw) {
            if ($scope.vm.currenthw) {
                $scope.vm.currenthw.editable = false;
            }
            $scope.dateoption.zydatetiem = hw.subendtime;
            $scope.vm.currenthw = hw;
            hw.editable = !hw.editable;

        }

        $scope.dateoption = {
            zydatetiem: "",
            setDatetime: _setDatetime
        }

        function _setDatetime(dt) {
            //alert(dt);
            //var time = "\/Date(" + (new Date(dt.replace(/-/g, "/"))).getTime() + ")\/"
            _updateSubendTime(dt);
            $scope.vm.currenthw.editable = false;
        }

        initialize();
        function initialize() {
            _getCheckList();

        }
        function _goNextpage(pageindex) {
            $scope.vm.pageindex = pageindex;
            _getCheckList();
            //alert(pageindex);
        }
        //获取作业列表
        function _getCheckList() {
            if ($state.current.name != "app.checkhomework.unalreadyhw") return;

            $scope.vm.pageindex = $scope.vm.pageindex + 1;
            var params = {
                Token: $scope.vm.token,
                PageIndex: $scope.vm.pageindex,
                type: 0,
                PageSize: $scope.vm.pagesize,
                CheckType: 0,
                ClassID: 0

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
                    });

                    //$scope.vm.homeworklist = result.data.inteacherarrangelist;
                    if ($scope.vm.allpage == 0) {
                        $scope.vm.allpage = result.data.pagecount;
                    }

                    //$scope.wplistOptions.allpage = result.data[0].allpage;
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
                    //$scope.vm.pigailist = result.data[0].pigailist;
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
                } else {
                    $scope.vm.pageindex = $scope.vm.pageindex - 1;
                    
                }

                //console.log(result.data)
            });
        }
        
        function _goToUnStudents(hw) { //app.checkhomework.unalreadyhw.unalreadyhwstudent

            $rootScope.tchwinfo = hw;

            $state.go('app.checkhomework.unalreadyhw.unstudent', { tchwlogid: hw.tchwlogid });


        }

        //设置提交截止时间 
        function _updateSubendTime(time) {
            var params = {
                Token: $scope.vm.token,
                TCHWLogID: $scope.vm.currenthw.tchwlogid,
                SubEndTime: new Date(time.replace(/-/g, "/")).getTime() / 1000,// "\/Date(" + (new Date(time.replace(/-/g, "/"))).getTime() + ")\/"

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

        //取消布置
        function _deleteHwDialog(home) {
            $scope.vm.homework = home;
            var nestedConfirmDialog = ngDialog.openConfirm({
                template:
                        '<div style="padding:1em;">' +
                        '<p>是否要取消布置</span></p>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="deleteHomeWork()">确定</button>' +
                        '</div>' +
                        '</div>',
                plain: true,
                width: 400,
                scope: $scope,
                className: 'ngdialog-theme-default',
            });
        }
        //
        function _deleteHomeWork() {
            var params = {
                Token: $scope.vm.token,
                tchwlogid: $scope.vm.homework.tchwlogid

            };
            checkHomeWorkSrv.deleteHomeWork(params).then(function (result) {
                if (result.code === 0) {
                    toastr.success('取消成功', '');
                    $scope.vm.homework.disable = !$scope.vm.homework.disable;
                    ngDialog.closeAll();
                } 
            });
        }


    }]);
    //获取学生列表
    module.controller('UnStudentCtrl', ['$scope', '$state', 'checkHomeWorkSrv', 'toastr', '$rootScope', 'ngDialog', function ($scope, $state, checkHomeWorkSrv, toastr, $rootScope, ngDialog) {
        //$scope.title = '布置作业';
        $scope.vm = {
            token: window.localStorage.tch_token,
            againreason: "",
            tabindex: 0,
            hwindex: 0,
            tchwlogid: $state.params.tchwlogid,
        }

        $scope.editDateDialog = _editDateDialog;
        $scope.updateSubendTime = _updateSubendTime;

        $scope.dateoption = {
            setDatetime: _setDatetime,
            zydatetiem: ''
        }

        var rootHandle = $rootScope.$watchCollection('tchwinfo', function (newvalue, oldvalue) {
            if (newvalue) {
                $scope.vm.tchwinfo = $rootScope.tchwinfo;
                $scope.dateoption.zydatetiem = $scope.vm.tchwinfo.subendtime;
                rootHandle();
            }

        })

        $scope.getHomeWorkSublog = _getHomeWorkSublog;
        $scope.selectTab = _selectTab;
        $scope.goToDetail = _goToDetail;
        $scope.reSubmitWorkDialog = _reSubmitWorkDialog;

        $scope.allChecked = _allChecked;
        $scope.selectStudent = _selectStudent;

        $scope.pigaiItem = [];

        initialize();
        function initialize() {

            _getHomeWorkSublog();

        }

        function _selectTab(tabIndex) {
            $scope.vm.tabindex = tabIndex;

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
        function _allChecked() {
            $scope.vm.allchecked = !$scope.vm.allchecked;
            angular.forEach($scope.vm.uncommitlist, function (unst, index) {
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
            angular.forEach($scope.vm.uncommitlist, function (unst, index) {
                if (unst.checked && unst.isalert != 1) {
                    $scope.vm.num = $scope.vm.num + 1;
                }
            })
        }

        function _goToDetail(studen) { //app.checkhomework.unalreadyhw.unalreadyhwstudent
            //studen
            //$scope.vm.currentsublogid = hw.tchwlogid;
            if ($rootScope.tchwinfo.checktype == 1) {

                if (studen.correctstatus === 2) {
                    $state.go('app.checkhomework.alreadyhw.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: studen.sublogid, upid: studen.upid, type: 1, cstatus: studen.correctstatus });
                } else {
                    $state.go('app.checkhomework.unalreadyhw.undetail', { tchwlogid: $scope.vm.tchwlogid, sublogid: studen.sublogid, upid: studen.upid });
                }
            } else {
                if (studen.correctstatus === 2) {
                    $state.go('app.checkhomework.alreadyhw.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: studen.sublogid, upid: studen.upid, type: 1, cstatus: studen.correctstatus });
                } else {
                    var nestedConfirmDialog = ngDialog.openConfirm({
                        template:
                            '<div style="padding:1em;">' +
                                '<p style="pidding:">此为待批作业，还未批改完成</p>' +
                                '<div class="ngdialog-buttons">' +

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
            if (allstudent.upid) {
                params.studentlist = [{ upid: allstudent.upid }];
            } else {
                angular.forEach($scope.vm.uncommitlist, function (su, index) {
                    if (su.checked && su.isalert == 2) {
                        params.studentlist.push({ upid: su.upid });
                    }
                })
            }

            checkHomeWorkSrv.cuiSubmitworkpl(params).then(function (result) {
                if (result.code === 0) {
                    $scope.vm.allchecked = false;
                    $scope.vm.num = 0;
                    angular.forEach($scope.vm.uncommitlist, function (su, index) {
                        angular.forEach(params.studentlist, function (ps, index) {
                            if (ps.upid == su.upid) {
                                su.isalert = 1;
                            }
                        })
                    })
                    toastr.success("提醒成功", '');
                } 
            });
        }

        function _editDateDialog() {
            var nestedConfirmDialog = ngDialog.openConfirm({
                template:
                    '<div style="padding:1em;">' +
                        '<div class="time-wj">作业截止时间：' +
                            '<div  style="width: 150px;margin-left: 95px;height: 30px;margin-top: -25px;" date-picker date-option="dateoption"></div>' +
                        '</div>' +
                        '<div class="ngdialog-buttons">' +
                            '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="updateSubendTime()">确定</button>' +
                         '</div>' +
                        '</div>',
                plain: true,
                width: 400,
                scope: $scope,
                className: 'ngdialog-theme-default'
            });
        }

        //
        function _updateSubendTime() {
            var params = {
                Token: $scope.vm.token,
                TCHWLogID: $scope.vm.currenthw.tchwlogid,
                SubEndTime: new Date(time).getTime() / 1000,//"\/Date(" + (new Date($scope.vm.setdatetime.replace(/-/g, "/"))).getTime() + ")\/"



            };
            checkHomeWorkSrv.updateSubendTime(params).then(function (result) {
                if (result.code === 0) {
                    toastr.success('设置成功', '');
                    ngDialog.closeAll();

                } 
            });
        }

        function _setDatetime(dt) {
            //alert(dt)
            $scope.vm.setdatetime = dt;
            _updateSubendTime();
            $scope.vm.currenthw.editable = false;
        }



    }]);
    //获取作业信息
    module.controller('UnDetailCtrl', ['$scope', '$state', '$sce', 'checkHomeWorkSrv', 'toastr', 'ngDialog', '$rootScope', function ($scope, $state, $sce, checkHomeWorkSrv, toastr, ngDialog, $rootScope) {
        //$scope.title = '布置作业';
        var date = new Date();
        $scope.vm = {
            token: window.localStorage.tch_token,
            tabindex: 0,
            currenthwindex: 0,
            tchwlogid: $state.params.tchwlogid,
            sublogid: $state.params.sublogid,
            upid: $state.params.upid,
            currentimgpageindex: 0,
            currentimgtotalcount: 0,
            commentid: 0,
            setdatetime: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
            currentcomment: [],
            againreason: '',
        }
        $scope.vm.remarks = [
            { id: 1, content: "请拍整页" },
            { id: 2, content: "光线明亮一点" },
            { id: 3, content: "对焦准确点" },
            { id: 4, content: "把书放平" }
        ]
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
        $scope.checkFinshDialog = _checkFinshDialog;
        $scope.checkFinsh = _checkFinsh;
        $scope.selectCommont = _selectCommont;
        $scope.deleteComment = _deleteComment;
        $scope.addSinglecomment = _addSinglecomment;
        $scope.closeDialog = _closeDialog;
        $scope.selectRemark = _selectRemark;
        $scope.submitRemarks = _submitRemarks;
        $scope.selectSimpleremark = _selectSimpleremark;
        $scope.getHomeWorkQuestionCommonList = _getHomeWorkQuestionCommonList
        $scope.goToResult = _goToResult

        $scope.openRef = _openRef;
        $scope.goUnstudent = _goUnstudent;

        initialize();
        function initialize() {
           
            _checkOutQuestionList();
        }

        function _goUnstudent() {
            $state.go('app.checkhomework.unalreadyhw.unstudent', { tchwlogid: $scope.vm.tchwlogid });
        }

        function _openRef() {
            $scope.vm.reopen = !$scope.vm.reopen;
        }
        function _selectRemark(c, checked) {
            c.checked = !c.checked;
        }
        function _closeDialog() {
            ngDialog.closeAll();
        }
        function drawShape() {
            $scope.imgoptions.cocyctx.drawImage($scope.imgoptions.img, 0, 0, $scope.currentPigaiItem.answer.picsrcwidth, $scope.currentPigaiItem.answer.picsrcheight);

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
                    var width = parseInt(p.width * p.picsrcwidth);
                    var height = parseInt(p.height * p.picsrcheight);
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
                if (img.height > 1024) {
                    var rate = img.width / 768;
                    var height = img.height / rate;
                    $('#canvasimg').parent('div').height(height);
                }

                $scope.imgoptions.cocyctx = cocyctx;
                $scope.imgoptions.img = img;
                cocyctx.drawImage(img, 0, 0, $scope.currentPigaiItem.answer.picsrcwidth, $scope.currentPigaiItem.answer.picsrcheight);
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
            //var params = {
            //    Token: $scope.vm.token,
            //};
            //checkHomeWorkSrv.getSimpleremark(params).then(function (result) {
            //    if (result.code === 0) {
            //        $scope.vm.cidsimplelist = result.data;
            //    } 
            //});


            $scope.vm.cidsimplelist = comfuns.getCommentList(); //result.data;
            angular.forEach($scope.vm.cidsimplelist, function (vc, index) {
                angular.forEach($scope.currentPigaiItem.correct.singlecommentlist, function (s, index) {
                    if (s.cid == vc.cid) {
                        vc.checked = true;
                    }
                });
            });



        }
        function _submitRemarks() {
            console.l
            var msg = "";
            var msgcode = 1;
            angular.forEach($scope.vm.remarks, function (vr, index) {
                if (vr.checked) {
                    var cm = vr.content;
                    if (cm && cm != '') {
                        msg = msg + msgcode + cm;
                        msgcode = msgcode + 1;
                    }
                }
            })
            if ($scope.vm.inputremark && $scope.vm.inputremark != "") {
                msg = msg + "#其他原因：" + $scope.vm.inputremark;
            }
            if (msg == "") {
                toastr.info("请选择重新提交原因", '');
                return;
            }
            var params = {
                Token: $scope.vm.token,
                tchwlogid: $scope.vm.tchwlogid,
                SubLogList: [{ sublogid: $scope.vm.sublogid }],
                message: msg
            };
            checkHomeWorkSrv.reSubmitWork(params).then(function (result) {
                if (result.code === 0) {
                    $state.go("app.checkhomework.unalreadyhw.unstudent", { tchwlogid: $scope.vm.tchwlogid });
                    toastr.success("提醒重新拍照成功", '');
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

        function datafactory(data) {
            var _data = {};
            //_data.settinghomework = data.settinghomework;
            _data.studentinfo = data.accepthomework;
            _data.questioncorrectlist = [];
            angular.forEach(data.correctpagelist, function (o, i) {
                angular.forEach(o.questioncorrectlist, function (q, i) {
                    _data.questioncorrectlist.push(q);
                });
            });

            return _data;
        }

        function _zoomQuesImg(list) {

            angular.forEach(list, function (o, i) {
                if (o.answer.picsrcwidth > 768) {
                    var rate = o.answer.picsrcwidth / 768;
                    o.answer.picsrcwidth = o.answer.picsrcwidth / rate;
                    o.answer.picsrcheight = o.answer.picsrcheight / rate;
                }

            });
        }

        //获取作业
        function _checkOutQuestionList() {
            var params = {
                Token: $scope.vm.token,
                tchwlogid: $scope.vm.tchwlogid,//188,//640,//
                sublogid: $scope.vm.sublogid,//143,//602,
                qid: 0,
                type: 1,
                DataType: 31,//[1, 2,3, 4, 5],//1，布置作业记录信息，2学生接收记录信息，3学生提交记录信息，4作业问题的基本信息和批改信息，5作业批改结果，6作业批改结果反馈

            };
            checkHomeWorkSrv.checkOutQuestionList(params).then(function (result) {
                if (result.code === 0) {

                    var newdata = datafactory(result.data);

                    $scope.vm.settinghomework = result.data.settinghomework;
                    $scope.vm.studentinfo = newdata.studentinfo;
                    $scope.vm.correctpagelist = result.data.correctpagelist;
                    $scope.vm.submithomework = result.data.submithomework;
                    $scope.vm.homeworkcorrectresult = result.data.homeworkcorrectresult;
                    $scope.vm.questioncorrectlist = newdata.questioncorrectlist;

                    $scope.vm.tchwlogid = $scope.vm.settinghomework.tchwlogid;
                    $scope.vm.sublogid = $scope.vm.submithomework.sublogid;
                    $scope.vm.upid = $scope.vm.studentinfo.upid;
                    
                    $scope.currentPigaiItem = $scope.vm.questioncorrectlist[$scope.vm.currenthwindex];
                    _zoomQuesImg($scope.vm.questioncorrectlist);
                    _selectQuestion($scope.vm.questioncorrectlist[0], 0);
                    //angular.forEach($scope.vm.cidsimplelist, function (vc, index) {
                    //    angular.forEach($scope.currentPigaiItem.correct.singlecommentlist, function (s, index) {
                    //        if (s.cid == vc.cid) {
                    //            vc.checked = true;
                    //        }
                    //    });
                    //});
                    _getSimpleremark();

                    setMinMaxPoint();
                    loadImage(drawImg);

                } else if (result.status == 500) {
                    $state.go('app.checkhomework.unalreadyhw');
                } else {

                    //调到作业学情分析
                    //$state.go('app.analyze.period.detail', { tchwlogid: $scope.vm.tchwlogid });
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
            angular.forEach($scope.vm.cidsimplelist, function (vc, index) {                
                vc.checked = false;               
            });
            angular.forEach($scope.vm.cidsimplelist, function (vc, index) {
                angular.forEach($scope.currentPigaiItem.correct.singlecommentlist, function (s, index) {
                    if (s.cid == vc.cid) {
                        vc.checked = true;
                    }
                });

            });

            //angular.forEach($scope.vm.cidsimplelist, function (asc, index) {
            //    asc.checked = false;
            //})
            //$scope.currentPigaiItem.pigai.cidlist = [{ cid: 73, ctitle: "测试73" }, { cid: 74, ctitle: "测试74" }, { cid: 75, ctitle: "测试75" }];
            //angular.forEach($scope.currentPigaiItem.pigai.cidlist, function (com, index) {

            //    angular.forEach($scope.vm.cidsimplelist, function (sc, index) {
            //        if (com.cid == sc.cid) {
            //            sc.checked = true;
            //        }
            //    })

            //    $scope.vm.currentcomment.push(com);
            //})
            if (item.bounds) {
                $(document).scrollTop(item.bounds[0].miny + 50);
            }

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

            var commentlist = [];
            angular.forEach($scope.currentPigaiItem.correct.singlecommentlist, function (comment, i) {
                commentlist.push({ cid: comment.cid, ctitle: comment.cidname });
            });

            var correcthomeworklist;
            if (isbatch) {
                correcthomeworklist = params;
            } else {
                correcthomeworklist = [
                    {
                        correcttype: 0,//拍一拍 0修改 -1删除 1新增 教师布置作业，精批服务不可以删除和新增。
                        autoid: $scope.currentPigaiItem.correct.autoid,
                        qid: $scope.currentPigaiItem.question.qid,
                        answerstatus: answerstatus,
                        score: _getScore($scope.currentPigaiItem.question.maxscore, answerstatus),
                        width: $scope.currentPigaiItem.answer.width,
                        height: $scope.currentPigaiItem.answer.height,
                        left: $scope.currentPigaiItem.answer.left,
                        top: $scope.currentPigaiItem.answer.top,
                        pid: $scope.currentPigaiItem.answer.pid,

                        CommentList: commentlist
                    }
                ];

                //angular.forEach($scope.vm.currentcomment, function (vc,index) {
                //    correcthomeworklist[0].cidlist.push({ cid: vc.cid, cidname: vc.ctitle });
                //})
                //correcthomeworklist[0].cidlist = $scope.vm.currentcomment;
                angular.forEach($scope.vm.questioncorrectlist, function (sp, index) {
                    if (sp.question.qid == $scope.currentPigaiItem.question.qid) {
                        sp.correct.score = _getScore($scope.currentPigaiItem.question.maxscore, answerstatus);
                        //sp.pigai.cidlist = $scope.vm.currentcomment;
                    }
                })
            }

            //var params = {
            //    Token: $scope.vm.token,
            //    //TCHWLogID: $scope.vm.tchwlogid,
            //    SubLogID: $scope.vm.sublogid,
            //    //UPID: $scope.vm.upid,
            //    CorrectHomeWorkList: correcthomeworklist


            //};
            //checkHomeWorkSrv.correctHomeWork(params).then(function (result) {
            //    if (result.code === 0) {
                    if (answerstatus) {
                        $scope.currentPigaiItem.correct.answerstatus = answerstatus;
                        $scope.currentPigaiItem.correct.iscorrect = 1;
                    }
                    //$scope.vm.sublogItems.pigailist[$scope.vm.currenthwindex].pigai.answerstatus = answerstatus;
                    loadImage(drawImg);

                    //$scope.vm.submithomework.correctstatus = parseInt(result.data.isover);
                    //$scope.vm.currentcomment = [];

                    //if (parseInt(result.data.isover) == 2) {
                    //    //_getHomeWorkResult();
                    //    $state.go('app.checkhomework.alreadyhw.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: $scope.vm.sublogid, upid: $scope.vm.upid });
                    //    //$scope.vm.sublogItems.mysorce = getStudentscore();
                    //}
                    toastr.success("批改成功", '');
            //    } 
            //});
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
        //图片下一页
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
                        if (comment.cid == obj.cid) {
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
                        if (comment.cid == obj.cid) {
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
            ngDialog.open({
                template: window.globalConfig.appPath + 'checkhomework/unalreadyhw/resubmitdialog.html',
                className: 'ngdialog-theme-default',
                width: 500,
                height: 300,
                //plain: true,
                scope: $scope
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
        function _checkFinshDialog() {
            var nestedConfirmDialog = ngDialog.openConfirm({
                template:
                    '<div style="padding:1em;">' +
                        '<p style="pidding:">还有题未进行批改,是否放弃？</p>' +
                        '<div class="ngdialog-buttons">' +
                            '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="checkFinsh()">确定</button>' +
                         '</div>' +
                        '</div>',
                plain: true,
                width: 400,
                scope: $scope,
                className: 'ngdialog-theme-default'
            });
        }
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
                template: window.globalConfig.appPath + 'checkhomework/unalreadyhw/commentdialog.html',
                className: 'ngdialog-theme-default',
                width: 800,
                height: 200,
                //plain: true,
                scope: $scope
            });
            _getHomeWorkQuestionCommoncClassList();
            //_getHomeWorkQuestionCommonList(cclassinfo);
        }

        function _toHtml(html) {
            return $sce.trustAsHtml(html);
        }

        //单题评语分类列表
        function _getHomeWorkQuestionCommoncClassList() {

            //var params = {
            //    Token: $scope.vm.token,

            //};
            if ($scope.vm.cidlist && $scope.vm.cidlist.length > 0) {
                angular.forEach($scope.vm.cidlist, function (c, i) {
                    c.checked = false;
                });
                angular.forEach($scope.vm.cidlist, function (c, i) {
                    angular.forEach($scope.currentPigaiItem.correct.singlecommentlist, function (s, i) {
                        if (c.cid == s.cid) {
                            c.checked = true;
                        }
                    });
                });

                return;
            }
            //checkHomeWorkSrv.getHomeWorkQuestionCommoncClassList(params).then(function (result) {
            //    if (result.code === 0) {
            $scope.vm.cclassidlist = comfuns.getSingleCommentCategoryList();//result.data;


                    getCommentnum();
                    _getHomeWorkQuestionCommonList($scope.vm.cclassidlist[0]);
            //    }

            //});

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
        function _getHomeWorkQuestionCommonList(classinfo) {

            //var params = {
            //    Token: $scope.vm.token,
            //    cclassid: classinfo.cclassid

            //};
            //checkHomeWorkSrv.getHomeWorkQuestionCommonList(params).then(function (result) {
            //    if (result.code === 0) {

            //        $scope.vm.cidlist = result.data;
            //        //angular.forEach($scope.vm.currentcomment, function (cur, inxexcur) {
            //        //    angular.forEach($scope.vm.cidlist, function (cid, indexcid) {
            //        //        if (cid.cid === cur.cid) {
            //        //            cid.checked = true;
            //        //        }

            //        //    })
            //        //})
            //        angular.forEach($scope.vm.cidlist, function (c, i) {
            //            angular.forEach($scope.currentPigaiItem.correct.singlecommentlist, function (s, i) {
            //                if (c.cid == s.cid) {
            //                    c.checked = true;
            //                }
            //            });
            //        });

            //    }

            //});

            $scope.vm.cidlist = [];
            angular.forEach(comfuns.getSingleCommentChildrenList(), function (o, i) {
                if (o.cclassid == classinfo.cclassid) {
                    $scope.vm.cidlist.push(o);
                }
            });

            angular.forEach($scope.vm.cidlist, function (c, i) {
                angular.forEach($scope.currentPigaiItem.correct.singlecommentlist, function (s, i) {
                    if (c.cid == s.cid) {
                        c.checked = true;
                    }
                });
            });

        }
        function _selectCommont(comment, checked) {

            if (checked) {
                if ($scope.currentPigaiItem.correct.singlecommentlist.length >= 3) {
                    //toastr.error('最多只能选3个评价', '');
                    //toastr.info('最多只能选3个评价', '');
                    toastr.warning('最多只能选3个评价', '');
                    comment.checked = false;
                    return;

                }
                else {
                    _addSinglecomment(comment);
                }
            } else {
                _deleteComment(comment);
            }
            comment.checked = checked;
                        

        }

        //添加单题评语
        function _addSinglecomment(comment) {
                if ($scope.currentPigaiItem.correct.singlecommentlist.length >=3) {
                    //toastr.error('最多只能选3个评价', '');
                    //toastr.info('最多只能选3个评价', '');
                    if (!comment.checked) {
                    	toastr.warning('最多只能选3个评价', '');
                    	return;
                    }
				}
                    //var params = {
                    //    Token: $scope.vm.token,
                    //    tchwlogid: $scope.vm.tchwlogid,//188,//640,//
                    //    sublogid: $scope.vm.sublogid,//
                    //    //upid: $scope.vm.upid,
                    //    hwid: $scope.vm.settinghomework.hwid,
                    //    answerid: $scope.currentPigaiItem.correct.autoid,
                    //    ctitle: comment.ctitle,
                    //    cid: comment.cid,
                    //    //type: type
                    //}
                    //checkHomeWorkSrv.addSinglecomment(params).then(function (result) {
                    //    if (result.code === 0) {
                    //        //if (params.type == 1) {
                    //        //    toastr.success('提交评语成功', '');
                    //        //} else {
                    //        //    toastr.success('删除评语成功', '');
                    //        //}
                            angular.forEach($scope.vm.cidsimplelist, function (vc, index) {
                                if (comment.cid == vc.cid) {
                                    //params.type == 1 ? vc.checked = true : vc.checked = false;
                                    
                                    if (vc.checked) {
                            			vc.checked = !vc.checked;
                            			angular.forEach($scope.currentPigaiItem.correct.singlecommentlist, function (v, index) {
                            				if (v.cid == vc.cid) {
                            					$scope.currentPigaiItem.correct.singlecommentlist.splice(index,1);
                            				}
                            			})
                            			
                            		} else{
                            			vc.checked = !vc.checked;
                            			 $scope.currentPigaiItem.correct.singlecommentlist.push({ cid: comment.cid, cidname: comment.ctitle })
                            		}
                                }
                            });
        
                            getCommentnum();

                            _correctHomeWork($scope.currentPigaiItem.correct.answerstatus);
                   

                    //});



            
        }

        //删除单题评语
        function _deleteComment(comment) {
            
            ////angular.forEach($scope.currentPigaiItem.pigai.cidlist, function (pc, index) {
            ////    if (comment.cid === pc.cid) {
            ////        $scope.currentPigaiItem.pigai.cidlist.splice(index, 1);
            ////    }
            ////})
            //var params = {
            //    Token: $scope.vm.token,
            //    tchwlogid: $scope.vm.tchwlogid,//188,//640,//
            //    sublogid: $scope.vm.sublogid,//
            //    //upid: $scope.vm.upid,
            //    hwid: $scope.vm.settinghomework.hwid,
            //    AnswerID: $scope.currentPigaiItem.correct.autoid,
            //    ctitle: comment.cidname == undefined?comment.ctitle:comment.cidname,
            //    cid: comment.cid,
            //    //type: 2
            //}
            //checkHomeWorkSrv.delSinglecomment(params).then(function (result) {
            //    if (result.code === 0) {
            //        angular.forEach($scope.vm.cidsimplelist, function (vc, index) {
            //            if (params.cid == vc.cid) {
            //                //params.type == 1 ? vc.checked = true : vc.checked = false;
            //                vc.checked = false;
            //            }
            //        });
                    angular.forEach($scope.currentPigaiItem.correct.singlecommentlist, function (vc, index) {
                        if (comment.cid === vc.cid) {                     	
                        	angular.forEach($scope.vm.cidsimplelist, function (v, index) {
                        		if (v.cid == comment.cid) {
                        			v.checked = false;
                        		}
                        	})
                            $scope.currentPigaiItem.correct.singlecommentlist.splice(index, 1);
                        }
                    })
                    getCommentnum();
                    _correctHomeWork($scope.currentPigaiItem.correct.answerstatus);
            

            //});
        }

        //跳转小结
        function _goToResult() {
            $rootScope.questioncorrectlist = $scope.vm.questioncorrectlist;
            $state.go('app.checkhomework.alreadyhw.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: $scope.vm.sublogid, upid: $scope.vm.upid, type: 1, cstatus: $scope.vm.homeworkcorrectresult.correctstatus });
        }

    }])
});