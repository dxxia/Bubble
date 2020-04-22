var WebSocketServer = require('ws').Server;
var netTool = {};
netTool._handlers = new Array();
netTool._sockets = new Array();
netTool._curUid = 1;

netTool.run = function(){
    var self = this;
    var wss = new WebSocketServer({host:"127.0.0.1",port:8808});
    console.log('websocket-server running...');

    wss.on('connection',function(socket){
        // 新客户端的连接
        socket._uid = self._curUid;
        self._curUid ++;
        self._sockets.push(socket);
        console.log('new connection founded successfully, id: '+ socket._uid);
        // 角色创建
        self._handlerRequest(socket._uid, "player_join");

        // 消息接收处理
        socket.on('message',function(data){
            console.log("[recv<--]:" + data);
            data = JSON.parse(data);
            data.uid = socket._uid; // 为每个消息加入客户端标识
            self._receive(data);
        });

        //退出处理
        socket.on("close", function(){
            console.log("连接断开, uid: " + socket._uid);
            self.closeSocket(socket._uid);
            // 角色注销
            self._handlerRequest(socket._uid, "player_exit");
        });

        socket.on("error", function(data){
            console.log("socket error: " + data);
        });
    });
};

// 注册消息处理方法
netTool.addRequestHandler = function(action, onRequest){
    var handler = {
        action: action,
        onRequest: onRequest,
    };
    this._handlers.push(handler);
};

// 关闭指定用户连接
netTool.closeSocket = function(uid){
    for (var i = 0; i < this._sockets.length; i ++){
        if (uid == this._sockets[i]._uid){
            this._sockets[i].close();
            console.log("befor len="+this._sockets.length);
            this._sockets.splice(i, 1);
            console.log("after len="+this._sockets.length);
            return;
        }
    }

    console.log("找不到要关闭的socket！");
};

// 向[指定]客户端发送消息
netTool.pushMsg = function(action, data, uid){ 
    var pack = this._createPack();
    pack.action = action;
    pack.msg.state = 2;
    pack.msg.data = data;
    pack = JSON.stringify(pack);
    
    for (var i = 0; i < this._sockets.length; i ++){
        if (uid && uid == this._sockets[i]._uid){
            this._sockets[i].send(pack);
            break;
        }else{
            this._sockets[i].send(pack);
        }
    }

    if (uid){
        console.log("[push-->uid: " + uid + "]: "+ pack);
    }else{
        console.log("[push-->ALL]: "+ pack);
    }
};

// 回应客户端消息
netTool._response = function(requestId, msg, uid){ 
    var pack = this._createPack();
    pack.requestId = requestId;
    pack.msg = msg;
    pack = JSON.stringify(pack);
    
    for (var i = 0; i < this._sockets.length; i ++){
        if (uid && uid == this._sockets[i]._uid){
            this._sockets[i].send(pack);
            return;
        }
    }

    console.log("[send-->uid: " + uid + "]: "+ pack);
};

// 从客户端接收消息
netTool._receive = function(pack){
    var requestId = pack.requestId;
    var action = pack.action;
    var recvMsg = pack.msg;
    var uid = pack.uid;
    
    var sendMsg = this._handlerRequest(uid, action, recvMsg);

    if (sendMsg){
        this._response(requestId, sendMsg, uid);
    }
};

// 构造发送数据包
netTool._createPack = function(){
    return {
        requestId : 0,
        action : "",
        msg : this._createMsg(),
    };
};

// 构造发送数据
netTool._createMsg = function(){
    return {
        state: 1,
        data: {},
    };
};

// 处理消息
netTool._handlerRequest = function(uid, action, msg){
    for (i = 0; i < this._handlers.length; i++){
        var handler = this._handlers[i];
        if (handler.action == action){
            var msg = handler.onRequest(uid, msg);
            return msg;
        }
    }

    var msg = this._createMsg();
    msg.state = 0;
    msg.msg = "没有相应action!";
    return msg;
};

module.exports = netTool;
