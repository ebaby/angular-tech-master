define([], function () {
    var basePath = {
        sethomework: globalConfig.appPath + 'sethomework/'
    }
    return {
        defaultRoutePath: '/',
        //lazyCfg: {
        //    'stateName': 'app.sethomework',
        //    'urlPrefix': '/sethomework',
        //    'type': 'ngload',
        //    'src': basePath.sethomework + 'app-sethomework.module.js'
        //},
        routers: {
            'app.sethomework': {
                url: '/sethomework',
                dependencies: [
					//basePath.sethomework + 'sethomework.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.sethomework + 'sethw/sethw.html',
                        //controller:'SetHomeworkCtrl'
                    }
                }
            },
            'app.sethomework.sethw': {
                url: '/sethw',
                dependencies: [
					basePath.sethomework + 'sethw/sethw.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.sethomework + 'sethw/sethw.html',
                        controller: 'SetHomeworkCtrl'
                    }
                }
            },
            'app.sethomework.setparthw': {
                url: '/setparthw/:hwid',
                dependencies: [
					basePath.sethomework + 'sethw/sethw.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.sethomework + 'sethw/setparthw.html',
                        controller: 'SetPartHomeworkCtrl'
                    }
                }
            },
            'app.sethomework.sethwlog': {
                url: '/sethwlog',
                dependencies: [
					basePath.sethomework + 'sethwlog/sethwlog.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.sethomework + 'sethwlog/sethwlog.html',
                        controller: 'HomeworkLogCtrl'
                    }
                }
            },
            'app.sethomework.statistics': {
                url: '/statistics/:tchwlogid',
                dependencies: [
					basePath.sethomework + 'statistics/statistics.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.sethomework + 'statistics/statistics.html',
                        controller: 'StatisticsCtrl'
                    }
                }
            },
            'app.sethomework.setholidayhw': {
                url: '/setholidayhw',
                dependencies: [
					basePath.sethomework + 'setholidayhw/setholidayhw.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.sethomework + 'setholidayhw/setholidayhw.html',
                        controller: 'HolidayCtrl'
                    }
                }
            },
            'app.sethomework.finsh': {
                url: '/finsh/:pagesize',
                dependencies: [
					basePath.sethomework + 'finsh/finsh.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.sethomework + 'finsh/finsh.html',
                        controller: 'FinshCtrl'
                    }
                }
            },
            'app.sethomework.holidayfinsh': {
                url: '/holidayfinsh/:pagesize',
                dependencies: [
					basePath.sethomework + 'holidayfinsh/holidayfinsh.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.sethomework + 'holidayfinsh/holidayfinsh.html',
                        controller: 'HolidayFinshCtrl'
                    }
                }
            }


        }
    }
})