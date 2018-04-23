define(['require', 'angular', 'components/com-funs', 'directives/com-directives', 'checkhomework/checkhomework.service'], function (require, ng, comfuns) {
    var module = ng.module('app.checkhomework');
    //获取作业信息
    module.controller('ResultCtrl', ['$scope', '$state', '$sce', 'checkHomeWorkSrv', 'toastr', 'ngDialog', '$rootScope', '$interval', '$timeout', function ($scope, $state, $sce, checkHomeWorkSrv, toastr, ngDialog, $rootScope, $interval, $timeout) {
        //$scope.title = '批改小结';
        var date = new Date();
        $scope.vm = {
            width:60,
            height:34,
            token: window.localStorage.tch_token,
            rnum: 0,
            bnum: 0,
            cnum: 0,
            tabindex: 0,
            currenthwindex: 0,
            type: $state.params.type,
            tchwlogid: $state.params.tchwlogid,
            sublogid: $state.params.sublogid,
            upid: $state.params.upid,
            cstatus: $state.params.cstatus,
            currentimgpageindex: 0,
            currentimgtotalcount: 0,
            commentid: 0,
            setdatetime: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
            currentcomment: [],
            againreason: '',
            currentcount: 0,
            maxcount: 100,
            commentlist: [],
            timeout:true,
        }

        var rootHandle = $rootScope.$watchCollection('tchwinfo', function (newvalue, oldvalue) {
            if (newvalue) {
                $scope.vm.tchwinfo = $rootScope.tchwinfo;
                rootHandle();
            }

        });

        var rootHandle1 = $rootScope.$watchCollection('questioncorrectlist', function (newvalue, oldvalue) {
            if (newvalue) {
                $scope.vm.questioncorrectlist = $rootScope.questioncorrectlist;
                _getHomeWorkResult();
                rootHandle1();
            }

        });

        $scope.imgoptions = {
        }
        $scope.pigaiItem = [];

        $scope.selectQuestion = _selectQuestion;
        //$scope.correctHomeWork = _correctHomeWork;
        $scope.imgPrevPage = _imgPrevPage;
        $scope.imgNextPage = _imgNextPage;
        $scope.selectComment = _selectComment;
        $scope.checkNextStudent = _checkNextStudent;
        //$scope.reSubmitWorkDialog = _reSubmitWorkDialog;
        //$scope.reSubmitWork = _reSubmitWork;
        //$scope.commentDialog = _commentDialog;
        $scope.toHtml = _toHtml;
        //$scope.getHomeWorkQuestionCommoncClassList = _getHomeWorkQuestionCommoncClassList;
        //$scope.checkFinsh = _checkFinsh;             
        //$scope.selectCommont = _selectCommont;
        $scope.closeDialog = _closeDialog;
        $scope.addResultComment = _addResultComment;
        $scope.deleteResultComment = _deleteResultComment;

        $scope.openRef = _openRef;
        $scope.teaThumb = _teaThumb;
        $scope.goAlstudent = _goAlstudent;
        $scope.goToSAnalyze = _goToSAnalyze;
        $scope.checkWord = _checkWord;
        $scope.playSingleVoice = _playSingleVoice;
        $scope.playResultVoice = _playResultVoice;
        $scope.checkFinshDialog = _checkFinshDialog;
        $scope.checkFinsh = _checkFinsh;
        $scope.applyCorrectDialog = _applyCorrectDialog;
        $scope.applyCorrect = _applyCorrect;

        initialize();
        function initialize() {
            if ($scope.vm.cstatus == 2) {
                _getHomeWorkResult();
            }
            //else {
            //    alert($rootScope.questioncorrectlist);
            //    $scope.vm.questioncorrectlist = $rootScope.questioncorrectlist;
            //}
        }

        function _closeDialog() {
            ngDialog.closeAll();
        }
        //跳转学情分析
        function _goToSAnalyze() {
            $state.go('app.analyze.period.detail', { tchwlogid: $scope.vm.tchwlogid });
        }
        function _openRef() {
            $scope.vm.reopen = !$scope.vm.reopen;
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

                    //绘制外框
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + width, y);
                    ctx.lineTo(x + width, y + height);
                    ctx.lineTo(x, y + height);
                    ctx.closePath();
                    ctx.lineWidth = 2;
                    ctx.lineCap = "round";
                    ctx.strokeStyle = 'rgba(255, 127, 0,0.8)';
                    ctx.stroke();

                    if (pg.correct.answerstatus == 3) {
                        //错误
                        ctx.beginPath();
                        ctx.moveTo(x + startX, y + startY);
                        ctx.lineTo(x + startX - 30, y + startY + 30);
                        ctx.closePath();
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = "red";
                        ctx.lineCap = "round";
                        ctx.stroke();
                        ctx.beginPath();
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

                    if (pg.correct.accessory != ''|| pg.correct.singlecommentlist.length>0 ) {
                       
                        var img = new Image();
                        img.onload = function () { ctx.drawImage(img, x + (width -60), y + height - 34); };
                        img.src = "http://img1.yqj.cn/w/images/ys-pc/Comment.png";
                        ctx.stroke();
                    }

                }
            });

            //var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + width, y);
            ctx.lineTo(x + width, y + height);
            ctx.lineTo(x, y + height);
            ctx.closePath();
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.strokeStyle = 'rgba(6,148,234,1)';
            ctx.stroke();
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

                                    if ($scope.vm.questioncorrectlist[i].correct.accessory != '' || $scope.vm.questioncorrectlist[i].correct.singlecommentlist.length > 0) {
                                        if (point.x > ap.bounds[j].maxx - $scope.vm.width && point.x < ap.bounds[j].maxx && point.y > ap.bounds[j].maxy - $scope.vm.height && point.y < ap.bounds[j].maxy) {
                                            _voiceDialog(quesinfo);
                                            return;
                                        }
                                    }


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
        function getPingyu() {
            var params = {
                Token: $scope.vm.token,
            };
            checkHomeWorkSrv.getPingyu(params).then(function (result) {
                if (result.code === 0) {
                    $scope.vm.cidlist = result.data;
                    angular.forEach($scope.vm.cidlist, function (vc, index) {
                        angular.forEach($scope.vm.currentcomment, function (vcm, index) {
                            if (vc.cid == vcm.cid) {
                                vc.checked = true;
                            }
                        })
                    })
                }
            });
        }

        function _teaThumb() {
            if (!$scope.vm.message || $scope.vm.message == "") {
                toastr.info("点赞原因不能为空", '');
                return;
            }
            var params = {
                Token: $scope.vm.token,
                sublogid: $scope.vm.sublogid,//
                upid: $scope.vm.upid,
                message: $scope.vm.message
            }
            checkHomeWorkSrv.teaThumb(params).then(function (result) {
                if (result.Code === 0) {
                    $scope.vm.sublogItems.thumbsupnum = 1;
                    toastr.success("点赞成功", '');
                } 
                //alert($scope.vm.sublogItems.mysorce);
            });
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
        //获取作业
        function _getHomeWorkResult() {
            var params = {
                Token: $scope.vm.token,
                sublogid: $scope.vm.sublogid,
                DataType:31,// [1, 2,3, 4, 5],//1，布置作业记录信息，2学生接收记录信息，3学生提交记录信息，4作业问题的基本信息和批改信息，5作业批改结果，6作业批改结果反馈
            };
            checkHomeWorkSrv.getHomeWorkResult(params).then(function (result) {
                if (result.code === 0) {
                    //$scope.vm.sublogItems = result.data[0];

                    //测试使用
                    //$scope.vm.sublogItems.cidlist = [{ cid: 73, ctitle: "测试73" }, { cid: 74, ctitle: "测试74" }, { cid: 75, ctitle: "测试75" }];

                    //$scope.vm.correctpagelist = result.data[0].correctpagelist;//[$scope.vm.currenthwindex];
                    //$scope.vm.currentimgtotalcount = result.data[0].correctpagelist.length;
                    var newdata = datafactory(result.data);

                    if ($scope.vm.cstatus == 2) {
                        $scope.vm.questioncorrectlist = newdata.questioncorrectlist;   
                    }

                    $scope.vm.settinghomework = result.data.settinghomework;
                    $scope.vm.studentinfo = newdata.studentinfo;
                    $scope.vm.correctpagelist = result.data.correctpagelist;
                    $scope.vm.submithomework = result.data.submithomework;
                    $scope.vm.homeworkcorrectresult = result.data.homeworkcorrectresult;
                    //$scope.vm.questioncorrectlist = newdata.questioncorrectlist;                   

                    $scope.vm.tchwlogid = $scope.vm.settinghomework.tchwlogid;
                    $scope.vm.sublogid = $scope.vm.submithomework.sublogid;
                    $scope.vm.upid = $scope.vm.studentinfo.upid;

                    //提前预判
                    if ($scope.vm.homeworkcorrectresult.correctstatus == 2) {
                        $scope.vm.questioncorrectlist = newdata.questioncorrectlist;
                    } else {
                        angular.forEach($scope.vm.questioncorrectlist, function (o, i) {
                            if (o.correct.answerstatus==0) {
                                o.correct.answerstatus = 1;
                            }
                        });

                    }
                    var score = sumResultScore($scope.vm.questioncorrectlist);
                    $scope.vm.homeworkcorrectresult.myscore = score;

                    //计算判题是否超过半小时
                    if ($scope.vm.homeworkcorrectresult.correctstatus == 2) {
                        var time = new Date().getTime() - result.data.homeworkcorrectresult.pigaiendtime * 1000;
                        if (time > (30 * 60 * 1000)) {
                            $scope.vm.timeout = false;
                        }
                    }


                    
                    $scope.currentPigaiItem = $scope.vm.questioncorrectlist[$scope.vm.currenthwindex];
                    _zoomQuesImg($scope.vm.questioncorrectlist);
                    setMinMaxPoint();

                    _resultCommentList();
                    //angular.forEach(comfuns.getCommentList(), function (vc, index) {
                    //    angular.forEach($scope.vm.homeworkcorrectresult.commentlist, function (s, index) {
                    //        if (s.cid == vc.cid) {
                    //            vc.checked = true;
                    //        }
                    //    });
                    //});
                    //_getResultNum();
                    //getPingyu();
                    loadImage(drawImg);

                }
            });
        }

        //计算分值
        function sumResultScore(pigailist, sumscore) {
            var _gscore = 0, rscore = 0;
            angular.forEach(pigailist, function (p, index) {

                rscore = rscore + p.question.maxscore;
                if (p.correct.answerstatus == 1) {
                    _gscore = _gscore + p.question.maxscore;
                } else if (p.correct.answerstatus == 2) {
                    _gscore = _gscore + Math.round(p.question.maxscore / 2);
                }

            })
            return Math.round((_gscore / rscore) * 100);
        }

        function _getResultNum() {
            $scope.vm.rnum = 0;
            $scope.vm.bnum = 0;
            $scope.vm.cnum = 0;
            angular.forEach($scope.vm.questioncorrectlist, function (sp, index) {
                //rnum: 0,
                //bnum:0,
                //cnum:0,
                if (sp.correct.answerstatus == 1) {
                    $scope.vm.rnum = $scope.vm.rnum + 1;
                } else if (sp.correct.answerstatus == 2) {
                    $scope.vm.bnum = $scope.vm.bnum + 1;
                } else if (sp.correct.answerstatus == 3) {
                    $scope.vm.cnum = $scope.vm.cnum + 1;
                }
            })

        }

        function _selectQuestion(item, index) {

            //$scope.vm.currenthwindex = index;
            //$scope.currentPigaiItem = item;
            //loadImage( drawImg);
            //if ($scope.vm.settinghomework.checktype == 1) {

                //$state.go('app.checkhomework.alreadyhw.detail', { tchwlogid: $scope.vm.tchwlogid, sublogid: $scope.vm.sublogid, upid: $scope.vm.upid });
            //} else {
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

                loadImage(drawImg);

            //}

        }

        function _goAlstudent() {
            //var rotue = '';
            //if ($scope.vm.homeworkcorrectresult.correctstatus == 2) {
            //    if ($scope.vm.settinghomework.nocorrections > 0) {
            //        $state.go('app.checkhomework.unalreadyhw.unstudent', { tchwlogid: $scope.vm.tchwlogid });
            //    } else {
            //        $state.go('app.checkhomework.alreadyhw.student', { tchwlogid: $scope.vm.tchwlogid });

            //    }
            //} else {
            //    $state.go('app.checkhomework.unalreadyhw.unstudent', { tchwlogid: $scope.vm.tchwlogid });
            //}
            

            var routername = 'app.checkhomework.alreadyhw.student';
            if ($scope.vm.type == 1) {
                routername = 'app.checkhomework.unalreadyhw.unstudent';
            }
            $state.go(routername, { tchwlogid: $scope.vm.tchwlogid });
        }
       

        //获取更多评语
        function _getHomeWorkQuestionList() {
            var params = {
                Token: $scope.vm.token,

            };
            checkHomeWorkSrv.getHomeWorkQuestionList(params).then(function (result) {
                if (result.Code === 0) {
                    $scope.vm.commentItems = result.data[0];//.cidlist;

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
        
        function _zoomQuesImg(list) {

            angular.forEach(list, function (o, i) {
                if (o.answer.picsrcwidth > 768) {
                    var rate = o.answer.picsrcwidth / 768;
                    o.answer.picsrcwidth = o.answer.picsrcwidth / rate;
                    o.answer.picsrcheight = o.answer.picsrcheight / rate;
                }

            });
        }

        //批改下一位同学
        function _checkNextStudent() {

            $state.go('app.checkhomework.unalreadyhw.undetail', { tchwlogid: $scope.vm.tchwlogid, sublogid: 0, upid: 0 });
        }

        //添加小结评语
        function _addResultComment(comment) {


                if ($scope.vm.homeworkcorrectresult.commentlist.length >= 3) {
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
                    //    hwid: $scope.vm.settinghomework.hwid,
                    //    ctitle: comment.ctitle,
                    //    cid: comment.cid,
                    //}
                    //checkHomeWorkSrv.addResultComment(params).then(function (result) {
                    //    if (result.code === 0) {
                    //        //if (params.type == 1) {
                    //        //    toastr.success('提交评语成功', '');
                    //        //} else {
                    //        //    toastr.success('删除评语成功', '');
                    //        //}
                            angular.forEach($scope.vm.cidsresultlist, function (vc, index) {
                                if (comment.cid == vc.cid) {
                                    //params.type == 1 ? vc.checked = true : vc.checked = false;
                                    if (vc.checked) {
                            			vc.checked = !vc.checked;
                            			angular.forEach($scope.vm.homeworkcorrectresult.commentlist, function (v, index) {
                            				if (v.cid == vc.cid) {
                            					$scope.vm.homeworkcorrectresult.commentlist.splice(index,1);
                            				}
                            			})
                            			
                            		} else{
                            			vc.checked = !vc.checked;
                            			 $scope.vm.homeworkcorrectresult.commentlist.push({ cid: comment.cid, ctitle: comment.ctitle })
                            		}
                                }
                            	});
            
                            
                    

                    //});

        }
        //删除小结评语
        function _deleteResultComment(comment) {
            //var params = {
            //    Token: $scope.vm.token,
            //    sublogid: $scope.vm.sublogid,//
            //    cid: comment.cid,
            //}
            //checkHomeWorkSrv.deleteResultComment(params).then(function (result) {
            //    if (result.code === 0) {
                    angular.forEach($scope.vm.cidsresultlist, function (vc, index) {
                        if (comment.cid == vc.cid) {
                            //params.type == 1 ? vc.checked = true : vc.checked = false;
                            vc.checked = false;
                        }
                    });
                    angular.forEach($scope.vm.homeworkcorrectresult.commentlist, function (vc, index) {
                        if (comment.cid === vc.cid) {
                            $scope.vm.homeworkcorrectresult.commentlist.splice(index, 1);
                        }
                    })
            //        getCommentnum();
            

            //});
        }

        function checkRemind(c) {
            var b = true;
            angular.forEach($scope.vm.currentcomment, function (vc, index) {
                if (c.cid == vc.cid) {
                    b = false;
                }
            })
            return b;
        }


        function _toHtml(html) {
            return $sce.trustAsHtml(html);
        }

        //小结评语列表
        function _resultCommentList() {

            //var params = {
            //    Token: $scope.vm.token,

            //};
            //checkHomeWorkSrv.resultCommentList(params).then(function (result) {
            //    if (result.code === 0) {
            $scope.vm.cidsresultlist = comfuns.getCommentList(); //result.data;
            angular.forEach($scope.vm.cidsresultlist, function (vc, index) {
                angular.forEach($scope.vm.homeworkcorrectresult.commentlist, function (s, index) {
                    if (s.cid == vc.cid) {
                        vc.checked = true;
                    }
                });
            });



            //    }

            //});

        }

        function _getHomeWorkQuestionCommonList(classinfo) {

            var params = {
                Token: $scope.vm.token,
                cclassid: classinfo.cclassid

            };
            checkHomeWorkSrv.getHomeWorkQuestionCommonList(params).then(function (result) {
                if (result.code === 0) {

                    $scope.vm.cidlist = result.data[0].cidlist;
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

        function _checkWord($event) {
            if ($event.keyCode == 8) {
                if ($scope.vm.currentcount != 0) {
                    $scope.vm.currentcount -= 1;
                }
            } else {
                if ($scope.vm.currentcount < $scope.vm.maxcount) {
                    $scope.vm.currentcount += 1;
                }
            }
            
        }

        function _voiceDialog(quesinfo) {
            $scope.vm.currentquesinfo = quesinfo;
            var common = [];
            var commonStr = '';
            angular.forEach(quesinfo.correct.singlecommentlist, function (o,i) {
                //common.push('#' + o.cidname+'#');
                commonStr += '#' + o.cidname + '#';
            });
            //if (common) {
            //    commonStr = common.toString();
            //}

            var nestedConfirmDialog = ngDialog.openConfirm({
                template:
                        '<div style="padding:1em;">' +
                        '<p>评语</p>'+
                        '<div style="padding:15px;">' +
                        '<div style="margin-top:20px;" ng-if="vm.currentquesinfo.correct.accessory">' +
                        '<div style="float:left"><img src="http://img1.yqj.cn/w/images/ys-pc/portrait.png" /></div>' +
                        '<div style="float:left; background:url(http://img1.yqj.cn/w/images/ys-pc/speech-bg.png) no-repeat; width:147px; height:50px; padding-left:25px; padding-top:12px;cursor:pointer;" ng-click="playSingleVoice()">' +
                        '<img src="http://img1.yqj.cn/w/images/ys-pc/speech.png" width="19" height="27"  ng-if="!vm.currentquesinfo.correct.played" />' +
                        '<img src="http://img1.yqj.cn/w/images/ys-pc/speech.gif" width="19" height="27"  ng-if="vm.currentquesinfo.correct.played"/>' +
                        //'<audio id="' + quesinfo.correct.autoid + '" >Your browser does not support the audio element.</audio>' +
                        '</div>' +
                        '<div style="float:left; margin-top:15px; font-size:18px; font-family:\'微软雅黑\'; color:#666666; margin-left:10px;" ng-bind="vm.currentquesinfo.correct.voicetime">15"</div>' +
                        '<div style="clear:both"></div>' +
                        '</div>' +
                        '<div style="font-family:\'微软雅黑\'; font-size:14px; color:#666666; margin-top:20px;"  ng-if="vm.currentquesinfo.correct.singlecommentlist.length>0">' + commonStr + '</div>' +
                        '</div>' +
                        
                        '</div>',
                plain: true,
                width: 350,
                scope: $scope,
                className: 'ngdialog-theme-default',
            });
        }

        //播放单题语音评语
        function _playSingleVoice() {
            if ($rootScope.rootaudio) {
                $rootScope.rootaudio.pause();
                $rootScope.rootaudio = null;
            }
            $rootScope.rootaudio = new Audio();
            $rootScope.rootaudio.src = $scope.vm.currentquesinfo.correct.accessory;
            //$scope.hwstatus["zyinfo"].isload = true;
            $rootScope.rootaudio.addEventListener("loadeddata", function () {
                $scope.$apply(function () {
                   // $scope.hwstatus["zyinfo"].isplay = true;
                    //$scope.hwstatus["zyinfo"].isload = false;
                    $scope.vm.currentquesinfo.correct.played = true;
                })

                $rootScope.rootaudio.play();
            })
            $rootScope.rootaudio.addEventListener("ended", function () {
                $scope.$apply(function () {
                    //$scope.hwstatus["zyinfo"].isplay = false;
                    $scope.vm.currentquesinfo.correct.played = false;
                })

            }, false);





            //audio = document.getElementById($scope.vm.currentquesinfo.correct.autoid);
            //audio.src = $scope.vm.currentquesinfo.correct.accessory;

            //audio.play();

            //$scope.vm.currentquesinfo.correct.played = true;
            ////var t = $scope.vm.currentquesinfo.correct.voicetime;
            ////var timePromise = $interval(function () {
            ////    if (t > 0) {

            ////        //$scope.vm.smstime = t;
            ////        t--;
            ////        //console.log($scope.vm.smstime);
            ////    } else {
            ////        $interval.cancel(timePromise);
                    
            ////    }
            ////}, 1000, 100);

            //if ($scope.vm.timer) {
            //    $timeout.cancel($scope.vm.timer);
                
            //}
            //$scope.vm.timer = $timeout(function () {
            //    //alert($scope.vm.currentquesinfo.correct.voicetime)
            //    $scope.vm.currentquesinfo.correct.played = false;


            //}, $scope.vm.currentquesinfo.correct.voicetime*1000);


        }

        //播放小结语音评语
        function _playResultVoice() {
            if ($rootScope.rootaudio) {
                $rootScope.rootaudio.pause();
                $rootScope.rootaudio = null;
            }
            $rootScope.rootaudio = new Audio();
            $rootScope.rootaudio.src = $scope.vm.homeworkcorrectresult.voiceurl;
            //$scope.hwstatus["zyinfo"].isload = true;
            $rootScope.rootaudio.addEventListener("loadeddata", function () {
                $scope.$apply(function () {
                    // $scope.hwstatus["zyinfo"].isplay = true;
                    //$scope.hwstatus["zyinfo"].isload = false;
                    $scope.vm.homeworkcorrectresult.played = true;
                })

                $rootScope.rootaudio.play();
            })
            $rootScope.rootaudio.addEventListener("ended", function () {
                $scope.$apply(function () {
                    //$scope.hwstatus["zyinfo"].isplay = false;
                    $scope.vm.homeworkcorrectresult.played = false;
                })

            }, false);


            //audio = document.getElementById('audio' + $scope.vm.settinghomework.hwid);
            //audio.src = $scope.vm.submithomework.voiceurl;

            //audio.play();

            //$scope.vm.submithomework.played = true;
            ////var t = $scope.vm.currentquesinfo.correct.voicetime;
            ////var timePromise = $interval(function () {
            ////    if (t > 0) {

            ////        //$scope.vm.smstime = t;
            ////        t--;
            ////        //console.log($scope.vm.smstime);
            ////    } else {
            ////        $interval.cancel(timePromise);
                    
            ////    }
            ////}, 1000, 100);

            //if ($scope.vm.timer) {
            //    $timeout.cancel($scope.vm.timer);
                
            //}
            //$scope.vm.timer = $timeout(function () {
            //    //alert($scope.vm.currentquesinfo.correct.voicetime)
            //    $scope.vm.submithomework.played = false;


            //}, $scope.vm.submithomework.voicetime * 1000);


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
            //var nestedConfirmDialog = ngDialog.openConfirm({
            //    template:
            //        '<div style="padding:1em;">' +
            //            '<p style="pidding:">还有题未进行批改,是否放弃？</p>' +
            //            '<div class="ngdialog-buttons">' +
            //                '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消' +
            //                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="checkFinsh()">确定</button>' +
            //             '</div>' +
            //            '</div>',
            //    plain: true,
            //    width: 400,
            //    scope: $scope,
            //    className: 'ngdialog-theme-default'
            //});
            _postCorrectResult();
        }
        function _checkFinsh() {            
            
            _sendToStudent();
        }

        //发送给学生 完成批改
        function _sendToStudent() {

            //var commentlist = [];
            //angular.forEach($scope.vm.commentlist, function (o, i) {
            //    angular.forEach(comfuns.getSingleCommentChildrenList(), function (p, j) {
            //        if (o.cid == p.cid) {
            //            commentlist.push(p);
            //        }
            //    });
            //});
            
            var params = {
                Token: $scope.vm.token,
                SubLogID: $scope.vm.sublogid,
                //VoiceUrl: "",
                //VoiceTime: 0,
                //WeChatServerID: "",
                //ResultCustomComment:"",
                CommentList: $scope.vm.homeworkcorrectresult.commentlist


            };
            checkHomeWorkSrv.sendToStudent(params).then(function (result) {
                if (result.code === 0) {

                    //angular.forEach($scope.vm.questioncorrectlist, function (o, i) {
                    //    if (o.correct.pgstatus == 0) {
                    //        o.correct.answerstatus = 1;
                    //        o.correct.pgstatus = 1
                    //    }
                    //});
                    //$scope.vm.settinghomework.nocorrections = 0

                    //loadImage(drawImg);

                    _getHomeWorkResult();

                    ngDialog.closeAll();

                    //if (parseInt(result.data.isover) == 2) {
                    //    //_getHomeWorkResult();
                    //    $state.go('app.checkhomework.alreadyhw.result', { tchwlogid: $scope.vm.tchwlogid, sublogid: $scope.vm.sublogid, upid: $scope.vm.upid });
                    //    //$scope.vm.sublogItems.mysorce = getStudentscore();
                    //}
                    //toastr.success("批改成功", '');
                } 
            });

        }

        //提交作业批改结果 取代 sendToStudent
        function _postCorrectResult() {
            
            var correctquestionlist = [];
            angular.forEach($scope.vm.questioncorrectlist, function (o, i) {
                if (o.correct.iscorrect) {
                    var singlecommentlist = [];
                    angular.forEach(o.correct.singlecommentlist, function (c, j) {
                        var cobj = {
                            "CID": c.cid,
                            "CTitle": c.cidname
                        };
                        singlecommentlist.push(cobj);
                    });
                    var q = {
                        "AnswerStatus": o.correct.answerstatus,
                        "AutoID": o.correct.autoid,
                        "QID": o.question.qid,
                        "VoiceUrl": o.correct.accessory,
                        "VoiceTime": o.correct.voicetime,
                        "WeChatServerID": o.correct.wechatserverid,
                        "CommentList": singlecommentlist,
                        "QuestionCustomComment": "",
                        "Width": o.answer.width,
                        "Height": o.answer.height,
                        "Left": o.answer.left,
                        "Top": o.answer.top,
                        "PID": o.answer.pid
                    }
                    correctquestionlist.push(q);
                }
            });
            
            var params = {
                Token: $scope.vm.token,
                SubLogID: $scope.vm.sublogid,
                CorrectHW: {
                    "VoiceUrl": $scope.vm.homeworkcorrectresult.voiceurl,
                    "VoiceTime": $scope.vm.homeworkcorrectresult.voicetime,
                    "WeChatServerID": "",
                    "CommentList": $scope.vm.homeworkcorrectresult.commentlist,
                    "ResultCustomComment": "",
                    "CorrectScore": $scope.vm.homeworkcorrectresult.myscore,
                },
                CorrectQuestionList: correctquestionlist,//$scope.vm.homeworkcorrectresult.commentlist,

            };
            checkHomeWorkSrv.postCorrectResult(params).then(function (result) {
                if (result.code === 0) {
                    
                    _getHomeWorkResult();

                    ngDialog.closeAll();

                } 
            });

        }

        //申请重新批改
        function _applyCorrectDialog() {
            var nestedConfirmDialog = ngDialog.openConfirm({
                template:
                    '<div style="padding:1em;">' +
                        '<p style="pidding:">确定要重新批改吗？</p>' +
                        '<div class="ngdialog-buttons">' +
                            '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="applyCorrect()">确定</button>' +
                         '</div>' +
                        '</div>',
                plain: true,
                width: 400,
                scope: $scope,
                className: 'ngdialog-theme-default'
            });
        }
        function _applyCorrect() {

            var params = {
                Token: $scope.vm.token,
                SubLogID: $scope.vm.sublogid,

            };
            checkHomeWorkSrv.applyCorrect(params).then(function (result) {
                if (result.code === 0) {


                    $state.go('app.checkhomework.unalreadyhw.undetail', { tchwlogid: $scope.vm.tchwlogid, sublogid: $scope.vm.sublogid, upid: $scope.vm.upid });

                    ngDialog.closeAll();


                }
            });

        }




    }])
});