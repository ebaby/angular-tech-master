define([], function () {
    return {
        lazyCfg: [
            { stateName: "app.analyze", urlPrefix: "/analyze", type: "ngload", src: globalConfig.appPath + "analyze/app-analyze.module.js" },
            { stateName: "app.checkhomework", urlPrefix: "/checkhomework", type: "ngload", src: globalConfig.appPath + "checkhomework/app-checkhomework.module.js" },
            { stateName: "app.classmanage", urlPrefix: "/classmanage", type: "ngload", src: globalConfig.appPath + "classmanage/app-classmanage.module.js" },
            { stateName: "app.sethomework", urlPrefix: "/sethomework", type: "ngload", src: globalConfig.appPath + "sethomework/app-sethomework.module.js" },
            { stateName: "app.userinfo", urlPrefix: "/userinfo", type: "ngload", src: globalConfig.appPath + "userinfo/app-userinfo.module.js" },
        ]
    }
});