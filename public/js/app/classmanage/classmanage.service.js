define(['require','angular','utils/http-funs'],function(require,ng){
	var module = ng.module('app.service');
	module.service('classmanageSrv', ['$q','httpFuns', function($q,httpFuns){
        //console.log(httpFuns);
		var actions = {
		    getteacherclasslist: "Account/Class/TeacherClassList",//"getteacherclasslist",
		    getteacherclassstudentlist: "Account/Class/ClassStudentList",//"getteacherclassstudentlist",
		    deleteclass: "Account/Class/ClassDelete",//"deleteclass",
		    unlocktheclass:"Account/Class/ClassUnLock",//"unlocktheclass",
            yichubanjixuesheng: "yichubanjixuesheng",
            setteacherguanzhustudent: "setteacherguanzhustudent",
            grades: "BasicData/Grade/GradeList",//"getgrade",
            getversionlist: "BasicData/TeachingMaterialSystem/MaterialVersionList",//"getjcbblist",
            getsubjects: "BasicData/Subject/SubjectList",//"getxueke",
            createclass: "Account/Class/ClassAdd",//"createclass",
            getbanjixinxi: "getbanjixinxi",
            getjsapicongfig: "getjsapicongfig",
            checklogin: "Account/Operation/CheckPage",//"checklogin",
            getclassinfo: "Account/Class/ClassBase",//"getclassinfo",
            updateclass: "Account/Class/ClassUpdate",//"updateclassinfo",
            getclassbooks: "Account/Class/ClassBooksList",//"getclassbooks",
            getallbooks: "Product/HomeWork/BooksList",//"getallbooks",
            teacherattenstudent: "Account/User/ATeacher/AttenStudent",//"teacherattenstudent",
            deleteclassstudent: "Account/Class/ClassRemoveStudent",//"deleteclassstudent",
            addclassbook: "Account/Class/ClassBooksAdd",//"addclassbook",
            deleteclassbook: "Account/Class/ClassBooksRemove",//"deleteclassbook",
            setuserguidance: "Account/Operation/SetCheckPage",//"setuserguidance",
            upgradeclass: "Account/Class/UpGradeClass",
            operclassdisplaystatus: "Account/Class/OperClassDisplayStatus",

            //记录操作日志
            platformoperlog: "platformoperlog"
        }
        var funcs = {
            getTeacherClasslist: _getTeacherClasslist,
            getTeacherClassStudentlist: _getTeacherClassStudentlist,
            deleteClass: _deleteClass,
            unlockTheclass:_unlockTheclass,
            removeStudent: _removeStudent,
            setTeacherAttStudent: _setTeacherAttStudent,
            getGrades: _getGrades,
            getVersionList: _getVersionList,
            getSubjects: _getSubjects,
            createClass: _createClass,
            updateClass: _updateClass,
            wxAuthorize: _wxAuthorize,
            checkLogin: _checkLogin,
            platformoperLog: _platformoperLog,
            getClassInfo: _getClassInfo,
            getClassBooks: _getClassBooks,
            getAllBooks: _getAllBooks,
            teacherAttenStudent: _teacherAttenStudent,
            deleteClassStudent: _deleteClassStudent,
            addClassBook: _addClassBook,
            deleteClassBook: _deleteClassBook,
            setUserGuidance: _setUserGuidance,
            upGradeClass: _upGradeClass,
            operClassDisplayStatus: _operClassDisplayStatus,

        };
        return funcs;
        function _getTeacherClasslist(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.getteacherclasslist,params);
        }
        function _getTeacherClassStudentlist(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.getteacherclassstudentlist,params);
        }
        function _deleteClass(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.deleteclass,params);
        }
        function _unlockTheclass(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.unlocktheclass,params);
        }
        function _removeStudent(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.yichubanjixuesheng,params);
        }
        function _setTeacherAttStudent(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.setteacherguanzhustudent,params);
        }
        function _getGrades(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.grades,params);
        }
        function _getVersionList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getversionlist, params);
        }
        function _getSubjects(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getsubjects, params);
        }
        function _createClass(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.createclass,params);
        }
        function _updateClass(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.updateclass, params);
        }
        function _wxAuthorize(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.getjsapicongfig,params);
        }
        function _checkLogin(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.checklogin,params);
        }
        function _platformoperLog(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.platformoperlog,params, true);
        }
        function _getClassInfo(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.getclassinfo,params, true);
        }
        function _getClassBooks(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.getclassbooks,params, true);
        }
        function _getAllBooks(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.getallbooks,params, true);
        }
        function _teacherAttenStudent(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.teacherattenstudent,params, true);
        }
        function _deleteClassStudent(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.deleteclassstudent,params, true);
        }
        function _addClassBook(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.addclassbook,params, true);
        }
        function _deleteClassBook(params) {
            return httpFuns.httpPost(globalConfig.apiPath+ actions.deleteclassbook,params, true);
        }
        function _setUserGuidance(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.setuserguidance, params, true);
        }
        function _upGradeClass(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.upgradeclass, params, true);
        }
        function _operClassDisplayStatus(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.operclassdisplaystatus, params, true);
        }
		
	}]);
})