﻿(function(D,C){if(typeof module!=="undefined"&&module.exports){if(typeof angular==="undefined"){C(require("angular"))}else{C(angular)}module.exports="ngDialog"}else{if(typeof define==="function"&&define.amd){define(["angular"],C)}else{C(D.angular)}}}(this,function(a){var S=a.module("ngDialog",[]);var R=a.element;var b=a.isDefined;var Q=(document.body||document.documentElement).style;var P=b(Q.animation)||b(Q.WebkitAnimation)||b(Q.MozAnimation)||b(Q.MsAnimation)||b(Q.OAnimation);var Z="animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend";var T="a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";var U="ngdialog-disabled-animation";var X={html:false,body:false};var O={};var V=[];var W=false;var Y=false;S.provider("ngDialog",function(){var C=this.defaults={className:"ngdialog-theme-default",appendClassName:"",disableAnimation:false,plain:false,showClose:true,closeByDocument:true,closeByEscape:true,closeByNavigation:false,appendTo:false,preCloseCallback:false,overlay:true,cache:true,trapFocus:true,preserveFocus:true,ariaAuto:true,ariaRole:null,ariaLabelledById:null,ariaLabelledBySelector:null,ariaDescribedById:null,ariaDescribedBySelector:null,bodyClassName:"ngdialog-open",width:null};this.setForceHtmlReload=function(F){X.html=F||false};this.setForceBodyReload=function(F){X.body=F||false};this.setDefaults=function(F){a.extend(C,F)};this.setOpenOnePerName=function(F){Y=F||false};var D=0,B=0,E,A={};this.$get=["$document","$templateCache","$compile","$q","$http","$rootScope","$timeout","$window","$controller","$injector",function(I,i,M,F,L,g,j,h,K,H){var G=[];var J={onDocumentKeydown:function(c){if(c.keyCode===27){N.close("$escape")}},activate:function(c){var d=c.data("$ngDialogOptions");if(d.trapFocus){c.on("keydown",J.onTrapFocusKeydown);G.body.on("keydown",J.onTrapFocusKeydown)}},deactivate:function(c){c.off("keydown",J.onTrapFocusKeydown);G.body.off("keydown",J.onTrapFocusKeydown)},deactivateAll:function(c){a.forEach(c,function(d){var e=a.element(d);J.deactivate(e)})},setBodyPadding:function(c){var d=parseInt((G.body.css("padding-right")||0),10);G.body.css("padding-right",(d+c)+"px");G.body.data("ng-dialog-original-padding",d);g.$broadcast("ngDialog.setPadding",c)},resetBodyPadding:function(){var c=G.body.data("ng-dialog-original-padding");if(c){G.body.css("padding-right",c+"px")}else{G.body.css("padding-right","")}g.$broadcast("ngDialog.setPadding",0)},performCloseDialog:function(c,f){var p=c.data("$ngDialogOptions");var n=c.attr("id");var d=O[n];if(!d){return}if(typeof h.Hammer!=="undefined"){var e=d.hammerTime;e.off("tap",E);e.destroy&&e.destroy();delete d.hammerTime}else{c.unbind("click")}if(B===1){G.body.unbind("keydown",J.onDocumentKeydown)}if(!c.hasClass("ngdialog-closing")){B-=1}var o=c.data("$ngDialogPreviousFocus");if(o&&o.focus){o.focus()}g.$broadcast("ngDialog.closing",c,f);B=B<0?0:B;if(P&&!p.disableAnimation){d.$destroy();c.unbind(Z).bind(Z,function(){J.closeDialogElement(c,f)}).addClass("ngdialog-closing")}else{d.$destroy();J.closeDialogElement(c,f)}if(A[n]){A[n].resolve({id:n,value:f,$dialog:c,remainingDialogs:B});delete A[n]}if(O[n]){delete O[n]}V.splice(V.indexOf(n),1);if(!V.length){G.body.unbind("keydown",J.onDocumentKeydown);W=false}},closeDialogElement:function(c,d){var e=c.data("$ngDialogOptions");c.remove();if(B===0){G.html.removeClass(e.bodyClassName);G.body.removeClass(e.bodyClassName);J.resetBodyPadding()}g.$broadcast("ngDialog.closed",c,d)},closeDialog:function(c,d){var f=c.data("$ngDialogPreCloseCallback");if(f&&a.isFunction(f)){var e=f.call(c,d);if(a.isObject(e)){if(e.closePromise){e.closePromise.then(function(){J.performCloseDialog(c,d)})}else{e.then(function(){J.performCloseDialog(c,d)},function(){return})}}else{if(e!==false){J.performCloseDialog(c,d)}}}else{J.performCloseDialog(c,d)}},onTrapFocusKeydown:function(l){var c=a.element(l.currentTarget);var f;if(c.hasClass("ngdialog")){f=c}else{f=J.getActiveDialog();if(f===null){return}}var d=(l.keyCode===9);var e=(l.shiftKey===true);if(d){J.handleTab(f,l,e)}},handleTab:function(d,q,e){var s=J.getFocusableElements(d);if(s.length===0){if(document.activeElement){document.activeElement.blur()}return}var f=document.activeElement;var c=Array.prototype.indexOf.call(s,f);var v=(c===-1);var r=(c===0);var t=(c===s.length-1);var u=false;if(e){if(v||r){s[s.length-1].focus();u=true}}else{if(v||t){s[0].focus();u=true}}if(u){q.preventDefault();q.stopPropagation()}},autoFocus:function(c){var n=c[0];var d=n.querySelector("*[autofocus]");if(d!==null){d.focus();if(document.activeElement===d){return}}var m=J.getFocusableElements(c);if(m.length>0){m[0].focus();return}var e=J.filterVisibleElements(n.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span"));if(e.length>0){var f=e[0];R(f).attr("tabindex","-1").css("outline","0");f.focus()}},getFocusableElements:function(c){var d=c[0];var f=d.querySelectorAll(T);var e=J.filterTabbableElements(f);return J.filterVisibleElements(e)},filterTabbableElements:function(f){var e=[];for(var c=0;c<f.length;c++){var d=f[c];if(R(d).attr("tabindex")!=="-1"){e.push(d)}}return e},filterVisibleElements:function(f){var e=[];for(var c=0;c<f.length;c++){var d=f[c];if(d.offsetWidth>0||d.offsetHeight>0){e.push(d)}}return e},getActiveDialog:function(){var c=document.querySelectorAll(".ngdialog");if(c.length===0){return null}return R(c[c.length-1])},applyAriaAttributes:function(c,d){if(d.ariaAuto){if(!d.ariaRole){var e=(J.getFocusableElements(c).length>0)?"dialog":"alertdialog";d.ariaRole=e}if(!d.ariaLabelledBySelector){d.ariaLabelledBySelector="h1,h2,h3,h4,h5,h6"}if(!d.ariaDescribedBySelector){d.ariaDescribedBySelector="article,section,p"}}if(d.ariaRole){c.attr("role",d.ariaRole)}J.applyAriaAttribute(c,"aria-labelledby",d.ariaLabelledById,d.ariaLabelledBySelector);J.applyAriaAttribute(c,"aria-describedby",d.ariaDescribedById,d.ariaDescribedBySelector)},applyAriaAttribute:function(c,n,p,o){if(p){c.attr(n,p)}if(o){var f=c.attr("id");var d=c[0].querySelector(o);if(!d){return}var e=f+"-"+n;R(d).attr("id",e);c.attr(n,e);return e}},detectUIRouter:function(){try{a.module("ui.router");return true}catch(c){return false}},getRouterLocationEventName:function(){if(J.detectUIRouter()){return"$stateChangeSuccess"}return"$locationChangeSuccess"}};var N={__PRIVATE__:J,open:function(w){var x=null;w=w||{};if(Y&&w.name){x=w.name+" dialog";if(this.isOpen(x)){return}}var t=a.copy(C);var d=++D;x=x||"ngdialog"+d;V.push(x);if(typeof t.data!=="undefined"){if(typeof w.data==="undefined"){w.data={}}w.data=a.merge(a.copy(t.data),w.data)}a.extend(t,w);var v;A[x]=v=F.defer();var s;O[x]=s=a.isObject(t.scope)?t.scope.$new():g.$new();var e,c;var u=a.extend({},t.resolve);a.forEach(u,function(l,k){u[k]=a.isString(l)?H.get(l):H.invoke(l,null,null,k)});F.all({template:r(t.template||t.templateUrl),locals:F.all(u)}).then(function(n){var l=n.template,Af=n.locals;if(t.showClose){l+='<div class="ngdialog-close"></div>'}var k=t.overlay?"":" ngdialog-no-overlay";e=R('<div id="'+x+'" class="ngdialog'+k+'"></div>');e.html((t.overlay?'<div class="ngdialog-overlay"></div><div class="ngdialog-content" role="document">'+l+"</div>":'<div class="ngdialog-content" role="document">'+l+"</div>"));e.data("$ngDialogOptions",t);s.ngDialogId=x;if(t.data&&a.isString(t.data)){var Ac=t.data.replace(/^\s*/,"")[0];s.ngDialogData=(Ac==="{"||Ac==="[")?a.fromJson(t.data):new String(t.data);s.ngDialogData.ngDialogId=x}else{if(t.data&&a.isObject(t.data)){s.ngDialogData=t.data;s.ngDialogData.ngDialogId=x}}if(t.className){e.addClass(t.className)}if(t.appendClassName){e.addClass(t.appendClassName)}if(t.width){var p=e[0].querySelector(".ngdialog-content");if(a.isString(t.width)){p.style.width=t.width}else{p.style.width=t.width+"px"}}if(t.disableAnimation){e.addClass(U)}if(t.appendTo&&a.isString(t.appendTo)){c=a.element(document.querySelector(t.appendTo))}else{c=G.body}J.applyAriaAttributes(e,t);if(t.preCloseCallback){var Ae;if(a.isFunction(t.preCloseCallback)){Ae=t.preCloseCallback}else{if(a.isString(t.preCloseCallback)){if(s){if(a.isFunction(s[t.preCloseCallback])){Ae=s[t.preCloseCallback]}else{if(s.$parent&&a.isFunction(s.$parent[t.preCloseCallback])){Ae=s.$parent[t.preCloseCallback]}else{if(g&&a.isFunction(g[t.preCloseCallback])){Ae=g[t.preCloseCallback]}}}}}}if(Ae){e.data("$ngDialogPreCloseCallback",Ae)}}s.closeThisDialog=function(y){J.closeDialog(e,y)};if(t.controller&&(a.isString(t.controller)||a.isArray(t.controller)||a.isFunction(t.controller))){var Ad;if(t.controllerAs&&a.isString(t.controllerAs)){Ad=t.controllerAs}var q=K(t.controller,a.extend(Af,{$scope:s,$element:e}),true,Ad);if(t.bindToController){a.extend(q.instance,{ngDialogId:s.ngDialogId,ngDialogData:s.ngDialogData,closeThisDialog:s.closeThisDialog})}e.data("$ngDialogControllerController",q())}j(function(){var y=document.querySelectorAll(".ngdialog");J.deactivateAll(y);M(e)(s);var Aa=h.innerWidth-G.body.prop("clientWidth");G.html.addClass(t.bodyClassName);G.body.addClass(t.bodyClassName);var z=Aa-(h.innerWidth-G.body.prop("clientWidth"));if(z>0){J.setBodyPadding(z)}c.append(e);J.activate(e);if(t.trapFocus){J.autoFocus(e)}if(t.name){g.$broadcast("ngDialog.opened",{dialog:e,name:t.name})}else{g.$broadcast("ngDialog.opened",e)}});if(!W){G.body.bind("keydown",J.onDocumentKeydown);W=true}if(t.closeByNavigation){var o=J.getRouterLocationEventName();g.$on(o,function(){J.closeDialog(e)})}if(t.preserveFocus){e.data("$ngDialogPreviousFocus",document.activeElement)}E=function(y){var z=t.closeByDocument?R(y.target).hasClass("ngdialog-overlay"):false;var Aa=R(y.target).hasClass("ngdialog-close");if(z||Aa){N.close(e.attr("id"),Aa?"$closeButton":"$document")}};if(typeof h.Hammer!=="undefined"){var m=s.hammerTime=h.Hammer(e[0]);m.on("tap",E)}else{e.bind("click",E)}B+=1;return N});return{id:x,closePromise:v.promise,close:function(k){J.closeDialog(e,k)}};function f(l,k){g.$broadcast("ngDialog.templateLoading",l);return L.get(l,(k||{})).then(function(m){g.$broadcast("ngDialog.templateLoaded",l);return m.data||""})}function r(k){if(!k){return"Empty template"}if(a.isString(k)&&t.plain){return k}if(typeof t.cache==="boolean"&&!t.cache){return f(k,{cache:false})}return f(k,{cache:i})}},openConfirm:function(c){var f=F.defer();var d=a.copy(C);c=c||{};if(typeof d.data!=="undefined"){if(typeof c.data==="undefined"){c.data={}}c.data=a.merge(a.copy(d.data),c.data)}a.extend(d,c);d.scope=a.isObject(d.scope)?d.scope.$new():g.$new();d.scope.confirm=function(m){f.resolve(m);var n=R(document.getElementById(e.id));J.performCloseDialog(n,m)};var e=N.open(d);if(e){e.closePromise.then(function(l){if(l){return f.reject(l.value)}return f.reject()});return f.promise}},isOpen:function(c){var d=R(document.getElementById(c));return d.length>0},close:function(f,d){var c=R(document.getElementById(f));if(c.length){J.closeDialog(c,d)}else{if(f==="$escape"){var e=V[V.length-1];c=R(document.getElementById(e));if(c.data("$ngDialogOptions").closeByEscape){J.closeDialog(c,"$escape")}}else{N.closeAll(d)}}return N},closeAll:function(e){var c=document.querySelectorAll(".ngdialog");for(var d=c.length-1;d>=0;d--){var f=c[d];J.closeDialog(R(f),e)}},getOpenDialogs:function(){return V},getDefaults:function(){return C}};a.forEach(["html","body"],function(c){G[c]=I.find(c);if(X[c]){var d=J.getRouterLocationEventName();g.$on(d,function(){G[c]=I.find(c)})}});return N}]});S.directive("ngDialog",["ngDialog",function(A){return{restrict:"A",scope:{ngDialogScope:"="},link:function(B,D,C){D.on("click",function(E){E.preventDefault();var F=a.isDefined(B.ngDialogScope)?B.ngDialogScope:"noScope";a.isDefined(C.ngDialogClosePrevious)&&A.close(C.ngDialogClosePrevious);var G=A.getDefaults();A.open({template:C.ngDialog,className:C.ngDialogClass||G.className,appendClassName:C.ngDialogAppendClass,controller:C.ngDialogController,controllerAs:C.ngDialogControllerAs,bindToController:C.ngDialogBindToController,scope:F,data:C.ngDialogData,showClose:C.ngDialogShowClose==="false"?false:(C.ngDialogShowClose==="true"?true:G.showClose),closeByDocument:C.ngDialogCloseByDocument==="false"?false:(C.ngDialogCloseByDocument==="true"?true:G.closeByDocument),closeByEscape:C.ngDialogCloseByEscape==="false"?false:(C.ngDialogCloseByEscape==="true"?true:G.closeByEscape),overlay:C.ngDialogOverlay==="false"?false:(C.ngDialogOverlay==="true"?true:G.overlay),preCloseCallback:C.ngDialogPreCloseCallback||G.preCloseCallback,bodyClassName:C.ngDialogBodyClass||G.bodyClassName})})}}}]);return S}));