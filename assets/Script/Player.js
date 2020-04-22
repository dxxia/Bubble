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
        bubblePrefab: {
            default: null,
            type: cc.Prefab
        },
        
        deadPic:{
            default: "",
            url: cc.Texture2D
        },
        norPic:{
            default: "",
            url: cc.Texture2D
        },
        
        //移动速度
        moveSpeed: 100,
        //id
        uid: 0,
        //队伍id
        teamId: 0,
    },
    
    init: function(initData){
        this.uid = initData.uid;
        this.node.setPosition(initData.pos);
        this.moveDirect = initData.moveDirect;
    },
    
    movePlayer: function(dt){
        if(this.moveDirect == "stay"){
            return;
        }

        switch(this.moveDirect){
            case "up":
                this.node.y += this.moveSpeed * dt;
                break;
            case "down":
                this.node.y -= this.moveSpeed * dt;
                break;
            case "left":
                this.node.x -= this.moveSpeed * dt;
                break;
            case "right":
                this.node.x += this.moveSpeed * dt;
                break;
        }
    },
    
    bubble: function(){
        var tileMap = this.node.parent.getComponent(cc.TiledMap);
        var mapSize = tileMap.getMapSize();
        var tileSize = tileMap.getTileSize();
        var bgLayer = this.node.parent.getChildByName("bg_layer").getComponent(cc.TiledLayer);
        
        var newBubble = cc.instantiate(this.bubblePrefab);
        var pos = cc.v2(parseInt(this.node.x / tileSize.width) , mapSize.height - parseInt(this.node.y / tileSize.height) - 1);
        var tile = bgLayer.getTileAt(pos);
        tileMap.node.addChild(newBubble);
        newBubble.setPosition(tile.getPositionX() + tileSize.width/2, tile.getPositionY() + tileSize.height/2);
    },
    
    killed:function(){
        var self = this;
        self.state = "killed";
        self.moveDirect = "stay";
        self.node.getComponent(cc.Sprite).spriteFrame.setTexture(self.deadPic);
        setTimeout(function() {
            self.state = "normal";
            self.node.getComponent(cc.Sprite).spriteFrame.setTexture(self.norPic);
            self.node.setPosition(20, 340);
        }, 3000);
    },
    
    setMoveDirect: function(moveDirect){
        cc.log("movedirect modify: "+moveDirect);
        this.moveDirect = moveDirect;
    },

    // use this for initialization
    onLoad: function () {
        this.moveDirect = "stay";
        this.state = "normal";
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.movePlayer(dt);
    },
});
