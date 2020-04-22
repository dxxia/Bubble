var TiledMap = {
	weight: 16,
	height: 9,
	tileWeight: 40,
	tileHeight: 40,
	playerBornPos: [{x: 20, y: 340, playerId: 0}, {x: 20, y: 20, playerId: 0},
					{x: 620, y: 20, playerId: 0}, {x: 620, y: 340, playerId: 0}],
	tiles: [[0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0],
			[0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
			[0,1,0,1,0,1,0,0,0,0,1,0,1,0,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0]]
};

TiledMap.convertToTilePos = function(pos){
    var posX,posY;
    
    if(pos.x < 0){
        posX = parseInt(pos.x / this.tileWeight) - 1;
    }else{
        posX = parseInt(pos.x / this.tileWeight);
    }
    
    if(pos.y < 0){
        posY = parseInt(pos.y/this.tileHeight) - 1;
    }else{
        posY = parseInt(pos.y/this.tileHeight);
    }
    
    return {x: posX, y: posY};
};
    
TiledMap.convertToLayerPos = function(pos){
    var posX,posY;
    
    posX = (pos.x + 0.5) * this.tileSize.width;
    posY = (pos.y + 0.5) * this.tileSize.height;
    
    return {x: posX, y: posY};
};

TiledMap.getTile = function(tilePos){
	return this.tiles[this.height - 1 - tilePos.y][tilePos.x]
};


// 初始化player重生位置
TiledMap.createBornPos = function(playerId){
	for (var i = 0; i < this.playerBornPos.length; i ++){
		var pos = this.playerBornPos[i];
		if (pos.playerId == 0){
			pos.playerId = playerId;
			return {x: pos.x, y: pos.y};
		}
	}

	console.log("位置异常，未找到合适重生点!");
};

//解除player相关占用
TiledMap.removePlayer = function(playerId){
	for (var i = 0; i < this.playerBornPos.length; i ++){
		var pos = this.playerBornPos[i];
		if (pos.playerId == playerId){
			pos.playerId = 0;
			return;
		}
	}

	console.log("解除重生点占用异常，未找到相应重生点!");
};

//判断是否可以移动
TiledMap.moveJudge = function(pos, moveDirect){
	switch(moveDirect){
        case "up":
            var nextPoint = this.convertToTilePos({x: pos.x, y: pos.y + this.tileHeight / 2 + 1});
            // 边界判断
            if (nextPoint.y >= this.height){
                return false;
            }
            // 板块判断
            var moveable = this.getTile(nextPoint);
            if(moveable == 1){
                return false;
            }
            
            break;
        case "down":
            var nextPoint = this.convertToTilePos({x: pos.x, y: pos.y - this.tileHeight / 2 - 1});
            // 边界判断
            if (nextPoint.y < 0){
                return false;
            }
            // 板块判断
            var moveable = this.getTile(nextPoint);
            if(moveable == 1){
                return false;
            }
            
            break;
        case "left":
            var nextPoint = this.convertToTilePos({x: pos.x - this.tileWeight / 2 - 1, y: pos.y});
            // 边界判断
            if (nextPoint.x < 0){
                return false;
            }
            // 板块判断
            var moveable = this.getTile(nextPoint);
            if(moveable == 1){
                return false;
            }
            
            break;
        case "right":
            var nextPoint = this.convertToTilePos({x: pos.x + this.tileWeight / 2 + 1, y: pos.y});
            // 边界判断
            if (nextPoint.x >= this.weight){
                return false;
            }
            // 板块判断
            var moveable = this.getTile(nextPoint);
            if(moveable == 1){
                return false;
            }
            
            break;
    }
        
        
    return true;
};

module.exports = TiledMap;