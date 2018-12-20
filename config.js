/**
 * 小程序配置文件
 */
// return 'https://examopenapi.elab-plus.com' //测试
// return 'http://139.196.5.82:3001' //堡垒 映射
// return 'https://openapi.elab-plus.com' //生产
// return 'http://192.168.0.15:3000' //开发环境
// return 'http://139.196.5.59:3001' // 测试
const env = 'test'
var config = function() {
    var result = {};
    if (env === 'prod') {
        result = {
            sdkAppID: '1400107457',
            accType: '30285',
            houseId: 10000,
            color1: "#6193A5",
            color2: "#3A4A80",
            backColor: "#474952",
            projectName: '无锡WIII',
            // 后台接口请求地址
            url: 'https://dm-api.elab-plus.cn/', //开发
            newUrl: 'https://dm-api.elab-plus.cn/', //开发
            ImgUrl: 'http://skyforest.static.elab-plus.com/',
            parameterUrl:'https://m.elab-plus.com/sell/#/housePramater?houseId=',
            tdviewUrl:'https://m.elab-plus.com/sell/#/tdview?houseId=',
            //客户业务后台请求域名
            serverUrl: 'https://dm-api.elab-plus.cn/elab-marketing-rtc', //'https://room.qcloud.com', 139.196.5.59:5757 、、https://zb.elab-plus.com//生产
            // imageUrl: 'http://skyforest.static.elab-plus.com',//'https://room.qcloud.com', 139.196.5.59:5757  
            //腾讯云RoomService后台请求域名
            roomServiceUrl: 'https://dm-api.elab-plus.cn/elab-marketing-rtc', //'https://room.qcloud.com',  http://139.196.5.59:5757 // 测试  http://139.196.5.82:5757 堡垒 https://zb.elab-plus.com//生产
            webrtcServerUrl: 'https://dm-api.elab-plus.cn/elab-marketing-rtc',
            templateUrl: 'https://m.elab-plus.com/launch/#/pages/preview?projectId=', // 模板H5链接前缀 
            newTemplateUrl: 'https://dm-mng.elab-plus.cn/touFangBao/#/pages/preview?houseId=', // 新的模板H5链接前缀
            watchModule2:10065//3d使用
        }
    } else if (env === 'dev') {
        result = {
            sdkAppID: '1400107457',
            accType: '30285',
            houseId: 83,
            color1: "#6193A5",
            color2: "#3A4A80",
            backColor: "#474952",
            projectName: '无锡WIII',
            // 后台接口请求地址
            url: 'https://examopenapi.elab-plus.com',
            newUrl: 'http://192.168.0.16:5555/', //开发
            ImgUrl: 'http://skyforest.static.elab-plus.com/', // 图片地址
            parameterUrl:'http://h5test.elab-plus.com/sell/#/housePramater?houseId=',
            tdviewUrl:'http://h5test.elab-plus.com/sell/#/tdview?houseId=',
            //客户业务后台请求域名
            serverUrl: 'http://192.168.0.16:5555/elab-marketing-rtc',
            // imageUrl: 'http://192.168.0.16:5555',
            //腾讯云RoomService后台请求域名
            roomServiceUrl: 'http://192.168.0.16:5555/elab-marketing-rtc',
            webrtcServerUrl: 'https://xzb.qcloud.com/webrtc/weapp/webrtc_room',
            templateUrl: 'https://h5test.elab-plus.com/launch/#/pages/preview?projectId=', // 模板H5链接前缀
            newTemplateUrl: 'https://h5test.elab-plus.com/touFangBao/#/pages/preview?houseId=', // 新的模板H5链接前缀
        }
    } else if (env === 'test') {
        result = {
            sdkAppID: '1400107457',
            accType: '30285',
            houseId: 88,
            color1: "#6193A5",
            color2: "#3A4A80",
            backColor: "#474952",
            projectName: '无锡WIII',
            // 后台接口请求地址
            url: 'http://139.196.5.59:5555/',
            parameterUrl:'https://h5test.elab-plus.com/sell/index.html#/housePramater?houseId=',
            tdviewUrl:'http://h5test.elab-plus.com/sell/#/tdview?houseId=',
            newUrl: 'https://gatewaytest.elab-plus.com/', //测试
            ImgUrl: 'http://skyforest.static.elab-plus.com/', // 图片地址
            //客户业务后台请求域名
            serverUrl: 'http://139.196.5.59:5555/elab-marketing-rtc', //测试
            // imageUrl: 'http://139.196.5.59:5757',
            //腾讯云RoomService后台请求域名
            roomServiceUrl: 'http://139.196.5.59:5555/elab-marketing-rtc', //测试
            webrtcServerUrl: 'https://xzb.qcloud.com/webrtc/weapp/webrtc_room',
            templateUrl: 'https://h5test.elab-plus.com/launch/#/pages/preview?projectId=', // 模板H5链接前缀
            newTemplateUrl: 'https://h5test.elab-plus.com/touFangBao/#/pages/preview?houseId=', // 新的模板H5链接前缀
            watchModule2:143//3d使用
        }
    } else if (env === 'uat') {
        result = {
            sdkAppID: '1400107457',
            accType: '30285',
            houseId: 10000,
            color1: "#6193A5",
            color2: "#3A4A80",
            backColor: "#474952",
            projectName: '无锡WIII',
            parameterUrl:'https://mng-uat.elaber.cn/sell/#/housePramater?houseId=',//此处URL需要调整，堡垒地址不对
            tdviewUrl:'https://mng-uat.elaber.cn/sell/#/tdview?houseId=',
            // 后台接口请求地址
            url: 'https://api-uat.elaber.cn/',
            newUrl: 'https://api-uat.elaber.cn/', //测试
            ImgUrl: 'http://skyforest.static.elab-plus.com/', // 图片地址
            //客户业务后台请求域名
            serverUrl: 'https://api-uat.elaber.cn/elab-marketing-rtc',
            // imageUrl: 'http://skyforest.static.elab-plus.com',
            //腾讯云RoomService后台请求域名
            roomServiceUrl: 'https://api-uat.elaber.cn/elab-marketing-rtc',
            webrtcServerUrl: 'https://api-uat.elaber.cn/elab-marketing-rtc',
            templateUrl: 'https://m.elab-plus.com/launch/#/pages/preview?projectId=', // 模板H5链接前缀
            newTemplateUrl: 'https://mng-uat.elaber.cn/touFangBao/#/pages/preview?houseId=', // 新的模板H5链接前缀
            watchModule2:10076//3d使用
        }
    }
    return result;
}

module.exports = config();