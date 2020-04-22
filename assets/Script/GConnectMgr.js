cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        this.ADDRESS = "ws://localhost:8808";//"127.0.0.1:8808";
        this.MINID = 1;
        this.MAXID = 1000;
        this._ws = null;
        this._currentReqId = this.MINID;
        this._handlers = new Array();
        this._pushHandlers = new Array();
        
        this.init();
    },
    
    init: function(){
        cc.log("网络模块初始化!");
        this.open();
        
        var self = this;
        this._ws.onmessage = function (event) {
            var pack = JSON.parse(event.data);
            cc.log("[recv<--]: " + event.data);
            self.receive(pack);
        };
    },
    
    open: function(){
        if (this._ws){
            this.destroy();
        }
        
        this._ws = new WebSocket(this.ADDRESS);
    },
    
    destroyNet: function(){
        if (this._ws){
            this._ws.close();
            this._ws = null;
        }
    },
    
    send: function(onResponse, action, param){
        if (this._ws == null){
            cc.log("websocket == null");
            return;
        }
        if (this._ws.readyState != 1){
            cc.log("网络暂时无法通信!")
            return;
        }
        if (param == null){
            param = "";
        }
        
        var requestId = this._currentReqId;
        this.pushRequest(requestId, onResponse);
        this._currentReqId ++;
        if (this._currentReqId > this.MAXID){
            this._currentReqId = this.MINID;
        }
        
        var pack = this.createPack();
        pack.requestId = requestId;
        pack.action = action;
        pack.msg = param;
        
        this._ws.send(JSON.stringify(pack));
        cc.log("[send-->]: " + JSON.stringify(pack));
    },
    
    receive: function(pack){
        var requestId = pack.requestId;
        var action = pack.action;
        var msg = pack.msg;
        var state = msg.state;
        
        if (state == 0){
            cc.log("[request error]: "+msg.msg);
            this.removeHandler(requestId);
        }else if(state == 1){
            this.handleResponse(requestId, msg);
        }else if(state == 2){
            this.handlePush(action, msg)
        }
    },
    
    createPack: function(){
        return {
            requestId : 0,
            action : "",
            msg : {},
        };
    },
    
    createHandler: function(requestId, onResponse){
        return {
            requestId: requestId,
            onResponse: onResponse,
            time: 0,
        };  
    },

    createPushHandles: function(action, onPush){
        var handlers = new Array();
        handlers.push(onPush);
        return {
            action: action,
            handlers: handlers
        };
    },
    
    pushRequest: function(requestId, onResponse){
        var handler = this.createHandler(requestId, onResponse);
        this._handlers.push(handler);
    },
    
    handleResponse: function(requestId, msg){
        for (i = 0; i < this._handlers.length; i++){
            var handler = this._handlers[i];
            if (handler.requestId == requestId){
                handler.onResponse(msg);
                this._handlers.splice(i, 1);
                return;
            }
        }
        cc.log("数据包对应handler丢失！");
    },

    // 收到服务器推送消息，向各个事件监听器发送事件
    handlePush: function(action, msg){
        for (var i = 0; i < this._pushHandlers.length; i++){
            var actionHandlers = this._pushHandlers[i];
            if (actionHandlers.action == action){
                for (var j = 0; j < actionHandlers.handlers.length; j ++){
                    if (actionHandlers.handlers[j]){
                        actionHandlers.handlers[j](msg);
                    }
                }
                return;
            }
        }
        cc.log("push数据包对应handler丢失！");
    },
    
    removeHandler: function(requestId){
        for (i = 0; i < this._handlers.length; i++){
            var handler = this._handlers[i];
            if (handler.requestId == requestId){
                this._handlers.splice(i, 1);
                return;
            }
        }
    },
    
    // 注册推送事件监听器
    regPushEvent: function(action, handler){
        // 已经存在此action对应的handler列表，直接加入
        for (var i = 0; i < this._pushHandlers.length; i++){
            if (this._pushHandlers[i].action == action){
                this._pushHandlers[i].handlers.push(handler);
                return;
            }
        }
        // 之前没有则创建
        this._pushHandlers.push(this.createPushHandles(action, handler));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
