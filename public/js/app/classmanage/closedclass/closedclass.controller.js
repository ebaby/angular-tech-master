define(['require', 'angular', 'components/com-funs', 'classmanage/classmanage.service', 'directives/com-directives'], function (require, ng, comfuns) {
    var module = ng.module('app.classmanage');
    module.controller('ClosedClassCtrl', ['$scope', '$state', '$timeout', '$templateRequest', '$templateCache', 'classmanageSrv', 'ngDialog', 'toastr', 'toastrConfig', '$sce', function ($scope, $state, $timeout, $templateRequest, $templateCache, classmanageSrv, ngDialog, toastr, toastrConfig, $sce) {

        $scope.vm = {
            token: window.localStorage.tch_token,
            currentclassid: 0,
            classlist: [],
            pageindex: 1,
            pagesize: 10,
        }

        $scope.closeClassDialog = _closeClassDialog;
        $scope.closeClass = _closeClass;

        initialize();
        function initialize() {

            //_selectPic($scope.vm.picindex);
            _getTeacherClasslist();

        }

        //获取班级列表
        function _getTeacherClasslist() {
            var params = {
                Token: $scope.vm.token,
                Type: 0,//-1：全部，0：不显示，1：显示
            }
            classmanageSrv.getTeacherClasslist(params).then(function (result) {
                if (result.code === 0) {
                    if (result.data.length > 0) {

                        //var arry = [];
                        //angular.forEach(result.data, function (o,i) {
                        //    if (!o.isshow) {
                        //        arry.push(o);
                        //    }
                        //});
                        $scope.vm.classlist = result.data;

                        

                    } else {
                        $scope.vm.currentclassinfo = [];
                        $scope.vm.classlist = [];
                    }
                }
            });


        }

        //关闭班级显示
        function _closeClassDialog(currentclassinfo,type) {
            $scope.vm.currentclassinfo = currentclassinfo;
            $scope.vm.type = type;

            var nestedConfirmDialog = ngDialog.openConfirm({
                template:
                        '<div style="padding:1em;">' +
                        '<p>确定要显示该班级吗？</p>' +
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
        }
        function _closeClass() {

            var params = {
                Token: $scope.vm.token,
                ClassID: $scope.vm.currentclassinfo.classid,
                Type: $scope.vm.type

            }
            classmanageSrv.operClassDisplayStatus(params).then(function (result) {
                if (result.code === 0) {

                    angular.forEach($scope.vm.classlist, function (o, i) {
                        if ($scope.vm.currentclassinfo.classid == o.classid) {
                            //o.isshow = 0;
                            $scope.vm.classlist.splice(i, 1);
                        }
                    });
                    
                    ngDialog.closeAll();

                }
            });

        }



    }])
});