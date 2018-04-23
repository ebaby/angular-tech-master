define(['require', 'angular', 'components/com-funs', 'classmanage/classmanage.service', 'directives/com-directives'], function (require, ng, comfuns) {
	var module = ng.module('app.classmanage');
	module.controller('ManageCtrl', ['$scope', '$state', '$timeout', '$templateRequest', '$templateCache', 'classmanageSrv', 'ngDialog', 'toastr', 'toastrConfig', '$sce', '$rootScope', function ($scope, $state, $timeout, $templateRequest, $templateCache, classmanageSrv, ngDialog, toastr, toastrConfig, $sce, $rootScope) {
				
	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        tabindex: 0,
	        currentclassid: 0,
	        picindex: 0,
	        booknum: 0,
	        classlist: [],

	        msgstatus: 0,
	        errormsg: '',
	        succmsg: '',
	        pageindex: 1,
	        pagesize: 10,

	        promote: true,
	        tips:false,

	    }
	    $scope.piclist = [
            'http://img1.yqj.cn/w/images/jsd/zy/bjtb1.jpg',
            'http://img1.yqj.cn/w/images/jsd/zy/bjtb2.jpg',
            'http://img1.yqj.cn/w/images/jsd/zy/bjtb3.jpg',
            'http://img1.yqj.cn/w/images/jsd/zy/bjtb4.jpg',
            'http://img1.yqj.cn/w/images/jsd/zy/bjtb5.jpg'
	    ];

	    $scope.numReg = /^[0-9]+$/;

	    $scope.vm.tempArray = [];
    
	    $scope.selectTab = _selectTab;
	    $scope.selectPic = _selectPic;
	    $scope.selectClass = _selectClass;
	    $scope.updateClass = _updateClass;
	    $scope.deleteDialog = _deleteDialog;
	    $scope.deleteClass = _deleteClass;
	    $scope.unlockDialog = _unlockDialog;
	    $scope.unlockTheclass = _unlockTheclass;
	    $scope.bookDialog = _bookDialog;
	    //$scope.unlockTheclass = _unlockTheclass;
	    $scope.searchClassBook = _searchClassBook;
	    $scope.getVersionList = _getVersionList;
	    $scope.addBookDialog = _addBookDialog;
	    $scope.teacherAttenDialog = _teacherAttenDialog;
	    $scope.teacherAttenStudent = _teacherAttenStudent;
	    $scope.deleteClassStudentDialog = _deleteClassStudentDialog;
	    $scope.deleteClassStudent = _deleteClassStudent;
	    $scope.selectClassBook = _selectClassBook;
	    $scope.selectSearchBook = _selectSearchBook;
	    $scope.deleteClassBookDialog = _deleteClassBookDialog;
	    $scope.deleteClassBook = _deleteClassBook;
	    $scope.cancleDeleteBook = _cancleDeleteBook;
	    $scope.goToPerson = _goToPerson;
	    $scope.goToClass = _goToClass;
	    $scope.getJCBbDialog = _getJCBbDialog;
	    $scope.selectBookInfo = _selectBookInfo;
	    $scope.keyDown = _keyDown;
	    $scope.goToJoinStudent = _goToJoinStudent;
	    $scope.upgradeGradeDialog = _upgradeGradeDialog;
	    $scope.upgradeGrade = _upgradeGrade;
	    $scope.goToClosedClass = _goToClosedClass;
	    $scope.closeClassDialog = _closeClassDialog;
	    $scope.closeClass = _closeClass;
	    $scope.goToHowJoinStu = _goToHowJoinStu;

	    function _selectTab(tabIndex) {
	        $scope.vm.tabindex = tabIndex;
	        switch (tabIndex) {
	            case 0:
	                _getTeacherClassStudentList();
	                break;
	            case 1:
	                _getClassInfo();
	                break;
	            case 2:
	                _getClassBooks();
	                break;
	            default:
	                break;
	        }
	    }

	    function _selectPic(picindex) {
	        $scope.vm.picindex = picindex;
	    }
	    
	    //function _setClass() {

	    //}

		//$scope.classlist = {

		//}
		
	    var rootHandle = $rootScope.$watchCollection('tips', function (newvalue, oldvalue) {
	        if (newvalue) {

	            $scope.vm.tips = $rootScope.tips;

	            rootHandle();
	        }

	    })

		initialize();
		function initialize(){
		    
		    //_selectPic($scope.vm.picindex);
		    _getTeacherClasslist();
		}

        //获取班级列表
		function _getTeacherClasslist() {
		    var params = {
		        Token: $scope.vm.token,
		        Type: 1,//-1：全部，0：不显示，1：显示
		    }
		    classmanageSrv.getTeacherClasslist(params).then(function (result) {
		        if (result.code === 0) {
		            if (result.data.length > 0) {		                

		                //if ($scope.vm.allpage == 0) {
		                //    $scope.vm.allpage = result.data[0].allpage;
		                //}
		                //if (!$scope.vm.pigailist) {
		                //    $scope.vm.pigailist = [];
		                //}
		                //angular.forEach(result.data[0].pigailist, function (dp, index) {
		                //    $scope.vm.pigailist.push(dp);
		                //})
		                //if (!$scope.vm.classlist || $scope.vm.classlist.length==0) {
		                //    $scope.vm.classlist = result.data;
		                //}

		                //var arry = [];
		                //angular.forEach(result.data, function (o, i) {
		                //    if (o.isshow) {
		                //        arry.push(o);
		                //    }
		                //});
		                $scope.vm.classlist = result.data;

		                if ($scope.vm.currentclassid == 0) {
		                    $scope.vm.currentclassid = $scope.vm.classlist[0].classid;
		                    $scope.vm.currentclassinfo = $scope.vm.classlist[0];

		                } else {
		                    angular.forEach($scope.vm.classlist, function (o, i) {
		                        if ($scope.vm.currentclassid == o.classid) {
		                            $scope.vm.currentclassinfo = o;
		                        }
		                    });

		                }
		                $scope.vm.studentItems = $scope.vm.currentclassinfo.student;
		                _getClassBooks();

		                _selectTab($scope.vm.tabindex);

		                //_classTipsDialog();

		                //var date = new Date();
		                //var currentYear = date.getFullYear();
		                //if (date.getTime() >= new Date(currentYear + '/8/25 00:00:00').getTime() && date.getTime() <= new Date(currentYear + '/9/25 23:59:59').getTime()) {
		                //    $scope.vm.tips = true;
		                //}

		            } else {
		                $scope.vm.currentclassinfo = [];
		                $scope.vm.classlist = [];
		            }
		        }
		    });


		}

        //选择班级
		function _selectClass(classinfo) {
		    $scope.vm.currentclassid = classinfo.classid;
		    //_getTeacherClasslist();
		    $scope.vm.currentclassinfo = classinfo;
		    $scope.vm.studentItems = classinfo.student;

		    switch ($scope.vm.tabindex) {
		        case 0:
		            _getTeacherClassStudentList();
		            break;
		        case 1:
		            _getClassInfo();
		            break;
		        case 2:
		            //_getClassBooks();
		            break;
		        default:
		            break;
		    }
		    _getClassBooks();
		    //_selectTab($scope.vm.tabindex);
		}

        //获取班级信息
		function _getClassInfo() {
		    var params = {
		        Token: $scope.vm.token,
		        ClassID: $scope.vm.currentclassid
		    }
		    classmanageSrv.getClassInfo(params).then(function (result) {
		        if (result.code === 0) {

		            $scope.vm.classinfo = result.data;

		            //var gradeid = result.Data.GradeID;
		            //var subjectid = 2;
		            //_getVersionList(gradeid, subjectid);
		            ////angular.forEach($scope.piclist, function (url, index) {
		            ////    if (url === $scope.vm.classInfoItems.headpic) {
		            ////        $scope.vm.picindex = index;
		            ////    }
		            ////});
		            //获取年级
		            _getGrades();

		            //
		            _getSubjects();

		            angular.forEach($scope.piclist, function (o,i) {
		                if (o === $scope.vm.currentclassinfo.classpic) {
		                    $scope.vm.picindex = i;
		                }
		            });


		        }
		    });
		}

	    //获取学科
		function _getSubjects() {
		    var params = {
		        Token: $scope.vm.token,

		    }
		    classmanageSrv.getSubjects(params).then(function (result) {
		        if (result.code === 0) {

		            $scope.vm.subjectItem = result.data;
		            angular.forEach(result.data, function (o, i) {
		                if (o.subjectname === '数学') {
		                    $scope.vm.subjectinfo = o;
		                }
		            });

		            _getVersionList($scope.vm.currentclassinfo.gradeid, $scope.vm.subjectinfo.subjectid);


		        } 
		    });
		}

	    //获取教材版本
		function _getVersionList(gradeid, subjectid) {

		    var params = {
		        Token: $scope.vm.token,
		        GradeID: gradeid,
		        SubjectID: subjectid

		    }
		    classmanageSrv.getVersionList(params).then(function (result) {
		        if (result.code === 0) {

		            $scope.vm.versionlist = result.data;

		            //init bookinfo
		            angular.forEach($scope.vm.versionlist, function (o, i) {
		                if (o.versionid == $scope.vm.currentclassinfo.versionid) {
		                    $scope.vm.versioninfo = o;

		                }
		            });


		        }
		    });
		}

        //修改班级
		function _updateClass(isValid) {
		    //if ($scope.vm.gradeinfo == '' || $scope.vm.gradeinfo == undefined) {
		    //    $scope.vm.msgstatus = 1;
		    //    $scope.vm.errormsg = '请选择年级';
		    //    return false;
		    //} else if ($scope.vm.currentClassInfo.classname == '' || $scope.vm.currentClassInfo == undefined) {
		    //    $scope.vm.msgstatus = 1;
		    //    $scope.vm.errormsg = '请输入班级名称';
		    //    return false;
		    //} else if ($scope.vm.currentClassInfo.maxusercount == '' || $scope.vm.currentClassInfo == undefined) {
		    //    $scope.vm.msgstatus = 1;
		    //    $scope.vm.errormsg = '请输入班级人数';
		    //    return false;
		    //} else if ($scope.vm.bookinfo == undefined) {
		    //    $scope.vm.msgstatus = 1;
		    //    $scope.vm.errormsg = '请选择教材版本';
		    //    return false;
		    //}
		    //else {

		    if (isValid) {
		        $scope.vm.submitted = true;
		        var params = {
		            Token: $scope.vm.token,
		            ClassID: $scope.vm.currentclassid,
		            ClassName: $scope.vm.classinfo.classname,
		            GradeID: $scope.vm.gradeinfo.gradeid,
		            GradeName: $scope.vm.gradeinfo.gradename,
		            Des: $scope.vm.classinfo.des,
		            VersionID: $scope.vm.versioninfo.versionid,
		            VersionName: $scope.vm.versioninfo.versionname,
		            MaxUserCount: $scope.vm.classinfo.maxusercount,
		            ClassPic: $scope.piclist[$scope.vm.picindex],
		            AllowStudentAdd: 1,//1、允许加入 2、不允许加入


		        }
		        classmanageSrv.updateClass(params).then(function (result) {
		            if (result.code === 0) {
						$scope.vm.currentclassinfo.classpic = $scope.piclist[$scope.vm.picindex];
		                //$scope.vm.currentclassinfo = $scope.vm.classinfo;
		                //angular.forEach($scope.vm.classlist, function (o,i) {
		                //    if (o.classid === $scope.vm.currentclassinfo.classid) {
		                //        o = $scope.vm.classinfo;
		                //    }
		                //});

		                toastr.success('修改成功', '');


		                //$scope.vm.msgstatus = 2;
		                //$scope.vm.succmsg = '修改成功';
		                //_getTeacherClasslist();

		                angular.forEach($scope.vm.classlist, function (o, index) {
		                    if (o.classid == $scope.vm.currentclassid) {
		                        o.classname = $scope.vm.classinfo.classname;
		                        //$scope.vm.classlist[index].gradename = $scope.vm.gradeinfo.gradename;
		                        return false;
		                    }
		                });
		                //$scope.vm.promote = !$scope.vm.promote;

		            } 
		        });
		    }
		    //}

		}

        //删除班级
		function _deleteDialog() {
		    var classname = $scope.vm.currentclassinfo.classname;
		    var nestedConfirmDialog = ngDialog.openConfirm({
		        template:
                        '<div style="padding:1em;">' +
                        '<p>是否要删除<span style="color:#3598dc;font-size:18px;">' + $scope.vm.currentclassinfo.gradename + $scope.vm.currentclassinfo.classname + '</span></p>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消</button>' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="deleteClass()">确定</button>' +
                        '</div>'+
                        '</div>',
		        plain: true,
		        width: 400,
		        scope: $scope,
		        className: 'ngdialog-theme-default',
		    });
		}
		function _deleteClass() {
		    var params = {
		        Token: $scope.vm.token,
		        ClassID: $scope.vm.currentclassid,

		    }
		    classmanageSrv.deleteClass(params).then(function (result) {
		        if (result.code === 0) {
		            $scope.vm.classlist = [];
                    //重新读取班级列表和学生列表
		            $scope.vm.currentclassid = 0;
		            _getTeacherClasslist();
		            _selectTab($scope.vm.tabindex);
		            toastr.success('删除成功', '');

		            ngDialog.closeAll();
		        } 
		    });
		}
	    //获取班级教辅 
		function _getClassBooks() {
		    var params = {
		        Token: $scope.vm.token,
		        classid: $scope.vm.currentclassid,
		    }
		    classmanageSrv.getClassBooks(params).then(function (result) {
		        if (result.code === 0) {
		            $scope.vm.bookItems = result.data;

		            $scope.vm.booknum = result.data.length;
		        }
		        
		    });
		}

	    //锁定/解锁班级
		function _unlockDialog() {
		    var msg;
		    if ($scope.vm.currentclassinfo.allowstudentadd == 1) {
		        msg = '是否锁定班级，锁定之后学生不允许加入';
		    } else {
		        msg = '是否解锁班级，解锁之后可以继续加入学生';
		    }
		    var nestedConfirmDialog = ngDialog.openConfirm({
		        template:
                        '<div style="padding:1em;">' +
                        '<p>' + msg + '</p>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消</button>' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="unlockTheclass()">确定</button>' +
                        '</div>'+
                        '</div>',
		        plain: true,
		        width: 400,
		        scope: $scope,
		        className: 'ngdialog-theme-default',
		    });
		}
		function _unlockTheclass() {
		    var params = {
		        Token: $scope.vm.token,
		        classid: $scope.vm.currentclassid,
		        type: $scope.vm.currentclassinfo.allowstudentadd == 1 ? 2 : 1
		    }
		    classmanageSrv.unlockTheclass(params).then(function (result) {
		        if (result.code === 0) {
		            //$scope.vm.currentclassid = 0;
		            _getTeacherClasslist();

		            //$scope.vm.currentclassinfo.allowstudentadd == 2 ? 1 : 2
		            toastr.success('修改成功', '');

		            ngDialog.closeAll();

		        } 
		    });
		}

		function _bookDialog() {
		    
		    ngDialog.open({
		        template: window.globalConfig.appPath + 'classmanage/manage/bookdialog.html',
		        className: 'ngdialog-theme-default',
		        width: 800,
                height:400,
                //showClose: false,
		        scope: $scope
		    });

		    //
		    //$scope.vm.xkid = '2';
		    _getSubjects();
		    _getGrades();
		    _getAllBooks(0,0,0);

		}

	    //获取教师所教班级学生列表
		function _getTeacherClassStudentList() {
		    var params = {
		        Token: $scope.vm.token,
		        classid: $scope.vm.currentclassid,
		    }
		    classmanageSrv.getTeacherClassStudentlist(params).then(function (result) {
		        if (result.code === 0) {
		            $scope.vm.studentItems = result.data;
		        }
		    });

		}

        //获取年级
		function _getGrades() {
		    var params = {
		        Token: $scope.vm.token,

		    }
		    classmanageSrv.getGrades(params).then(function (result) {
		        if (result.code === 0) {
		            $scope.vm.gradeItem = result.data;

		            if ($scope.vm.tabindex == 1) {
		                angular.forEach($scope.vm.gradeItem, function (obj, index) {
		                    if (obj.gradeid === $scope.vm.currentclassinfo.gradeid) {
		                        $scope.vm.gradeinfo = obj;
		                    }
		                });
		            }
		        }
		            
		    });
		}

		function _searchClassBook() {
		    //if ($scope.vm.gradeinfo!= null && $scope.vm.bookinfo != null) {
		        
		    _getAllBooks($scope.vm.gradeinfo==undefined?0:$scope.vm.gradeinfo.gradeid
                , $scope.vm.bookinfo == undefined ? 0 : $scope.vm.bookinfo.versionid
                , $scope.vm.subjectinfo.subjectid);
		    //}
		}
		function _getAllBooks(gradeid, bbid, xkid) {

		    var params = {
		        Token: $scope.vm.token,
		        GradeID: gradeid,//$scope.vm.gradeinfo.gradeid,
		        VersionID: bbid,//$scope.vm.bookinfo.bbid,
		        SubjectID: xkid//$scope.vm.xkid

		    }
		    classmanageSrv.getAllBooks(params).then(function (result) {
		        if (result.code === 0) {
		           
		            $scope.vm.searchBookItem = result.data;
		            
		        } 
		    });

		}


		function _getJCBbDialog() {
		    if ($scope.vm.gradeinfo && $scope.vm.subjectinfo) {
		        var params = {
		            Token: $scope.vm.token,
		            GradeID: $scope.vm.gradeinfo.gradeid,
		            SubJectID: $scope.vm.subjectinfo.subjectid

		        }
		        classmanageSrv.getVersionList(params).then(function (result) {
		            if (result.code === 0) {

		                $scope.vm.bookItem = result.data;


		            }
		        });
		    } else {
		        $scope.vm.bookItem = [];
		    }
		    _getAllBooks($scope.vm.gradeinfo == undefined ? 0 : $scope.vm.gradeinfo.gradeid
               , $scope.vm.bookinfo == undefined ? 0 : $scope.vm.bookinfo.versionid
               , $scope.vm.subjectinfo == undefined ? 0 : $scope.vm.subjectinfo.subjectid);

		    if (!$scope.vm.bookinfo) { $scope.vm.searchBookItem = []; }
		}

	    //加入班级教辅 addClassBook
		function _addBookDialog() {
		    if ($scope.vm.tempArray.length > 0) {

		        var hwbidlist = new Array();
		        angular.forEach($scope.vm.tempArray, function (book, index) {
		            hwbidlist.push(parseInt(book.hwbid));
		        });

		        var params = {
		            Token: $scope.vm.token,
		            ClassID: $scope.vm.currentclassid,
		            HWBIDList: hwbidlist

		        }
		        classmanageSrv.addClassBook(params).then(function (result) {
		            if (result.code === 0) {

		                angular.forEach($scope.vm.tempArray, function (book, index) {
		                    $scope.vm.bookItems.push(book);
		                });
		                _getClassBooks();
		                $scope.vm.tempArray = [];
		                $scope.vm.searchBookItem = [];

		                toastr.success('添加成功', '');
		                ngDialog.closeAll();

		            }

		        });



		        
		        
		    } else {
		        var nestedConfirmDialog = ngDialog.openConfirm({
		            template:
                            '<div style="padding:1em;">' +
                            '<p>请选择一本教辅。</p>' +
                            '<div class="ngdialog-buttons">' +
                                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">确定</button>' +
                            '</div>' +
                            '</div>',
		            plain: true,
		            width: 400,
		            scope: $scope,
		            className: 'ngdialog-theme-default',
		        });
		    }
		}

		function _teacherAttenDialog(student) {
		    $scope.vm.currrentstudent = student;
		    var msg;
		    if (student.attention == 0) {
		        msg = '是否关注学生';
		    } else {
		        msg = '是否取消关注学生';
		    }
		    var nestedConfirmDialog = ngDialog.openConfirm({
		        template:
                        '<div style="padding:1em;">'+
                        '<p>' + msg + '</p>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消</button>' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="teacherAttenStudent()">确定</button>' +
                        '</div>'+
                        '</div>',
		        plain: true,
		        width: 400,
		        scope: $scope,
		        className: 'ngdialog-theme-default',
		    });
		}
        //关注/取消关注学生
		function _teacherAttenStudent() {
		    var params = {
		        Token: $scope.vm.token,
		        UPID: $scope.vm.currrentstudent.upid,
		        Attention: $scope.vm.currrentstudent.attention == 0 ? 1 : 0

		    }
		    classmanageSrv.teacherAttenStudent(params).then(function (result) {
		        if (result.code === 0) {

		            angular.forEach($scope.vm.studentItems, function (s,index) {
		                if (s.upid == $scope.vm.currrentstudent.upid) {
		                    s.attention = $scope.vm.currrentstudent.attention == 0 ? 1 : 0;
		                    return false;
		                }
		            });

		            toastr.success('修改成功', '');

		            ngDialog.closeAll();

		        } 
		    });
		}
        
	    //移除学生
		function _deleteClassStudentDialog(student) {
		    $scope.vm.currrentstudent = student;
		    var nestedConfirmDialog = ngDialog.openConfirm({
		        template:
                        '<div style="padding:1em;">' +
                        '<p>是否移除该班级的学生？</p>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消</button>' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="deleteClassStudent()">确定</button>' +
                        '</div>' +
                        '</div>',
		        plain: true,
		        width: 400,
		        scope: $scope,
		        className: 'ngdialog-theme-default',
		    });
		}
		function _deleteClassStudent() {
		    var params = {
		        Token: $scope.vm.token,
		        upid: $scope.vm.currrentstudent.upid,
		        classid: $scope.vm.currentclassid

		    }
		    classmanageSrv.deleteClassStudent(params).then(function (result) {
		        if (result.code === 0) {

		            angular.forEach($scope.vm.studentItems, function (obj, index) {
		                if ($scope.vm.currrentstudent.upid == obj.upid) {
		                    $scope.vm.studentItems.splice(index, 1);
		                    return;
		                }
		            });

		            toastr.success('移除成功', '');
		            //$scope.vm.currrentstudent.disable = !$scope.vm.currrentstudent.disable;
		            //$scope.vm.classInfoItems.joinusercount--;
		            ngDialog.closeAll();

		        } 
		    });
		}

	    //选择班级教辅
		function _selectClassBook(book, $event) {

		    $event.stopPropagation();
		    book.checked = !book.checked;
		}

		function _deleteClassBookDialog(book, $event) {
		    $event.stopPropagation();
		    $scope.vm.currrentbook = book;
		    var msg = '是否移除' + book.gradename + book.subjectname + book.jxjdhfname + book.versionname;
		    var nestedConfirmDialog = ngDialog.openConfirm({
		        template:
                        '<div style="padding:1em;">' +
                        '<p>' + msg + '</p>' +
                        '<div class="ngdialog-buttons">' +
		                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="cancleDeleteBook()">取消</button>' +
                            '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="deleteClassBook()">确定</button>' +
                        '</div>' +
                        '</div>',
		        plain: true,
		        width: 400,
		        scope: $scope,
		        className: 'ngdialog-theme-default',
		    });
		   
		}
	    //取消移除班级教辅
		function _cancleDeleteBook() {
		    ngDialog.closeAll();
		    $scope.vm.currrentbook.checked = !$scope.vm.currrentbook.checked;
		    //console.log($scope.vm.currrentbook);    
		}

	    //移除班级教辅
		function _deleteClassBook() {
		    var params = {
		        Token: $scope.vm.token,
		        classid: $scope.vm.currentclassid,
		        hwbid: $scope.vm.currrentbook.hwbid

		    }
		    classmanageSrv.deleteClassBook(params).then(function (result) {
		        if (result.code === 0) {
		            toastr.success('移除成功', '');
		            _getClassBooks();
		            ngDialog.closeAll();

		        } 
		    });
		}

	    //选择搜索教辅
		function _selectSearchBook(book) {

		    if ($scope.vm.tempArray.length > 0) {
		        if (book.checked) {
		            angular.forEach($scope.vm.tempArray, function (b,index) {
		                if (b == book)
		                {
		                    $scope.vm.tempArray.splice(index, 1);
		                    return;
		                }
		            });
		            book.checked = !book.checked;
		        }
		        else {
		            $scope.vm.tempArray.push(book);
		            book.checked = true;
		        }
		    }
		    else {
		        $scope.vm.tempArray.push(book);
		        book.checked = !book.checked;
		    }

		}

	    //跳转个人学情分析
		function _goToPerson(student) {
		    $state.go('app.analyze.person', { upid: student.upid });
		}
	    //跳转班级学情分析
		function _goToClass() {
		    $state.go('app.analyze.class', { classid: $scope.vm.currentclassid });
		}

		function _selectBookInfo() {
		    if ($scope.vm.bookinfo != null) {
		        $scope.vm.msgstatus = 0;
		    }
		}

		function _keyDown($event) {
		    $scope.vm.msgstatus = 0;
		}

	    //跳转如何加入学生页面
		function _goToJoinStudent() {
		    $state.go('http://www.yqj.cn/Teacher/bj/JoinClassWay?classid='+$scope.vm.currentclassid+'', {  });
		}
        
	    //升级班级
		function _upgradeGradeDialog() {
		    var date = new Date();
		    var currentYear = date.getFullYear();
		    //var currentMonth = date.getMonth() + 1;
		    //var currentDate = date.getDate();

		    //if (currentMonth == 8 && currentDate == 25) {
		    //if (date.getTime() >= new Date(currentYear+'/8/25 00:00:00').getTime() && date.getTime() <= new Date(currentYear+'/10/25 23:59:59').getTime()) {
		    //    //$scope.vm.promote = !$scope.vm.promote;
		        var nestedConfirmDialog = ngDialog.openConfirm({
		            template:
                            '<div style="padding:1em;">' +
                            '<p>确定要升级年级吗?</p>' +
                            '<div class="ngdialog-buttons">' +
                                '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog()">取消</button>' +
                                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="upgradeGrade()">确定</button>' +
                            '</div>' +
                            '</div>',
		            plain: true,
		            width: 400,
		            scope: $scope,
		            className: 'ngdialog-theme-default',
		        });

		    //} else {

		    //    var nestedConfirmDialog = ngDialog.openConfirm({
		    //        template:
            //                '<div style="padding:1em;">' +
            //                '<p>升班时间为每年8月25日-9月25日，现在不是升班时间，不能升级！</p>' +
            //                '<div class="ngdialog-buttons">' +
            //                    '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">确定</button>' +
            //                '</div>' +
            //                '</div>',
		    //        plain: true,
		    //        width: 400,
		    //        scope: $scope,
		    //        className: 'ngdialog-theme-default',
		    //    });
		    //}
		    
		}
		function _upgradeGrade() {
		    
		    var params = {
		        Token: $scope.vm.token,
		        OldClassID: $scope.vm.currentclassid,
		        NewClassName: $scope.vm.currentclassinfo.classname

		    }
		    classmanageSrv.upGradeClass(params).then(function (result) {
		        if (result.code === 0) {

		            angular.forEach($scope.vm.classlist, function (o,i) {
		                if ($scope.vm.currentclassid == o.classid) {
		                    o.classid = result.data.classid;
		                    o.gradename = result.data.gradename;
		                }
		            });
		            $scope.vm.currentclassid = result.data.classid;
		            $scope.vm.currentclassinfo.classid = result.data.classid;
		            $scope.vm.currentclassinfo.gradename = result.data.gradename;

		            toastr.success('升级成功', '');
		            ngDialog.closeAll();

		        }
		    });


		    
		}

	    //跳转已关闭班级
		function _goToClosedClass() {
		    $state.go('app.classmanage.closedclass', {});
		}

	    //关闭班级显示
		function _closeClassDialog(type) {
		    //if ($scope.vm.classlist.length > 1) {
		        $scope.vm.type = type;

		        var nestedConfirmDialog = ngDialog.openConfirm({
		            template:
                            '<div style="padding:1em;">' +
                            '<p>确定要关闭该班级显示吗，该班级保存到【已关闭班级】中</p>' +
                            '<div class="ngdialog-buttons">' +
                                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">取消</button>' +
                                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeClass()">确定</button>' +
                            '</div>' +
                            '</div>',
		            plain: true,
		            width: 400,
		            scope: $scope,
		            className: 'ngdialog-theme-default',
		        });
		    //}
		}
		function _closeClass() {

		    var params = {
		        Token: $scope.vm.token,
		        ClassID: $scope.vm.currentclassid,
		        Type: $scope.vm.type

		    }
		    classmanageSrv.operClassDisplayStatus(params).then(function (result) {
		        if (result.code === 0) {

		            angular.forEach($scope.vm.classlist, function (o, i) {
		                if ($scope.vm.currentclassid == o.classid) {
		                    $scope.vm.classlist.splice(index, 1);
		                }
		            });
		            if ($scope.vm.classlist.length > 0) {
		                $scope.vm.currentclassid = $scope.vm.classlist[0].classid;
		                $scope.vm.currentclassinfo = $scope.vm.classlist[0];

		                $scope.vm.studentItems = $scope.vm.currentclassinfo.student;
		                _getClassBooks();
		            } else {
		                $scope.vm.currentclassid = 0;
		                $scope.vm.currentclassinfo = [];

		                $scope.vm.studentItems = [];
		            }
		            ngDialog.closeAll();

		        } 
		    });

		}

	    //班级数量提示
		function _classTipsDialog() {
		    if ($scope.vm.classlist.length >= 4) {
		        var nestedConfirmDialog = ngDialog.openConfirm({
		            template:
                            '<div style="padding:1em;">' +
                            '<p>老师，你的班级有点多哦，可以通过“关闭班级显示”，将上年班级保存到【我教过的班级】或者可以将班级升级哦</p>' +
                            '<div class="ngdialog-buttons">' +
                                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="closeThisDialog()">确定</button>' +
                            '</div>' +
                            '</div>',
		            plain: true,
		            width: 400,
		            scope: $scope,
		            className: 'ngdialog-theme-default',
		        });
		    }
		}

		function _goToHowJoinStu() {		    
		    
		    window.open(window.globalConfig.domain + 'resource/YS/howtojoin.html');
		}

	}])
});