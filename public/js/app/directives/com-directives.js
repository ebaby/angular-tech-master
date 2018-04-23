define(['require', 'angular'], function (require, ng) {
    var module = ng.module('app.directives');
    module.directive('uploadImg', ['$http', function ($http) {
        return {
            replace: true,
            restrict: 'A',
            scope: {
                imgOptions: "="
            },
            link: function (scope, elem, attr, ctrl) {
                var imgcontainer = $('<div id="altContent" ></div>');
                elem.append(imgcontainer);
                xiuxiu.embedSWF("altContent", 5, "90%", "100%");
                //修改为您自己的图片上传接口
                xiuxiu.setUploadURL("http://img1.yqj.cn/data/teacher_tp.ashx");//上传的接口
                xiuxiu.setUploadType(2);
                xiuxiu.setUploadDataFieldName("upload_file");
                xiuxiu.onInit = function () {
                    xiuxiu.loadPhoto($("#hidpic").val());//修改为要处理的图片url
                }
                xiuxiu.onUploadResponse = function (data) {
                    //alert("上传响应" + data); 可以开启调试
                    //alert(data);
                    scope.imgOptions.uploadImg(data);//上传图片服务器保存数据库
                }
            }
        }
    }]).directive("setRate", ["$window", function ($window) {
        return {
            scope: {
                rate: "=",
            },
            link: function (scope, element, attributes) {
                scope.$watchCollection('rate', function (newvalue, oldvalue) {
                    //if (newvalue) {
                    $(element).css("width", newvalue + "%");
                    //}

                })
            }
        }
    }]).directive("scrollData", ["$window", function ($window) {
        return {
            scope: {
                pageoptions: "=",
            },
            link: function (scope, element, attributes) {
                var winheight = $(window).height();
                $(document).bind("scroll", function () {
                    //var top = getScrollTop();
                    var top = $(document).scrollTop() + 50;



                    if (top >= $(document).height() - winheight) {
                        scope.pageoptions.scrollLoaddata();
                    }

                });
                function getScrollTop() {
                    var scrollPos;
                    if (window.pageYOffset) {
                        scrollPos = window.pageYOffset;
                    }
                    else if (document.compatMode && document.compatMode != 'BackCompat')
                    { scrollPos = document.documentElement.scrollTop; }
                    else if (document.body) { scrollPos = document.body.scrollTop; }
                    return scrollPos;
                }
            }
        }
    }]).directive("scrollLoad", ["$window", function ($window) {
        return {
            scope: {
                scrollOptions: "=",
                //container:"@",
                gotopId: "@"
            },
            link: function (scope, element, attributes) {
                var container = $(document);
                var docheight = $(window).height();
                var topObj = $("#" + scope.gotopId);



                $(window).bind("scroll", function () {
                    var top = getScrollTop();
                    //if (top > 50) {
                    //    $('#container-head').css("display", "none");
                    //    $('#container-head').fadeOut("fast");
                    //} else {
                    //    $('#container-head').fadeIn("fast");

                    //}
                    if (top > 50) {
                        $("#checkcontainer").css("top", "65px");
                        //$("#checkcontrol").css("height", (docheight - 170) + "px");
                    } else {
                        $("#checkcontainer").css("top", "120px");
                        //$("#checkcontrol").css("height", (docheight - 270) + "px");

                    }

                    if (top > 50) {
                        $("#" + scope.gotopId).show();
                    } else {
                        $("#" + scope.gotopId).hide();
                    }
                    //if (top >= container.height() - docheight) {
                    //    $("#aboutfoot").show();
                    //} else {
                    //    $("#aboutfoot").hide();
                    //}
                });
                function getScrollTop() {
                    var scrollPos;
                    if (window.pageYOffset) {
                        scrollPos = window.pageYOffset;
                    }
                    else if (document.compatMode && document.compatMode != 'BackCompat')
                    { scrollPos = document.documentElement.scrollTop; }
                    else if (document.body) { scrollPos = document.body.scrollTop; }
                    return scrollPos;
                }
                topObj.bind('click', function () {
                    $("body, html").animate({ scrollTop: 0 }, 500);
                })
            }
        }
    }]).directive('customMathjax', ['$http', function ($http) {
        return {
            scope: {
                content: "="
            },
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                scope.$watchCollection('content', function (newvalue, oldvalue) {
                    if (newvalue) {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, attr.id]);
                    }

                })
            }
        }
    }]).directive('noData', ['$http', function ($http) {
        return {
            scope: {
                datalist: "="
            },
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                scope.$watchCollection('datalist', function (newvalue, oldvalue) {
                    if (newvalue) {
                        if (newvalue.length == 0) {
                            elem.children("div").show();
                        } else {
                            elem.children("div").hide();
                        }

                    }else{
                    	elem.children("div").hide();
                    }

                })
            }
        }
    }]).directive('setPagination', ['$http', function ($http) {
        return {
            scope: {
                pageOptions: "="
            },
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                scope.$watchCollection("pageOptions.allpage", function (newvalue, oldvalue) {
                    if (newvalue > 1) {
                        $(elem).css("display", "block");
                        $(elem).pagination(newvalue, {
                            num_edge_entries: 1, //边缘页数
                            num_display_entries: 10, //主体页数
                            callback: pageselectCallback,
                            items_per_page: 1, //每页显示1项
                            prev_text: "上一页",//分页按钮上显示的文字	字符串参数，可选，默认是"Prev"
                            next_text: "下一页",
                            current_page: 0,	//当前选中的页面	可选参数，默认是0，表示第1页
                            num_edge_entries: 0,//	两侧显示的首尾分页的条目数	可选参数，默认是0
                            link_to: "&",	//分页的链接	字符串，可选参数，默认是"#"
                            ellipse_text: "...",	//省略的页数用什么文字表示	可选字符串参数，默认是"..."
                            prev_show_always: true,	//是否显示“前一页”分页按钮	布尔型，可选参数，默认为true，即显示“前一页”按钮
                            next_show_always: true
                        });
                    } else {
                        $(elem).css("display", "none");
                    }
                })

                //scope.$watchCollection('content', function (newvalue, oldvalue) {
                //    if (newvalue) {
                //        MathJax.Hub.Queue(["Typeset", MathJax.Hub, attr.id]);
                //    }

                //})
                function pageselectCallback(page_index, jq) {
                    //alert(page_index);
                    scope.pageOptions.goNextpage(page_index + 1);
                    //var new_content = $("#hiddenresult div.result:eq("+page_index+")").clone();
                    //$("#Searchresult").empty().append(new_content); //装载对应分页的内容
                    return false;
                }
            }

        }
    }]).directive('convInt', ['$http', function ($http) {//四舍五入 保留整数部分
        return {
            restrict: 'AE',
            scope: {
                floatvalue: '='
            },
            link: function (scope, elem, attrs) {
                var rootHandle = scope.$watchCollection('floatvalue', function (newvalue, oldvalue) {
                    if (newvalue) {
                        var num = new Number(newvalue);
                        var result = num == 0 ? 0 : num.toFixed(0);
                        elem.html(result);

                        rootHandle();
                    }
                })


            }
        }
    }]).directive('subPhone', ['$http', function ($http) {
        return {
            restrict: 'AE',
            scope: {
                phonevalue: '='
            },
            link: function (scope, elem, attrs) {
                var rootHandle = scope.$watchCollection('phonevalue', function (newvalue, oldvalue) {
                    if (newvalue) {
                        var arr = newvalue.toString();
                        if (arr.length > 0 && arr.length <= 11) {
                            var arry = new Array();
                            arry.push(arr.substr(0, 3));
                            arry.push("*****");
                            arry.push(arr.substring(arr.length - 3, arr.length));

                            elem.html(arry.join(''));
                        }
                        rootHandle();
                    }
                })


            }
        }
    }]).directive('subTime', ['$http', function ($http) {
        return {
            restrict: 'AE',
            scope: {
                timevalue: '='
            },
            link: function (scope, elem, attrs) {
                var rootHandle = scope.$watchCollection('timevalue', function (newvalue, oldvalue) {
                    if (newvalue) {
                        var arr = newvalue.split(' ');
                        if (arr.length > 0) {
                            elem.html(arr[0]);
                        }
                        rootHandle();
                    }
                })


                //var arr = scope.timevalue.split(' ');
                //if (arr.length > 0) {
                //    elem.html(arr[0]);
                //}

            }
        }
    }]).directive('datePicker', ['$http', function ($http) {
        return {
            restrict: 'AE',
            scope: {
                dateOption: '='
            },
            link: function (scope, elem, attrs) {
                window.pickerFun = function (dp) {
                    scope.$apply(function () {
                        scope.dateOption.setDatetime(elem.find('input').val());
                    })
                }
                scope.$watchCollection('dateOption.zydatetiem', function (newvalue, oldvalue) {
                    if (newvalue) {
                        var currDate = new Date();
                        var value = '';
                        if (scope.dateOption.zydatetiem) {
                            var zydatetiem = new Date(scope.dateOption.zydatetiem * 1000); //scope.dateOption.zydatetiem.replace(/\//g, '-')
                            value = (zydatetiem.getFullYear() + '-' + (zydatetiem.getMonth() + 1) + '-' + zydatetiem.getDate() + ' ' + zydatetiem.getHours() + ':' + zydatetiem.getMinutes() + ':' + zydatetiem.getSeconds());
                        }
                        var datetime = $('<input class="form-control wdate" style="width:170px;" type="text" readonly="readonly" onfocus="WdatePicker({startDate:\'%y-%M-01 00:00\',dateFmt:\'yyyy-MM-dd HH:mm\',isShowClear:false,isShowToday:false,alwaysUseStartDate:true,qsEnabled:false,onpicked:function(dp){pickerFun(dp)}})"  value="' + value + '" />');
                        //var datetime = $('<input class="form-control wdate" style="width:175px;" type="text" readonly="readonly" onfocus="WdatePicker({startDate:\'%y-%M-%d 23:59:59\',dateFmt:\'yyyy-MM-dd HH:mm:ss\',autoShowQS:false,autoPickDate:false,isShowClear:false,isShowToday:false,alwaysUseStartDate:true,readOnly:true,qsEnabled:false,onpicked:function(dp){pickerFun(dp)}})"  value="' + value + '" />');
                        //var datetime = $('<input class="form-control wdate" style="width:170px;" type="text" readonly="readonly" onfocus="WdatePicker({startDate:\'%y-%M-01 00:00\',dateFmt:\'yyyy-MM-dd HH:mm\',isShowClear:false,isShowToday:true,alwaysUseStartDate:true,qsEnabled:false,onpicked:function(dp){pickerFun(dp)}})"  value="' + value + '" />');
                        elem.append(datetime);
                        elem.children('input').focus();
                    }
                })

            }
        }
    }]).directive('eChart', ['$http', function ($http) {
        return {
            scope: {
                options: "="
            },
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                require([
						"echarts",
						"echarts/chart/pie",
						'echarts/chart/bar',
            			'echarts/chart/line'
                ], function (ec) {
                    //console.log(ec);
                    scope.options.loadData(ec);
                })
            }
        }
    }]).directive('slimscroll', ['$timeout', '$window', function ($timeout, $window) {
        'use strict';

        return {
            restrict: 'A',
            link: function ($scope, $elem, $attr) {
                var off = [];
                var option = {};

                var refresh = function () {
                    $timeout(function () {
                        if (angular.isDefined($attr.slimscroll)) {
                            option = $scope.$eval($attr.slimscroll) || {};
                        } else if ($attr.slimscrollOption) {
                            option = $scope.$eval($attr.slimscrollOption) || {};
                        }

                        var el = angular.element($elem);

                        el.slimScroll({ destroy: true });
                        el.slimScroll(option);
                    });
                };

                angular.element($window).bind('resize', function () {
                    if ($attr.slimscroll) {
                        option = $scope.$eval($attr.slimscroll);
                    } else if ($attr.slimscrollOption) {
                        option = $scope.$eval($attr.slimscrollOption);
                    }

                    $($elem).slimScroll(option);
                });

                var registerWatch = function () {
                    if (angular.isDefined($attr.slimscroll) && !option.noWatch) {
                        off.push($scope.$watchCollection($attr.slimscroll, refresh));
                    }

                    if ($attr.slimscrollWatch) {
                        off.push($scope.$watchCollection($attr.slimscrollWatch, refresh));
                    }

                    if ($attr.slimscrolllistento) {
                        off.push($scope.$on($attr.slimscrolllistento, refresh));
                    }
                };

                var destructor = function () {
                    angular.element($elem).slimScroll({ destroy: true });
                    off.forEach(function (unbind) {
                        unbind();
                    });
                    off = null;
                };

                off.push($scope.$on('$destroy', destructor));

                registerWatch();
            }
        };
    }]).directive("hover", ['$http', function () {//鼠标悬停更改样式
        return {
            restrict: 'A',
            //scope: {
            //    classvalue: '='
            //},
            link: function (scope, ele, attrs) {
                ele.bind('mouseover', function () {
                    ele.toggleClass('border-green');
                });
                ele.bind('mouseout', function () {
                    ele.toggleClass('border-green');
                });
            }
        }
    }]).directive('goTotop', ['$http', function ($http) {
        return {

            restrict: 'E',
            replace: true,
            scope: {
                minHeight: '@'
            },
            //templateUrl : 'tmpl.html',
            link: function (scope, elem, attrs) {
                console.log(88)
                elem.click(function () {
                    jQuery('html,body').animate({ scrollTop: 0 }, 700);
                })
                .hover(function () {
                    jQuery(this).addClass("hover");
                }, function () {
                    jQuery(this).removeClass("hover");
                });

                scope.minHeight = scope.minHeight ? scope.minHeight : 600;
                jQuery(window).scroll(function () {
                    var s = jQuery(window).scrollTop();
                    if (s > scope.minHeight) {
                        jQuery("#gotoTop").fadeIn(100);
                    } else {
                        jQuery("#gotoTop").fadeOut(200);
                    };
                });
            }
        }
    }]).directive('chartLength', ['$http', function ($http) {
        return {
            scope: {
                chartauto: "=",
                length: "=",
                content: "="
            },
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                scope.$watchCollection('content', function (newvalue, oldvalue) {
                    var devWidth = $(window).width();
                    var content = elem.html();
                    var str = "";
                    if (scope.chartauto && devWidth <= 320) {
                        scope.length = scope.length - 4;
                    } else if (scope.chartauto && devWidth > 320 && scope.chartauto && devWidth <= 360) {
                        scope.length = scope.length - 1;
                    }
                    if (content) {
                        var _len = 0;
                        for (var i = 0, len = content.length; i < len; i++) {
                            str = str + content[i];
                            if (content.charCodeAt(i) > 255) {
                                _len = _len + 1;
                            } else {
                                _len = _len + 0.5;
                            }
                            if (parseInt(_len) >= scope.length) break;
                        }
                        if (str.length != content.length) {
                            str = str + "...";
                        }
                        elem.html(str);
                    }
                })
            }
        }
    }]).directive('pcImg', ['$http', function ($http) {
        return {
            restrict: 'AE',
            replace: false,
            scope: {
                imgoptions:"="
            },
            link: function (scope, elem, attrs) {
                scope.$watchCollection('imgoptions',function(newvalue,oldvalue){
                    if(newvalue){
                        var _width = newvalue.picsrcwidth*newvalue.width;
                        var _height = newvalue.picsrcheight * newvalue.height;
                        if (newvalue.usabled) {
                            $(elem).parent().width(parseInt(_width));
                        }
                        $(elem).parent().height(parseInt(_height));
                        $(elem).parent().show();
                        $(elem).width(parseInt(_width));
                        $(elem).height(parseInt(_height));
                        $(".note-ywrong-imgup").css("left",_width+"px");
                        loadImg($(elem));
                    }
                    function loadImg(viewerhandle){
                        viewerhandle.iviewer({
                            zoom_min:55,
                            zoom:100,
                            src: scope.imgoptions.picsource,
                            onFinishLoad:function(){   
                                scope.iviewer.setCoords(-(scope.imgoptions.picsrcheight * scope.imgoptions.left), -(scope.imgoptions.picsrcwidth * scope.imgoptions.top));
                            },
                            initCallback: function(){
                                scope.iviewer = this;
                            }
                        });
                        
                    }
                })
            }
        }
    }]).directive('playerForm', ['$http', function ($http) {
        return {
            restrict: 'AE',
            scope: {
                playerOptions: "="
            },
            link: function (scope, elem, attrs) {
                scope.$watchCollection('playerOptions.vid', function (newvalue, oldvalue) {
                    if (newvalue) {
                        console.log(scope.playerOptions);
                        initPlayer();
                    }
                })
                scope.playerOptions.controlPanel = function (isopen) {
                    var width = scope.playerOptions.minwidth;
                    //if (!isopen) {
                    //    width = scope.playerOptions.maxwidth;
                    //}
                    $(scope.playerOptions.pcontainer).width(width);
                    $($(scope.playerOptions.container).children().get(0)).width(width);
                }

                function initPlayer() {
                    scope.playerOptions.playerhandle = polyvObject(scope.playerOptions.container).videoPlayer({
                        'width': $(scope.playerOptions.container).width(),
                        'height': $(scope.playerOptions.container).height(),
                        'vid': scope.playerOptions.vid,
                        'df': '1'
                    });

                }
            }
        }
    }])
    ;
});