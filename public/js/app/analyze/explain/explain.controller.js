define(['require', 'angular', 'components/com-funs', 'analyze/analyze.service', 'directives/com-directives'], function (require, ng, comfuns) {
	var module = ng.module('app.analyze');
	module.controller('ExplainCtrl', ['$scope', '$state', 'analyzeSrv', '$sce', '$rootScope', 'toastr', 'ngDialog', function ($scope, $state, analyzeSrv, $sce, $rootScope, toastr, ngDialog) {
	    //$scope.title = '学情分析';

	    $scope.vm = {
	        token: window.localStorage.tch_token,
	        pageindex: 1,
	        pagesize: 10,
	        couid: 0,
	        treeid: 0,
	    }

	    $scope.toHtml = _toHtml;
	    $scope.bookDialog = _bookDialog;
	    $scope.videoDialog = _videoDialog;
	    $scope.getWrongQCourseDirectory = _getWrongQCourseDirectory;
	    $scope.selectSearchBook = _selectSearchBook;
	    $scope.selectChapter = _selectChapter;
	    $scope.selectBookBox = _selectBookBox;
	    $scope.wQConciseToFreeStudent = _wQConciseToFreeStudent;

	    $scope.playerOptions = {
	        pcontainer: ".error-play",
	        container: '#playercontainer',
	        maxwidth: 1180,
	        minwidth: 895,
	        ratio: 9 / 16
	    }

	    initialize();
	    function initialize() {
	        _getWrongQConciseBook();
	    }
        
	    function _selectBookBox() {
	        $scope.vm.bookbox = !$scope.vm.bookbox;
	    }

	    //获取高频错题精讲教辅列表 
	    function _getWrongQConciseBook() {
	        var params = {
	            Token: $scope.vm.token,
	        };
	        analyzeSrv.getWrongQConciseBook(params).then(function (result) {
	            if (result.code === 0) {
                    
	                if (result.data.getwrongqconcisebook&&result.data.getwrongqconcisebook.length > 0) {
	                    $scope.vm.wrongqconcisebook = result.data.getwrongqconcisebook;

	                    if (result.data.getwrongqconcisebook.length > 0) {
	                        $scope.vm.wrongqconcisebook[0].checked = true;
	                        $scope.vm.currentbook = result.data.getwrongqconcisebook[0];


	                        //
	                        $scope.vm.couid = result.data.getwrongqconcisebook[0].couid;
	                        _getWrongQCourseDirectory();
	                    }
	                } else {
	                    $scope.vm.wrongqconcisebook = [];
	                    $scope.vm.treeids = [];
	                }
	            }
	        });
	    }

	    //选择搜索教辅
	    function _selectSearchBook(book) {

	        angular.forEach($scope.vm.wrongqconcisebook, function (o,i) {
	            if (o.id == book.id) {
	                o.checked = true;
	            } else {
	                o.checked = false;
	            }
	        });
	        $scope.vm.currentbook = book;


	        $scope.vm.couid = book.couid;
	        _getWrongQCourseDirectory();
	    }

	    //获取高频错题精讲教辅目录 
	    function _getWrongQCourseDirectory() {
	        var params = {
	            Token: $scope.vm.token,
	            CouID: $scope.vm.couid,

	        };
	        analyzeSrv.getWrongQCourseDirectory(params).then(function (result) {
	            if (result.code === 0) {
                    
                    $scope.vm.treeids = result.data.treeids;

                    if (result.data.treeids.length > 0) {
                        $scope.vm.treeids[result.data.treeids.length-1].checked = true;
                        $scope.vm.treeid = $scope.vm.treeids[result.data.treeids.length-1].treeid;
                        $scope.vm.currenttree = $scope.vm.treeids[result.data.treeids.length-1];

                        _getWrongQCourseRes();

                    }

	            }
	        });
	    }

	    function _selectChapter(tree) {
	        angular.forEach($scope.vm.treeids, function (o,i) {
	            if (o.treeid == tree.treeid) {
	                o.checked = true;
	            } else {
	                o.checked = false;
	            }
	        });

	        $scope.vm.treeid = tree.treeid;
	        $scope.vm.couid = tree.couid;
	        $scope.vm.currenttree = tree;
	        _getWrongQCourseRes();
	    }

	    //获取高频错题精讲目录内容 
	    function _getWrongQCourseRes() {
	        var params = {
	            Token: $scope.vm.token,
	            TreeID:$scope.vm.treeid,
	            CouID: $scope.vm.couid,

	        };
	        analyzeSrv.getWrongQCourseRes(params).then(function (result) {
	            if (result.code === 0) {
                    
                    $scope.vm.wrongqcourseres = result.data.wrongqcourseres;
                    
	            }
	        });
	    }

	    //教师发送学生免费使用错题精讲 
	    function _wQConciseToFreeStudent() {

	        if ($scope.vm.currenttree.senttostustatus == 1) {
	            toastr.warning("该目录已推荐给学生", '');
	            return false;
	        }

	        var params = {
	            Token: $scope.vm.token,
	            WQConciseList: [{
	                TreeID: $scope.vm.currenttree.treeid,
	                CouID: $scope.vm.currenttree.couid,
	            }],

	        };
	        analyzeSrv.wQConciseToFreeStudent(params).then(function (result) {
	            if (result.code === 0) {
                    
	                angular.forEach($scope.vm.treeids, function (o, i) {
	                    if (o.treeid == $scope.vm.currenttree.treeid) {
	                        o.senttostustatus = 1;
	                    }
	                });

	                //$scope.vm.currenttree.senttostustatus = 1;
	                toastr.success('推荐成功', '');
                    
	            }
	        });
	    }

	    function _bookDialog() {

	        ngDialog.open({
	            template: window.globalConfig.appPath + 'analyze/explain/bookdialog.html',
	            className: 'ngdialog-theme-default',
	            width: 800,
	            height: 300,
	            //showClose: false,
	            scope: $scope
	        });
	        _getWrongQConciseBook();

	    }
	    function _videoDialog(wrong) {

	        ngDialog.open({
	            template: window.globalConfig.appPath + 'analyze/explain/videldialog.html',
	            className: 'ngdialog-theme-default',
	            width: 800,
	            height: 400,
	            //showClose: false,
	            scope: $scope
	        });
	        $scope.vm.currentwrong = wrong;
	        $scope.playerOptions.vid = wrong.blvid;
	        //$scope.playerOptions.playerhandle.changeVid(wrong.blvid)
	    }









	    function _toHtml(html) {
	        return $sce.trustAsHtml(html);
	    }




	}]);
});