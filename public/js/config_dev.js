(function (window) {
    var global = {
        apiPath:"https://doapi.yqj.cn/api/",// "https://oapiv3400.yqj.cn/api/",////'http://moapi.yqj.cn/MockAPI/',//'http://toapi.yqj.cn/api/',
        curl: "//dauthcode.yqj.cn/ShowCode",
        appver: '4.0.1',
        //appver: '3.4.0',
        uploadPath: '//dres.yqj.cn/ResUp.aspx',
        downloadPath: '//ddocgen.yqj.cn/downloadv32.ashx',
        platformurl: "//dwww.yqj.cn/index.html",//"http://dwww.yqj.cn/index.html",
        libPath: '/js/libs/',
        appPath: '/js/app/',
        domain: '//dwww.yqj.cn/',
    };
    window.globalConfig=window.globalConfig||global;
})(window)
require.config({
    baseUrl: "/js/app/",
    paths: {
        'app': globalConfig.appPath + "app",
        // 'jquery': globalConfig.libPath + 'jquery',
        'pagination': window.globalConfig.libPath + 'pagination/jquery.pagination',
        'echarts': window.globalConfig.libPath + 'echarts',
        'zrender': window.globalConfig.libPath + 'zrender',
        'angular':'//cdn.bootcss.com/angular.js/1.5.9/angular.min',// globalConfig.libPath + 'angular',
        'ng-dialog': globalConfig.libPath + 'ngDialog.min',
        'ng-img-crop': globalConfig.libPath + 'ng-img-crop',
        'angular-toastr': globalConfig.libPath + 'angular-toastr',
        'angular-toastr.tpls': globalConfig.libPath + 'angular-toastr.tpls',
        'angular-animate': globalConfig.libPath + 'angular-animate',
        'angular-loading-bar': globalConfig.libPath + 'loading-bar',
        'angular-route':'//cdn.bootcss.com/angular-ui-router/0.3.2/angular-ui-router',// globalConfig.libPath + 'angular-ui-router',
        'angular-bootstrap':'//cdn.bootcss.com/angular-ui-bootstrap/2.3.0/ui-bootstrap-tpls.min', // globalConfig.libPath + 'ui-bootstrap-tpls',
        //'bootstrap':globalConfig.libPath+'bootstrap',
        //'mymodule':globalConfig.libPath+'mymodule',
        //'messenger-theme':globalConfig.libPath+'messenger-theme-future',
        'angularAMD': globalConfig.libPath + "angularAMD",
        "uiRouterExtras": globalConfig.libPath + "ct-ui-router-extras",
        "ngload": globalConfig.libPath + "ngload",
        "moment": globalConfig.libPath + "moment",
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-animate': {
            deps: ['angular'],
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular'],
            exports: 'angular'
        },
        'angular-bootstrap': {
            deps: ['angular', 'moment'],
            exports: 'angular'
        },
        'ng-dialog': {
            deps: ['angular', 'css!' + globalConfig.libPath + 'ngDialog.min', 'css!' + globalConfig.libPath + 'ngDialog-theme-default'],
            exports: 'angular'
        },
        'ng-img-crop': {
            deps: ['angular', 'css!' + globalConfig.libPath + 'ng-img-crop'],
            exports: 'angular'
        },
        'angular-toastr': {
            deps: ['angular', 'angular-toastr.tpls', 'css!' + globalConfig.libPath + 'angular-toastr'],
            exports: 'angular'
        },
        'angular-toastr.tpls': {
            deps: ['angular'],
            exports: 'angular'
        },
        'angular-loading-bar': {
            deps: ['angular', 'css!' + globalConfig.libPath + 'loading-bar'],
            exports: 'angular'
        },
        // 'bootstrap':{
        // 	deps:['jquery','angular-bootstrap','css!/js/libs/bootstrap'],
        // 	exports:'jquery'
        // },
        'moment': {
            exports: 'moment'
        },
        // 'jquery': {
        //     exports: '$'
        // },
        'pagination': {
            deps: ['css!' + window.globalConfig.libPath + 'pagination/pagination'],
            exports: '$'
        },
        /*'messenger':{
            deps:['jquery','css!/js/libs/messenger','css!/js/libs/messenger-theme-air'],
            exports:'Jquery'
        },
        'messenger-theme':{
            deps:['messenger'],
            exports:'Jquery'
        },*/
        "angularAMD": {
            deps: ["angular"],
            exports: "angular"
        },
        "ngload": {
            deps: ["angularAMD"],
            exports: "angular"
        },
        "uiRouterExtras": {
            deps: ["angular-route"]
        }
    },
    map: {
        '*': {
            'css': globalConfig.libPath + 'css.js'
        }
    },
    urlArgs: ""
});
/*require(['app'],function(app){
	angular.bootstrap(document, ['app']);
})*/
require(['app', 'angularAMD'], function (app, angularAMD) {
    angularAMD.bootstrap(app);
})