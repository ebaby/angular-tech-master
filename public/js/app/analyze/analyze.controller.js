define(['require', 'angular', 'analyze/analyze.service', 'directives/com-directives'], function (require, ng) {
    var module = ng.module('app.analyze');
    module.controller('AnalyzeCtrl', ['$scope', 'analyzeSrv', function ($scope, analyzeSrv) {
        //$scope.title = '学情分析';

        $scope.vm = {
            pageindex: 1,
            pagesize: 10,
            tabindex: 0,
            currentclassid: 0,
            classindex: 0,
            classlist: []

        }

        $scope.selectClass = _selectClass;
        $scope.loadMore = _loadMore;

        initialize();
        function initialize() {

            _getTeacherClasslist();
        }

        function _selectClass(classinfo, classindex) {
            $scope.vm.classindex = classindex;
            $scope.vm.currentclassid = classinfo.classid;
            _getTeacherClasslist();
            //_getXueQingFenZuoYeIndexPage();
        }

        //获取班级列表
        function _getTeacherClasslist() {
            var params = {
                classid: $scope.vm.currentclassid
            }
            analyzeSrv.getTeacherClasslist(params, '').then(function (result) {
                if (result.status === 200) {
                    if (result.data.length > 0) {
                        $scope.vm.classInfoItems = result.data[0];
                        if ($scope.vm.classlist.length == 0) {
                            $scope.vm.classlist = result.data[0].classlist;
                        }

                        $scope.vm.currentclassid = result.data[0].classid;
                        _getXueQingFenZuoYeIndexPage();

                    }
                }
            });


        }

        //获取班级学情分析
        function _getXueQingFenZuoYeIndexPage() {
            var params = {
                page: $scope.vm.pageindex,
                num: $scope.vm.pagesize,
                classid: $scope.vm.currentclassid
            }
            analyzeSrv.getXueQingFenZuoYeIndexPage(params, '').then(function (result) {
                if (result.status === 200) {

                    $scope.vm.pigailist = result.data[0].pigailist;

                }
            });
        }

        //
        function _loadMore() {

        }


    }])
});