define(['require','angular','utils/http-funs','layout/header.service'],function(require,ng){
	var module = ng.module('app.service');
	module.service('headerSrv', ['$q','httpFuns', function($q,httpFuns){
        //console.log(httpFuns);
		var actions = {
		    getteacherinfo: "Account/User/ATeacher/TInfo/GetInfo",//"getteacherinfo",
		    teacherloginout: "Account/User/ATeacher/Logout",//"teacherloginout",
		    getteachersmessagerecordlist:"Message/System/STeacher/Msg_List",// "getteachersmessagerecordlist",
		    setteachersmessagerecordread: "Message/System/STeacher/Msg_SetStauts",//"setteachersmessagerecordread",


        }
        var funcs = {
            getTeacherInfo: _getTeacherInfo,  
            teacherLoginOut: _teacherLoginOut,
            getTeachersMessageRecordList: _getTeachersMessageRecordList,
            setTeachersMessageRecordRead: _setTeachersMessageRecordRead,

        };
        return funcs;
        function _getTeacherInfo(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.getteacherinfo, params );
        }
        function _teacherLoginOut(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.teacherloginout, params );
        }
        function _getTeachersMessageRecordList(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.getteachersmessagerecordlist,params);
        }
        function _setTeachersMessageRecordRead(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.setteachersmessagerecordread, params);
        }

	}]);
})