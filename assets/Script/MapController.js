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
        
        tiledMap:{
            default: null,
            type: cc.TiledMap
        },
        
        bgLayer:{
            default: null,
            type: cc.TiledLayer
        },
        
    },

    convertToTilePos: function(pos){
        var posX,posY
        
        if(pos.x < 0){
            posX = parseInt(pos.x / this.tileSize.width) - 1;
        }else{
            posX = parseInt(pos.x / this.tileSize.width);
        }
        
        if(pos.y < 0){
            posY = this.mapSize.height - (parseInt(pos.y/this.tileSize.height) - 1) - 1;
        }else{
            posY = this.mapSize.height - parseInt(pos.y/this.tileSize.height) - 1;
        }
        
        return cc.v2(posX,posY);
    },
    
    convertToLayerPos: function(pos){
        var posX,posY
        
        posX = (pos.x + 0.5) * this.tileSize.width;
        posY = (this.mapSize.height - pos.y - 1 + 0.5)*this.tileSize.height;
        
        return cc.v2(posX,posY);
    },

    // use this for initialization
    onLoad: function () {
        // this.mapSize = this.tiledMap.getMapSize();
        // this.tileSize = this.tiledMap.getTileSize();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
