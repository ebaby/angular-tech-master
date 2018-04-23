define(['require', 'angular', 'angularAMD', 'angular-route', 'ng-dialog', 'angular-toastr', 'angular-loading-bar', 'angular-animate', 'angular-bootstrap', 'uiRouterExtras',  'layout/app-layout.module', 'app.service', 'components/interceptor', 'components/lazyHelper', 'utils/app-utils.module', , 'directives/app-directives.module'], function (require, angular, angularAMD) {
	return angular.module('app', [
		'ui.router',
		'ui.bootstrap',
		'ngAnimate',
		'ngDialog',
		'chieffancypants.loadingBar',
		'toastr',
		'ct.ui.router.extras',
		'app.layout',
		'app.interceptor',
		'app.service',
		'app.utils',
		'app.directives',
		'app.lazyHelper'
		]
	)
    //    .constant('FEATURE_STATES', [
	//	//'layout/app-layout.router',
	//	'classmanage/app-classmanage.router',
	//	//'teacherhw/app-teacherhw.router',
	//	'userinfo/app-userinfo.router',
	//	'checkhomework/app-checkhomework.router',
	//	'sethomework/app-sethomework.router',
	//	'analyze/app-analyze.router',
	//	//'livecourse/app-livecourse.router',
	//])
        .config(['$httpProvider', function ($httpProvider) {
      //config global interceptors
      $httpProvider.interceptors.push('resourceInterceptor');
    }]).config(['ngDialogProvider', function (ngDialogProvider) {
    	//ngDialog配置
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            plain: false,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            appendTo: false,
            preCloseCallback: function () {
                //console.log('default pre-close callback');
            }
        });
    }]).config(['$futureStateProvider','$locationProvider',function($futureStateProvider,$locationProvider) {
	    var loadAndRegisterFutureStates = ['$http','lazyHerper',function ($http,lazyHerper) {
	      return lazyHerper.getLazyModuleCfg().then(function(moduleCfg){
	          angular.forEach(moduleCfg, function (cfg) {
	            $futureStateProvider.futureState(cfg);
	          });
	      });
	    }];

	    $futureStateProvider.stateFactory('ngload', ngloadStateFactory); // register AngularAMD ngload state factory
	    $futureStateProvider.stateFactory('iframe', iframeStateFactory); // register silly iframe state factory
	    $futureStateProvider.stateFactory('requireCtrl', requireCtrlStateFactory); // Register state factory that registers controller via eval.
	      
	    $futureStateProvider.addResolve(loadAndRegisterFutureStates);
	}]).config(['toastrConfig',function(toastrConfig) {
	  //angular-toastr配置
	  angular.extend(toastrConfig, {
	    allowHtml: true,
	    closeButton: false,
	    closeHtml: '<button>&times;</button>',
	    extendedTimeOut: 1000,
	    positionClass:'toast-top-right',
	    iconClasses: {
	      error: 'toast-error',
	      info: 'toast-info',
	      success: 'toast-success',
	      warning: 'toast-warning'
	    },  
	    messageClass: 'toast-message',
	    onHidden: null,
	    onShown: null,
	    onTap: null,
	    progressBar: true,
	    tapToDismiss: true,
	    templates: {
	      toast: 'directives/toast/toast.html',
	      progressbar: 'directives/progressbar/progressbar.html'
	    },
	    timeOut: 1000,
	    titleClass: 'toast-title',
	    toastClass: 'toast'
	  });
	}]).config(['cfpLoadingBarProvider',function(cfpLoadingBarProvider) {
	    cfpLoadingBarProvider.includeSpinner = false;
	    //自定义spinner
	    //cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
	}]).config(['$httpProvider', function ($httpProvider) {
	    //angularjs post的请求显示的数据在Request Payload中，显然angular js的默认处理方式与以前jquery有所不同导致了问题。
	    $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	    $httpProvider.defaults.transformRequest = [function (data) {
	        /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
	        var param = function (obj) {
	            var query = '';
	            var name, value, fullSubName, subName, subValue, innerObj, i;

	            for (name in obj) {
	                value = obj[name];

	                if (value instanceof Array) {
	                    for (i = 0; i < value.length; ++i) {
	                        subValue = value[i];
	                        fullSubName = name + '[' + i + ']';
	                        innerObj = {};
	                        innerObj[fullSubName] = subValue;
	                        query += param(innerObj) + '&';
	                    }
	                } else if (value instanceof Object) {
	                    for (subName in value) {
	                        subValue = value[subName];
	                        fullSubName = name + '[' + subName + ']';
	                        innerObj = {};
	                        innerObj[fullSubName] = subValue;
	                        query += param(innerObj) + '&';
	                    }
	                } else if (value !== undefined && value !== null) {
	                    query += encodeURIComponent(name) + '='
                                + encodeURIComponent(value) + '&';
	                }
	            }

	            return query.length ? query.substr(0, query.length - 1) : query;
	        };

	        return angular.isObject(data) && String(data) !== '[object File]'
                    ? param(data)
                    : data;
	    }];
    }]).run(["$templateCache", function($templateCache) {
		$templateCache.put("directives/progressbar/progressbar.html","<div class=\"toast-progress\"></div>\n");
		$templateCache.put("directives/toast/toast.html","<div class=\"{{toastClass}} {{toastType}}\" ng-click=\"tapToast()\">\n  <div ng-switch on=\"allowHtml\">\n    <div ng-switch-default ng-if=\"title\" class=\"{{titleClass}}\" aria-label=\"{{title}}\">{{title}}</div>\n    <div ng-switch-default class=\"{{messageClass}}\" aria-label=\"{{message}}\">{{message}}</div>\n    <div ng-switch-when=\"true\" ng-if=\"title\" class=\"{{titleClass}}\" ng-bind-html=\"title\"></div>\n    <div ng-switch-when=\"true\" class=\"{{messageClass}}\" ng-bind-html=\"message\"></div>\n  </div>\n  <progress-bar ng-if=\"progressBar\"></progress-bar>\n</div>\n");
	}]);
	function requireCtrlStateFactory($q, futureState) {
	    var d = $q.defer(); // make a deferred

	    // Tell RequireJS to load lazyController 
	    // (leave off the .js)
	    require([featureState.lazyCfg], function (lazyController) {
	      // RequireJS asynchronousely gives us the result of 
	      // lazyController.js as the 'lazyController' parameter

	      // Define the full UI-Router state using the 
	      // lazyController and the injected futureState 
	      var fullstate = { controller: lazyController,
	        name: futureState.stateName,
	        url: futureState.urlPrefix,
	        templateUrl: futureState.templateUrl
	      };

	      // Resolve the promise with the full UI-Router state.
	      d.resolve(fullstate);
	    });
	    
	    // The state factory returns the promise
	    return d.promise;
	}
	  
	function iframeStateFactory ($q, futureState) {
	    var state = {
	      name: futureState.stateName,
	      template: '<iframe src="" + futureState.src + ""></iframe>',
	      url: futureState.urlPrefix
	    };
	    return $q.when(state);
	}

	function ngloadStateFactory($q, futureState) {
	    var ngloadDeferred = $q.defer();
	    require([ 'ngload!' + futureState.src , 'ngload', 'angularAMD'],
	        function ngloadCallback(result, ngload, angularAMD) {
	          angularAMD.processQueue();
	          ngloadDeferred.resolve(undefined);
	        });
	    return ngloadDeferred.promise;
	}
});
function setMinheight() {
    $(function () {
        setCheckcontrol();
        function setCheckcontrol() {
            var docheight = $(window).height();
            $(".page-content").css("minHeight", (docheight - 160) + "px");
        }
    })
}
