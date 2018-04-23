define(['require', 'angular', 'utils/http-funs'], function (require, ng) {
    var module = ng.module('app.service');
    module.service('checkHomeWorkSrv', ['$q', 'httpFuns', function ($q, httpFuns) {
        //console.log(httpFuns);
        var actions = {
            teacherthumbsuphomework:"SocialContact/Like/CorrectResultThumbs",// "teacherthumbsuphomework",
            gethomeworkquestionrapidcommonlist: "Product/HomeWork/Correct/Common_List",//"gethomeworkquestionrapidcommonlist",
            addresultcomment: "Product/HomeWork/Correct/ResultComment_Add",// "sumbithomeworkresultpingyu",
            deleteresultcomment: "Product/HomeWork/Correct/ResultComment_Delete",// "sumbithomeworkresultpingyu",
            //getpingyu: "Product/HomeWork/Correct/ResultComment_List",//"getpingyu",
            addsinglecomment: "Product/HomeWork/Correct/QuestionComment_Add",//"addsinglecomment",
            delsinglecomment: "Product/HomeWork/Correct/QuestionComment_Delete",//"delsinglecomment",
            promptedsubmithomework:"Product/HomeWork/HWInfo/PromptedToStudentSubmit",// "promptedsubmithomework",
            getchecklist: "Product/HomeWork/HWInfo/InTeacherArrangeList",//"huoqupigailiebiao",
            gethomeworksublog:"Product/HomeWork/HWInfo/SubmitCondition",// "gethomeworksublog",
            checkoutquestionlist:"Product/HomeWork/Correct/Checkout",// "checkoutquestionlist",
            correcthomework: "Product/HomeWork/Correct/Correct",//"correcthomework",
            gethomeworkquestionlist: "Product/HomeWork/HWInfo/HWInfo",//"gethomeworkquestionlist",
            updatesubendtime: "Product/HomeWork/HWInfo/SetHomeWorkSubEndTime",//"updatesubendtime",
            resubmitwork: "Product/HomeWork/HWInfo/ReSubmitHomeWorkToStudent",//"resubmitwork",
            gethomeworkquestioncommoncclasslist: "Product/HomeWork/Correct/CommonClass",//"gethomeworkquestioncommoncclasslist",
            gethomeworkquestioncommonlist:"Product/HomeWork/Correct/QuestionCommon_List",// "gethomeworkquestioncommonlist",
            gethomeworkresult:"Product/HomeWork/Correct/Result",// "gethomeworkresult",
            deletehomework:"Product/HomeWork/Arrangement/ArrangeCancel",// "deletehomework",
            resultcommentlist: "Product/HomeWork/Correct/ResultComment_List",// "resultcommentlist",
            sendtostudent: "Product/HomeWork/Correct/SendToStudent",
            applycorrect: "Product/HomeWork/Correct/ApplyCorrect",
            postcorrectresult: "Product/HomeWork/Correct/PostCorrectResult",

        }
        var funcs = {
            teaThumb: _teaThumb,
            getSimpleremark: _getSimpleremark,
            addResultComment: _addResultComment,
            deleteResultComment: _deleteResultComment,
            //getPingyu: _getPingyu,
            addSinglecomment: _addSinglecomment,
            delSinglecomment: _delSinglecomment,
            cuiSubmitworkpl: _cuiSubmitworkpl,
            getCheckList: _getCheckList,
            getHomeWorkSublog: _getHomeWorkSublog,
            checkOutQuestionList: _checkOutQuestionList,
            correctHomeWork: _correctHomeWork,
            getHomeWorkQuestionList: _getHomeWorkQuestionList,
            updateSubendTime: _updateSubendTime,
            reSubmitWork: _reSubmitWork,
            getHomeWorkQuestionCommoncClassList: _getHomeWorkQuestionCommoncClassList,
            getHomeWorkQuestionCommonList: _getHomeWorkQuestionCommonList,
            getHomeWorkResult: _getHomeWorkResult,
            deleteHomeWork: _deleteHomeWork,
            resultCommentList: _resultCommentList,
            sendToStudent: _sendToStudent,
            applyCorrect: _applyCorrect,
            postCorrectResult: _postCorrectResult,

        };
        return funcs;
        function _teaThumb(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.teacherthumbsuphomework, params);
        }
        function _getSimpleremark(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkquestionrapidcommonlist, params);
        }
        function _addResultComment(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.addresultcomment, params);
        }
        function _deleteResultComment(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.deleteresultcomment, params);
        }
        //function _getPingyu(params) {
        //    return httpFuns.httpPost(globalConfig.apiPath + actions.getpingyu, params);
        //}
        function _addSinglecomment(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.addsinglecomment, params);
        }
        function _delSinglecomment(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.delsinglecomment, params);
        }
        function _cuiSubmitworkpl(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.promptedsubmithomework, params);
        }
        function _getCheckList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.getchecklist, params);
        }
        function _getHomeWorkSublog(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworksublog, params);
        }
        function _checkOutQuestionList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.checkoutquestionlist, params);
        }
        function _correctHomeWork(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.correcthomework, params);
        }
        function _getHomeWorkQuestionList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkquestionlist, params);
        }
        function _updateSubendTime(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.updatesubendtime, params);
        }
        function _reSubmitWork(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.resubmitwork, params);
        }
        function _getHomeWorkQuestionCommoncClassList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkquestioncommoncclasslist, params);
        }
        function _getHomeWorkQuestionCommonList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkquestioncommonlist, params);
        }
        function _getHomeWorkResult(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.gethomeworkresult, params);
        }
        function _deleteHomeWork(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.deletehomework, params);
        }
        function _resultCommentList(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.resultcommentlist, params);
        }
        function _sendToStudent(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.sendtostudent, params);
        }
        function _applyCorrect(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.applycorrect, params);
        }
        function _postCorrectResult(params) {
            return httpFuns.httpPost(globalConfig.apiPath + actions.postcorrectresult, params);
        }

    }]);
})