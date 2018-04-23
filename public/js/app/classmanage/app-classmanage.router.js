define([],function(){
	var basePath = {
		classmanage:globalConfig.appPath+'classmanage/'
	}
	return {
	    defaultRoutePath: '/',
	    //lazyCfg: {
	    //    'stateName': 'app.classmanage',
	    //    'urlPrefix': '/classmanage',
	    //    'type': 'ngload',
	    //    'src': basePath.classmanage + 'app-classmanage.module.js'
	    //},
	    routers: {
	        'app.classmanage': {
	            url: '/classmanage',
	            dependencies: [
					//basePath.classmanage + 'classmanage.controller.js'
	            ],
	            views: {
	                'content@app': {
	                    templateUrl: basePath.classmanage + 'manage/manage.html',
	                    //controller:'ClassmanageCtrl'
	                }
	            }
	        },
	        'app.classmanage.create': {
	            url: '/create',
	            dependencies: [
					basePath.classmanage + 'create/create.controller.js'
	            ],
	            views: {
	                'content@app': {
	                    templateUrl: basePath.classmanage + 'create/create.html',
	                    controller: 'CreateCtrl'
	                }
	            }
	        },
	        'app.classmanage.manage': {
	            url: '/manage',
	            dependencies: [
					basePath.classmanage + 'manage/manage.controller.js'
	            ],
	            views: {
	                'content@app': {
	                    templateUrl: basePath.classmanage + 'manage/manage.html',
	                    controller: 'ManageCtrl'
	                }
	            }
	        },
	        'app.classmanage.closedclass': {
	            url: '/closedclass',
	            dependencies: [
					basePath.classmanage + 'closedclass/closedclass.controller.js'
	            ],
	            views: {
	                'content@app': {
	                    templateUrl: basePath.classmanage + 'closedclass/closedclass.html',
	                    controller: 'ClosedClassCtrl'
	                }
	            }
	        }
	    }
	}
})