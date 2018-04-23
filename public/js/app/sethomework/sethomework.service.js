define(['require', 'angular', 'utils/http-funs'], function (require, ng) {
    var module = ng.module('app.service');
    module.service('setHomeWorkSrv', ['$q', 'httpFuns', function ($q, httpFuns) {
        //console.log(httpFuns);
        var actions = {
            getteacherclasslist:"Account/Class/TeacherClassList",// "getteacherclasslist",
            getclassbooks: "Product/HomeWork/HWInfo/ArrangeClassBooksList",// "getclassbooks",
            gethomeworklist: "Product/HomeWork/HWInfo/ClassBooksLHList",//"gethomeworklist",
            getyibuzhizuoyelist: "getyibuzhizuoyelist",
            sethomework:"Product/HomeWork/Arrangement/SetHomeWork",// "sethomework",
            deletehomework:"Product/HomeWork/Arrangement/ArrangeCancel",// "deletehomework",
            updatesubendtime: "Product/HomeWork/HWInfo/SetHomeWorkSubEndTime",//"updatesubendtime",
            gethomestatistics: "Account/Class/GetHWStatistics",
            getteachercansethomework: "Product/HomeWork/HWInfo/ArrangeClassBooksList",//"getteachercansethomework",
            setuserguidance: "Account/Operation/SetCheckPage",// "setuserguidance",
            getchecklist:"Product/HomeWork/HWInfo/InTeacherArrangeList",// "huoqupigailiebiao",
            gethomeworkquestionlist:"Product/HomeWork/HWInfo/HWInfo",// "gethomeworkquestionlist",

        }
        var funcs = {
            getTeacherClasslist: _getTeacherClasslist,
            getClassBooks: _getClassBooks,
            getHomeWorkList: _getHomeWorkList,
            getYiBuZhiZuoYeList: _getYiBuZhiZuoYeList,
            setHomeWork: _setHomeWork,
            deleteHomeWork: _deleteHomeWork,
            updateSubendTime: _updateSubendTime,
            getHomeStatistics: _getHomeStatistics,
            getTeacherCanSetHomeWork: _getTeacherCanSetHomeWork,
            setUserGuidance: _setUserGuidance,
            getCheckList: _getCheckList,
            getHomeWorkQuestionList: _getHomeWorkQuestionList,

        };
        return funcs;
        function _getTeacherClasslist(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getteacherclasslist, params);
        }
        function _getClassBooks(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getclassbooks, params, true);
        }
        function _getHomeWorkList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworklist, params, true);
        }
        function _getYiBuZhiZuoYeList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getyibuzhizuoyelist, params, true);
        }
        function _setHomeWork(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.sethomework, params, true);
        }
        function _deleteHomeWork(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.deletehomework, params);
        }
        function _updateSubendTime(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.updatesubendtime, params);
        }
        function _getHomeStatistics(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomestatistics, params);
        }
        function _getTeacherCanSetHomeWork(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getteachercansethomework, params);
        }
        function _setUserGuidance(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.setuserguidance, params, true);
        }
        function _getCheckList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getchecklist, params);
        }
        function _getHomeWorkQuestionList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkquestionlist, params);
        }

    }]);
})