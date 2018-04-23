define([require, angular], function (require, angular) {
    var funcs = {
        sureDialog: _sureDialog,
        getScore: _getScore,
        convertKeysToCamelCase: _convertKeysToCamelCase,
        dataURLtoBlob: _dataURLtoBlob,
        getCommentList: _getCommentList,
        getSingleCommentCategoryList: _getSingleCommentCategoryList,
        getSingleCommentChildrenList: _getSingleCommentChildrenList,
    }
    var lowerCache = {};
    return funcs;
    function _sureDialog() {

    }
    function _getScore(maxscore, answervalue) {
        var score = 0;
        var maxscore = parseInt(maxscore);
        if (answervalue == 1) {
            score = maxscore;
        } else if (answervalue == 2) {
            score = parseInt(maxscore / 2);
        } else if (answervalue == 3) {
            score = 0;
        }
        return score;
    }

    function _convertKeysToCamelCase(obj) {
        if (typeof (obj) === "string" || typeof (obj) === "number")
            return obj;

        if (Object.prototype.toString.call(obj) === '[object Array]' && obj.length == 0)
            return obj;

        var l = obj.length;
        if (l) {
            l |= 0;
            var result = [];
            result.length = l;
            for (var i = 0; i < l; i++) {
                var newVal = obj[i];
                result[i] = typeof (newVal) === "string" ? newVal : _convertKeysToCamelCase(newVal);
            }
            return result;
        } else {
            var ret = {};
            for (var key in obj) {

                var keyStr = typeof (key) === "string" ? key : String(key);
                var newKey = lowerCache[keyStr];
                if (newKey === undefined) {
                    newKey = keyStr.toLowerCase();
                    lowerCache[keyStr] = newKey;
                }

                var newVal = obj[key] === null ? '' : obj[key];
                ret[newKey] = typeof (newVal) === "string" ? newVal : _convertKeysToCamelCase(newVal);
            }
            return ret;
        }
    }

    function _dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    function _getCommentList() {
        return [{ "cid": 105, "ctitle": "perfect!" }, { "cid": 104, "ctitle": "棒棒哒" }, { "cid": 106, "ctitle": "你离学霸不远喽" },
            { "cid": 107, "ctitle": "粗心大意是数学大敌哦" }, { "cid": 80, "ctitle": "注意审题哦" }, { "cid": 108, "ctitle": "加油！老师看好你！" },
            { "cid": 109, "ctitle": "与众不同，有创意" }, { "cid": 110, "ctitle": "书写工整会更棒" },
			 { "cid": 111, "ctitle": "知识概念还要下功夫啊" }, { "cid": 112, "ctitle": "步骤不能省略" }];

    }

    function _getSingleCommentCategoryList() {
        return [{ "cclassid": 5, "cclassname": "粗心问题评语" },
            { "cclassid": 9, "cclassname": "读题审题评语" },
            { "cclassid": 8, "cclassname": "概念不清评语" },
            { "cclassid": 4, "cclassname": "规范解答评语" },
            { "cclassid": 6, "cclassname": "计算问题评语" },
            { "cclassid": 10, "cclassname": "解题方法评语" },
            { "cclassid": 11, "cclassname": "空白卷面评语" },
            { "cclassid": 12, "cclassname": "拍照不清晰评语" },
            { "cclassid": 16, "cclassname": "学生作业批改评语" },
            { "cclassid": 3, "cclassname": "赞赏与激励评语" },
            { "cclassid": 14, "cclassname": "作业小结评语" }];
    }

    function _getSingleCommentChildrenList() {
        return [{ "cclassid": 5, "cclassname": "粗心问题评语", "cid": 88, "ctitle": "粗心大意" }, { "cclassid": 5, "cclassname": "", "cid": 34, "ctitle": "粗心大意是数学的大敌！" }, { "cclassid": 5, "cclassname": "", "cid": 90, "ctitle": "答题不规范" }, { "cclassid": 5, "cclassname": "", "cid": 32, "ctitle": "方法太好了，可要细心呀！" }, { "cclassid": 5, "cclassname": "", "cid": 91, "ctitle": "概念不清" }, { "cclassid": 5, "cclassname": "", "cid": 89, "ctitle": "没有理解" }, { "cclassid": 5, "cclassname": "", "cid": 35, "ctitle": "每一个数字都是不能马虎的！" }, { "cclassid": 5, "cclassname": "", "cid": 40, "ctitle": "你何时克服粗心大意的毛病，你何时就能获得全胜！" }, { "cclassid": 5, "cclassname": "", "cid": 38, "ctitle": "弄清小括号的作用，你就不会漏掉了！" }, { "cclassid": 5, "cclassname": "", "cid": 87, "ctitle": "审题不清" }, { "cclassid": 5, "cclassname": "", "cid": 86, "ctitle": "思路不对" }, { "cclassid": 5, "cclassname": "", "cid": 33, "ctitle": "再细心一些，你一定可以！" }, { "cclassid": 5, "cclassname": "", "cid": 41, "ctitle": "找出错因并加以纠正，就不会重复以往的错误！" }, { "cclassid": 5, "cclassname": "", "cid": 36, "ctitle": "这些问题不是你不会做，而是太粗心啦！" }, { "cclassid": 5, "cclassname": "", "cid": 37, "ctitle": "注意，不要忘记单位！" }, { "cclassid": 5, "cclassname": "", "cid": 39, "ctitle": "注意：一个人的数学水平，往往是从细节中折射出来的！" }
            , { "cclassid": 9, "cclassname": "读题审题评语", "cid": 63, "ctitle": "必须在应用题的审题习惯上下功夫" }, { "cclassid": 9, "cclassname": "读题审题评语", "cid": 61, "ctitle": "读题时，要弄清每一数学信息的含义！" }, { "cclassid": 9, "cclassname": "读题审题评语", "cid": 57, "ctitle": "读题与抄写，有关数据信息要确保准确无误！" }, { "cclassid": 9, "cclassname": "读题审题评语", "cid": 58, "ctitle": "理解题意，才能明确解决问题的方法！" }, { "cclassid": 9, "cclassname": "读题审题评语", "cid": 59, "ctitle": "弄清数量关系，方法才会正确！" }, { "cclassid": 9, "cclassname": "读题审题评语", "cid": 62, "ctitle": "学会读图，也是数学的重要内容！" }, { "cclassid": 9, "cclassname": "读题审题评语", "cid": 60, "ctitle": "要准确运用题目中的已知条件！" }
            , { "cclassid": 8, "cclassname": "概念不清评语", "cid": 52, "ctitle": "必须在弄清概念的本质上下功夫！" }, { "cclassid": 8, "cclassname": "概念不清评语", "cid": 53, "ctitle": "概念记忆不牢，相关概念混淆！" }, { "cclassid": 8, "cclassname": "概念不清评语", "cid": 54, "ctitle": "公式运用错误！" }, { "cclassid": 8, "cclassname": "概念不清评语", "cid": 56, "ctitle": "没有认清概念的本质是你的最大问题！" }, { "cclassid": 8, "cclassname": "概念不清评语", "cid": 55, "ctitle": "性质运用错误！" }
            , { "cclassid": 4, "cclassname": "规范解答评语", "cid": 28, "ctitle": " 答语不能过于简单！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 20, "ctitle": "别让字再舞蹈，站稳! " }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 21, "ctitle": "都会，为什么不好好写呢？" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 26, "ctitle": "方法不错，如果字面再工整一些就更完美了！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 29, "ctitle": "计算步骤不能过简，要相对完整！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 31, "ctitle": "解决问题的步骤要合乎题目的要求！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 16, "ctitle": "你的作业令老师赏心悦目！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 18, "ctitle": "你很聪明，如果字写得再好一点，那就更好了！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 17, "ctitle": "批改你的作业，是一种享受!" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 23, "ctitle": "书写一定要认真！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 22, "ctitle": "希望你把数和字写得再大方些！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 24, "ctitle": "养成认真书写的习惯，对数学学习会很有帮助！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 30, "ctitle": "用方程解决问题，“设语”是必不可少的环节！" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 27, "ctitle": "有些数学问题的结果是可以灵活处理的" }, { "cclassid": 4, "cclassname": "规范解答评语", "cid": 25, "ctitle": "注意书面设计要美观、大方！" }
            , { "cclassid": 6, "cclassname": "计算问题评语", "cid": 42, "ctitle": "计算全部正确，恭喜你！一分耕耘一分收获!" }, { "cclassid": 6, "cclassname": "计算问题评语", "cid": 44, "ctitle": "计算时，一定要注意精确！" }, { "cclassid": 6, "cclassname": "计算问题评语", "cid": 49, "ctitle": "计算也要灵活！" }, { "cclassid": 6, "cclassname": "计算问题评语", "cid": 51, "ctitle": "提高正确率，是你在计算过程中必须注意做到的！" }, { "cclassid": 6, "cclassname": "计算问题评语", "cid": 45, "ctitle": "一步错，步步错，多可惜啊！" }, { "cclassid": 6, "cclassname": "计算问题评语", "cid": 48, "ctitle": "约分的方法要灵活！" }, { "cclassid": 6, "cclassname": "计算问题评语", "cid": 50, "ctitle": "运算时，不要漏掉符号的运算！" }, { "cclassid": 6, "cclassname": "计算问题评语", "cid": 46, "ctitle": "注意：错误的结论，是由错误的计算造成的！" }, { "cclassid": 6, "cclassname": "计算问题评语", "cid": 47, "ctitle": "注意单位的换算！" }
            , { "cclassid": 10, "cclassname": "解题方法评语", "cid": 71, "ctitle": "爱动脑筋的你还有高招吗？" }, { "cclassid": 10, "cclassname": "解题方法评语", "cid": 65, "ctitle": "从你涂改的地方来看，解题思路好像有点乱！" }, { "cclassid": 10, "cclassname": "解题方法评语", "cid": 69, "ctitle": "读题要细，方法要明！" }, { "cclassid": 10, "cclassname": "解题方法评语", "cid": 66, "ctitle": "多想一想前后知识的联系，思路就会清晰了！" }, { "cclassid": 10, "cclassname": "解题方法评语", "cid": 70, "ctitle": "解题方法有点复杂，还有更好的解法吗？" }, { "cclassid": 10, "cclassname": "解题方法评语", "cid": 68, "ctitle": "请记住“计算四字诀”---看、想、算、查！" }, { "cclassid": 10, "cclassname": "解题方法评语", "cid": 64, "ctitle": "请注意解决数学问题方法的灵活性！" }, { "cclassid": 10, "cclassname": "解题方法评语", "cid": 73, "ctitle": "思路和书面都应讲求清楚！" }, { "cclassid": 10, "cclassname": "解题方法评语", "cid": 67, "ctitle": "线段图可以帮你分析数量关系！" }, { "cclassid": 10, "cclassname": "解题方法评语", "cid": 72, "ctitle": "学习数学应努力做到“触类旁通”！" }
            , { "cclassid": 11, "cclassname": "空白卷面评语", "cid": 74, "ctitle": "你如果没有思路的话，可以从概念、公式入手！" }
            , { "cclassid": 12, "cclassname": "拍照不清晰评语", "cid": 75, "ctitle": "提交作业的前提是拍照要清楚啊！" }
            , { "cclassid": 16, "cclassname": "学生作业批改评语", "cid": 98, "ctitle": "点评不详细" }, { "cclassid": 16, "cclassname": "学生作业批改评语", "cid": 101, "ctitle": "点评很详细" }, { "cclassid": 16, "cclassname": "学生作业批改评语", "cid": 102, "ctitle": "批改及时" }, { "cclassid": 16, "cclassname": "学生作业批改评语", "cid": 99, "ctitle": "批改延迟" }, { "cclassid": 16, "cclassname": "学生作业批改评语", "cid": 100, "ctitle": "试题批改错误" }, { "cclassid": 16, "cclassname": "学生作业批改评语", "cid": 103, "ctitle": "试题批改正确" }
            , { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 1, "ctitle": "perfect!" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 3, "ctitle": "very good!" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 92, "ctitle": "非常棒哦" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 95, "ctitle": "非常认真" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 8, "ctitle": "老师非常欣赏你对该题的处理！" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 7, "ctitle": "你的思路很有见地！" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 14, "ctitle": "你的头脑真灵活，这种方法比老师的方法还好。" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 5, "ctitle": "你的做法很不错！" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 6, "ctitle": "你的做法很有创意！" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 10, "ctitle": "你是一个富有创造性的学生！" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 9, "ctitle": "你是一个很有数学才能的学生！" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 12, "ctitle": "你与众不同的见解，让我耳目一新！" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 13, "ctitle": "你真棒！老师都没想到的这种做法，我向你学习。" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 93, "ctitle": "思路独特" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 97, "ctitle": "态度非常好" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 96, "ctitle": "头脑灵活" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 4, "ctitle": "完美！继续努力！" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 94, "ctitle": "这次不错" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 15, "ctitle": "这真是奇思妙想，棒极了！" }, { "cclassid": 3, "cclassname": "赞赏与激励评语", "cid": 11, "ctitle": "真了不起，这种题也难不倒你！" }
            , { "cclassid": 14, "cclassname": "作业小结评语", "cid": 81, "ctitle": "不错，继续加油" }, { "cclassid": 14, "cclassname": "作业小结评语", "cid": 84, "ctitle": "不太认真，注意哦" }, { "cclassid": 14, "cclassname": "作业小结评语", "cid": 76, "ctitle": "非常棒" }, { "cclassid": 14, "cclassname": "作业小结评语", "cid": 82, "ctitle": "思路非常好，看好你" }, { "cclassid": 14, "cclassname": "作业小结评语", "cid": 83, "ctitle": "写字工整会更好" }, { "cclassid": 14, "cclassname": "作业小结评语", "cid": 85, "ctitle": "要多思考，多练习" }, { "cclassid": 14, "cclassname": "作业小结评语", "cid": 79, "ctitle": "有待提高哦" }, { "cclassid": 14, "cclassname": "作业小结评语", "cid": 77, "ctitle": "这孩子有前途" }, { "cclassid": 14, "cclassname": "作业小结评语", "cid": 80, "ctitle": "注意审题哦" }, { "cclassid": 14, "cclassname": "作业小结评语", "cid": 78, "ctitle": "作业非常认真哦" }];


    }

})