define(['require','angular','utils/http-funs'],function(require,ng){
	var module = ng.module('app.service');
	module.service('mainSrv', ['$q','httpFuns', function($q,httpFuns){
        //console.log(httpFuns);
		var actions = {
		    getchecklist: "Product/HomeWork/HWInfo/InTeacherArrangeList",//"huoqupigailiebiao", 
		    deletehomework: "Product/HomeWork/Arrangement/ArrangeCancel",
		    updatesubendtime: "Product/HomeWork/HWInfo/SetHomeWorkSubEndTime",//"updatesubendtime",
            getteacherclasslist: "Account/Class/TeacherClassList",//"getteacherclasslist",
            setuserguidance: "Account/Operation/SetCheckPage",//"setuserguidance",
            checklogin: "Account/Operation/CheckPage",//"checklogin",
            classhwstatistics: "Account/Class/ClassHWStatistics",//"checklogin",

        }
        var funcs = {
            getCheckList: _getCheckList,   
            deleteHomeWork: _deleteHomeWork, 
            updateSubendTime: _updateSubendTime,
            getTeacherClasslist: _getTeacherClasslist,
            setUserGuidance: _setUserGuidance,
            checkLogin: _checkLogin,
            classHWStatistics: _classHWStatistics,

        };
        return funcs;
        function _getCheckList(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.getchecklist, params);
        }
        function _deleteHomeWork(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.deletehomework, params);
        }
        function _updateSubendTime(params) {
            return httpFuns.httpPost(globalConfig.apiPath+  actions.updatesubendtime, params);
        }
        function _getTeacherClasslist(params) {
            return httpFuns.httpPost(globalConfig.apiPath+  actions.getteacherclasslist, params);
        }
        function _setUserGuidance(params) {
            return httpFuns.httpPost(globalConfig.apiPath+  actions.setuserguidance, params, true);
        }
        function _checkLogin(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.checklogin, params, true);
        }
        function _classHWStatistics(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.classhwstatistics, params, true);
        }

	}]);
})