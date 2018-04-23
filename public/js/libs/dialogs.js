﻿(function(){var F=angular.module("translate.sub",[]);F.provider("$translate",[function(){var A=[];var B="en-US";this.translations=function(H,C){if(angular.isDefined(H)&&angular.isDefined(C)){A[H]=angular.copy(C);B=H}};this.$get=[function(){return{instant:function(C){if(angular.isDefined(C)&&angular.isDefined(A[B][C])){return A[B][C]}else{return""}}}}]}]);F.filter("translate",["$translate",function(A){return function(B){return A.instant(B)}}]);var D;try{angular.module("pascalprecht.translate");D=angular.module("dialogs.controllers",["ui.bootstrap.modal","pascalprecht.translate"])}catch(E){D=angular.module("dialogs.controllers",["ui.bootstrap.modal","translate.sub"])}D.controller("errorDialogCtrl",["$scope","$uibModalInstance","$translate","data",function(A,C,B,H){A.header=(angular.isDefined(H.header))?H.header:B.instant("DIALOGS_ERROR");A.msg=(angular.isDefined(H.msg))?H.msg:B.instant("DIALOGS_ERROR_MSG");A.icon=(angular.isDefined(H.fa)&&angular.equals(H.fa,true))?"fa fa-warning":"glyphicon glyphicon-warning-sign";A.close=function(){C.close();A.$destroy()}}]);D.controller("waitDialogCtrl",["$scope","$uibModalInstance","$translate","$timeout","data",function(A,C,B,I,J){A.header=(angular.isDefined(J.header))?J.header:B.instant("DIALOGS_PLEASE_WAIT_ELIPS");A.msg=(angular.isDefined(J.msg))?J.msg:B.instant("DIALOGS_PLEASE_WAIT_MSG");A.progress=(angular.isDefined(J.progress))?J.progress:100;A.icon=(angular.isDefined(J.fa)&&angular.equals(J.fa,true))?"fa fa-clock-o":"glyphicon glyphicon-time";A.$on("dialogs.wait.complete",function(){I(function(){C.close();A.$destroy()})});A.$on("dialogs.wait.message",function(G,H){A.msg=(angular.isDefined(H.msg))?H.msg:A.msg});A.$on("dialogs.wait.progress",function(G,H){A.msg=(angular.isDefined(H.msg))?H.msg:A.msg;A.progress=(angular.isDefined(H.progress))?H.progress:A.progress});A.getProgress=function(){return{"width":A.progress+"%"}}}]);D.controller("notifyDialogCtrl",["$scope","$uibModalInstance","$translate","data",function(A,C,B,H){A.header=(angular.isDefined(H.header))?H.header:B.instant("DIALOGS_NOTIFICATION");A.msg=(angular.isDefined(H.msg))?H.msg:B.instant("DIALOGS_NOTIFICATION_MSG");A.icon=(angular.isDefined(H.fa)&&angular.equals(H.fa,true))?"fa fa-info":"glyphicon glyphicon-info-sign";A.close=function(){C.close();A.$destroy()}}]);D.controller("confirmDialogCtrl",["$scope","$uibModalInstance","$translate","data",function(A,C,B,H){A.header=(angular.isDefined(H.header))?H.header:B.instant("DIALOGS_CONFIRMATION");A.msg=(angular.isDefined(H.msg))?H.msg:B.instant("DIALOGS_CONFIRMATION_MSG");A.icon=(angular.isDefined(H.fa)&&angular.equals(H.fa,true))?"fa fa-check":"glyphicon glyphicon-check";A.no=function(){C.dismiss("no")};A.yes=function(){C.close("yes")}}]);angular.module("dialogs.services",["ui.bootstrap.modal","dialogs.controllers"]).provider("dialogs",[function(){var O=true;var Q=true;var T="dialogs-default";var A="dialogs-backdrop-default";var N=true;var C=null;var R="lg";var P=false;var B=false;var S=function(H){var G={};H=H||{};G.kb=(angular.isDefined(H.keyboard))?!!H.keyboard:Q;G.bd=(angular.isDefined(H.backdrop))?H.backdrop:O;G.bdc=(angular.isDefined(H.backdropClass))?H.backdropClass:A;G.ws=(angular.isDefined(H.size)&&((H.size==="sm")||(H.size==="lg")||(H.size==="md")))?H.size:R;G.wc=(angular.isDefined(H.windowClass))?H.windowClass:T;G.anim=(angular.isDefined(H.animation))?!!H.animation:P;return G};this.useBackdrop=function(G){if(angular.isDefined(G)){O=G}};this.useEscClose=function(G){if(angular.isDefined(G)){Q=(!angular.equals(G,0)&&!angular.equals(G,"false")&&!angular.equals(G,"no")&&!angular.equals(G,null)&&!angular.equals(G,false))?true:false}};this.useClass=function(G){if(angular.isDefined(G)){T=G}};this.useCopy=function(G){if(angular.isDefined(G)){N=(!angular.equals(G,0)&&!angular.equals(G,"false")&&!angular.equals(G,"no")&&!angular.equals(G,null)&&!angular.equals(G,false))?true:false}};this.setWindowTmpl=function(G){if(angular.isDefined(G)){C=G}};this.setSize=function(G){if(angular.isDefined(G)){R=(angular.equals(G,"sm")||angular.equals(G,"lg")||angular.equals(G,"md"))?G:R}};this.useAnimation=function(){P=true};this.useFontAwesome=function(){B=true};this.$get=["$uibModal",function(G){return{error:function(I,J,H){H=S(H);return G.open({templateUrl:"/dialogs/error.html",controller:"errorDialogCtrl",backdrop:H.bd,backdropClass:H.bdc,keyboard:H.kb,windowClass:H.wc,size:H.ws,animation:H.anim,resolve:{data:function(){return{header:angular.copy(I),msg:angular.copy(J),fa:B}}}})},wait:function(K,H,J,I){I=S(I);return G.open({templateUrl:"/dialogs/wait.html",controller:"waitDialogCtrl",backdrop:I.bd,backdropClass:I.bdc,keyboard:I.kb,windowClass:I.wc,size:I.ws,animation:I.anim,resolve:{data:function(){return{header:angular.copy(K),msg:angular.copy(H),progress:angular.copy(J),fa:B}}}})},notify:function(I,J,H){H=S(H);return G.open({templateUrl:"/dialogs/notify.html",controller:"notifyDialogCtrl",backdrop:H.bd,backdropClass:H.bdc,keyboard:H.kb,windowClass:H.wc,size:H.ws,animation:H.anim,resolve:{data:function(){return{header:angular.copy(I),msg:angular.copy(J),fa:B}}}})},confirm:function(I,J,H){H=S(H);return G.open({templateUrl:"/dialogs/confirm.html",controller:"confirmDialogCtrl",backdrop:H.bd,backdropClass:H.bdc,keyboard:H.kb,windowClass:H.wc,size:H.ws,animation:H.anim,resolve:{data:function(){return{header:angular.copy(I),msg:angular.copy(J),fa:B}}}})},create:function(K,J,M,L,I){var H=(L&&angular.isDefined(L.copy))?L.copy:N;L=S(L);return G.open({templateUrl:K,controller:J,controllerAs:I,keyboard:L.kb,backdrop:L.bd,backdropClass:L.bdc,windowClass:L.wc,size:L.ws,animation:L.anim,resolve:{data:function(){if(H){return angular.copy(M)}else{return M}}}})}}}]}]);angular.module("dialogs.main",["dialogs.services","ngSanitize"]).config(["$translateProvider","dialogsProvider",function(C,N){try{angular.module("pascalprecht.translate")}catch(M){C.translations("en-US",{DIALOGS_ERROR:"Error",DIALOGS_ERROR_MSG:"An unknown error has occurred.",DIALOGS_CLOSE:"Close",DIALOGS_PLEASE_WAIT:"Please Wait",DIALOGS_PLEASE_WAIT_ELIPS:"Please Wait...",DIALOGS_PLEASE_WAIT_MSG:"Waiting on operation to complete.",DIALOGS_PERCENT_COMPLETE:"% Complete",DIALOGS_NOTIFICATION:"Notification",DIALOGS_NOTIFICATION_MSG:"Unknown application notification.",DIALOGS_CONFIRMATION:"Confirmation",DIALOGS_CONFIRMATION_MSG:"Confirmation required.",DIALOGS_OK:"OK",DIALOGS_YES:"Yes",DIALOGS_NO:"No"})}try{var O=document.styleSheets;sheetLoop:for(var B=(O.length-1);B>=0;B--){var L=null;var A=null;if(!O[B].disabled){if(O[B].href!==null){L=O[B].href.match(/font\-*awesome/i)}if(angular.isArray(L)){N.useFontAwesome();break}else{A=O[B].cssRules;for(var P=(A.length-1);P>=0;P--){if(typeof(A[P].selectorText)==="string"&&A[P].selectorText.toLowerCase()===".fa"){N.useFontAwesome();break sheetLoop}}}}}}catch(M){}}]).run(["$templateCache","$interpolate",function(C,H){var A=H.startSymbol();var B=H.endSymbol();C.put("/dialogs/error.html",'<div class="modal-header dialog-header-error"><button type="button" class="close" ng-click="close()">&times;</button><h4 class="modal-title text-danger"><span class="'+A+"icon"+B+'"></span> <span ng-bind-html="header"></span></h4></div><div class="modal-body text-danger" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="close()">'+A+'"DIALOGS_CLOSE" | translate'+B+"</button></div>");C.put("/dialogs/wait.html",'<div class="modal-header dialog-header-wait"><h4 class="modal-title"><span class="'+A+"icon"+B+'"></span> '+A+"header"+B+'</h4></div><div class="modal-body"><p ng-bind-html="msg"></p><div class="progress progress-striped active"><div class="progress-bar progress-bar-info" ng-style="getProgress()"></div><span class="sr-only">'+A+"progress"+B+""+A+'"DIALOGS_PERCENT_COMPLETE" | translate'+B+"</span></div></div>");C.put("/dialogs/notify.html",'<div class="modal-header dialog-header-notify"><button type="button" class="close" ng-click="close()" class="pull-right">&times;</button><h4 class="modal-title text-info"><span class="'+A+"icon"+B+'"></span> '+A+"header"+B+'</h4></div><div class="modal-body text-info" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="close()">'+A+'"DIALOGS_OK" | translate'+B+"</button></div>");C.put("/dialogs/confirm.html",'<div class="modal-header dialog-header-confirm"><button type="button" class="close" ng-click="no()">&times;</button><h4 class="modal-title"><span class="'+A+"icon"+B+'"></span> '+A+"header"+B+'</h4></div><div class="modal-body" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="yes()">'+A+'"DIALOGS_YES" | translate'+B+'</button><button type="button" class="btn btn-primary" ng-click="no()">'+A+'"DIALOGS_NO" | translate'+B+"</button></div>")}])})();