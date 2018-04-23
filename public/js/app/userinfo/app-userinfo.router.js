define([], function () {
    var basePath = {
        userinfo: globalConfig.appPath + 'userinfo/'
    }
    return {
        defaultRoutePath: '/',
        //lazyCfg:{
        //	'stateName':'app.userinfo',
        //    'urlPrefix':'/userinfo',
        //    'type':'ngload',
        //    'src':basePath.userinfo+'app-userinfo.module.js'
        //},
        routers: {
            'app.userinfo': {
                url: '/userinfo',
                dependencies: [
					basePath.userinfo + 'userinfo.controller.js'
                ],
                views: {
                    'content@app': {
                        templateUrl: basePath.userinfo + 'userinfo.html',
                        controller: 'UserInfoCtrl'
                    }
                }
            },
            'app.userinfo.baseinfo': {
                url: '/baseinfo',
                dependencies: [
					basePath.userinfo + 'baseinfo/baseinfo.controller.js'
                ],
                views: {
                    'userinfo@app.userinfo': {
                        templateUrl: basePath.userinfo + 'baseinfo/baseinfo.html',
                        controller: 'BaseInfoCtrl'
                    }
                }
            },
            'app.userinfo.updheadimg': {
                url: '/updheadimg',
                dependencies: [
					basePath.userinfo + 'updheadimg/updheadimg.controller.js'
                ],
                views: {
                    'userinfo@app.userinfo': {
                        templateUrl: basePath.userinfo + 'updheadimg/updheadimg.html',
                        controller: 'UpdHeadImgCtrl'
                    }
                }
            },
            'app.userinfo.updpwd': {
                url: '/updpwd',
                dependencies: [
					basePath.userinfo + 'updpwd/updpwd.controller.js'
                ],
                views: {
                    'userinfo@app.userinfo': {
                        templateUrl: basePath.userinfo + 'updpwd/updpwd.html',
                        controller: 'UpdPasswordCtrl'
                    }
                }
            },
            'app.userinfo.certificate': {
                url: '/certificate',
                dependencies: [
					basePath.userinfo + 'certificate/certificate.controller.js'
                ],
                views: {
                    'userinfo@app.userinfo': {
                        templateUrl: basePath.userinfo + 'certificate/certificate.html',
                        controller: 'CertificateCtrl'
                    }
                }
            },
            'app.userinfo.credit': {
                url: '/credit',
                dependencies: [
					basePath.userinfo + 'credit/credit.controller.js'
                ],
                views: {
                    'userinfo@app.userinfo': {
                        templateUrl: basePath.userinfo + 'credit/credit.html',
                        controller: 'CreditCtrl'
                    }
                }
            }
        }
    }
})