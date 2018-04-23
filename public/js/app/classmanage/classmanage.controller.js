define(['require', 'angular', 'classmanage/classmanage.service', 'directives/com-directives'], function (require, ng) {
    var module = ng.module('app.classmanage');
    module.controller('ClassmanageCtrl', ['$scope', '$timeout', '$templateRequest', '$templateCache', 'classmanageSrv', 'ngDialog', 'toastr', 'toastrConfig', function ($scope, $timeout, $templateRequest, $templateCache, classmanageSrv, ngDialog, toastr, toastrConfig) {
        $scope.title = '班级管理';
        var openedToasts = [];
        //公用属性存放
        $scope.vm = {
            token: window.localStorage.tch_token,
            selectdate: ''
        }
        $scope.vm.ages = [{ age: 12 }, { age: 13 }]
        $scope.reg = /^[A-Za-z0-9]+$/;
        $scope.ok = _ok;

        $scope.dateoption = {
            setDatetime: _setDatetime
        }

        function _setDatetime(dt) {
            alert(dt);

        }

        $scope.classlist = {

        }
        $scope.testFunction = _testFunction;

        initialize();
        function initialize() {

            // var nestedConfirmDialog = ngDialog.openConfirm({
            //        template:
            //                '<p>Are you sure you want to close the parent dialog?</p>' +
            //                '<div style="height:200px;background:red;">ss</div>' +
            //                '<div class="ngdialog-buttons">' +
            //                    '<button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="testFunction(0)">No' +
            //                    '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes' +
            //                '</button></div>',
            //        plain: true,
            //        width:400,
            //        scope: $scope,
            //        className: 'ngdialog-theme-default'
            //    });


            //getTeacherClasslist();
        }
        function getTeacherClasslist() {
            var params = {

            }
            classmanageSrv.getTeacherClasslist(params).then(function (result) {
                $scope.vm.title = result.name;
            });
            $timeout(function () {
                $scope.vm.title = "sssl";
            }, 1000)

        }
        function _ok(isValid) {
            $scope.vm.submitted = true;
            getTeacherClasslist();
            console.log(isValid);
        }
        function _testFunction() {
            $scope.closeThisDialog(0)
        }

        function srcFunc() {

        }


        var openedToasts = [];

        $scope.toast = {
            title: '',
            message: ''
        };
        $scope.openToast = function () {
            //toastr.clear();
            //openedToasts.push(toastr.info('大家好', '标题'));
            toastr.info('大家好', '标题');
            toastr.error('大家好', '标题');
            toastr.warning('大家好', '标题');
            toastr.success('大家好', '标题');
        };

        //添加自定义信息模板
        $scope.$watch('toast.customTemplate', function (newVal) {
            if ($templateCache.get('custom')) {
                $templateCache.remove('custom');
            }
            $templateCache.put('custom', newVal);
        });
        $templateRequest('default.html').then(function (tpl) {
            $scope.toast.customTemplate = tpl;
        });
    }])
});