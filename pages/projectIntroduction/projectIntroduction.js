var util = require('../../utils/util.js')
import {trackRequest} from "../../utils/util";
var app = getApp()
var config = require('../../config.js')
import regeneratorRuntime from '../../lib/runtime';

import { login } from '../../lib/promise';
import endpoint from "../../lib/endpoint";

var serverUrl = 'https://dm.static.elab-plus.com/wuXiW3/projectIntroduction/'
Page({
    data:{
        serverUrl:serverUrl,
        mask2:'#272A34',
    },
    onShow:async function(e){
        wx.setNavigationBarTitle({
            title: '项目介绍'
        })
        const appData = await login();
        const param = {
            type: 'PV',
            pvId: 'P_2cdinzhi_6',
            pvCurPageName: 'shejilinian',
        };
        trackRequest(param);
    },
    onShareAppMessage(options) {
        return {
            title: '项目介绍',
            path: '/pages/projectIntroduction/projectIntroduction'
        }
    },
    toDiy(){
        const url = `/pages/customHouse/customHouse`
        wx.navigateTo({ url });
    },
    onUnload(){
    },
    onHide(){
    },

    onLoad:function(options) {
    }
})
