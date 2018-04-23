define([], function () {
    var basePath = {
        checkhomework: globalConfig.appPath + 'checkhomework/'
    }
    return {
        defaultRoutePath: '/',
        //lazyCfg: {
        //    'stateName': 'app.checkhomework',
        //    'urlPrefix': '/checkhomework',
        //    'type': 'ngload',
        //    'src': basePath.checkhomework + 'app-checkhomework.module.js'
        //},
        routers: {
            'app.checkhomework': {
                url: '/checkhomework',
                dependencies: [
                    basePath.checkhomework + 'unalreadyhw/unalreadyhw.controller.js'
					//basePath.homework + 'checkhomework.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.checkhomework + 'unalreadyhw/unalreadyhw.html',
                        //controller:'CheckHomeworkCtrl'
                    }
                }
            },
            'app.checkhomework.alreadyhw': {
                url: '/alreadyhw',
                dependencies: [
					basePath.checkhomework + 'alreadyhw/alreadyhw.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.checkhomework + 'alreadyhw/alreadyhw.html',
                        controller: 'AlreadyCtrl'
                    }
                }
            },
            'app.checkhomework.alreadyhw.student': {
                url: '/student/:tchwlogid',
                dependencies: [
					basePath.checkhomework + 'alreadyhw/alreadyhw.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.checkhomework + 'alreadyhw/student.html',
                        controller: 'AlreadystudentCtrl'
                    }
                }
            },            
            'app.checkhomework.alreadyhw.detail': {
                url: '/detail/:tchwlogid/:sublogid/:upid',
                dependencies: [
					basePath.checkhomework + 'alreadyhw/alreadyhw.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.checkhomework + 'alreadyhw/detail.html',
                        controller: 'AlreadydetailCtrl'
                    }
                }
            },
            'app.checkhomework.unalreadyhw': {
                url: '/unalreadyhw',
                dependencies: [
					
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.checkhomework + 'unalreadyhw/unalreadyhw.html',
                        controller: 'UnAlreadyCtrl'
                    }
                }
            },
            'app.checkhomework.unalreadyhw.unstudent': {
                url: '/unstudent/:tchwlogid',
                dependencies: [
					basePath.checkhomework + 'unalreadyhw/unalreadyhw.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.checkhomework + 'unalreadyhw/unstudent.html',
                        controller: 'UnStudentCtrl'
                    }
                }
            },
            'app.checkhomework.unalreadyhw.undetail': {
                url: '/undetail/:tchwlogid/:sublogid/:upid',
                dependencies: [
					basePath.checkhomework + 'unalreadyhw/unalreadyhw.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.checkhomework + 'unalreadyhw/undetail.html',
                        controller: 'UnDetailCtrl'
                    }
                }
            },
            'app.checkhomework.alreadyhw.result': {
                url: '/result/:tchwlogid/:sublogid/:upid/:type/:cstatus',
                dependencies: [
					basePath.checkhomework + 'result/result.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.checkhomework + 'result/result.html',
                        controller: 'ResultCtrl'
                    }
                }
            }

        }
    }
})