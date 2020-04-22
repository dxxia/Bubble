cc.Class({
    extends: cc.Component,

    properties: {
        Main:{
            default:null,
            type:cc.Node
        },
        Map:{
            default: null,
            type:cc.TiledMap
        },
        
        btn_up:{
            default:null,
            type:cc.Button
        },
        btn_down:{
            default:null,
            type:cc.Button
        },
        btn_left:{
            default:null,
            type:cc.Button
        },
        btn_right:{
            default:null,
            type:cc.Button
        },
        btn_skill:{
            default:null,
            type:cc.Button
        }
    },

    // use this for initialization
    onLoad: function () {
        this.GConnectMgr = this.Main.getComponent("GConnectMgr");
        this.PlayerController = this.getComponent("PlayerController");
        
        this.roomInfo = null;
        this.init();
    },
    
    init: function(){
        var self = this;
        
        //房间信息
        self.GConnectMgr.regPushEvent("roomInfo", function(pack){
            self.roomInfo = pack.data;
            
            //玩家信息
            self.PlayerController.setInfo(self.roomInfo.playerInfo);
        });
        
        // up
        this.btn_up.node.on("touchstart", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "up"});
        });
        this.btn_up.node.on("touchend", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "stay"});
        });
        this.btn_up.node.on("touchcancel", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "stay"});
        });
        //down
        this.btn_down.node.on("touchstart", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "down"});
        });
        this.btn_down.node.on("touchend", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "stay"});
        });
        this.btn_down.node.on("touchcancel", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "stay"});
        });
        //left
        this.btn_left.node.on("touchstart", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "left"});
        });
        this.btn_left.node.on("touchend", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "stay"});
        });
        this.btn_left.node.on("touchcancel", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "stay"});
        });
        //right
        this.btn_right.node.on("touchstart", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "right"});
        });
        this.btn_right.node.on("touchend", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "stay"});
        });
        this.btn_right.node.on("touchcancel", function(){
            self.GConnectMgr.send(function(pack){}, "move", {direction: "stay"});
        });
        //skill
        this.btn_skill.node.on("touchstart", function(){
            //player.bubble();
        });
    }
    // called every frame
    // update: function (dt) {

    // },
});
