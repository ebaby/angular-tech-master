define(['require','angular','utils/http-funs'],function(require,ng){
	var module = ng.module('app.service');
	module.service('userinfoSrv', ['$q', 'httpFuns', function ($q, httpFuns) {
	    //console.log(httpFuns);
	    var actions = {
	        getprovince: "BasicData/Region/ProvinceList",//"getprovince",
	        getcity: "BasicData/Region/CityList",//"getcity",
	        getcounty: "BasicData/Region/CountyList",//"getcounty",
	        getschool: "BasicData/School/SchoolList",// "getschool",
	        setteacherpassword: "Account/User/ATeacher/TInfo/SetPassword",//"setteacherpassword",
	        savebaseinfo: "Account/User/ATeacher/TInfo/SetBase",//"setteacherinfobase",
	        saveteachinfo: "Account/User/ATeacher/TInfo/SetInfo_Tea",//"setteachertaught",
	        getsubjectlist: "BasicData/Subject/SubjectList",//"setteachertaught",
	        teachauth: "saveteachinfo",
	        emailauth: "saveteachinfo",
	        phoneauth: "saveteachinfo",
	        setteacherpic: "Account/User/ATeacher/TInfo/SetHeadPicUseWeChat",//"setteacherpic",
	        getteacherintegral: "Account/Integral/ITeacher/IntegralDetail",//"getteacherintegral",
	        getteacherintegralbuyproductlist: "Account/Integral/ITeacher/ExchangeLog",//"getteacherintegralbuyproductlist",
	        getteacherintegralcanbuyproductlist: "Account/Integral/ProductList",//"getteacherintegralcanbuyproductlist",
	        teacherbuyintegralproduct: "Account/Integral/Exchange",//"teacherbuyintegralproduct",
	    }
	    var funcs = {
	        getProvince: _getProvince,
	        getCity: _getCity,
	        getCounty: _getCounty,
	        getSchool: _getSchool,
	        setTeacherPassword: _setTeacherPassword,
	        saveBaseInfo: _saveBaseInfo,
	        saveTeachInfo: _saveTeachInfo,
	        getSubjectList: _getSubjectList,
	        teachAuth: _teachAuth,
	        emailAuth: _emailAuth,
	        phoneAuth: _phoneAuth,
	        setTeacherPic: _setTeacherPic,
	        getTeacherIntegral: _getTeacherIntegral,
	        getTeacherIntegralBuyProductList: _getTeacherIntegralBuyProductList,
	        getTeacherIntegralCanBuyProductList: _getTeacherIntegralCanBuyProductList,
	        teacherBuyIntegralProduct: _teacherBuyIntegralProduct,
	        uploadImage: _uploadImage,
	    };
	    return funcs;
	    function _getProvince(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.getprovince, params);
	    }
	    function _getCity(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.getcity, params);
	    }
	    function _getCounty(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.getcounty, params);
	    }
	    function _getSchool(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.getschool, params);
	    }
	    function _setTeacherPassword(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.setteacherpassword, params);
	    }
	    function _saveBaseInfo(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.savebaseinfo, params);
	    }
	    function _saveTeachInfo(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.saveteachinfo, params);
	    }
	    function _getSubjectList(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.getsubjectlist, params);
	    }
	    function _teachAuth(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.teachauth, params);
	    }
	    function _emailAuth(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.emailauth, params);
	    }
	    function _phoneAuth(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.phoneauth, params);
	    }
	    function _setTeacherPic(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.setteacherpic, params);
	    }
	    function _getTeacherIntegral(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.getteacherintegral, params);
	    }
	    function _getTeacherIntegralBuyProductList(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.getteacherintegralbuyproductlist, params);
	    }
	    function _getTeacherIntegralCanBuyProductList(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.getteacherintegralcanbuyproductlist, params);
	    }
	    function _teacherBuyIntegralProduct(params) {
	        return httpFuns.httpPost(globalConfig.apiPath + actions.teacherbuyintegralproduct, params);
	    }
	    function _uploadImage(params) {
	        return httpFuns.httpPost(globalConfig.uploadPath, params);
	    }

	}]);
})