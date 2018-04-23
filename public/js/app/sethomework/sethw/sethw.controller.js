define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'sethomework/sethomework.service'], function (require, ng, comfuns) {
	var module = ng.module('app.sethomework');
	module.controller('SetHomeworkCtrl', ['$scope', '$state', 'setHomeWorkSrv', 'toastr', 'ngDialog', '$rootScope', function ($scope, $state, setHomeWorkSrv, toastr, ngDialog, $rootScope) {
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

	    $scope.imgPrevPage = _imgPrevPage;
	    $scope.imgNextPage = _imgNextPage;
	    $scope.checkQuestion = _checkQuestion;

	    $scope.getClassBook = _getClassBook;
	    $scope.resetCheck = _resetCheck;
	    $scope.selectBook = _selectBook;
	    $scope.nodeExtender = _nodeExtender;
	    $scope.selectAllHomeWork = _selectAllHomeWork;
	    $scope.selectPartHomeWork = _selectPartHomeWork;
	    $scope.setHomeWork = _setHomeWork;
	    $scope.editDatetime = _editDatetime;
	    $scope.goToSetHW = _goToSetHW;


	    $scope.vm.bookItems = [];
	    $scope.vm.tempArray = [];//装载练习册
	    $scope.vm.hwItems = [];

	    $scope.dateoption = {
	        zydatetiem: new Date().getTime()/1000,//date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
	        setDatetime: _setDatetime
	    }

	    initialize();
	    function initialize() {

	        _getTeacherClasslist();
	    }

	    function _getTeacherClasslist() {
	        var params = {
	            Token: $scope.vm.token,
	            Type: 1,//-1：全部，0：不显示，1：显示
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
	                classinfo.checked = checked;
	            }

	        } else {

	            $scope.vm.tempArray.push(classinfo)
	        }
	        //$rootScope.zyclasslist = $scope.vm.tempArray;
	        //classinfo.checked = checked;
	        if (flag) {

	            var classidlist = new Array()
	            angular.forEach($scope.vm.tempArray, function (o, i) {
	                classidlist.push({ClassID:o.classid});
	            });
	            if (classidlist.length > 0) {
	                _getClassBooks(classidlist, classinfo, checked);
	            } else {
	                $scope.vm.hwbidlist = [];
	                $scope.vm.chapterlist = [];
	            }
	        }
	        //console.log($scope.vm.tempArray.length)
	    }

	    function _getClassBooks(classidlist, classinfo, checked) {
	        var params = {
	            Token: $scope.vm.token,
	            ClassList: classidlist
	        }
	        setHomeWorkSrv.getTeacherCanSetHomeWork(params).then(function (result) {
	            if (result.code === 0) {

	                classinfo.checked = checked;
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
	            } else {
	                //$scope.vm.tempArray = [];
	                angular.forEach($scope.vm.tempArray, function (obj, index) {
	                    if (classinfo.classid === obj.classid) {
	                        $scope.vm.tempArray.splice(index, 1);
	                        return;
	                    }
	                });
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
	                classidlist.push({ ClassID: classinfo.classid });
	            });

	            if ($scope.vm.currenthwbid != 0) {
	                var params = {
	                    Token: $scope.vm.token,
	                    HWBID: $scope.vm.currenthwbid,
	                    ClassList: classidlist
	                }
	                setHomeWorkSrv.getHomeWorkList(params).then(function (result) {
	                    if (result.code === 0) {
	                        $scope.vm.chapterlist = result.data.chapterlist;

	                    }

	                });
	            }
	        }
	        $scope.vm.chapterlist = [];
	        $scope.vm.hwItems = [];
	    }

	    function _nodeExtender(node) {

	        node.checked = !node.checked;
	        //console.log(2)
	    }

	    //全部布置
	    function _selectAllHomeWork(home) {
	        //console.log($scope.vm.hwItems.length)
	        home.partchecked = false;
	        if ($scope.vm.hwItems.length >= 10) {
	            if (home.allchecked) {
	                angular.forEach($scope.vm.hwItems, function (obj, index) {
	                    if (home == obj) {
	                        $scope.vm.hwItems.splice(index, 1);
	                        return;
	                    }
	                });
	                home.allchecked = !home.allchecked;
	            } else {
	                var nestedConfirmDialog = ngDialog.openConfirm({
	                    template:
                            '<div style="padding:1em;">' +
                                '<p style="pidding:">最多只能选10个作业布置。</p>' +
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
	            if (home.allchecked) {
	                angular.forEach($scope.vm.hwItems, function (obj, index) {
	                    if (home.hwid == obj.hwid) {
	                        $scope.vm.hwItems.splice(index, 1);
	                        return;
	                    }
	                });
	                home.allchecked = false;

	            } else {
	                home.homeworkquestionlist = [];
	                home.isallarrangement = 1;

	                var params = {
	                    Token: $scope.vm.token,
	                    hwid: home.hwid
	                }
	                setHomeWorkSrv.getHomeWorkQuestionList(params).then(function (result) {
	                    if (result.code === 0) {

	                        angular.forEach($scope.vm.hwItems, function (obj, index) {
	                            if (home.hwid == obj.hwid && !home.allchecked) {
	                                $scope.vm.hwItems.splice(index, 1);
	                                return;
	                            }
	                        });

	                        var count = 0;
	                        var qids = [];
	                        var arrques = [];
	                        angular.forEach(result.data.pagelist, function (q, index) {

	                            angular.forEach(q.question, function (p, index) {
	                                //if (p.checked) {
	                                    count++;
	                                //}
	                                    qids.push({ qid: p.qid });
	                                    arrques.push(p);
	                            });
	                        });
	                        home.allnum = count;
	                        home.arrques = arrques;
	                        home.homeworkquestionlist = qids;
	                        home.allchecked = true;
                            
	                        $scope.vm.hwItems.push(home);
	                    }
	                });

	            }
	            //home.allchecked = !home.allchecked;
	        }
	        //console.log($scope.vm.hwItems.length)
	    }

	    //分题布置
	    function _selectPartHomeWork(home) {
	        home.allchecked = false;
	        //home.partchecked = !home.partchecked;
	        //if (home.partchecked)
	        {
	            $scope.currenthw = home;
	            //初始化选中数量
	            $scope.vm.selectedcount = 0;
	            //console.log($scope.vm.hwItems.length)
	            if ($scope.vm.hwItems.length >= 10) {
	                if (home.partchecked) {
	                    angular.forEach($scope.vm.hwItems, function (obj, index) {
	                        if (home == obj) {
	                            $scope.vm.hwItems.splice(index, 1);
	                            return;
	                        }
	                    });
	                    home.partchecked = !home.partchecked;
	                } else {
	                    var nestedConfirmDialog = ngDialog.openConfirm({
	                        template:
	                            '<div style="padding:1em;">' +
	                                '<p style="pidding:">最多只能选10个作业布置。</p>' +
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
	                if (home.partchecked) {
	                    angular.forEach($scope.vm.hwItems, function (obj, index) {
	                        if (home.hwid == obj.hwid) {
	                            $scope.vm.hwItems.splice(index, 1);
	                            return;
	                        }
	                    });
	                } else {

	                    //$scope.vm.hwItems.push(home);
	                    //ngDialog.open({
	                    //    template: 'js/app/sethomework/sethw/setparthw.html',
	                    //    className: 'ngdialog-theme-default',
	                    //    width: 768,
	                    //    height: 1024,
	                    //    //plain: true,
	                    //    scope: $scope
	                    //});
	                    $scope.vm.partindex = !$scope.vm.partindex;
	                    _getHomeWorkQuestionList(home.hwid);
	                }
	                home.partchecked = !home.partchecked;
	            }
	            //console.log($scope.vm.hwItems.length)

	            
	        }

	    }

	    //布置作业
	    function _setHomeWork() {

	        var hwidlist = new Array();
	        angular.forEach($scope.vm.hwItems, function (home, index) {
	            hwidlist.push(parseInt(home.hwid));
	        });

	        var classidlist = new Array();
	        angular.forEach($scope.vm.tempArray, function (classinfo, index) {
	            classidlist.push({ ClassID: classinfo.classid });
	        });

	        if (classidlist.length > 0) {
	            if ($scope.vm.currenthwbid != 0) {

	                if ($scope.vm.hwItems.length > 0 && classidlist.length > 0) {

	                    if ($scope.vm.currentdatatime) {
	                        if ($scope.vm.currentdatatime > new Date().getTime() / 1000) {
	                           // if ($scope.vm.currentdatatime <= parseInt( (new Date(new Date().valueOf() + 1 * 24 * 60 * 60 * 1000)).getTime() / 1000)) {
	                                var params = {
	                                    Token: $scope.vm.token,
	                                    HWIDList: [],
	                                    ClassList: classidlist,
	                                    Time: parseInt($scope.vm.currentdatatime),//"\/Date(" + (new Date($scope.vm.currentdatatime.replace(/-/g, "/"))).getTime() + ")\/",
	                                    isdaipi: 1
	                                }
	                                angular.forEach($scope.vm.hwItems, function (vh, index) {
	                                    var obj = {
	                                        HWID: vh.hwid,
	                                        HomeWorkQuestion: vh.homeworkquestionlist,
	                                        IsAllArrangement: vh.isallarrangement,
	                                        HWType: 1
	                                    }
	                                    params.HWIDList.push(obj);
	                                })
	                                $rootScope.hwendtime = $scope.vm.currentdatatime;
	                                $rootScope.tempArray = $scope.vm.tempArray;
	                                $rootScope.hwItems = $scope.vm.hwItems;
	                                setHomeWorkSrv.setHomeWork(params).then(function (result) {
	                                    if (result.code === 0) {
	                                        toastr.success('布置成功', '');

	                                        _setUserGuidance();

	                                        $state.go('app.sethomework.finsh', { pagesize: $scope.vm.hwItems.length });
	                                        //_getTeacherClasslist();
	                                    } 

	                                });
	                            //} else {
	                            //    toastr.error('作业提交时间建议一天以后截止', '');
	                            //}
	                        } else {
	                            toastr.error('作业提交截止时间应大于当前时间', '');
	                        }

	                    } else {
	                        toastr.error('请选择作业提交截止时间', '');
	                    }
	                }
	                else {
	                    toastr.error('请选择课时', '');
	                }
	            }
	            else {
	                toastr.error('请选择教材', '');
	            }
	        } else {
	            toastr.error('请选择年级', '');
	        }

	    }

	    function _setDatetime(time) {
	        //alert(dt);
	        $scope.vm.currentdatatime = new Date(time).getTime() / 1000;
	        //$scope.vm.datedisable = false;

	        //$scope.arrange["dateformatter"] = $scope.arrange["dateformatter"].replace(/-/g, "/");
	        //var params = {
	        //    hwidlist: hwidlist,
	        //    classidlist: classidlist,
	        //    time: "\/Date(" + (new Date($scope.arrange["dateformatter"])).getTime() + ")\/",
	        //    isdaipi: 1
	        //};


	    }

	    function _editDatetime(day) {
	        var d = new Date();
	        if (day == 3) {
	            d = new Date(d.pattern('yyyy/MM/dd') + ' 23:59:59');

	            $scope.vm.enddatetime = '';
	            $scope.dateoption.zydatetiem = '';
	            $scope.vm.datedisable = true;
	        }
	        else {
	            
	            d = (new Date(d.valueOf() + day * 24 * 60 * 60 * 1000));
	            //var time = d.pattern("yyyy-MM-dd HH:mm:ss").replace(/-/g, "/"); //d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
	            d = new Date(d.pattern('yyyy/MM/dd') + ' 23:59:59');
	           
	            //$scope.vm.enddatetime = time;

	            $scope.vm.datedisable = false;
	        }
	        $scope.vm.currentdatatime = d.getTime() / 1000;
	    }

	    //设置指导页已经查看 -- 创建班级
	    function _setUserGuidance() {
	        var params = {
	            Token: $scope.vm.token,
	            SetCheckPageFunctionList: [{ FeaturesPageCode: '0301' }]

	        }
	        setHomeWorkSrv.setUserGuidance(params).then(function (result) {
	            if (result.code === 0) {


	            } 
	        });
	    }


	    function _getHomeWorkQuestionList(hwid) {
	        var params = {
	            Token: $scope.vm.token,
	            HWID: hwid
	        }
	        setHomeWorkSrv.getHomeWorkQuestionList(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.sublogItems = result.data.pagelist;

	                var total = 0;
	                angular.forEach(result.data.pagelist, function (o,i) {
	                    angular.forEach(o.question, function (p, i) {
	                        total += 1;
	                    });
	                });
	                $scope.vm.questiontotalcount = total;
	                //$scope.vm.correctpagelist = result.data[0].correctpagelist;//[$scope.vm.currenthwindex];
	                //$scope.vm.pid = $scope.vm.correctpagelist[0].pid;
	                //$scope.vm.currentimgtotalcount = result.data[0].correctpagelist.length;

	                $scope.currentPigaiItem = $scope.vm.sublogItems[$scope.vm.currenthwindex];
	                _zoomQuesImg($scope.vm.sublogItems);
	                setMinMaxPoint();
	                //angular.forEach($scope.vm.sublogItems.cidlist, function (py, index) {
	                //    $scope.vm.currentcomment.push(py);
	                //})

	                loadImage(drawImg);

	            }
	        });


	    }

	    function _zoomQuesImg(list) {

	        angular.forEach(list, function (o, i) {
	            if (o.picsrcwidth > 768) {
	                var rate = o.picsrcwidth / 768;
	                o.picsrcwidth = o.picsrcwidth / rate;
	                o.picsrcheight = o.picsrcheight / rate;
	            }

	        });
	    }

	    function drawShape() {
	        $scope.imgoptions.cocyctx.drawImage($scope.imgoptions.img, 0, 0, $scope.currentPigaiItem.picsrcwidth, $scope.currentPigaiItem.picsrcheight);

	        var ctx = $scope.imgoptions.cocyctx;
	        var k = 0;
	        k = $scope.vm.currentimgpageindex;
	        //var pid = $scope.vm.correctpagelist[k].pid;
	        angular.forEach($scope.currentPigaiItem.question, function (pg, index) {
	            //if (pg.answer.pid == pid) {
	                var p = {
	                    width: pg.position.w,
	                    height: pg.position.h,
	                    left: pg.position.l,
	                    top: pg.position.t,
	                    picsrcwidth: $scope.currentPigaiItem.picsrcwidth,
	                    picsrcheight: $scope.currentPigaiItem.picsrcheight
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


	                if (pg.checked) {
	                    
	                    ctx.beginPath();
	                    ctx.moveTo(x, y);
	                    ctx.lineTo(x + width, y);
	                    ctx.lineTo(x + width, y + height);
	                    ctx.lineTo(x, y + height);
	                    ctx.closePath();
	                    ctx.lineWidth = 2;
	                    ctx.lineCap = "round";
	                    //ctx.strokeStyle = 'rgba(6,148,234,0.8)';
	                    ctx.font = "30px Courier New"; //设置字体填充颜色 
	                    //ctx.fillStyle = "#ff0000";
	                    ctx.strokeStyle = "#ff0000";
	                    ctx.strokeText("已选择", x, y + height / 2);
	                    ctx.stroke();

	                    //pg.checked = !pg.checked;

	                }




	            //}
	        })

	        //angular.forEach($scope.currentPigaiItem.question, function (pg, index) {
	        //    //if (pg.answer.pid == pid) {
	        //        if (pg.checked) {
	        //            var p = {
	        //                width: pg.answer.width,
	        //                height: pg.answer.height,
	        //                left: pg.answer.left,
	        //                top: pg.answer.top,
	        //                picsrcwidth: pg.answer.picsrcwidth,
	        //                picsrcheight: pg.answer.picsrcheight
	        //            }

	        //            var width = parseInt(p.width * p.picsrcwidth);
	        //            var height = parseInt(p.height * p.picsrcheight);
	        //            var x = p.picsrcwidth * p.left;
	        //            var y = p.picsrcheight * p.top;
	        //            //var ctx = canvas.getContext('2d');
	        //            ctx.beginPath();
	        //            ctx.moveTo(x, y);
	        //            ctx.lineTo(x + width, y);
	        //            ctx.lineTo(x + width, y + height);
	        //            ctx.lineTo(x, y + height);
	        //            ctx.closePath();
	        //            ctx.lineWidth = 2;
	        //            ctx.lineCap = "round";
	        //            //ctx.strokeStyle = 'rgba(6,148,234,0.8)';
	        //            ctx.font = "30px Courier New"; //设置字体填充颜色 
	        //            //ctx.fillStyle = "#ff0000";
	        //            ctx.strokeStyle = "#ff0000";
	        //            ctx.strokeText("已选择", x, y+ height/2);
	        //            ctx.stroke();

	        //            //pg.checked = !pg.checked;

	        //        }

	        //    //}


	        //})

	    }

	    function drawImg(img) {

	        var cocv = document.getElementById('canvasimg');
	        cocyctx = cocv.getContext("2d");
	        cocv.onclick = function (event) {

	            var point = windowTocanvas(cocv, event.clientX, event.clientY)
	            var x = parseInt(point.x);
	            var y = parseInt(point.y);
	            point.checked = false;
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
	            cocyctx.drawImage(img, 0, 0, $scope.currentPigaiItem.picsrcwidth, $scope.currentPigaiItem.picsrcheight);
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


	    function cimgOnceclick(point) {
	        //if ($scope.vm.reimg) return;
	        //alert($scope.vm.pid);
	        $scope.$apply(function () {
	            // $scope.reRender = rerender;
	            for (var i = 0, len = $scope.vm.sublogItems.length; i < len; i++) {
	                var ap = $scope.vm.sublogItems[i];
	                if (ap.pageindex == $scope.currentPigaiItem.pageindex) {
	                    for (var k = 0; k < ap.question.length; k++) {

	                        //for (var j = 0, jlen = ap.question[k].bounds.length; j < jlen; j++) {
	                            // if (ap.bounds[j].pageindex == $scope.currentPigaiItem.pageindex) {
	                            if (point.x > ap.question[k].bounds.minx && point.x < ap.question[k].bounds.maxx && point.y > ap.question[k].bounds.miny && point.y < ap.question[k].bounds.maxy) {
	                                var quesinfo = ap.question[k];
	                                quesinfo.checked = !quesinfo.checked;
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
	                                //$scope.vm.currenthwindex = i;
	                                //$scope.currentPigaiItem = $scope.vm.sublogItems[i];
	                                loadImage(drawImg);
	                                break;
	                            }
	                            //}
	                        //}




	                    }


	                }
	            }
	            //计算选中的数量
	            var count = 0;
	            angular.forEach($scope.vm.sublogItems, function (q, index) {

	                angular.forEach(q.question, function (p, index) {
	                    if (p.checked) {
	                        count++;
	                    }
	                });
	            });
	            $scope.vm.selectedcount = count;
	        })

            

            console.log($scope.vm.selectedcount)
	    }

	    function setMinMaxPoint() {
	        //var pigailist = $scope.correct["aninfo"].pigailist;
	        var getBound = function (answer, pageindex) {
	            //var ratio = zoomfactor / $scope.vm.initscale;
	            var minX = parseFloat($scope.currentPigaiItem.picsrcwidth) * parseFloat(answer.l);
	            var minY = parseFloat($scope.currentPigaiItem.picsrcheight) * parseFloat(answer.t);
	            var maxX = minX + parseFloat(answer.w * $scope.currentPigaiItem.picsrcwidth);
	            var maxY = minY + parseFloat(answer.h * $scope.currentPigaiItem.picsrcheight);
	            //$scope.vm["zoomfactor"] = zoomfactor;
	            if (parseFloat(answer.w) == 0 && parseFloat(answer.h) == 0) {
	                minX = 99999;
	                minY = 99999;
	                maxX = -99999;
	                maxY = -99999;
	            }
	            return {
	                pageindex: pageindex,
	                minx: minX,
	                miny: minY,
	                maxx: maxX,
	                maxy: maxY
	            }
	        }

	        angular.forEach($scope.vm.sublogItems, function (q, index) {

	            angular.forEach(q.question, function (p, index) {
	                p.bounds = {};

	                if (parseFloat(p.position.w) != 0 && parseFloat(p.position.h) != 0) {
	                    var mainpoint = getBound(p.position, q.pageindex);
	                    p.bounds = mainpoint;
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

	        });



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
	        img.src = $scope.currentPigaiItem.picsource;// imgurl;
	    }


	    //图片上一页
	    function _imgPrevPage() {
	        if ($scope.vm.currentimgpageindex == 0) {
	            toastr.error('已经是第一页', '');
	            return false;
	        } else {
	            var b = true;
	            $scope.vm.currentimgpageindex -= 1;
	            var pageindex = $scope.vm.sublogItems[$scope.vm.currentimgpageindex].pageindex;
	            //$scope.vm.pid = pid;
	            angular.forEach($scope.vm.sublogItems, function (pigai, index) {
	                if (pigai.pageindex == pageindex && b) {
	                    //$scope.vm.currenthwindex = index;
	                    $scope.currentPigaiItem = pigai;
	                    loadImage(drawImg);
	                    b = false;
	                }

	            });
	            //$scope.vm.currentimgpageindex-=1;
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
	            var pageindex = $scope.vm.sublogItems[$scope.vm.currentimgpageindex].pageindex;
	            //$scope.vm.pid = pid;
	            angular.forEach($scope.vm.sublogItems, function (pigai, index) {
	                if (pigai.pageindex == pageindex && b) {
	                    //$scope.vm.currenthwindex = index;
	                    $scope.currentPigaiItem = pigai;
	                    loadImage(drawImg);
	                    b = false;
	                }

	            });
	            //$scope.vm.currentimgpageindex+=1;

	        }

	    }


	    //选择试题
	    function _checkQuestion() {
	        var arry = new Array();
	        var arrQues = [];
	        var count = 0;
	        //angular.forEach($scope.vm.sublogItems.pigailist, function (pg, index) {
	        //    if (pg.checked) {
	        //        arrQues.push(pg);
	        //        arry.push(pg.ques.qid);
	        //    }
	        //});
	        angular.forEach($scope.vm.sublogItems, function (q, index) {

	            angular.forEach(q.question, function (p, index) {
	                if (p.checked) {
	                    arrQues.push(p);
	                    arry.push({ qid: p.qid });
	                }
	                count += 1;
	            });
	        });



	        if (arry.length > 0) {
	            //$rootScope.parthomework = arry;


	            angular.forEach($scope.vm.hwItems, function (obj, index) {
	                if ($scope.currenthw.hwid == obj.hwid && obj.allchecked) {
	                    $scope.vm.hwItems.splice(index, 1);
	                    return;
	                }
	            });

	            $scope.currenthw.arrques = arrQues;
	            $scope.currenthw.allnum = count;//$scope.vm.sublogItems.pigailist.length;
	            $scope.currenthw.homeworkquestionlist = arry;
	            $scope.currenthw.isallarrangement = 0;

	            angular.forEach($scope.vm.hwItems, function (obj, index) {
	                if ($scope.currenthw.hwid == obj.hwid) {
	                    $scope.vm.hwItems.splice(index, 1);
	                    return;
	                }
	            });

	            //$scope.vm.hwItems = [];
	            $scope.vm.hwItems.push($scope.currenthw);
	            //ngDialog.closeAll();
	            $scope.vm.partindex = !$scope.vm.partindex;


	        } else {

	        }


	    }

	    function _goToSetHW() {
	        

	        var flag = false;
	        angular.forEach($scope.vm.hwItems, function (obj, index) {
	            if ($scope.currenthw == obj) {
	                flag = true;
	            }
	        });

	        if (!flag) {
	            $scope.currenthw.partchecked = !$scope.currenthw.partchecked;
	        }
	            $scope.vm.partindex = !$scope.vm.partindex;

	    }

	    Date.prototype.pattern = function (fmt) {
	        var o = {
	            "M+": this.getMonth() + 1, //月份         
	            "d+": this.getDate(), //日         
	            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
	            "H+": this.getHours(), //小时         
	            "m+": this.getMinutes(), //分         
	            "s+": this.getSeconds(), //秒         
	            "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
	            "S": this.getMilliseconds() //毫秒         
	        };
	        var week = {
	            "0": "/u65e5",
	            "1": "/u4e00",
	            "2": "/u4e8c",
	            "3": "/u4e09",
	            "4": "/u56db",
	            "5": "/u4e94",
	            "6": "/u516d"
	        };
	        if (/(y+)/.test(fmt)) {
	            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	        }
	        if (/(E+)/.test(fmt)) {
	            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	        }
	        for (var k in o) {
	            if (new RegExp("(" + k + ")").test(fmt)) {
	                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	            }
	        }
	        return fmt;
	    }

	}]);
	module.controller('SetPartHomeworkCtrl', ['$scope', '$state', 'setHomeWorkSrv', 'toastr', 'ngDialog', '$rootScope', function ($scope, $state, setHomeWorkSrv, toastr, ngDialog, $rootScope) {
	    //$scope.title = '布置作业';
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        hwid: $state.params.hwid,
	        currenthwindex: 0,
	        currentimgpageindex:0
	    }

	    $scope.imgoptions = {
	    }
	    $scope.pigaiItem = [];

	    $scope.imgPrevPage = _imgPrevPage;
	    $scope.imgNextPage = _imgNextPage;
	    $scope.checkQuestion = _checkQuestion;

	    initialize();
	    function initialize() {

	        _getHomeWorkQuestionList();
	    }

	    function _getHomeWorkQuestionList() {
	        var params = {
	            Token: $scope.vm.token,
	            hwid: $scope.vm.hwid
	        }
	        setHomeWorkSrv.getHomeWorkQuestionList(params).then(function (result) {
	            if (result.code === 0) {
	                $scope.vm.sublogItems = result.data[0];
	                $scope.vm.correctpagelist = result.data[0].correctpagelist;//[$scope.vm.currenthwindex];
	                $scope.vm.currentimgtotalcount = result.data[0].correctpagelist.length;

	                $scope.currentPigaiItem = $scope.vm.sublogItems.pigailist[$scope.vm.currenthwindex];
	                setMinMaxPoint();
	                angular.forEach($scope.vm.sublogItems.cidlist, function (py, index) {
	                    $scope.vm.currentcomment.push(py);
	                })
	                
	                loadImage(drawImg);

	            }
	        });


	    }

	    function drawShape() {
	        $scope.imgoptions.cocyctx.drawImage($scope.imgoptions.img, 0, 0);

	        var ctx = $scope.imgoptions.cocyctx;
	        var k = 0;
	        k = $scope.vm.currentimgpageindex;
	        var pid = $scope.vm.correctpagelist[k].pid;
	        angular.forEach($scope.vm.sublogItems.pigailist, function (pg, index) {
	            if (pg.answer.pid == pid) {
	                var p = {
	                    width: pg.answer.width,
	                    height: pg.answer.height,
	                    left: pg.answer.left,
	                    top: pg.answer.top,
	                    picsrcwidth: pg.answer.picsrcwidth,
	                    picsrcheight: pg.answer.picsrcheight
	                }

	                var width = parseInt(p.width);
	                var height = parseInt(p.height);
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
	            }
	        })

	        angular.forEach($scope.vm.sublogItems.pigailist, function (pg, index) {
	            if (pg.answer.pid == pid) {
	                if (pg.checked) {
	                    var p = {
	                        width: pg.answer.width,
	                        height: pg.answer.height,
	                        left: pg.answer.left,
	                        top: pg.answer.top,
	                        picsrcwidth: pg.answer.picsrcwidth,
	                        picsrcheight: pg.answer.picsrcheight
	                    }

	                    var width = parseInt(p.width);
	                    var height = parseInt(p.height);
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
	                    //ctx.strokeStyle = 'rgba(6,148,234,0.8)';
	                    ctx.font = "30px Courier New"; //设置字体填充颜色 
	                    //ctx.fillStyle = "#ff0000";
	                    ctx.strokeStyle = "#ff0000";
	                    ctx.strokeText("已选择", x, y);
	                    ctx.stroke();

	                    //pg.checked = !pg.checked;

	                }



	            }


	        })
	        //绘制所有批改作业状态
	        //angular.forEach($scope.vm.sublogItems.pigailist, function (pg, index) {
	        //    if (pg.answer.pid == $scope.currentPigaiItem.answer.pid) {
	        //        var p = pg.answer;
	        //        if (pg.child.length > 0) {
	        //            p = pg.child[0].answer;
	        //        }
	        //        var width = parseInt(p.width);
	        //        var height = parseInt(p.height);
	        //        var x = p.picsrcwidth * p.left;
	        //        var y = p.picsrcheight * p.top;
	        //        var ctx = document.getElementById('canvasimg').getContext('2d');
	        //        var startX = width / 2 + 30;
	        //        if (pg.pigai.answerstatus == 3) {
	        //            //错误
	        //            ctx.beginPath()
	        //            ctx.moveTo(x + startX, y);
	        //            ctx.lineTo(x + startX - 30, y + 30);
	        //            ctx.closePath();
	        //            ctx.lineWidth = 3;
	        //            ctx.strokeStyle = "red";
	        //            ctx.lineCap = "round";
	        //            ctx.stroke();
	        //            ctx.beginPath()
	        //            ctx.moveTo(x + startX - 30, y);
	        //            ctx.lineTo(x + startX, y + 30);
	        //            ctx.closePath();
	        //            ctx.lineWidth = 3;
	        //            ctx.strokeStyle = "red";
	        //            ctx.lineCap = "round";
	        //            ctx.stroke();
	        //        } else if (pg.pigai.answerstatus == 2) {
	        //            //半对
	        //            ctx.beginPath()
	        //            ctx.moveTo(x + startX, y);
	        //            ctx.lineTo(x + startX - 30, y + 20);
	        //            ctx.closePath();
	        //            ctx.lineWidth = 3;
	        //            ctx.strokeStyle = "red";
	        //            ctx.lineCap = "round";
	        //            ctx.stroke();
	        //            ctx.beginPath()
	        //            ctx.moveTo(x + startX - 40, y + 5);
	        //            ctx.lineTo(x + startX - 30, y + 20);
	        //            ctx.closePath();
	        //            ctx.lineWidth = 3;
	        //            ctx.strokeStyle = "red";
	        //            ctx.lineCap = "round";
	        //            ctx.stroke();
	        //            ctx.beginPath()
	        //            ctx.moveTo(x + startX - 20, y + 2);
	        //            ctx.lineTo(x + startX - 15, y + 20);
	        //            ctx.closePath();
	        //            ctx.lineWidth = 3;
	        //            ctx.strokeStyle = "red";
	        //            ctx.lineCap = "round";
	        //            ctx.stroke();
	        //        } else if (pg.pigai.answerstatus == 1) {
	        //            //正确
	        //            ctx.beginPath()
	        //            ctx.moveTo(x + startX, y);
	        //            ctx.lineTo(x + startX - 30, y + 20);
	        //            ctx.closePath();
	        //            ctx.lineWidth = 3;
	        //            ctx.strokeStyle = "red";
	        //            ctx.lineCap = "round";
	        //            ctx.stroke();
	        //            ctx.beginPath()
	        //            ctx.moveTo(x + startX - 40, y + 5);
	        //            ctx.lineTo(x + startX - 30, y + 20);
	        //            ctx.closePath();
	        //            ctx.lineWidth = 3;
	        //            ctx.strokeStyle = "red";
	        //            ctx.lineCap = "round";
	        //            ctx.stroke();
	        //        }

	        //    }
	        //});

	    }

	    function drawImg(img) {

	        var cocv = document.getElementById('canvasimg');
	        cocyctx = cocv.getContext("2d");
	        cocv.onclick = function (event) {

	            var point = windowTocanvas(cocv, event.clientX, event.clientY)
	            var x = parseInt(point.x);
	            var y = parseInt(point.y);
	            point.checked = false;
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


	    function cimgOnceclick(point) {
	        //if ($scope.vm.reimg) return;

	        $scope.$apply(function () {
	            // $scope.reRender = rerender;
	            for (var i = 0, len = $scope.vm.sublogItems.pigailist.length; i < len; i++) {
	                var ap = $scope.vm.sublogItems.pigailist[i];
	                if (ap.answer.pid == $scope.currentPigaiItem.answer.pid) {
	                    for (var j = 0, jlen = ap.bounds.length; j < jlen; j++) {
	                        if (ap.bounds[j].pid == $scope.currentPigaiItem.answer.pid) {
	                            if (point.x > ap.bounds[j].minx && point.x < ap.bounds[j].maxx && point.y > ap.bounds[j].miny && point.y < ap.bounds[j].maxy) {
	                                var quesinfo = $scope.vm.sublogItems.pigailist[i];
	                                quesinfo.checked = !quesinfo.checked;
	                                //$scope.correct["selectcorrect"] = $scope.vm.sublogItems.pigailist[i];
	                                //$scope.imgzoomoption['quesinfo'] = quesinfo;
	                                var childans = [], pid = null;
	                                if (quesinfo.child && quesinfo.child.length > 0) {
	                                    angular.forEach(quesinfo.child, function (ca, index) {
	                                        if (!pid) {
	                                            pid = ca.answer.pid;
	                                            childans.push(ca.answer);
	                                        } else if (pid == ca.answer.pid) {
	                                            childans.push(ca.answer);
	                                        }
	                                    });
	                                } else {
	                                    childans.push(quesinfo.answer);
	                                }
	                                //rerender($scope.correct["aninfo"].pigailist, childans, $scope.vm.imgpid);
	                                //alert(i)
	                                $scope.vm.currenthwindex = i;
	                                $scope.currentPigaiItem = $scope.vm.sublogItems.pigailist[i];
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
	            var maxX = minX + parseFloat(answer.width);
	            var maxY = minY + parseFloat(answer.height);
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
	        angular.forEach($scope.vm.sublogItems.pigailist, function (p, index) {
	            p.bounds = [];

	            if (parseFloat(p.answer.width) != 0 && parseFloat(p.answer.height) != 0) {
	                var mainpoint = getBound(p.answer);
	                p.bounds.push(mainpoint);
	            }
	            if (p.child.length > 0) {
	                angular.forEach(p.child, function (pc, index) {
	                    var cbound = getBound(pc.answer);
	                    p.bounds.push(cbound);
	                    //if (cbound.minx < p.bound.minx) {
	                    //    p.bound.minx = cbound.minx;
	                    //}
	                    //if (cbound.miny < p.bound.miny) {
	                    //    p.bound.miny = cbound.miny;
	                    //}
	                    //if (cbound.maxx > p.bound.maxx) {
	                    //    p.bound.maxx = cbound.maxx;
	                    //}
	                    //if (cbound.maxy > p.bound.maxy) {
	                    //    p.bound.maxy = cbound.maxy;
	                    //}
	                })

	            }
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
	        img.src = $scope.currentPigaiItem.answer.picsorce;// imgurl;
	    }


	    //图片上一页
	    function _imgPrevPage() {
	        if ($scope.vm.currentimgpageindex == 0) {
	            toastr.error('已经是第一页', '');
	            return false;
	        } else {

	            $scope.vm.currentimgpageindex-=1;
	            var pid = $scope.vm.correctpagelist[$scope.vm.currentimgpageindex].pid;
	            angular.forEach($scope.vm.sublogItems.pigailist, function (pigai, index) {
	                if (pigai.answer.pid == pid) {
	                    //$scope.vm.currenthwindex = index;
	                    $scope.currentPigaiItem = pigai;
	                    loadImage(drawImg);
	                }

	            });
	            //$scope.vm.currentimgpageindex--;
	        }
	    }
	    //图片下一页
	    function _imgNextPage() {
	        if ($scope.vm.currentimgpageindex == $scope.vm.currentimgtotalcount-1) {
	            toastr.error('已经是最后一页', '');
	            return false;
	        } else {
	            $scope.vm.currentimgpageindex+=1;
	            var pid = $scope.vm.correctpagelist[$scope.vm.currentimgpageindex].pid;
	            angular.forEach($scope.vm.sublogItems.pigailist, function (pigai, index) {
	                if (pigai.answer.pid == pid) {
	                    $scope.vm.currenthwindex = index;
	                    $scope.currentPigaiItem = pigai;
	                    loadImage(drawImg);
	                }

	            });
	            //$scope.vm.currentimgpageindex++;

	        }

	    }


	    //选择试题
	    function _checkQuestion() {
	        var arry = new Array();
	        angular.forEach($scope.vm.sublogItems.pigailist, function (pg, index) {
	            if (pg.checked) {
	                arry.push(pg);
	            }
	        });
	        $rootScope.parthomework=arry;
	        //$state.go('');
	    }


	}]);
});