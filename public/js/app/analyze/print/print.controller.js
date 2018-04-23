define(['require', 'angular', 'components/com-funs', 'analyze/analyze.service', 'directives/com-directives'], function (require, ng, comfuns) {
	var module = ng.module('app.analyze');
	module.controller('PrintCtrl', ['$scope', '$state', 'analyzeSrv', '$sce', '$rootScope', 'toastr', function ($scope, $state, analyzeSrv, $sce, $rootScope, toastr) {
	    //$scope.title = '学情分析';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        //classid: $state.params.classid,
	        //charpterid: $state.params.charpterid,
	        pageindex: 1,
	        pagesize: 10,
	        tabindex: 0,
	        allchecked: false,
	        currentclassid: 0,
	        gradename: "",
	        classname: "",
	    }

	    $scope.toHtml = _toHtml;
	    $scope.selectHFWrong = _selectHFWrong;
	    $scope.openBox = _openBox;
	    $scope.openStudent = _openStudent;
	    //$scope.clearBox = _clearBox;
	    $scope.getChapters = _getChapters;
	    $scope.allChecked = _allChecked;
	    $scope.selectStudents = _selectStudents;
	    $scope.checkStudent = _checkStudent;
	    $scope.selectTab = _selectTab;
	    $scope.selectClass = _selectClass;
	    $scope.multiStudent = _multiStudent;
	    $scope.getClassChapterIdUserList = _getClassChapterIdUserList;
	    $scope.checkStudentWrong = _checkStudentWrong;
	    $scope.downloadStudentWrong = _downloadStudentWrong;
	    $scope.downloadClassWrong = _downloadClassWrong;
	    $scope.print = _print;
	    $scope.getClassWrongQuestionBook = _getClassWrongQuestionBook;

	    $scope.expandBook = _expandBook;
	    $scope.checkedBook = _checkedBook;
	    $scope.expandChapter = _expandChapterk;
	    $scope.checkedChapter = _checkedChapter;
	    $scope.checkedLearn = _checkedLearn;
	    $scope.selectWrongStudent = _selectWrongStudent;
	    $scope.getQuestionType = _getQuestionType;
	    $scope.getWrongQuesStatus = _getWrongQuesStatus;
	    $scope.playSingleVoice = _playSingleVoice;

	    initialize();
	    function initialize() {
	        _getTeacherClasslist();
	    }

	    //$scope.gxlistOptions = {
	    //    goNextpage: _goNextpageGX,
	    //    allpage: 0
	    //}

	    //$scope.gplistOptions = {
	    //    goNextpage: _goNextpageGP,
	    //    allpage: 0
	    //}

	    //function _goNextpageGX(pageindex) {
	    //    $scope.vm.pageindex = pageindex;
	    //    _getClassUserAllWrongList();
	    //    //alert(pageindex);
	    //}

	    //function _goNextpageGP(pageindex) {
	    //    $scope.vm.pageindex = pageindex;
	    //    _getHomeWorkClassAnalsysCharpterIdUsuallyWrongList();
	    //    //alert(pageindex);
	    //}

	    function _selectWrongStudent(student, studentlist) {
	        angular.forEach(studentlist, function (st, index) {
	            if (st.upid == student.upid) {
	                st.checked = true;
	            } else {
	                st.checked = false;
	            }
	            
	        })
	        //student.checked = !student.checked;
	    }


	    function _toHtml(html) {
	        return $sce.trustAsHtml(html);
	    }


	    function _selectClass(classinfo) {
	        //$scope.vm.pigailist = null;
	        $scope.vm.pageindex = 1;
	        //$scope.vm.allpage = 0;
	        $scope.vm.allchecked = false;
	        $scope.vm.boxstatus = false;
	        $scope.vm.currentclassid = classinfo.classid;
	        $scope.vm.gradename = classinfo.gradename;
	        $scope.vm.classname = classinfo.classname;
	        $scope.vm.wrongquestionlist = null;
	        
	        _getTeacherClasslist();

	        if ($scope.charpterwron && $scope.chapterwrong.wrongdata && $scope.chapterwrong.wrongdata.length > 0) {
	            $scope.chapterwrong.wrongdata = [];
	            $scope.chapterwrong = [];
	            $scope.gplistOptions.allpage = 0;
	        }
	        //$('title').html(classinfo.gradename + classinfo.classname);
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
	                    $scope.vm.selectedArray = [];
	                    $scope.stuchapterwrong = [];
	                    $scope.vm.currentstudent = [];
	                    $scope.vm.boxsttudent = false;
	                    $scope.vm.upidlist = [];

	                    _getClassWrongQuestionBook();

	                    //if ($scope.stuchapterwrong)
	                    //{
	                    //    $scope.stuchapterwrong.wrongdata = []
	                    //}
	                    //if ($scope.vm.selectedArray)
	                    //{
	                    //    $scope.vm.selectedArray = []
	                    //}
	                    //if ($scope.vm.chapterwrong)
	                    //{
	                    //    $scope.vm.chapterwrong = []
	                    //}

	                    //$('title').html($scope.vm.classlist[0].gradename + $scope.vm.classlist[0].classname);


	                } else {
	                    $scope.vm.classlist = [];
	                    $scope.vm.classInfoItems = [];
	                }
	            }
	        });


	    }


	    function _selectTab(tabIndex) {
	        $scope.vm.tabindex = tabIndex;
	        $scope.vm.boxstatus = false;
	        $scope.vm.allchecked = false;
	        $scope.vm.boxstatus = false;
	        $scope.vm.wrongquestionlist = [];
	        $scope.vm.upidlist = [];
	        //switch (tabIndex) {
	        //    case 0:
	        //        _getTeacherClassCharpterList();
	        //        break;
	        //    case 1:
	        //        _getTeacherClassCharpterList();
	        //        break;
	        //    default:
	        //        break;
	        //}
	        _getTeacherClasslist();
	    }
                	   

	    //班级错题教辅列表 
	    function _getClassWrongQuestionBook() {
	        var params = {
	            Token: $scope.vm.token,
	            ClassID: parseInt($scope.vm.currentclassid),
	            //UPIDs:[],

	        };
	        analyzeSrv.getClassWrongQuestionBook(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.classwrongquestionbook = result.data;

	                angular.forEach(result.data, function (o, i) {
	                    _getJCTXMuLu(o.hwbid, $scope.vm.currentclassid)
	                });

	            }
	        });
	    }
	    //错题教辅列表
	    function _getJCTXMuLu(hwbid, classid) {

	        var params = {
	            Token: $scope.vm.token,
	            HWBID: hwbid,
	            ClassID: classid,

	        };
	        analyzeSrv.getJCTXMuLu(params).then(function (result) {
	            if (result.code === 0) {

	                $scope.vm.chapterlist = result.data.chapterlist;

	                angular.forEach($scope.vm.classwrongquestionbook, function (c, l) {
						if(hwbid == c.hwbid){
							angular.forEach($scope.vm.chapterlist, function (o, i) {

								o.wronglhlist = [];
								angular.forEach(o.nodelist, function (n, j) {
									angular.forEach(n.wronglhlist, function (w, k) {
										o.wronglhlist.push(w)
									});
								});

							});
							c.chapterlist = $scope.vm.chapterlist;
						}
	                    
	                });


	            }
	        });
	    }

	    //获取班级学情分析章节对应高频错题的列表
	    //function _getHomeWorkClassAnalsysCharpterIdUsuallyWrongList() {
	       
	    //    var chapterArray = [];
	    //    angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	    //        angular.forEach(b.chapterlist, function (c, j) {
	    //            if (c.checked) {
	    //                chapterArray.push( c.chapterid );
	    //            }
	    //            //angular.forEach(w.wronglhlist, function (w, k) {
	    //            //    if (w.checked) {
	    //            //        booklist.push(w.lhname);
	    //            //    }
	    //            //});
	    //        });
	    //    });

	    //    if (!chapterArray) {
	    //        toastr.warning('请选择章节', '');
	    //        return false;
	    //    }

	    //    var params = {
	    //        Token: $scope.vm.token,
	    //        ClassID: $scope.vm.currentclassid,
	    //        ChapterList: chapterArray,
	    //        PageIndex: $scope.vm.pageindex,
	    //        PageSize: $scope.vm.pagesize

	    //    };
	    //    analyzeSrv.getHomeWorkClassAnalsysCharpterIdUsuallyWrongList(params).then(function (result) {
	    //        if (result.code === 0) {
	    //            $scope.chapterwrong = result.data;
	    //            $scope.chapterwrong.wrongdata = [];
	    //            $scope.vm.boxstatus = false;
	    //            $scope.gplistOptions.allpage = result.data.pagecount;

	    //            var chapters = [];
	    //            angular.forEach($scope.chapterwrong.questionlist, function (o, i) {
	    //                //var temp = { charpterid: o.charpterid, charptername: '' };
	    //                if (chapters.indexOf(o.chapterid) == -1) {
	    //                    chapters.push(o.chapterid);
	    //                }
	    //            });


	    //            angular.forEach(chapters, function (ch, index) {
	    //                var obj = {
	    //                    chapterid: ch,
	    //                    wronglist: []
	    //                }
	    //                angular.forEach(result.data.questionlist, function (cq, index) {
	    //                    if (obj.chapterid == cq.chapterid) {
	    //                        var wrong = {
	    //                            timuxushu: cq.timuxushu,
	    //                            wrongnum: cq.wrongnum,
	    //                            wrongrate: cq.wrongrate,
	    //                            xuanxiang: cq.xuanxiang
	    //                        }
	    //                        obj.chaptername = cq.chaptername;

	    //                        obj.wronglist.push(wrong);
	    //                    }
	    //                })
	    //                $scope.chapterwrong.wrongdata.push(obj)
	    //            });



	    //        }
	    //    });

	    //}

	    //选择高频错题
	    function _selectHFWrong() {
	        $scope.vm.wrongtype = 1;
	        _getWrongQuestionList();
	    }

	    function _toHtml(html) {
	        return $sce.trustAsHtml(html);
	    }


	    //打开弹出层列表
	    function _openBox($event) {debugger
	        if ($scope.vm.classwrongquestionbook.length == 0) {
	            toastr.warning('暂无错题章节','');
	            return false;
	        }

	        $scope.vm.boxstatus = !$scope.vm.boxstatus;
	        //$('.choose-class').fadeIn('fast');
	        $scope.vm.boxsttudent = false;
	        $event.stopPropagation();
	    }
	    function _openStudent($event) {
	        if ($scope.vm.upidlist && $scope.vm.upidlist.length > 0) {
	            $scope.vm.boxsttudent = !$scope.vm.boxsttudent;
	            $scope.vm.boxstatus = false;
	            //$('.choose-class').fadeIn('fast');

	            $event.stopPropagation();
	        }
	    }

	    //关闭弹出层列表
	    var tid;
	    function _clearBox() {
	        tid = setTimeout(function () {
	            $scope.vm.boxstatus = false;
	        }, 125);

	    }

	    $scope.vm.chapterArray = [];
	    function _getChapters(chapter, checked) {

	        if ($scope.vm.chapterArray.length > 0) {
	            if (checked) {
	                $scope.vm.chapterArray.push(chapter);


	            } else {
	                angular.forEach($scope.vm.chapterArray, function (obj, index) {
	                    if (chapter.charpterid === obj.charpterid) {
	                        $scope.vm.chapterArray.splice(index, 1);
	                        return;
	                    }
	                });

	            }

	        } else {

	            $scope.vm.chapterArray.push(chapter)
	        }
	        chapter.checked = checked;

	        //console.log($scope.vm.chapterArray.length)
	    }

	    //全选
	    function _allChecked() {

	        $scope.vm.allchecked = !$scope.vm.allchecked;
	        angular.forEach($scope.vm.chapterlist, function (obj, index) {

	            obj.checked = $scope.vm.allchecked;

	        });

	        if ($scope.vm.allchecked) {
	            $scope.vm.chapterArray = [];
	            angular.forEach($scope.vm.chapterlist, function (obj, index) {

	                $scope.vm.chapterArray.push(obj);

	            });
	        } else {
	            $scope.vm.chapterArray = [];
	        }

	    }


	    //获取班级个性化错题选择章节获取学生列表
	    function _getClassChapterIdUserList() {
	        var chapterArray = [];
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            angular.forEach(b.chapterlist, function (c, j) {
	                if (c.checked) {
	                    chapterArray.push({ ChapterID: c.chapterid } );
	                }
	                //angular.forEach(w.wronglhlist, function (w, k) {
	                //    if (w.checked) {
	                //        booklist.push(w.lhname);
	                //    }
	                //});
	            });
	        });



	        if (chapterArray.length > 0) {
	            //var arry = new Array();
	            //angular.forEach($scope.vm.chapterArray, function (obj, index) {
	            //    arry.push({ ChapterID: obj.chapterid });
	            //});
	            var params = {
	                Token: $scope.vm.token,
	                classid: $scope.vm.currentclassid,
	                ChapterList: chapterArray

	            };
	            analyzeSrv.getClassChapterIdUserList(params).then(function (result) {
	                if (result.code === 0) {
	                    $scope.vm.upidlist = result.data;
	                    $scope.vm.boxstatus = false;
	                }
	            });

	        } else {
	            toastr.warning('请选择课时', '');
	        }
	    }

	    //获取班级学生个性化错题列表
	    //function _getClassUserAllWrongList() {
	        
	    //    var chapterArray = [];
	    //    angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	    //        angular.forEach(b.chapterlist, function (c, j) {
	    //            if (c.checked) {
	    //                chapterArray.push(c.chapterid);
	    //            }
	    //            //angular.forEach(w.wronglhlist, function (w, k) {
	    //            //    if (w.checked) {
	    //            //        booklist.push(w.lhname);
	    //            //    }
	    //            //});
	    //        });
	    //    });

	    //    var students = new Array();
	    //    angular.forEach($scope.vm.currentstudent, function (obj, index) {
	    //        students.push(obj.upid);
	    //    });
	    //    var params = {
	    //        Token: $scope.vm.token,
	    //        ClassID: $scope.vm.currentclassid,
	    //        ChapterList: chapterArray,
	    //        upidlist: students,
	    //        PageIndex: $scope.vm.pageindex,
	    //        PageSize: $scope.vm.pagesize

	    //    };
	    //    analyzeSrv.getClassUserAllWrongList(params).then(function (result) {
	    //        if (result.code === 0) {
	    //            //$scope.vm.studentquestionlist = result.data.questionlist;
	    //            $scope.stuchapterwrong = result.data;
	    //            $scope.stuchapterwrong.wrongdata = [];
	    //            $scope.gxlistOptions.allpage = result.data.pagecount;

	    //            var chapters = [];
	    //            angular.forEach(result.data.questionlist, function (o, i) {
	    //                //var temp = { charpterid: o.charpterid, charptername: '' };
	    //                if (chapters.indexOf(o.chapterid) == -1) {
	    //                    chapters.push(o.chapterid);
	    //                }
	    //            });

	    //            //allpages = result.data[0].allpage;
	    //            angular.forEach(chapters, function (ch, index) {
	    //                var obj = {
	    //                    chapterid: ch,
	    //                    wronglist: []
	    //                }
	    //                angular.forEach(result.data.questionlist, function (cq, index) {
	    //                    if (obj.chapterid == cq.chapterid) {
	    //                        var wrong = {
	    //                            timuxushu: cq.timuxushu,
	    //                            xuanxiang: cq.xuanxiang
	    //                        }
	    //                        obj.chaptername = cq.chaptername;

	    //                        obj.wronglist.push(wrong);
	    //                    }
	    //                })
	    //                $scope.stuchapterwrong.wrongdata.push(obj)
	    //            });
	    //        }
	    //    });
	    //    //} else {
	    //    //    toastr.warning('请选择学生', '');
	    //    //}

	    //    //} else {
	    //    //    toastr.warning('请选择章节', '');
	    //    //}
	    //}

	    $scope.vm.studentArray = [];
	    //选择高频错题学生
	    function _checkStudent(user) {
	        if ($scope.vm.studentArray.length > 0) {
	            if (user.checked) {
	                angular.forEach($scope.vm.studentArray, function (obj, index) {
	                    if (user.upid === obj.upid) {
	                        $scope.vm.studentArray.splice(index, 1);
	                        return;
	                    }
	                });


	            } else {
	                $scope.vm.studentArray.push(user);

	            }

	        } else {

	            $scope.vm.studentArray.push(user)
	        }
	        user.checked = !user.checked;
	    }

	    $scope.vm.multiStudentArray = [];
	    //个性化错题选择学生列表中的学生
	    function _multiStudent(student) {
	        if ($scope.vm.multiStudentArray.length > 0) {
	            if (student.checked) {
	                angular.forEach($scope.vm.multiStudentArray, function (s, index) {
	                    if (s == student) {
	                        $scope.vm.multiStudentArray.splice(index, 1);
	                        return;
	                    }
	                });
	                student.checked = !student.checked;
	            }
	            else {
	                $scope.vm.multiStudentArray.push(student);
	                student.checked = true;
	            }
	        }
	        else {
	            $scope.vm.multiStudentArray.push(student);
	            student.checked = !student.checked;
	        }
	    }

	    //获取错题列表
	    function _getWrongQuestionList(upids) {

	        var chaters = [];
	        var learns = [];
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            angular.forEach(b.chapterlist, function (c, j) {
	                if (c.checked) {
	                    chaters.push(c.chapterid);
	                    angular.forEach(c.wronglhlist, function (w, k) {
	                        if (w.checked) {
	                            learns.push(w.lhid);
	                        }
	                    });

	                }
	            });
	        });

	        if (!learns||learns.length==0) {
	            toastr.warning('请选择章节', '');
	            return false;
	        }

	        var params = {
	            Token: $scope.vm.token,
	            ChapterID: chaters,
	            LHID: learns,
	            ClassID: $scope.vm.currentclassid,
	            Type: $scope.vm.wrongtype,

	        };
	        if (upids) {
	            params.UPIDs=upids;
	        }


	        analyzeSrv.getWrongQuestionList(params).then(function (result) {
	            if (result.code === 0) {
	                
	                $scope.vm.wrongquestionlist = result.data.lhlist;
	                if (result.data.lhlist.length > 0) {
	                    angular.forEach(result.data.lhlist, function (o,i) {
	                        angular.forEach(o.qitems, function (p, j) {
	                        	if (p.parenttitle) {
	                        		p.title = p.parenttitle + p.title;
	                        	}
	                            angular.forEach(p.studentlist, function (q, k) {
	                                if (k == 0) {
	                                    q.checked = true;
	                                }
	                                q.usabled = true;
	                            });
	                        });
	                    });
	                }
	                
	                $scope.vm.boxstatus = false;
	            }
	        });
	    }



	    $scope.vm.selectedArray = [];
	    //选取学生
	    function _selectStudents() {
	        var arry = new Array();
	        angular.forEach($scope.vm.multiStudentArray, function (o, i) {
	            if (o.checked) {
	                o.checked = false;
	                arry.push(o);
	            }
	        });
	        
	        $scope.vm.selectedArray = arry;
	        $scope.vm.boxsttudent = false;

	        //默认第一个学生
	        if (arry.length > 0) {
	            _checkStudentWrong(arry[0]);
	        }

	    }

	    $scope.vm.currentstudent = [];
	    //选择单个学生
	    function _checkStudentWrong(student) {
	        angular.forEach($scope.vm.selectedArray, function (vs, index) {
	            if (student.upid != vs.upid) {
	                vs.pchecked = false;
	            }
	            student.pchecked = true;
	        })
	        if (student.pchecked) {
	            $scope.vm.currentstudent = [];
	            $scope.vm.currentstudent.push(student.upid);
	            //_getClassUserAllWrongList();
	            $scope.vm.wrongtype = 2;
	            _getWrongQuestionList($scope.vm.currentstudent);
	        } else {
	            $scope.stuchapterwrong.wrongdata = [];
	        }
	        //student.pchecked = !student.pchecked;
	    }

        //下载个性化错题
	    function _downloadStudentWrong() {
	        var chaters = [];
	        var learns = [];

	        var book = [];
	        var subj = [];
	        var bb = [];
	        var grade = [];
	        var phase = [];

	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            book.push(b.bookname);
	            subj.push(b.kmname);
	            bb.push(b.bbname);
	            grade.push(b.njname);
	            phase.push(b.njjdname);

	            angular.forEach(b.chapterlist, function (c, j) {
	                if (c.checked) {
	                    chaters.push(c.chapterid);
	                    angular.forEach(c.wronglhlist, function (w, k) {
	                        if (w.checked) {
	                            learns.push(w.lhid);
	                        }
	                    });

	                }
	            });
	        });

	        if (chaters.length > 0&&learns.length > 0) {
	            if ($scope.vm.currentstudent.length > 0) {
	                
	                var students = new Array();
	                angular.forEach($scope.vm.currentstudent, function (obj, index) {
	                    students.push(obj.upid);
	                });
	                window.open(globalConfig.downloadPath + "?token=" + $scope.vm.token 
                        + "&classid=" + $scope.vm.currentclassid
                        + "&chapteridlist=" + chaters
                        + "&lhidlist=" + learns
                        + "&upidlist=" + students

                        + "&book=" + book.join(',')
                        + "&subj=" + subj.join(',')
                        + "&bb=" + bb.join(',')
                        + "&grade=" + grade.join(',')
                        + "&phase=" + phase.join(',')

                        );
	            }
	            else {
	                toastr.warning('请选择学生', '');
	            }

	        } else {
	            toastr.warning('请选择章节', '');
	        }
	    }

	    //下载高频错题
	    function _downloadClassWrong() {
	        var chaters = [];
	        var learns = [];

	        var book = [];
	        var subj = [];
	        var bb = [];
	        var grade = [];
	        var phase = [];

	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            book.push(b.bookname);
	            subj.push(b.kmname);
	            bb.push(b.bbname);
	            grade.push(b.njname);
	            phase.push(b.njjdname);

	            angular.forEach(b.chapterlist, function (c, j) {
	                if (c.checked) {
	                    chaters.push(c.chapterid);
	                    angular.forEach(c.wronglhlist, function (w, k) {
	                        if (w.checked) {
	                            learns.push(w.lhid);
	                        }
	                    });

	                }
	            });
	        });
	        if (chaters.length > 0 && learns.length > 0) {
	            if ($scope.vm.wrongquestionlist.length > 0) {
	                window.open(globalConfig.downloadPath + "?token=" + $scope.vm.token 
                        + "&classid=" + $scope.vm.currentclassid
                        + "&chapteridlist=" + chaters
                        + "&lhidlist=" + learns

                        + "&book=" + book.join(',')
                        + "&subj=" + subj.join(',')
                        + "&bb=" + bb.join(',')
                        + "&grade=" + grade.join(',')
                        + "&phase=" + phase.join(',')


                        );

	            } else {
	                toastr.warning('该学生还没有错题', '');
	            }
	            
	            
	        } else {
	            toastr.warning('请选择章节', '');
	        }
	    }

	    function _playSingleVoice(student) {
	        angular.forEach($scope.vm.wrongquestionlist, function (o, i) {
	            angular.forEach(o.qitems, function (p, j) {
	                angular.forEach(p.studentlist, function (p, k) {
	                    p.played = false;
	                });
	            });
	        });

	        if ($rootScope.rootaudio) {
	            $rootScope.rootaudio.pause();
	            $rootScope.rootaudio = null;
	        }
	        $rootScope.rootaudio = new Audio();
	        $rootScope.rootaudio.src = student.recordingcomment;
	        $rootScope.rootaudio.addEventListener("loadeddata", function () {
	            $scope.$apply(function () {
	                student.played = true;
	            })

	            $rootScope.rootaudio.play();
	        })
	        $rootScope.rootaudio.addEventListener("ended", function () {
	            $scope.$apply(function () {
	                student.played = false;
	            })

	        }, false);
	    }

	    function _print(id) {

	        //switch (id) {
	        //    case 'gxprint':
	        //        if ($scope.stuchapterwrong.wrongdata && $scope.stuchapterwrong.wrongdata.length > 0) { } else { return false; }
	        //        break;
	        //    case 'gpprint':
	        //        if ($scope.chapterwrong.wrongdata && $scope.chapterwrong.wrongdata.length > 0) { } else { return false; }
	        //        break;
	        //    default:
	        //        break;
	        //}

	        if ($scope.vm.wrongquestionlist&&$scope.vm.wrongquestionlist.length > 0) {

	            $('#' + id).jqprint();
	        } else {
	            toastr.warning('请选择章节', '');
	        }
	    }

	    //
	    function _getQuestionType(type) {
	        //1、单选题 2、多选题 3、填空题 4、解答题 5、综合题 6、判断题
	        var name = '';
	        switch (type) {
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

	    function _getWrongQuesStatus(n) {//1、未提醒 2、提醒重做 3、已处理 4、判对 5、判错
	        var name = '';
	        switch (n) {
	            case 1:
	                name = '未提醒';
	                break;
	            case 2:
	                name = '提醒重做';
	                break;
	            case 3:
	                name = '已处理';
	                break;
	            case 4:
	                name = '判对';
	                break;
	            case 5:
	                name = '判错';
	                break;
	            default:
	                break;
	        }
	        return name;
	    }


        //选中1
	    function _checkedBook(book) {
	        var flag = !book.checked;
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            
	            if (b.hwbid == book.hwbid) {
					b.checked = flag;
	                angular.forEach(b.chapterlist, function (c, j) {
	                    c.checked = flag;

	                    angular.forEach(c.wronglhlist, function (w, j) {
	                        w.checked = flag;
	                    });
	                });
	            }
	        });

	        //var count = 0;
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
				b.count = 0;
	            angular.forEach(b.chapterlist, function (c, j) {
	                
	                    if (c.checked) {
	                        b.count += 1;
	                    }
	                
	            });
	        });
			 angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
				if(b.count>0){
					if (b.hwbid == book.hwbid) {
						b.checked = true;
					}
				}else{
					if (b.hwbid == book.hwbid) {
						b.checked = false;
					}
				}
				

			});
	        // if (count > 0) {
	        //     angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	        //         if (b.bbid == book.bbid) {
	        //             b.checked = true;
	        //         }

	        //     });
	        // } else {
	        //     angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	        //         if (b.bbid == book.bbid) {
	        //             b.checked = false;
	        //         }

	        //     });
	        // }

	    }
        //选中2
	    function _checkedChapter(book, chapter) {
	        chapter.checked = !chapter.checked;
	        var flag = chapter.checked;
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            angular.forEach(b.chapterlist, function (c, j) {
	                if (c.chapterid == chapter.chapterid) {
	                    c.checked = flag;
	                    angular.forEach(c.wronglhlist, function (w, j) {
	                        w.checked = flag;
	                    });
	                }
	            });
	        });

	        var count = 0;
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            angular.forEach(b.chapterlist, function (c, j) {
	                
	                    if (c.checked) {
	                        count += 1;
	                    }
	               
	            });
	        });

	        if (count > 0) {
	            angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	                if (b.bbid == book.bbid) {
	                    b.checked = true;
	                    
	                }

	            });
	        } else {
	            angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	                if (b.bbid == book.bbid) {
	                    b.checked = false;
	                    
	                }

	            });
	        }



	    }
        //选中3
	    function _checkedLearn(book,chatper,learn) {
	        var flag = !learn.checked;
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            angular.forEach(b.chapterlist, function (c, j) {
	                angular.forEach(c.wronglhlist, function (w, j) {
	                    if (w.lhid == learn.lhid) {
	                        w.checked = flag;
	                    }
	                });
	            });
	        });

	        var count = 0;
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            angular.forEach(b.chapterlist, function (c, j) {
	                angular.forEach(c.wronglhlist, function (w, j) {
	                    if (w.checked) {
	                        count += 1;
	                    }
	                });
	            });
	        });

	        if (count > 0) {
	            angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	                if (b.bbid == book.bbid) {
	                    b.checked = true;
	                    angular.forEach(b.chapterlist, function (c, j) {
	                        if (c.chapterid == chatper.chapterid) {
	                            c.checked = true;
	                        }
	                    });
	                }
	                
	            });
	        } else {
	            angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	                if (b.bbid == book.bbid) {
	                    b.checked = false;
	                    angular.forEach(b.chapterlist, function (c, j) {
	                        if (c.chapterid == chatper.chapterid) {
	                            c.checked = false;
	                        }
	                    });
	                }

	            });
	        }

	    }

	    //展开1
	    function _expandBook(book) {
	        var flag = !book.expanded;
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {
	            if (b.hwbid == book.hwbid) {
	                b.expanded = flag;
	                angular.forEach(b.chapterlist, function (c, j) {
	                    c.expanded = flag;
	                    angular.forEach(c.wronglhlist, function (w, k) {
	                        w.expanded = flag;
	                    });
	                });
	            }
	        });
	    }

	    //展开2
	    function _expandChapterk(chapter) {
	        var flag = !chapter.expanded;
	        angular.forEach($scope.vm.classwrongquestionbook, function (b, i) {

	            angular.forEach(b.chapterlist, function (c, j) {
	                if (c.chapterid == chapter.chapterid) {
	                    c.expanded = flag;
	                    angular.forEach(c.wronglhlist, function (w, k) {
	                        w.expanded = flag;
	                    });
	                }
	            });

	        });
	    }


	}]);
});