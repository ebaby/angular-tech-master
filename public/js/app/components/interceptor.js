define(['require','angular'], function(require,ng) { 
	var  interceptor=angular.module('app.interceptor',[]);
    
	interceptor.factory('errorService', ['$rootScope','$filter',function($rootScope,$filter){
		var service = {
			handleErrors:function(response){
				var statusCode = response.status;
			}
		}
		return service;
	}]);

	 
	interceptor.factory('maskService', ['$rootScope','$q','cfpLoadingBar','$timeout',function($rootScope,$q,cfpLoadingBar,$timeout){
		var service = {
			 showMask:function(){  
			 	//所有列表请求需要显示loading
			 	cfpLoadingBar.start();
			 },
			 hideMask:function(){ 
			 	//隐藏loading
			 	cfpLoadingBar.complete();
			 } 
		}
		return service;
	}]);
	 
	interceptor.factory('resourceInterceptor', ['$q', 'errorService', 'maskService', function ($q, errorService, maskService, $state) {
	    var resourceInterceptor = { 
	        responseError: function(response) {
	        	maskService.hideMask(response);
	        	errorService.handleErrors(response);
	        	return $q.reject(response);
	        },
	        request: function(config) {
	            if (config.data) {
                    //console.log($state);
	                $(".all-loading").show();
	        		//maskService.showMask();
	        	}
	          	return config; 
	        },
	        response: function (config) {
	            $(".all-loading").hide();
	            //maskService.hideMask();
	            if (config.data) {
	                if (config.data.Code == 1000 || config.data.Code == 1002) {
	                    window.location.href = window.globalConfig.platformurl;
	                }
	            }
	            return config;
	        }
	    }; 
	    return resourceInterceptor;
	}]);
	
	return interceptor;
});