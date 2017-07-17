// JavaScript Document


Easemob.im.config = {
    /*
        The global value set for xmpp server
    */
    xmppURL: 'im-api.easemob.com',
    /*
        The global value set for Easemob backend REST API
        "http://a1.easemob.com"
    */
    apiURL: 'https://a1.easemob.com',
    /*
        连接时提供appkey
    */
    //appkey: "easemob-demo#chatdemoui",
    appkey: "sangabcdefg#demo",
    /*
     * 是否使用https 
     */
    https : true,
    /*
     * 是否使用多resource
     */
    multiResources: false,

    usr : 'sang3',
    psw : '123456'

};



var imStatus={
	online : false,
	offline : true,
	autoreply : false
};


window.onload=function(){
//var img=$('#container>img');
//$('#container').css({width:img.width(),height:img.height()});

// 百度地图API功能
	var map = new BMap.Map('container');    // 创建Map实例
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);  // 初始化地图,设置中心点坐标和地图级别
	map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
	map.setCurrentCity('北京');          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

var opts = {type: BMAP_NAVIGATION_CONTROL_LARGE}    
map.addControl(new BMap.NavigationControl(opts));

// 多点标注
var points=[new BMap.Point(116.404, 39.915),new BMap.Point(116.406, 39.915)];
for(var i=0; i < points.length;i++) map.addOverlay(new BMap.Marker(points[i]));


};




////////////////////////////////////////////////////////////////////////////

var curUserId = null;
var curChatUserId = null;
var conn = null;
var curRoomId = null;
var curChatRoomId = null;
var msgCardDivId = "chat01";
var talkToDivId = "talkTo";
var talkInputId = "talkInputId";
var bothRoster = [];
var toRoster = [];
var maxWidth = 200;
var groupFlagMark = "groupchat";
var chatRoomMark = "chatroom";
var groupQuering = false;
var textSending = false;
var time = 0;
var flashFilename = '';
var audioDom = [];
var picshim;
var audioshim;
var fileshim;
var PAGELIMIT = 8;
var pageLimitKey = new Date().getTime();

var encode = function ( str ) {
    if ( !str || str.length === 0 ) return "";
    var s = '';
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/<(?=[^o][^)])/g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    //s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "&quot;");
    s = s.replace(/\n/g, "<br>");
    return s;
};


//处理不支持异步上传的浏览器,使用swfupload作为解决方案
var uploadType = null;


//提供上传接口
var flashUpload = function ( swfObj, url, options ) {
    swfObj.setUploadURL(url);
    swfObj.uploadOptions = options;
    swfObj.startUpload();
};
var flashPicUpload = function ( url, options ) {
    flashUpload(picshim, url, options);
};
var flashAudioUpload = function ( url, options ) {
    flashUpload(audioshim, url, options);
};
var flashFileUpload = function ( url, options ) {
    flashUpload(fileshim, url, options);
};


window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;



$(function(){

    conn = new Easemob.im.Connection({
        multiResources: Easemob.im.config.multiResources,
        https : Easemob.im.config.https,
        url: Easemob.im.config.xmppURL
    });

    conn.open({
        apiUrl : Easemob.im.config.apiURL,
        user : Easemob.im.config.usr,
        pwd : Easemob.im.config.psw,
        //连接时提供appkey
        appKey : Easemob.im.config.appkey
    });  

    //初始化连接
    conn.listen({
        //当连接成功时的回调方法
        onOpened : function() {
            handleOpen(conn);
        },
        //当连接关闭时的回调方法
        onClosed : function() {
            handleClosed();
        },
        //收到文本消息时的回调方法
        onTextMessage : function(message) {
            handleTextMessage(message);
        },
        //收到表情消息时的回调方法
       onEmotionMessage : function(message) {
            handleEmotion(message);
        },
        //收到图片消息时的回调方法
         onPictureMessage : function(message) {
            handlePictureMessage(message);
        },
        //收到音频消息的回调方法
        onAudioMessage : function(message) {
            handleAudioMessage(message);
        },
        //收到位置消息的回调方法
/*        onLocationMessage : function(message) {
            handleLocationMessage(message);
        },
        //收到文件消息的回调方法
        onFileMessage : function(message) {
            handleFileMessage(message);
        },
        //收到视频消息的回调方法
        onVideoMessage: function(message) {
            handleVideoMessage(message);
        },
        //收到联系人订阅请求的回调方法
        onPresence: function(message) {
            handlePresence(message);
        },
        //收到联系人信息的回调方法
        onRoster: function(message) {
            handleRoster(message);
        },
        //收到群组邀请时的回调方法
        onInviteMessage: function(message) {
            handleInviteMessage(message);
        },*/
        //异常时的回调方法
        onError: function(message) {
            handleError(message);
        }
    });
    //var loginInfo = getLoginInfo();

});



//处理连接时函数,主要是登录成功后对页面元素做处理
var handleOpen = function(conn) {
    //从连接中获取到当前的登录人注册帐号名
    curUserId = conn.context.userId;
    //获取当前登录人的联系人列表
    conn.getRoster({
        success : function(roster) {
            conn.setPresence();//设置用户上线状态，必须调用
            var curroster;
            //alert(JSON.stringify(roster))
        }
    });

    if ( !Easemob.im.Helper.isCanUploadFileAsync && typeof uploadShim === 'function' ) {
        picshim = uploadShim('sendPicInput', 'pic');
        audioshim = uploadShim('sendAudioInput', 'aud');
        fileshim = uploadShim('sendFileInput', 'file');
    }

    //启动心跳
    if (conn.isOpened()) {
        conn.heartBeat(conn);
    }
};

//连接中断时的处理，主要是对页面进行处理
var handleClosed = function() {
    curUserId = null;
    curChatUserId = null;
    curRoomId = null;
    curChatRoomId = null;
    bothRoster = [];
    toRoster = [];
    groupQuering = false;
    textSending = false;
};




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//easemobwebim-sdk收到文本消息的回调方法的实现
var handleTextMessage = function(message) {
    //alert(JSON.stringify(message))
    var from = message.from;//消息的发送者
    var mestype = message.type;//消息发送的类型是群组消息还是个人消息
    //TODO  根据消息体的to值去定位那个群组的聊天记录
    var room = message.to;
    yaudio.play();
    if (mestype == 'chat') {
       // appendMsg(message.from, mestype + message.to, messageContent);
       appendTxtMsg(message,false,false);
    } else {
       // appendMsg(from, from, messageContent);
       appendTxtMsg(message,true,false);
    }
};

//easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了
//统一的处理，不需要用户自己区别字符是文本还是表情符号。
var handleEmotion = function(message) {
    var from = message.from;
    var room = message.to;
    var mestype = message.type;//消息发送的类型是群组消息还是个人消息
    yaudio.play();
    if (mestype == 'chat') {
       // appendMsg(message.from, mestype + message.to, messageContent);
       appendEmoMsg(message,false,false);
    } else {
       // appendMsg(from, from, messageContent);
       appendEmoMsg(message,true,false);
    }
};

//easemobwebim-sdk收到图片消息的回调方法的实现
var handlePictureMessage = function(message) {
    var filename = message.filename;//文件名称，带文件扩展名
    //console.log(JSON.stringify(message));
    var mestype = message.type;//消息发送的类型是群组消息还是个人消息
    var from = message.from;
    var room = message.to;
    yaudio.play();
    if (mestype == 'chat') {
       // appendMsg(message.from, mestype + message.to, messageContent);
       appendPicMsg(message,false,false);
    } else {
       // appendMsg(from, from, messageContent);
       appendPicMsg(message,true,false);
    }

};

//easemobwebim-sdk收到声音消息的回调方法的实现
var handleAudioMessage = function(message) {
    var filename = message.filename;
    var filetype = message.filetype;
    //console.log(JSON.stringify(message));
    var mestype = message.type;//消息发送的类型是群组消息还是个人消息
    var from = message.from;
    var room = message.to;
    yaudio.play();
    // 只能使用老版sdk的方法
    var options = message;
    options.onFileDownloadComplete = function(response, xhr) {
        var objectURL = Easemob.im.Helper.parseDownloadResponse.call(this, response);
        var audio = document.createElement("audio");
        
        audio.onload = function() {
            audio.onload = null;
           // window.URL && window.URL.revokeObjectURL && window.URL.revokeObjectURL(audio.src);
        };
        audio.onerror = function() {
            audio.onerror = null;
         //   appendMsg(from, contactDivId, "当前浏览器不支持播放此音频:" + (filename || ''));
        };
        audio.controls = "controls";
        audio.src = objectURL;
        //audio.play();
		
		message.src=objectURL;
		var group=false;
		if(message.type=='groupchat') group=true;
		var isIPhone = !!window.navigator.appVersion.match(/AppleWebKit/gi),msg00;
		if(isIPhone){
            //message.data=audio;
            message.duration='';
            appendAudioMsg(message,group);
            audio=null;
		}
        else audio.oncanplay=function(){
            //message.data=audio;
            message.duration=Math.round(audio.duration);
            appendAudioMsg(message,group);
            audio=null;
        }
        return;
        
    };
    options.onFileDownloadError = function(e) {
       // appendMsg(from, contactDivId, e.msg + ",下载音频" + filename + "失败");
    };
    options.headers = {
        "Accept" : "audio/mp3"
    };
    Easemob.im.Helper.download(options);
};

//异常情况下的处理方法
var handleError = function(e) {
/*    curChatRoomId = null;

    clearPageSign();
    e && e.upload && $('#fileModal').modal('hide');
    if (curUserId == null) {
        hiddenWaitLoginedUI();
        alert(e.msg + ",请重新登录");
        showLoginUI();
    } else {
        var msg = e.msg;
        if (e.type == EASEMOB_IM_CONNCTION_SERVER_CLOSE_ERROR) {
            if (msg == "" || msg == 'unknown' ) {
                alert("服务器断开连接,可能是因为在别处登录");
            } else {
                alert("服务器断开连接");
            }
        } else if (e.type === EASEMOB_IM_CONNCTION_SERVER_ERROR) {
            if (msg.toLowerCase().indexOf("user removed") != -1) {
                alert("用户已经在管理后台删除");
            }
        } else {
            alert(msg);
        }
    }*/
    //yalert(e.msg.type+'IM服务器已断开，请重试新连接');
    conn.stopHeartBeat(conn);
	//handleClosed();
	//handleOpen(conn);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//显示文字聊天记录的统一处理方法
var appendTxtMsg=function(message,group,me,history){
    //console.log(JSON.stringify(message));
    var el=$('#yguide-chat .ychatmain'),h='',self='';
	var time=new timeLine();
    if(group) el=$('#yguide-group .ychatmain');
    if(me) self='yme';
	if(isTimeLine()) self+=' ytime';
    // 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
    var localMsg = null;
    if (typeof message == 'string') {
        localMsg = Easemob.im.Helper.parseTextMessage(message);
        localMsg = localMsg.body;
    } else {
        localMsg = message.data;
    }
    //alert(localMsg);
    if(localMsg.indexOf('</dl>')>0) h='<li class="ycase '+self+'" timeline="'+time.stamp+'"><h6><span><b>'+time.date+'</b>'+time.time+'</span></h6><figure><img alt="" src="../images/yguide-portrait.png"></figure><h5>'+message.from+'</h5>'+localMsg+'</li>'
    else h='<li class="'+self+'" timeline="'+time.stamp+'"><h6><span><b>'+time.date+'</b>'+time.time+'</span></h6><figure><img alt="" src="../images/yguide-portrait.png"></figure><h5>'+message.from+'</h5><p>'+localMsg+'</p></li>';
    
    //else curel.append(h).find('li').eq(-1).get(0).scrollIntoView();
    if(history) curel.prepend(h);
    else el.append(h).find('li').eq(-1).get(0).scrollIntoView();

};

//显示表情聊天记录的统一处理方法
var appendEmoMsg=function(message,group,me,history){
    //console.log(JSON.stringify(message));
    var el=$('#yguide-chat .ychatmain'),h='',self='';
	var time=new timeLine();
    if(group) el=$('#yguide-group .ychatmain');
    if(me) self='yme';
	if(isTimeLine()) self+=' ytime';
    h='<li class="'+self+'" timeline="'+time.stamp+'"><h6><span><b>'+time.date+'</b>'+time.time+'</span></h6><figure><img alt="" src="../images/yguide-portrait.png"></figure><h5>'+message.from+'</h5><p>';
    for(var i in message.data){
        if(message.data[i].type=='emotion') h+='<img src="'+message.data[i].data+'" alt="" />';
        else if(message.data[i].type=='txt') h+=message.data[i].data;
    }
    h+='</p></li>';
    if(history) el.prepend(h);
    else el.append(h).find('li').eq(-1).get(0).scrollIntoView();
};

//显示图片记录的统一处理方法
var appendPicMsg=function(message,group,me,history){
    //console.log(JSON.stringify(message));
    var el=$('#yguide-chat .ychatmain'),h='',self='';
	var time=new timeLine();
    if(group) el=$('#yguide-group .ychatmain');
    if(me) self='yme';
	if(isTimeLine()) self+=' ytime';
    h='<li class="ypic '+self+'" timeline="'+time.stamp+'"><h6><span><b>'+time.date+'</b>'+time.time+'</span></h6><figure><img alt="" src="../images/yguide-portrait.png"></figure><h5>'+message.from+'</h5><p><img src="'+message.url+'" alt="'+message.filename+'" /></p></li>'
    
    if(history) el.prepend(h);
    else el.append(h).find('li').eq(-1).get(0).scrollIntoView();
};

//显示声音记录的统一处理方法
var appendAudioMsg=function(message,group,me,history){
    //console.log(JSON.stringify(message));
    var el=$('#yguide-chat .ychatmain'),h='',self='';
	var time=new timeLine();
    if(group) el=$('#yguide-group .ychatmain');
    if(me) self='yme';
	if(isTimeLine()) self+=' ytime';
    h='<li class="yaudio new '+self+'" timeline="'+time.stamp+'"><h6><span><b>'+time.date+'</b>'+time.time+'</span></h6><figure><img alt="" src="../images/yguide-signal2.png"></figure><h5>'+message.from+'</h5><p><audio src="'+message.src+'"></audio><span>'+message.duration+'</span>"</p></li>';
    
    if(history) el.prepend(h);
    else el.append(h).find('li').eq(-1).get(0).scrollIntoView();
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 发送文本消息
var sendText = function() {
    if (textSending) {
        return;
    }
    textSending = true;
    var pageEl=$('section:visible'),msgInput = pageEl.find('.yinputbar>input:text');
    var msg = msgInput.val();
    if (msg == null || msg.length == 0) {
        textSending = false;
        return;
    }
    var options = {
        to : pageEl.find('.ychatid').attr('name'),
        msg : msg,
		from : '我',
        type : "chat"
    };
    // 群组消息和个人消息的判断分支
    var group=false;
    if(pageEl.attr('id').indexOf('group')>0){
        options.type='groupchat',
        group=true
    }

    //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
    conn.sendTextMessage(options);
    //当前登录人发送的信息在聊天窗口中原样显示
    var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
    options.data=msgtext;
    appendTxtMsg(options,group,true);
    pageEl.find('.yemotion').velocity('fadeOut',300);
    msgInput.val('').focus();
    setTimeout(function() {
        textSending = false;
    }, 1000);
};

var pictype = {
    "jpg" : true,
    "gif" : true,
    "png" : true,
    "bmp" : true
};

//发送图片消息时调用方法
var sendPic = function() {

    var pageEl=$('section:visible'),fileInputId = pageEl.find('.yinputbar label input').attr('id');
    // Easemob.im.Helper.getFileUrl为easemobwebim-sdk获取发送文件对象的方法，fileInputId为 input 标签的id值
    var fileObj = Easemob.im.Helper.getFileUrl(fileInputId);
    if (Easemob.im.Helper.isCanUploadFileAsync && (fileObj.url == null || fileObj.url == '')) {
        yalert("请先选择图片");
        return;
    }
    var filetype = fileObj.filetype;
    var filename = fileObj.filename;
    var msgtype='chat',to=pageEl.find('.ychatid').attr('name');
    // 群组消息和个人消息的判断分支
    var group=false;
    if(pageEl.attr('id').indexOf('group')>0){
        msgtype='groupchat',
        group=true
    }
    if (!Easemob.im.Helper.isCanUploadFileAsync || filetype in pictype) {
        var opt = {
            type : msgtype,
            fileInputId : fileInputId,
            filename : flashFilename || filename,
            to : to,
            apiUrl: Easemob.im.config.apiURL,
            onFileUploadError : function(error) {
                var messageContent = (error.msg || '') + ",发送图片文件失败:" + (filename || flashFilename);
                yalert(messageContent);
            },
            onFileUploadComplete : function(data) {

                var file = document.getElementById(fileInputId),src;
                if ( Easemob.im.Helper.isCanUploadFileAsync && file && file.files) {
                    var objUrl = getObjectURL(file.files[0]);
                    if (objUrl) src = objUrl;
                    
                } else {
                    filename = data.filename || '';
                    src = data.uri + '/' + data.entities[0].uuid;
                }
                var localmsg={
                    type : 'pic',
                    to : to,
					from : '我',
                    filename : filename,
                    url : src
                };
                appendPicMsg(localmsg,group,true);
            },
            flashUpload: flashPicUpload
        };
        conn.sendPicture(opt);
        return;
    }
    yalert("不支持此图片类型" + filetype);
};




// 表情包
var emotionDialog={
    flag : false,
    init : function(){
        // Easemob.im.Helper.EmotionPicData设置表情的json数组
        var sjson = Easemob.im.EMOTIONS,
            data = sjson.map,
            path = sjson.path;
        $('.yemotion ul').empty();
        for ( var key in data) {
            var emotions = $('<img>').attr({
                "id" : key,
                "src" : path + data[key],
                "style" : "cursor:pointer;"
            });
            $('<li>').append(emotions).appendTo($('.yemotion ul')).click(function() {
                var ell=$(this).closest('.yemotion').next().find('input').eq(0);
                ell.val(ell.val()+$(this).find('img').attr('id'));
                ell.focus();
            });
        } 
    },
    show : function(){
        
    }
};
Easemob.im.EMOTIONS = {
    path: 'js/webim/faces/'
    , map: {
        '[):]': 'ee_1.png',
        '[:D]': 'ee_2.png',
        '[;)]': 'ee_3.png',
        '[:-o]': 'ee_4.png',
        '[:p]': 'ee_5.png',
        '[(H)]': 'ee_6.png',
        '[:@]': 'ee_7.png',
        '[:s]': 'ee_8.png',
        '[:$]': 'ee_9.png',
        '[:(]': 'ee_10.png',
        '[:\'(]': 'ee_11.png',
        '[:|]': 'ee_12.png',
        '[(a)]': 'ee_13.png',
        '[8o|]': 'ee_14.png',
        '[8-|]': 'ee_15.png',
        '[+o(]': 'ee_16.png',
        '[<o)]': 'ee_17.png',
        '[|-)]': 'ee_18.png',
        '[*-)]': 'ee_19.png',
        '[:-#]': 'ee_20.png',
        '[:-*]': 'ee_21.png',
        '[^o)]': 'ee_22.png',
        '[8-)]': 'ee_23.png',
        '[(|)]': 'ee_24.png',
        '[(u)]': 'ee_25.png',
        '[(S)]': 'ee_26.png',
        '[(*)]': 'ee_27.png',
        '[(#)]': 'ee_28.png',
        '[(R)]': 'ee_29.png',
        '[({)]': 'ee_30.png',
        '[(})]': 'ee_31.png',
        '[(k)]': 'ee_32.png',
        '[(F)]': 'ee_33.png',
        '[(W)]': 'ee_34.png',
        '[(D)]': 'ee_35.png'
    }
};