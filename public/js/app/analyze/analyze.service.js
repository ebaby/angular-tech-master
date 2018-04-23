define(['require', 'angular', 'utils/http-funs'], function (require, ng) {
    var module = ng.module('app.service');
    module.service('analyzeSrv', ['$q', 'httpFuns', function ($q, httpFuns) {
        //console.log(httpFuns);
        var actions = {
            getteacherclasslist: "Account/Class/TeacherClassList",//"getteacherclasslist",
            getxueqingfenzuoyeindexpage: "Product/HomeWork/HWInfo/InTeacherArrangeList",//"getxueqingfenzuoyeindexpage",
            xueqingfenxi: "Statistics/LearningSituationAnalysis/HomeWorkLHAnalysis",//"xueqingfenxi",
            gethomeworkanalsyszsdquestionlist: "Statistics/LearningSituationAnalysis/HWorkLHAnalysisZSDQuestionList",//gethomeworkanalsyszsdquestionlist",
            xueqingfenxisorcelevel: "Statistics/LearningSituationAnalysis/HomeWorkLHAnalysisScoreLevel",//xueqingfenxisorcelevel",
            getclassxueqingfenxi: "Statistics/LearningSituationAnalysis/ClassAnalysis",//getclassxueqingfenxi",
            getstusentanalysis: "Statistics/LearningSituationAnalysis/StudentAnalysis", //"getstusentanalysis",
            getstusentanalysishistroy: "Statistics/LearningSituationAnalysis/StudentAnalysisHomeWorkList",//getstusentanalysishistroy",
            promptedredowrongquestion: "Product/WrongQuestion/Q_PromoteToStudentSubmitWQ",//"promptedredowrongquestion",
            getclassxueqingfenxisorcelevel: "Statistics/LearningSituationAnalysis/ClassAnalysisScoreLevel",//"getclassxueqingfenxisorcelevel",
            getclasshomeworklist: "Statistics/LearningSituationAnalysis/ClassAnalysisHomeWorkList",//"getclasshomeworklist",
            getlistpigaiwrongti: "Product/WrongQuestion/Q_WatingCorrectWrongQ",//"getlistpigaiwrongti",
            dianzanxuesheng: "SocialContact/Like/WrongQuestionThumbs",//"dianzanxuesheng",
            updatesubendtime: "Product/HomeWork/HWInfo/SetHomeWorkSubEndTime",//"updatesubendtime",
            subpigaiwrongti: "Product/WrongQuestion/Q_CorrectWrongQ",// "subpigaiwrongti",
            teacherattenstudent: "Account/User/ATeacher/AttenStudent",//teacherattenstudent",
            deleteclassstudent: "Account/Class/ClassRemoveStudent",//deleteclassstudent",
            addclassbook: "Account/Class/ClassBooksAdd",//"addclassbook",
            deleteclassbook: "Account/Class/ClassBooksRemove",//"deleteclassbook",
            gethomeworkusersanalsyszsdquestionlist: "Statistics/LearningSituationAnalysis/StudentAnalysisZSDQuestionList",// "gethomeworkusersanalsyszsdquestionlist",
            getteacherclasscharpterlist: "Product/WrongQuestion/ClassChapterList",//"getteacherclasscharpterlist",
            gethomeworkclassanalsyscharpteridusuallywronglist: "Statistics/LearningSituationAnalysis/ClassAnalysisUsuallyWrongList",// "gethomeworkclassanalsyscharpteridusuallywronglist",
            getclasschapteriduserlist: "Statistics/LearningSituationAnalysis/ClassAnalysiIndividuationStudentList",// "getclasschapteriduserlist",
            getclassuserallwronglist: "Statistics/LearningSituationAnalysis/ClassAnalysiIndividuationWrongList",//"getclassuserallwronglist",
            gethomeworkclassanalsyszsdquestionlist: "Statistics/LearningSituationAnalysis/ClassAnalysisZSDQuestionList",
            getclasswrongquestionbook: "Product/WrongQuestion/ClassWrongQuestionBook",
            getjctxmulu: "Product/WrongQuestion/JCTXMuLu",
            getwrongquestionlist: "Product/WrongQuestion/Q_List",
            //记录操作日志
            platformoperlog: "platformoperlog"
        }
        var funcs = {
            getTeacherClasslist: _getTeacherClasslist,
            getXueQingFenZuoYeIndexPage: _getXueQingFenZuoYeIndexPage,
            xueQingFenXi: _xueQingFenXi,
            getHomeWorkAnalsysZsdQuestionList: _getHomeWorkAnalsysZsdQuestionList,
            xueQingFenXiSorceLevel: _xueQingFenXiSorceLevel,
            getClassXueQingFenXi: _getClassXueQingFenXi,
            getStusentAnalysis: _getStusentAnalysis,
            getStusentAnalysisHistroy: _getStusentAnalysisHistroy,
            promptedRedoWrongQuestion: _promptedRedoWrongQuestion,
            getClassXueQingFenXiSorceLevel: _getClassXueQingFenXiSorceLevel,
            getClassHomeWorkList: _getClassHomeWorkList,
            getListPiGaiWrongTi: _getListPiGaiWrongTi,
            dianZanXueSheng: _dianZanXueSheng,
            updateSubendTime: _updateSubendTime,
            subPiGaiWrongTi: _subPiGaiWrongTi,
            platformoperLog: _platformoperLog,
            teacherAttenStudent: _teacherAttenStudent,
            deleteClassStudent: _deleteClassStudent,
            addClassBook: _addClassBook,
            deleteClassBook: _deleteClassBook,
            getHomeWorkUsersAnalsysZsdQuestionList: _getHomeWorkUsersAnalsysZsdQuestionList,
            getHomeWorkClassAnalsysZsdQuestionList: _getHomeWorkClassAnalsysZsdQuestionList,
            getTeacherClassCharpterList: _getTeacherClassCharpterList,
            getHomeWorkClassAnalsysCharpterIdUsuallyWrongList: _getHomeWorkClassAnalsysCharpterIdUsuallyWrongList,
            getClassChapterIdUserList: _getClassChapterIdUserList,
            getClassUserAllWrongList: _getClassUserAllWrongList,
            getClassWrongQuestionBook: _getClassWrongQuestionBook,
            getJCTXMuLu: _getJCTXMuLu,
            getWrongQuestionList: _getWrongQuestionList,

        };
        return funcs;
        function _getTeacherClasslist(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getteacherclasslist, params);
        }
        function _getXueQingFenZuoYeIndexPage(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getxueqingfenzuoyeindexpage, params);
        }
        function _xueQingFenXi(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.xueqingfenxi, params);
        }
        function _getHomeWorkAnalsysZsdQuestionList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkanalsyszsdquestionlist, params);
        }
        function _xueQingFenXiSorceLevel(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.xueqingfenxisorcelevel, params);
        }
        function _getClassXueQingFenXi(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getclassxueqingfenxi, params);
        }
        function _getStusentAnalysis(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getstusentanalysis, params);
        }
        function _getStusentAnalysisHistroy(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getstusentanalysishistroy, params);
        }
        function _promptedRedoWrongQuestion(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.promptedredowrongquestion, params);
        }
        function _getClassXueQingFenXiSorceLevel(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getclassxueqingfenxisorcelevel, params);
        }
        function _getClassHomeWorkList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getclasshomeworklist, params);
        }
        function _getListPiGaiWrongTi(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getlistpigaiwrongti, params);
        }
        function _dianZanXueSheng(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.dianzanxuesheng, params);
        }
        function _updateSubendTime(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.updatesubendtime, params);
        }
        function _subPiGaiWrongTi(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.subpigaiwrongti, params, true);
        }
        function _platformoperLog(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.platformoperlog, params, true);
        }
        function _teacherAttenStudent(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.teacherattenstudent, params, true);
        }
        function _deleteClassStudent(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.deleteclassstudent, params, true);
        }
        function _addClassBook(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.addclassbook, params, true);
        }
        function _deleteClassBook(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.deleteclassbook, params, true);
        }
        function _getHomeWorkUsersAnalsysZsdQuestionList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkusersanalsyszsdquestionlist, params, true);
        }
        function _getHomeWorkClassAnalsysZsdQuestionList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkclassanalsyszsdquestionlist, params, true);
        }
        function _getTeacherClassCharpterList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getteacherclasscharpterlist, params, true);
        }
        function _getHomeWorkClassAnalsysCharpterIdUsuallyWrongList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkclassanalsyscharpteridusuallywronglist, params, true);
        }
        function _getClassChapterIdUserList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getclasschapteriduserlist, params, true);
        }
        function _getClassUserAllWrongList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getclassuserallwronglist, params, true);
        }
        function _getClassWrongQuestionBook(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getclasswrongquestionbook, params, true);
        }
        function _getJCTXMuLu(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getjctxmulu, params);
        }
        function _getWrongQuestionList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getwrongquestionlist, params);
        }

    }]);
});