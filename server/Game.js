var Game = {};
var Net = require("./Net");
var TiledMap = require("./TiledMap");
var Player = require("./Player");
//var Bubble = require("./Bubble");

var players = new Array();
//var bubbles = new Array();
var MAXMEMBER = 4;

// 启动服务器
Net.run();

// 监听玩家加入离开
Net.addRequestHandler("player_join", function(uid){
    if (players.length >= MAXMEMBER){
        console.log("房间人数已满！");
        Net.closeSocket(uid);
        return;
    }

    console.log("玩家"+uid+"加入了房间!");
    Game.playerJoin(uid);
});
Net.addRequestHandler("player_exit", function(uid){
    console.log("玩家"+uid+"退出了房间!");
    Game.playerExit(uid);
});



// 监听玩家移动
Net.addRequestHandler("move", function(uid, msg){
    console.log("move: "+msg.direction);

    for (var i = 0; i < players.length; i ++){
        var player = players[i];
        if (uid == player.uid){
            player.setMoveDirection(msg.direction);
            return;
        }
    }
});

// 监听技能
Net.addRequestHandler("skill", function(msg){

});


//调用主循环更新游戏
var lastTime = Date.now();
setInterval(function(){
    var curTime = Date.now();
    Game.update((curTime - lastTime)/ 1000);
    lastTime = curTime;
}, 1000/60);

/*****************************************************************/

// 玩家加入处理
Game.playerJoin = function(uid){
    var player = new Player(uid);
    players.push(player);
    // 设置重生点
    var bornPos = TiledMap.createBornPos(uid);
    player.setBornPos(bornPos);
    player.born();

    //广播
    Net.pushMsg("playerJoin",{
        uid: uid,
        pos: player.getPosition(),
        moveDirect: "stay"
    });

    //登录信息
    Net.pushMsg("userInfo",{
        uid: uid
    }, uid);

    //游戏信息
    var playerInfos = new Array();
    for (var i = 0; i < players.length; i ++){
        playerInfos.push({
            uid: players[i].uid,
            pos: players[i].pos,
            moveDirect: players[i].moveDirect
        });
    }
    Net.pushMsg("roomInfo", {
        playerInfo: playerInfos
    }, uid);
};

// 玩家退出处理
Game.playerExit = function(uid){
    for (var i = 0; i < players.length; i++){
        var player = players[i];
        if (player.uid == uid){
            player.onExit();
            TiledMap.removePlayer(uid);
            players.splice(i, 1);
            Net.pushMsg("playerExit",{
                uid: uid
            });
            return;
        }
    }
    console.log("退出时未找到相应player");
};

// 主计时器
Game.update = function(dt){
    //角色移动
    for (var i = 0; i < players.length; i++){
        players[i].update(dt);
    }
};