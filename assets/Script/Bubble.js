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
        stayDuration: 2,
        skillLenth: 2,
        
        water_center_prefab:{
            default: null,
            type: cc.Prefab
        },
        water_left_f_prefab: {
            default: null,
            type: cc.Prefab
        },
        water_left_prefab: {
            default: null,
            type: cc.Prefab
        },
        water_right_f_prefab: {
            default: null,
            type: cc.Prefab
        },
        water_right_prefab: {
            default: null,
            type: cc.Prefab
        },
        water_up_f_prefab: {
            default: null,
            type: cc.Prefab
        },
        water_up_prefab: {
            default: null,
            type: cc.Prefab
        },
        water_down_f_prefab: {
            default: null,
            type: cc.Prefab
        },
        water_down_prefab: {
            default: null,
            type: cc.Prefab
        },
    },

    staySkill: function(){
        this.state = 0;
        this.stayTime = 0;
    },

    boomSkill: function(){
        this.judgeEffectArea();
        this.drawEffectArea();
        this.createEffect();
        
        this.node.destroy();
    },
    
    judgeEffectArea: function(){
        var bgLayer = this.map.bgLayer;
        var tiledMap = this.map.tiledMap;
        this.centerPos = this.map.convertToTilePos(this.node.getPosition());
        var centerPos = this.centerPos;
        
        // up
        this.skillArea_up = 0;
        while(true){
            if(this.skillArea_up + 1 > this.skillLenth){
                break;
            }
            
            var scanTilePos = cc.v2(centerPos.x, centerPos.y - this.skillArea_up - 1);
            if(scanTilePos.y < 0){
                break;
            }
            var GID = bgLayer.getTileGIDAt(scanTilePos);
            var property = tiledMap.getPropertiesForGID(GID);
            if(property.moveable == "false"){
                break;
            }
            
            this.skillArea_up++;
        }
        
        // down
        this.skillArea_down = 0;
        while(true){
            if(this.skillArea_down + 1 > this.skillLenth){
                break;
            }
            
            var scanTilePos = cc.v2(centerPos.x, centerPos.y + this.skillArea_down + 1);
            if(scanTilePos.y > this.map.mapSize.height - 1){
                break;
            }
            var GID = bgLayer.getTileGIDAt(scanTilePos);
            var property = tiledMap.getPropertiesForGID(GID);
            if(property.moveable == "false"){
                break;
            }
            
            this.skillArea_down++;
        }
        
        // left
        this.skillArea_left = 0;
        while(true){
            if(this.skillArea_left + 1 > this.skillLenth){
                break;
            }
            
            var scanTilePos = cc.v2(centerPos.x - this.skillArea_left - 1, centerPos.y);
            if(scanTilePos.x < 0){
                break;
            }
            var GID = bgLayer.getTileGIDAt(scanTilePos);
            var property = tiledMap.getPropertiesForGID(GID);
            if(property.moveable == "false"){
                break;
            }
            
            this.skillArea_left++;
        }
        
        // right
        this.skillArea_right = 0;
        while(true){
            if(this.skillArea_right + 1 > this.skillLenth){
                break;
            }
            
            var scanTilePos = cc.v2(centerPos.x + this.skillArea_right + 1, centerPos.y);
            if(scanTilePos.x > this.map.mapSize.width - 1){
                break;
            }
            var GID = bgLayer.getTileGIDAt(scanTilePos);
            var property = tiledMap.getPropertiesForGID(GID);
            if(property.moveable == "false"){
                break;
            }
            
            this.skillArea_right++;
        }
        
    },

    drawEffectArea: function(){
        var c_water = cc.instantiate(this.water_center_prefab);
        var lf_water = cc.instantiate(this.water_left_f_prefab);
        var rf_water = cc.instantiate(this.water_right_f_prefab);
        var uf_water = cc.instantiate(this.water_up_f_prefab);
        var df_water = cc.instantiate(this.water_down_f_prefab);
        
        this.map.node.addChild(c_water);
        c_water.setPosition(this.node.getPosition())
        
        for(var i = 1; i <= this.skillArea_left; i++){
            if(i == this.skillArea_left){
                c_water.addChild(lf_water);
                lf_water.setPosition(-i * this.map.tiledMap.getTileSize().width, 0);
            }else{
                var l_water = cc.instantiate(this.water_left_prefab);
                c_water.addChild(l_water);
                l_water.setPosition(-i * this.map.tiledMap.getTileSize().width, 0);
            }
        }
        for(var i = 1; i <= this.skillArea_right; i++){
            if(i == this.skillArea_right){
                c_water.addChild(rf_water);
                rf_water.setPosition(i * this.map.tiledMap.getTileSize().width, 0);
            }else{
                var r_water = cc.instantiate(this.water_right_prefab);
                c_water.addChild(r_water);
                r_water.setPosition(i * this.map.tiledMap.getTileSize().width, 0);
            }
        }
        for(var i = 1; i <= this.skillArea_up; i++){
            if(i == this.skillArea_up){
                c_water.addChild(uf_water);
                uf_water.setPosition(0, i * this.map.tiledMap.getTileSize().height);
            }else{
                var u_water = cc.instantiate(this.water_up_prefab);
                c_water.addChild(u_water);
                u_water.setPosition(0, i * this.map.tiledMap.getTileSize().height);
            }
        }
        for(var i = 1; i <= this.skillArea_down; i++){
            if(i == this.skillArea_down){
                c_water.addChild(df_water);
                df_water.setPosition(0, -i * this.map.tiledMap.getTileSize().height);
            }else{
                var d_water = cc.instantiate(this.water_down_prefab);
                c_water.addChild(d_water);
                d_water.setPosition(0, -i * this.map.tiledMap.getTileSize().height);
            }
        }
        
        c_water.runAction(cc.sequence(cc.fadeOut(0.5),cc.callFunc(function(){
            c_water.destroy();
        })));
    },
    
    createEffect: function(){
        var player = this.map.player;
        var pos = this.map.convertToTilePos(player.getPosition());
        
        var kill = false;
        if(pos.x == this.centerPos.x){
            if(pos.y - this.centerPos.y >= -this.skillArea_up && pos.y - this.centerPos.y <= this.skillArea_down){
                kill = true;
            }
        }
        else if(pos.y == this.centerPos.y){
            if(pos.x - this.centerPos.x >= -this.skillArea_left && pos.x - this.centerPos.x <= this.skillArea_right){
                kill = true;
            }
        }
        
        if(kill == true){
            player.getComponent("Player").killed();
        }
    },

    // use this for initialization
    onLoad: function () {
        this.staySkill();
        this.map = this.node.parent.getComponent("Map");
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.state == 0){
            if(this.stayTime >= this.stayDuration){
                this.boomSkill();
            }else{
                this.stayTime += dt;
            }
        }
    },
});
