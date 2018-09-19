var rtcroom = require('../../../utils/rtcroom.js')
var webim = require('../../../utils/webim_wx.js');
var report = require('../../../utils/report.js');
var app  = getApp();
Component({
    properties: {
        roomID: {type: String, value: ''},
        roomInfo: {type: String, value: ''},
        template: {type: String, value: '', observer: function(newVal, oldVal) {this.init(newVal)}},        //使用的界面模版
        beauty: {type: String, value: 5},           //美颜程度，取值为0~9
        aspect: {type: String, value: '3:4'},       //设置画面比例，取值为'3:4'或者'9:16'
        minBitrate: {type: Number, value: 200},     //设置码率范围为[minBitrate,maxBitrate]，四人建议设置为200~400
        maxBitrate: {type: Number, value: 400},
        muted: {type: Boolean, value: false},       //设置推流是否静音
        debug: {type: Boolean, value: false},       //是否显示log
        assistant: {type: Object, value: null},       //是否显示log
        hideBg: {type: Boolean, value: false},       //是否显示背景图
        flag: {type: Boolean, value: false},       //是否来自聊天页面
        flagStatus: {type: Number, value: 1},       //是否来自聊天页面
        startTime: {type: String, value: ''},       //是否来自聊天页面
        // frontCamera: {type: Boolean, value: true, observer: function (newVal, oldVal) { this.switchCamera(); }},  //设置前后置摄像头，true表示前置
    },
    data: {
        pusherContext: '',
        hasPushStarted: false,
        pushURL: '',
        members: [{},{}, {}],
        maxMembers: 3,
        self: {},
        hasExitRoom: true,

        //数据统计
        push_stream_start: 0,
        push_stream_tap: 0,
        push_info: '',
        play_stream_start: 0,
        play_stream_end: 0,
        play_stream_tap: 0,
        play_info: '',

        ERROR_GET_PUSH_URL: -1,  //获取推流失败
        ERROR_CREATE_ROOM: -2,   //创建房间失败
        ERROR_ENTER_ROOM: -3,    //进房失败
        ERROR_OPEN_CAMERA: -4,   //打开摄像头失败
        ERROR_OPEN_MIC: -5,      //打开麦克风失败
        ERROR_PUSH_DISCONNECT: -6,   //推流连接断开
        ERROR_CAMERA_MIC_PERMISSION: -7,  //获取不到摄像头或者麦克风权限
        ERROR_REACH_MAX_MEMBERS: -8,      //房间到达最大人数限制
    },

    ready: function(){
        if (!this.data.pusherContext) {
            // console.log("***pusherContext***");
            this.data.pusherContext = wx.createLivePusherContext('rtcpusher');
            // console.log(this.data.pusherContext)
        }
        self = this;
    },
    detached: function(){
        console.log("组件 detached");
        self.exitRoom();
    },
    // 建议在页面 onUnload 里面对 <live-pusher> 与<live-player> 标签做清理 7.23新增方法
    onUnload: function () {
        self.data.pusherContext && self.data.pusherContext.stop();
        self.data.playerContext && self.data.playerContext.stop();
    },
    methods: {

        init: function(newVal) {
            self = this;
            switch(newVal) {
                case '1v3':
                    // this.data.maxMembers = 3;
                    // this.data.members = [{}, {}, {}];
                    this.setData({
                        maxMembers: 3,
                        members: [{}, {}, {}],
                        template: newVal
                    });
                    break;
                case '1v1':
                    // this.data.maxMembers = 1;
                    // this.data.members = [{}];
                    this.setData({
                        maxMembers: 1,
                        members: [{}],
                        template: newVal
                    });
                    break;
            }
        },

        start: function(cb) {
            self = this;
            self.data.hasExitRoom = false;
            //设置rtcroom监听事件
            rtcroom.setListener({
                onPusherJoin: self.onPusherJoin,
                onPusherQuit: self.onPusherQuit,
                onRoomClose: self.onRoomClose,
                onPush: self.onPush,
                onRecvRoomTextMsg: self.onRecvRoomTextMsg
            });

            //创建房间，获取推流URL，开始推流
            self.createRoom(cb);

            // --------------    yuan daim ----------------------------
            // if (self.data.roomID) {
            //     //获取推流URL，开始推流
            //     self.getPushURLAndStartPush(self.data.roomID);
            // } else {
            //     //创建房间，获取推流URL，开始推流
            //     self.createRoom();
            // }
            

            // if (self.data.roomID) {
            //     //获取除了自己外房间所有的成员信息
            //     rtcroom.getPushers({
            //         data: {
            //             roomID: self.data.roomID
            //         },
            //         success: function(res) {
            //             if (res.pushers.length > self.data.maxMembers) {
            //                 self.postErrorEvent(self.data.ERROR_REACH_MAX_MEMBERS, '房间已达到最大人数限制');
            //                 return;
            //             }
            //             //拉流开始时间戳
            //             if (!self.data.play_stream_start) {
            //                 self.data.play_stream_start = +new Date();
            //                 self.data.play_stream_tap = +new Date();
            //             }
            //             for(var i = 0; i < self.data.maxMembers; i++) {
            //                 if (res.pushers[i]) {
            //                     var pusher = res.pushers[i];
            //                     pusher.loading = false;
            //                     pusher.playerContext = wx.createLivePlayerContext(pusher.userID);
            //                     self.data.members[i] = pusher;
            //                 }
            //             }
            //             self.setData({ members: self.data.members });
            //         },
            //         fail: function(){}
            //     });
            // }
            // ----------------------------yuan daima -----------------
        },

        stop: function() {
            self.data.hasExitRoom = true;
            console.log("组件停止");
            self.exitRoom();
        },

        pause: function() {
            if (!self.data.pusherContext) {
                self.data.pusherContext = wx.createLivePusherContext('rtcpusher');
            }
            self.data.pusherContext && self.data.pusherContext.pause();

            self.data.members.forEach(function (val) {
                val.playerContext && val.playerContext.pause();
            });
        },

        resume: function() {
            if (!self.data.pusherContext) {
                self.data.pusherContext = wx.createLivePusherContext('rtcpusher');
            }
            self.data.pusherContext && self.data.pusherContext.resume();

            self.data.members.forEach(function (val) {
                val.playerContext && val.playerContext.resume();
            });
        },

        switchCamera: function () {
            if (!self.data.pusherContext) {
                self.data.pusherContext = wx.createLivePusherContext('rtcpusher');
            }
            self.data.pusherContext && self.data.pusherContext.switchCamera({});
        },

        sendTextMsg: function(msg,data) {
            if (!msg) {
                return;
            }
            if(data.flag==3){
                // 普通消息
                rtcroom.sendRoomTextMsg({
                    data: {
                        text:'ceshi2',
                        msg: msg,
                        ext: msg
                    },
                    typedata :{
                        TYPE : webim.SESSION_TYPE.C2C,
                        myselToID: data.myselToID || "",
                        flag:data.flag
                    }
                });
            }
            
            else{
                // 自定义消息
                rtcroom.sendRoomTextMsg({
                    data: {
                        text:'ceshi2',
                        data: msg,
                        ext: msg
                    },
                    typedata :{
                        TYPE : webim.SESSION_TYPE.C2C,
                        myselToID: data.myselToID || "",
                        flag:data.flag
                    }
                });
            }
            
        },

        getAccountInfo: function() {
            var accountInfo = rtcroom.getAccountInfo();
            return {
                userID: accountInfo.userID,			// 用户ID
                userName: accountInfo.userName,		// 用户昵称
                userAvatar: accountInfo.userAvatar,		// 用户头像URL
                userSig: accountInfo.userSig,		// IM登录凭证
                sdkAppID: accountInfo.sdkAppID,		// IM应用ID
                accountType: accountInfo.accountType,	// 账号集成类型
                accountMode: accountInfo.accountMode,		//帐号模式，0-表示独立模式，1-表示托管模式		
                token: accountInfo.token			//登录RoomService后使用的票据
            }
        },

        getRoomInfo: function() {
            var roomInfo = rtcroom.getRoomInfo();
            return {
                roomID: roomInfo.roomID,    // 视频位房间ID
                roomCreator: roomInfo.roomCreator, //房间创建者
                roomInfo: roomInfo.roomInfo,    // 房间自定义信息（如作为房间名称）
                mixedPlayURL: roomInfo.mixedPlayURL,    // 混流地址
                pushers: roomInfo.pushers,  // 当前用户信息
                isDestory: roomInfo.isDestory   // 是否已解散
            }
        },

        createRoom: function(cb) {
            var roomInfo = {
                roomID:self.data.roomID,
                roomName:self.data.roomInfo
            }
            console.log("********creatroom********",roomInfo)
            rtcroom.createRoom({
                data: {
                    roomInfo: roomInfo
                },
                success: function(res) {
                    self.data.roomID = res.roomID;
                    console.log('创建房间成功，房间号：', res.roomID,self.data.roomID);
                    self.getPushURLAndStartPush(self.data.roomID,cb);
                },
                fail: function(res) {
                    console.error('创建房间失败:', res);
                    self.exitRoom();
                    self.postErrorEvent(self.data.ERROR_CREATE_ROOM, '创建房间失败[' + res.errMsg + '(' + res.errCode + ')]')
                }
            });
        },

        enterRoom: function() {
            rtcroom.enterRoom({
                data: {
                    roomID: self.data.roomID,
                    pushURL: self.data.pushURL,
                    roomInfo: self.data.roomInfo
                },
                success: function(res) {
                    console.log('进房成功');
                },
                fail: function(res) {
                    console.error('进房失败:', res);
                    self.exitRoom();
                    self.postErrorEvent(self.data.ERROR_ENTER_ROOM, '进入房间失败[' + res.errMsg + '(' + res.errCode + ')]');
                }
            });
        },

        exitRoom: function(needCallback) {
            if (!self.data.pusherContext) {
                self.data.pusherContext = wx.createLivePusherContext('rtcpusher');
            }
            self.data.pusherContext && self.data.pusherContext.stop && self.data.pusherContext.stop();
            
            self.data.members.forEach(function (val) {
                val.playerContext && val.playerContext.stop();
            });

            for (var i = 0; i < self.data.maxMembers; i++) {
                self.data.members[i] = {};
            }
            self.setData({
                members: self.data.members
            });
            rtcroom.exitRoom({roomID:self.data.roomID});
            if (needCallback) {
                self.postEvent('roomClosed', 0, '');
            }
        },

        postErrorEvent: function(errCode, errMsg) {
            self.postEvent('error', errCode, errMsg);
        },

        postEvent: function(tag, code, detail) {
            self.triggerEvent('onRoomEvent', {
                tag: tag,
                code: code,
                detail: detail
            }, {});
        },

        getPushURLAndStartPush: function(roomID,cb) {
            var data = {}
            if (roomID) {
                data.roomID = roomID;
            }
            rtcroom.getPushURL({
                data: data,
                success: function(res) {
                    //开启推流
                    console.log("==========###getPushURLAndStartPush###",res)
                    if (!self.data.hasExitRoom) {
                        self.data.hasPushStarted = false;
                        self.setData({
                            push_stream_start: +new Date(),
                            push_stream_tap: +new Date(),
                            pushURL: res.pushURL
                        })
                        // self.enterRoom(); // 进入房间
                    }
                    typeof cb == "function" && cb(roomID)
                },
                fail: function(res) {
                    console.error('获取推流地址失败:', JSON.stringify(res));
                    self.postErrorEvent(self.data.ERROR_GET_PUSH_URL, '获取推流地址失败[' + res.errMsg + '(' + res.errCode + ')]');
                }
            });
        },

        onPusherJoin: function(res) {
            // console.log("####拉流开始时间戳")
            // 拉流开始时间戳
            if (!self.data.play_stream_start) {
                self.data.play_stream_start = +new Date();
                self.data.play_stream_tap = +new Date();
            }
            console.log("####***拉流开始时间戳***###",self.data.play_stream_start);
            res.pushers.forEach(function (val) {
                var emptyIndex = -1;
                var hasPlay = false;
                for (var i = 0; self.data.members && i < self.data.members.length; i++) {
                    if (self.data.members[i].userID && self.data.members[i].userID == val.userID) {
                        hasPlay = true;
                    } else if (!self.data.members[i].userID && emptyIndex == -1) {
                        emptyIndex = i;
                    }
                }
                if (!hasPlay && emptyIndex != -1) {
                    val.loading = false;
                    val.playerContext = wx.createLivePlayerContext(val.userID);
                    self.data.members[emptyIndex] = val;
                }
            });
            self.setData({ members: self.data.members });
        },
        onPusherQuit: function(res) {
            res.pushers.forEach(function(val){
                for (var i = 0; i < self.data.maxMembers; i++) {
                    if (self.data.members[i].userID == val.userID) {
                        self.data.members[i] = {};
                    }
                }
            });
            self.setData({ members: self.data.members });
        },
        onRoomClose: function() {
            console.log('房间解散');
            self.exitRoom(true);
        },
        onRecvRoomTextMsg: function(res) {
            /**
             * res:
             * {
             *   roomID: roomInfo.roomID,
             *   userID: msg.fromAccountNick,
             *   nickName: msg.nickName,
             *   headPic: msg.headPic,
             *   textMsg: msg.content,
             *   time: msg.time
	         * }
             */
            console.log("***111***",res)
            self.postEvent('recvTextMsg', 0, JSON.stringify(res));
        },

        // 推流事件
        onPush: function(e) {
            if (!self.data.pusherContext) {
                self.data.pusherContext = wx.createLivePusherContext('rtcpusher');
            }
            var code;
            if (e.detail) {
                code = e.detail.code;
            } else {
                code = e;
            }
            console.log('推流情况：', code);
            app.globalData.pushLog+=JSON.stringify(e);
            if(app.globalData.pushLog.length>1500){
                self.triggerEvent('trigVideo', {}, {});
            }
            // 推流情况打点记录
            if (self.data.push_stream_tap != -1) {
                self.data.push_stream_tap = +new Date() - self.data.push_stream_tap;
                self.data.push_info += '[' + code + ':' + self.data.push_stream_tap + ']';
                self.data.push_stream_tap = +new Date();
            }
            var errmessage = '';
            switch (code) {
            case 1002: {
                if (!self.data.hasPushStarted) {
                    self.data.hasPushStarted = true;
                    //推流成功，进入房间
                    self.enterRoom();
                    self.data.push_stream_tap = -1;
                    report.setReportData({
                        int64_tc_push_stream: +new Date() - self.data.push_stream_start,
                        str_push_info: self.data.push_info
                    });
                }
                break;
            }
            case -1301: {
                console.error('打开摄像头失败: ', code);
                self.postErrorEvent(self.data.ERROR_OPEN_CAMERA, '打开摄像头失败');
                self.exitRoom();
                break;
            }
            case -1302: {
                console.error('打开麦克风失败: ', code);
                self.postErrorEvent(self.data.ERROR_OPEN_MIC, '打开麦克风失败');
                self.exitRoom();
                break;
            }
            case -1307: {
                console.error('推流连接断开: ', code);
                self.postErrorEvent(self.data.ERROR_PUSH_DISCONNECT, '推流连接断开');
                self.exitRoom();
                break;
            }
            case 5000: {
                console.log('收到5000: ', code);
                // 收到5000就退房
                self.exitRoom();
                break;
            }
            default: {
            // console.log('推流情况：', code);
            }
            }
        },

        // 标签错误处理
        onError: function(e) {
            console.log('推流错误：',e);
            e.detail.errCode == 10001 ? (e.detail.errMsg = '未获取到摄像头功能权限，请删除小程序后重新打开') : '';
            e.detail.errCode == 10002 ? (e.detail.errMsg = '未获取到录音功能权限，请删除小程序后重新打开') : '';
            self.postErrorEvent(self.data.ERROR_CAMERA_MIC_PERMISSION, e.detail.errMsg || '未获取到摄像头、录音功能权限，请删除小程序后重新打开')
        },
        decline:function(){
            self.stop();
            console.log("***rtc-room***triggerEvent***decline***");
            // 触发事件
            self.triggerEvent('decline', {}, {});
            // if(self.data.flag){
            //     if(self.data.startTime){
            //         var st = Math.floor((Date.now() - self.data.startTime)/1000);
            //         var mini=Math.floor(st/60);
            //         var second=st%60;
            //         var videoTime = (mini>9?mini:("0"+mini)) +":"+(second>9?second:("0"+second))
            //         console.log(mini,second,videoTime);
            //         wx.redirectTo({
            //             url:'../../chat/chat?videoStatus=1&videoTime='+videoTime
            //         })
            //     }
            //     else{
            //         wx.redirectTo({
            //             url:'../../chat/chat?videoStatus=2'
            //         })
            //     }
            // }
            // else{
            //     wx.navigateBack({ delta: 1 });
            // }
        },
        changeMute: function () {
            console.log("******muted******",this.muted)
            this.muted = !this.muted;
            this.setData({
                muted: this.muted
            });
        },
        //播放器live-player回调
        onPlay: function (e) {
            console.log("***live-player-onPlay***",e);
            app.globalData.pullLog+=JSON.stringify(e);//拉流日志记录
            self.triggerEvent('onliveplay', {}, {});
            if(app.globalData.pullLog.length>1500){
                self.triggerEvent('trigVideo', {}, {});
            }
            // 拉流情况打点记录
            if (self.data.play_stream_tap != -1) {
                self.data.play_stream_tap = +new Date() - self.data.play_stream_tap;
                self.data.play_info += '[' + e.detail.code + ':' + self.data.play_stream_tap + ']';
                console.log("####***拉流间隔耗时戳***###",self.data.play_info);
                self.data.play_stream_tap = +new Date();
            }
            self.data.members.forEach(function(val){
              if(e.currentTarget.id == val.userID) {
                switch (e.detail.code) {
                  case 2007: {
                    console.log('视频播放loading: ', e);
                    val.loading = true;
                    break;
                  }
                  case 2004: {
                    console.log('视频播放开始: ', e);
                    val.loading = false;
                    // 拉流成功耗时
                    if (!self.data.play_stream_end) {
                        self.data.play_stream_end = +new Date();
                        self.data.play_stream_tap = -1;
                        console.warn("int64_tc_play_stream" + self.data.play_stream_start + ', ' + self.data.play_stream_end)
                        report.setReportData({
                        int64_tc_play_stream: self.data.play_stream_end - self.data.play_stream_start,
                        int64_ts_play_stream: self.data.play_stream_end,
                        str_play_info: self.data.play_info
                        });
                    }
                    break;
                  }
                  default: {
                    console.log('拉流情况：', e);
                  }
                }
              }
            });
            self.setData({
                members: self.data.members
            })
        },
    }
})
