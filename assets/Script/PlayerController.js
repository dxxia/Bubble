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
        playerPrefab: {
        	default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        this._players = new Array();
        this.GConnectMgr = this.node.getComponent("RoomController").Main.getComponent("GConnectMgr");
        this.tiledMap = this.node.getComponent("RoomController").Map;
        
        this.init();
    },
    
    init: function(){
        var self = this;
        this.GConnectMgr.regPushEvent("playerJoin", function(pack){
            //生成新角色
            self.createPlayer(pack.data);
        });
        
        this.GConnectMgr.regPushEvent("playerExit", function(pack){
            //清楚角色
            self.removePlayer(pack.data.uid);
        });
        
        this.GConnectMgr.regPushEvent("directionModify", function(pack){
            var uid = pack.data.uid;
            var direct = pack.data.direction;
            
            for (var i = 0; i < self._players.length; i++){
                var player = self._players[i].getComponent("Player");
                if (player.uid == uid){
                    player.setMoveDirect(direct);
                    break;
                }
            }
        });
    },

    createPlayer: function(playerInfo){
    	var newPlayer = cc.instantiate(this.playerPrefab);
        var player_js = newPlayer.getComponent("Player");
        player_js.init(playerInfo);
        this.tiledMap.node.addChild(newPlayer);

        this._players.push(newPlayer);
    },
    
    removePlayer: function(uid){
        for (var i = 0; i < this._players.length; i++){
            var player = this._players[i].getComponent("Player");
            if (player.uid == uid){
                this._players[i].removeFromParent();
                this._players.splice(i, 1);
                
                return;
            }
        }
        
        cc.log("移除角色失败 uid="+uid);
    },
    
    setInfo: function(playerInfo){
    	for (var i = 0; i < playerInfo.length; i++){
    		var info = playerInfo[i];

    		// 对于不存在的角色创建
    		var isExist = false;
    		for (var j = 0; j < this._players.length; j++){
    			if (this._players[j].getComponent("Player").uid == info.uid){
    				isExist = true;
    				break;
    			}
    		}
    		if (isExist == false){
    			this.createPlayer(info);
    		}
    	}
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
