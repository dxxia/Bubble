var TiledMap = require("./TiledMap");
var Net = require("./Net");

var Player = function(uid){
	//坐标
	this.pos = {x: 0, y: 0};
	//重生坐标
	this.bornPos = {x: 0, y: 0};
	//移动方向
	this.moveDirect = "stay"; // stay,up,down,left,right
	//移动速度
    this.moveSpeed = 100;
    //id
    this.uid = uid;
    //队伍id
    this.teamId = 0;

    this.born = function(){
    	this.pos = this.bornPos;
    };

    this.onExit = function(){

    };

    this.move = function(dt){
	    if(this.moveDirect == "stay"){
	        return;
	    }
	    if(!TiledMap.moveJudge(this.pos, this.moveDirect)){
	    	console.log("此路不通!");
	    	this.setMoveDirection("stay");
	        return;
	    }
	    
	    switch(this.moveDirect){
	        case "up":
	            this.pos.y += this.moveSpeed * dt;
	            break;
	        case "down":
	            this.pos.y -= this.moveSpeed * dt;
	            break;
	        case "left":
	            this.pos.x -= this.moveSpeed * dt;
	            break;
	        case "right":
	            this.pos.x += this.moveSpeed * dt;
	            break;
	    }
	};

	this.setPosition = function(pos){
		this.pos = pos;
	};

	this.getPosition = function(){
		return this.pos;
	};

	this.setBornPos = function(pos){
		this.bornPos = pos;
	};

	this.setMoveDirection = function(moveDirect){
		if (this.moveDirect == moveDirect){
			return;
		}

		if (!TiledMap.moveJudge(this.pos, moveDirect)){
			this.moveDirect = "stay";
			console.log("此路不通!");
			return;
		}

		this.moveDirect = moveDirect;

		Net.pushMsg("directionModify", {
			uid: this.uid,
			direction: moveDirect
		})
	};

	this.update = function(dt){
		this.move(dt);
	};

};


module.exports = Player;