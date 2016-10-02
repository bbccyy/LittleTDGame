var _TD = {
	loading: [],
	init: function () {

    var i, TD = {

      init: function () {

				document.getElementById('post').style.display = 'none';
				document.getElementById('pre').style.display = 'block';
				document.getElementById('over').style.display = 'none';

				TD.lang.setMoney(TD.cfg.money);
				TD.lang.setWave(TD.wave);
				TD.lang.setScore(TD.score);

				var spriteHandler = new TD.spriteSheetHandler();

				spriteHandler.init({type : 'monster'});
				spriteHandler.init({type : 'explode'});
				spriteHandler.init({type : 'scene'});
				spriteHandler.init({type : 'turret'});

				TD.map = new TD.createMap();

			},

			start : function(){
				this.runner.addEventListener('click', TD.onClick_runner, false);
				this.pauseElement.addEventListener('click', TD.onClick_pause, false);

				TD.bldCtrl = new TD.buildingController();
				//console.log("haha2");
				for(var idx=0; idx<this.terminalNodePool.length; idx++){
					var node = this.terminalNodePool[idx];
					this.aliveTerminals[node] =
						new TD.terminalBuilding(node.position, node, TD.cfg.Buildings['building-5']);
					TD.bloodBarQueue.push(new TD.bloodBar(this.aliveTerminals[node]));
				}
				//TD.buildNextWave();
				//this.monsterQueue.push(new this.monster(this.root, 10, 1));
				this.ucx.clearRect(0, 0, this.width, this.height);
				TD.lang.showBuildingInfo();
			},

			onClick_runner : function(){
				if(TD.beforeRun){
					TD.beforeRun = false;
					document.getElementById('run').style.display = 'none';
					document.getElementById('pause').style.display = 'block';
					TD.step();
				}else{
					TD.pause = false;
					document.getElementById('run').style.display = 'none';
					document.getElementById('pause').style.display = 'block';
				}
			},

			onClick_pause : function(){
				TD.pause = true;
				document.getElementById('run').style.display = 'block';
				document.getElementById('pause').style.display = 'none';
			},

			step : function(){
				_this = TD;
				//TD.terminalTmpBuffer = [];

				if(TD.GameOver){
					clearTimeout(_this._st);
					TD.gameOver();
					return;
				}

				if(TD.waitingForNextWave==false && _this.monsterQueue.length==0){
					// won't stop the main thread, but after 6s, another thread will run bulidNextWave
					// then monsterQueue will have something new
					TD.waitingForNextWave = true;  // prevent create multiple setTimeout thread
					TD.lang.levelUp();
					TD.lang.setWave(TD.wave+1);
					setTimeout(TD.buildNextWave , 3000);
				}
				else{  // not waiting for next wave OR  still has alive monsters in queue

					if(!TD.pause){
						_this.ucx.clearRect(0, 0, _this.cfg.width, _this.cfg.height);
						while(_this.eventQueue.length>0){
							var e = _this.eventQueue.shift();
							_this.drawer(e);
						}

						var size = _this.grassQueue.length;
						while(size > 0){
							size--;
							var el = _this.grassQueue.shift();
							if(el.alive){
								_this.eventQueue.push(el);
								_this.grassQueue.push(el);
							}
						}

						var size = _this.irremovalbeGrassQueue.length;
						while(size > 0){
							size--;
							var el = _this.irremovalbeGrassQueue.shift();
							if(el.alive){
								_this.eventQueue.push(el);
								_this.irremovalbeGrassQueue.push(el);
							}
						}
					}

					//1
					var size = _this.monsterQueue.length, key;
					while(size > 0){
						size--;
						var el = _this.monsterQueue.shift();
						if(el.move() == true){
							_this.monsterQueue.push(el);
						}
					}

					//2
					size = _this.buildingQueue.length;
					while(size > 0){
						size--;
						var el = _this.buildingQueue.shift();
						if(el.move() == true){
							_this.buildingQueue.push(el);
						}
					}

					//2.5
					size = _this.inBuildingQueue.length;
					while(size > 0){
						size--;
						var el = _this.inBuildingQueue.shift();
						if(el.move() == true){
							_this.inBuildingQueue.push(el);
						}
					}

					if(!TD.pause){
						//3
						for(key in TD.deadTerminals){
							if(!TD.deadTerminals.hasOwnProperty(key)) continue;
							var el = TD.deadTerminals[key];
							el.move();
						}
					}

					//4
					for(key in TD.aliveTerminals){
						if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
						var el = TD.aliveTerminals[key];
						if(el.move() == false){
							TD.deadTerminals[key] = el;
							delete TD.aliveTerminals[key];
						}
					}

					if(TD.terminalTmpBuffer.length > 0){  // this step makes sure that no latter object covers over front object
						TD.terminalTmpBuffer.sort(function(a,b){return a.position[1] - b.position[1];});
						while(TD.terminalTmpBuffer.length > 0){
							TD.eventQueue.push(TD.terminalTmpBuffer.shift());
						}
					}

					//5~ 6
					if(!TD.pause){
						size = _this.bloodBarQueue.length;
						while(size > 0){
							size--;
							var el = _this.bloodBarQueue.shift();
							if(el.move() == true){
								_this.bloodBarQueue.push(el);
							}
						}

						size = _this.bulletQueue.length;
						while(size > 0){
							size--;
							var el = _this.bulletQueue.shift();
							if(el.move() == true){
								_this.bulletQueue.push(el);
							}
						}
					}

				}  // end of else

				_this._st = setTimeout(function(){
					_this.step();
				},30);

			}

    };

    for (i = 0; this.loading[i]; i++) {
      this.loading[i](TD);
    }
    TD.init();
  }
};  //end of td.js


_TD.loading.push(function(TD){
  TD.cfg = {
    height : 500,   // main canvas size

    width : 500,

    Restriction : [[[100,0],[0,100]],[[500-100, 500],[500, 500-100]]],   //  use to check user's stroke if out of boundary

    taRestriction : [[450,500],[500,450]],   // use to find which one the our final target

    dirC : [[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]],

    dirD : [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]],

    Dir : [[[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]], [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]]],

    buildingR : 20,    // show how large the building is on map

    monsterR : 10,    // the max radius of a monster could be

    bulletSize1 : 1,   // the size of bullet, radius of bullet

    bulletSize2 : 1,

    bulletSize3 : 2,

    maxLevel : 3,

    maxNumberOfMonsterPerWave : 10,

    money : 500,

    density : 10,

    speedMapping : function( area ){
      if(area <= 350) return 1;
      else if(area <= 700) return 0.9;
      else return 0.5;
    },

    monster : function( ctx, position ){
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(position[0],position[1],5,0,2*Math.PI);
      ctx.fill();
    },

    mouse : function ( ctx, c, cfg ){
      this.clearAll(ctx, c);
      ctx.beginPath();
      ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      ctx.fillStyle = 'rgba(225,0,0,0.2)';
      if(cfg.buildable == true){
        ctx.fillStyle = 'rgba(0,255,0,0.2)';
      }
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
    },

    clearAll : function ( ctx, c ){
      ctx.clearRect(0,0,c.width, c.height);
    },

    bar : function ( ctx, cfg ){
      var posOut = cfg.position, posIn = cfg.positionIn;
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.moveTo(posOut[0][0],posOut[0][1]);
      ctx.lineTo(posOut[1][0],posOut[1][1]);
      ctx.stroke();

      ctx.beginPath();
			if(cfg.shield==true){
        ctx.strokeStyle = "rgba(68, 51, 250, 1)";
      }else{
        ctx.strokeStyle = "lightgreen";
      }
      ctx.lineWidth = 3;
      ctx.moveTo(posIn[0][0],posIn[0][1]);
      ctx.lineTo(posIn[1][0],posIn[1][1]);
      ctx.stroke();
    },

    bullet_small : function( ctx, cfg ){
      if(cfg.exploding == undefined){
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], this.bulletSize1, 0, 2*Math.PI, false);
        ctx.fillStyle = "rgba(118, 93, 5, 1)";
        ctx.fill();
      }else{
        // ctx.arc(cfg.position[0], cfg.position[1], cfg.exploding, 0, 2*Math.PI, false);
        // ctx.fillStyle = "rgba(215, 140, 66, 0.7)";
        TD.drawSprite(ctx, 'explode', cfg.exploding, cfg.position[0], cfg.position[1]);
      }
    },

    bullet_middle : function( ctx, cfg ){
      if(cfg.exploding == undefined){
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], this.bulletSize2, 0, 2*Math.PI, false);
        ctx.fillStyle = "#40CF8E";
        ctx.fill();
      }else{
        // ctx.arc(cfg.position[0], cfg.position[1], cfg.exploding, 0, 2*Math.PI, false);
        // ctx.fillStyle = "rgba(215, 140, 66, 0.7)";
        TD.drawSprite(ctx, 'explode', cfg.exploding, cfg.position[0], cfg.position[1]);
      }
    },

    bullet_large : function( ctx, cfg ){
      if(cfg.exploding == undefined){
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], this.bulletSize3, 0, 2*Math.PI, false);
        ctx.fillStyle = "#AB4F80";
        ctx.fill();
      }else{
        // ctx.arc(cfg.position[0], cfg.position[1], cfg.exploding, 0, 2*Math.PI, false);
        // ctx.fillStyle = "rgba(215, 140, 66, 0.7)";
        TD.drawSprite(ctx, 'explode', cfg.exploding, cfg.position[0], cfg.position[1]);
      }
    },

    bullet_layser : function( ctx, cfg ){
      if(cfg.position == undefined) return;
      if(cfg.hostType == undefined || cfg.hostType == 'building-4'){
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(210, 50, 205, 1)';
        ctx.lineWidth = 2;
				ctx.lineCap="round";
        ctx.moveTo(cfg.origin[0], cfg.origin[1]);
        ctx.lineTo(cfg.position[0], cfg.position[1]);
        ctx.stroke();
      }
      else if(cfg.hostType == 'monster-4'){
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(156, 81, 58, 1)';
        ctx.lineWidth = 2;
				ctx.lineCap="round";
        ctx.moveTo(cfg.origin[0], cfg.origin[1]);
        ctx.lineTo(cfg.position[0], cfg.position[1]);
        ctx.stroke();
      }
      else{  // should be terminal building
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(24, 85, 205, 1)';
        ctx.lineWidth = 3;
				ctx.lineCap="round";
        ctx.moveTo(cfg.origin[0], cfg.origin[1]);
        ctx.lineTo(cfg.position[0], cfg.position[1]);
        ctx.stroke();
      }
    },

    bullet_missile : function(ctx, cfg ){
      ctx.beginPath();
      var idx, e;
			if(cfg.track != undefined && cfg.track[0] != undefined){
        ctx.moveTo(cfg.track[0][0][0], cfg.track[0][0][1]);
        for(idx=0; idx<cfg.track.length; idx++){
          e = cfg.track[idx];
          ctx.strokeStyle = 'rgba(251, 212, 40, 0.5)';
          ctx.lineWidth = 1;
          ctx.lineTo(e[1][0], e[1][1]);
        }
        ctx.stroke();
      }
      if(cfg.exploding != undefined){
        // ctx.beginPath();
        // ctx.arc(cfg.position[0], cfg.position[1], cfg.exploding, 0, 2*Math.PI, false);
        // ctx.fillStyle = "rgba(215, 140, 66, 0.7)";
        // ctx.fill();
        TD.drawSprite(ctx, 'explode', cfg.exploding, cfg.position[0], cfg.position[1]);
      }else if(cfg.track.length > 1){
        if(cfg.catnon){
          var x = e[1][0], y = e[1][1], img = TD.catnonImg;
          var baseLine = [ e[0] ,  [x-10, y] ];
          var angle = TD.lang.getAngle360(baseLine, e);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.translate(-21, -13);
          ctx.drawImage(img, 0, 0, 42, 26);
          ctx.restore();
        }else{
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
          ctx.lineWidth = 2;
          ctx.moveTo(e[0][0], e[0][1]);
          ctx.lineTo(e[1][0], e[1][1]);
          ctx.stroke();
        }
      }
    },

    grass : function( ctx, cfg ){
      var x = cfg.position[0], y = cfg.position[1];
      var spriteSheet = TD.gSpriteSheets['scene'];
      spt = spriteSheet.getStats(cfg.spritename);
      var feature = cfg.spritename[7];
      if(feature == '6' || feature == '9' || feature == '0'){
        var hlf = {
          x : spt.cx,
          y : spt.cy
        };
        ctx.drawImage(spriteSheet.img, spt.x, spt.y,
           spt.w, spt.h, x+hlf.x, y+hlf.y, spt.w, spt.h);
      }else{
        var hlf = {
          x : spt.cx/2,
          y : spt.cy/2
        };
        ctx.drawImage(spriteSheet.img, spt.x, spt.y,
           spt.w, spt.h, x+hlf.x, y+hlf.y, spt.w/2, spt.h/2);
      }
    },

    mst1 : function ( ctx, cfg ){
      // ctx.beginPath();
      // ctx.fillStyle = 'rgba(130, 142, 16, 1)';
      // ctx.arc(cfg.position[0], cfg.position[1], this.monsterR/2, 0, 2*Math.PI, false);
      // ctx.fill();
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = 'black';
      // ctx.stroke();
      TD.drawSprite(ctx, cfg.type, cfg.spritename, cfg.position[0], cfg.position[1]);
    },

    mst2 : function ( ctx, cfg ){
      // ctx.beginPath();
      // ctx.fillStyle = 'rgba(142, 16, 41, 1)';
      // ctx.arc(cfg.position[0], cfg.position[1], this.monsterR, 0, 2*Math.PI, false);
      // ctx.fill();
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = 'black';
      // ctx.stroke();
      TD.drawSprite(ctx, cfg.type, cfg.spritename, cfg.position[0], cfg.position[1]);
    },

    mst3 : function ( ctx, cfg ){
      // var d1 = 0.866* this.monsterR, d2 = this.monsterR/2;
      // ctx.beginPath();
      // ctx.moveTo(cfg.position[0], cfg.position[1]+this.monsterR);
      // ctx.lineTo(cfg.position[0] - d1, cfg.position[1]-d2);
      // ctx.lineTo(cfg.position[0] + d1, cfg.position[1]-d2);
      // ctx.closePath();
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = 'black';
      // ctx.stroke();
      // ctx.fillStyle = 'rgba(16, 66, 142, 1)';
      // ctx.fill();
      TD.drawSprite(ctx, cfg.type, cfg.spritename, cfg.position[0], cfg.position[1]);
    },

    mst4 : function ( ctx, cfg ){
      // var d1 = this.monsterR * 0.707;
      // ctx.beginPath();
      // ctx.rect(cfg.position[0]-d1, cfg.position[1]-d1, 2*d1, 2*d1);
      // ctx.fillStyle = 'rgba(142, 83, 16, 1)';
      // ctx.fill();
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = 'black';
      // ctx.stroke();
      TD.drawSprite(ctx, cfg.type, cfg.spritename, cfg.position[0], cfg.position[1]);
    },

    bld1 : function( ctx, cfg ){
      // ctx.beginPath();
      // ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      // ctx.fillStyle = "blue";
      // ctx.fill();
      // ctx.lineWidth = 0.5;
      // ctx.strokeStyle = '#003300';
      // ctx.stroke();
      // ctx.beginPath();
      // ctx.lineWidth = 2;
      // ctx.moveTo(cfg.cannon[0][0], cfg.cannon[0][1]);
      // ctx.lineTo(cfg.cannon[1][0], cfg.cannon[1][1]);
      // ctx.stroke();
      // position : this.position,
      // type : this.type,   //building type, indicate the outline of building
      // angle : this.angle,
      // frame : 0
      var x = cfg.position[0], y = cfg.position[1];
      var spriteSheet = TD.gSpriteSheets['turret'];
      TD.turretFrame[cfg.type];
      spt = spriteSheet.getStats(TD.turretFrame[cfg.type][cfg.frame]);
      var hlf = {
        x : 25,
        y : 15
      };
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(cfg.angle);
      ctx.translate(-hlf.x, -hlf.y);
      ctx.drawImage(spriteSheet.img, spt.x, spt.y,
         spt.w, spt.h, 0, 0, 40, 30);
      ctx.restore();

      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      }
    },

    bld2 : function( ctx, cfg ){
      // ctx.beginPath();
      // ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      // ctx.fillStyle = "red";
      // ctx.fill();
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = '#003300';
      // ctx.stroke();
      // ctx.lineWidth = 2;
      // ctx.moveTo(cfg.cannon[0][0], cfg.cannon[0][1]);
      // ctx.lineTo(cfg.cannon[1][0], cfg.cannon[1][1]);
      // ctx.stroke();
      var x = cfg.position[0], y = cfg.position[1];
      var spriteSheet = TD.gSpriteSheets['turret'];
      TD.turretFrame[cfg.type];
      spt = spriteSheet.getStats(TD.turretFrame[cfg.type][cfg.frame]);
      var hlf = {
        x : 25,
        y : 15
      };
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(cfg.angle);
      ctx.translate(-hlf.x, -hlf.y);
      ctx.drawImage(spriteSheet.img, spt.x, spt.y,
         spt.w, spt.h, 0, 0, 40, 30);
      ctx.restore();
      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      }
    },

    bld3 : function( ctx, cfg ){
      // ctx.beginPath();
      // ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      // ctx.fillStyle = "brown";
      // ctx.fill();
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = '#003300';
      // ctx.stroke();
      // ctx.lineWidth = 2;
      // ctx.moveTo(cfg.cannon[0][0], cfg.cannon[0][1]);
      // ctx.lineTo(cfg.cannon[1][0], cfg.cannon[1][1]);
      // ctx.stroke();
      var x = cfg.position[0], y = cfg.position[1];
      var spriteSheet = TD.gSpriteSheets['turret'];
      TD.turretFrame[cfg.type];
      spt = spriteSheet.getStats(TD.turretFrame[cfg.type][cfg.frame]);
      var hlf = {
        x : 25,
        y : 15
      };
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(cfg.angle);
      ctx.translate(-hlf.x, -hlf.y);
      ctx.drawImage(spriteSheet.img, spt.x, spt.y,
         spt.w, spt.h, 0, 0, 40, 30);
      ctx.restore();
      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      }
    },

    bld4 : function( ctx, cfg ){
      // ctx.beginPath();
      // ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      // ctx.fillStyle = "purple";
      // ctx.fill();
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = '#003300';
      // ctx.stroke();
      // ctx.lineWidth = 2;
      // ctx.moveTo(cfg.cannon[0][0], cfg.cannon[0][1]);
      // ctx.lineTo(cfg.cannon[1][0], cfg.cannon[1][1]);
      // ctx.stroke();
      var x = cfg.position[0], y = cfg.position[1];
      var spriteSheet = TD.gSpriteSheets['turret'];
      TD.turretFrame[cfg.type];
      spt = spriteSheet.getStats(TD.turretFrame[cfg.type][cfg.frame]);
      var hlf = {
        x : 22,
        y : 19
      };
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(cfg.angle);
      ctx.translate(-hlf.x, -hlf.y);
      ctx.drawImage(spriteSheet.img, spt.x, spt.y,
         spt.w, spt.h, 0, 0, 41, 38);
      ctx.restore();
      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      }
    },

    bld5 : function( ctx, cfg ){
      var x = cfg.position[0], y = cfg.position[1];
      // ctx.beginPath();
      // ctx.arc(x, y-13, 3, 0, 2*Math.PI, false);
      // ctx.fillStyle = "rgba(63, 190, 207, 1)";
      // ctx.fill();
      // ctx.lineWidth = 0.5;
      // ctx.strokeStyle = 'black';
      // ctx.stroke();
      //
      // ctx.beginPath();
      // ctx.lineWidth = 1;
      // ctx.moveTo(x, y-10);
      // ctx.lineTo(x-5, y+3);
      // ctx.lineTo(x+5, y+3);
      // ctx.closePath();
      // ctx.stroke();
      // ctx.fillStyle = "rgba(34, 65, 98, 1)";
      // ctx.fill();
      // position : this.position,
      // type : this.type,   //building type, indicate the outline of building
      // tid : this.tid.Feature,  // 'TA' or not
      var spriteSheet = TD.gSpriteSheets['scene'];
      if(cfg.tid == 'TA'){
          var spt = spriteSheet.getStats('tower_02.png');
      }
      else{
          var spt = spriteSheet.getStats('tower_01.png');
      }
      var hlf = {
        x : spt.cx+10,
        y : spt.cy+5
      };
      ctx.drawImage(spriteSheet.img, spt.x, spt.y,
         spt.w, spt.h, x+hlf.x, y+hlf.y, 15, 50);

      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(x, y, range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      }
    },

    bld5_2 : function( ctx, cfg ){  // show as ruin
      var x = cfg.position[0], y = cfg.position[1];
      // ctx.beginPath();
      // ctx.lineWidth = 1;
      // ctx.moveTo(x, y);
      // ctx.lineTo(x-5, y+3);
      // ctx.lineTo(x+5, y+3);
      // ctx.closePath();
      // ctx.stroke();
      // ctx.fillStyle = "rgba(34, 65, 98, 1)";
      // ctx.fill();

      var spriteSheet = TD.gSpriteSheets['scene'];
      var spt = spriteSheet.getStats('tower_03.png');
      var hlf = {
        x : spt.cx+7,
        y : spt.cy-20
      };

      ctx.drawImage(spriteSheet.img, spt.x, spt.y,
         spt.w, spt.h, x+hlf.x, y+hlf.y, 15, 15);

      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(x, y, range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      }
    },

    bld6 : function( ctx, cfg ){
      var x = cfg.position[0], y = cfg.position[1];
      // var corners = [[x-7,y-7],[x+7, y-7],[x-7,y+7],[x+7,y+7]], idx;
      // for(idx=0; idx<corners.length; idx++){
      //   ctx.beginPath();
      //   ctx.arc(corners[idx][0], corners[idx][1], 2, 0, 2*Math.PI, false);
      //   ctx.fillStyle = "rgba(208, 205, 254, 1)";
      //   ctx.fill();
      //   ctx.lineWidth = 0.5;
      //   ctx.strokeStyle = 'black';
      //   ctx.stroke();
      //   ctx.beginPath();
      //   ctx.lineWidth = 2;
      //   ctx.strokeStyle = 'rgba(12, 3, 135, 1)';
      //   ctx.moveTo(x, y);
      //   ctx.lineTo(corners[idx][0], corners[idx][1]);
      //   ctx.stroke();
      // }
      // ctx.beginPath();
      // ctx.strokeStyle = 'black';
      // ctx.lineWidth = 1;
      // ctx.moveTo(cfg.launcher[0][0], cfg.launcher[0][1]);
      // ctx.lineTo(cfg.launcher[1][0], cfg.launcher[1][1]);
      // ctx.lineTo(cfg.launcher[2][0], cfg.launcher[2][1]);
      // ctx.lineTo(cfg.launcher[3][0], cfg.launcher[3][1]);
      // ctx.closePath();
      // ctx.stroke();
      // ctx.fillStyle = 'rgba(108, 150, 178, 1)';
      // ctx.fill();
      // ctx.beginPath();
      // ctx.strokeStyle = 'rgba(51, 68, 97, 1)';
      // ctx.lineWidth = 3;
      // ctx.moveTo(cfg.launcher[0][0], cfg.launcher[0][1]);
      // ctx.lineTo(cfg.launcher[1][0], cfg.launcher[1][1]);
      // ctx.stroke();
      // position : this.position,
      // type : this.type,   //building type, indicate the outline of building
      // angle : this.angle
      var spriteSheet = TD.gSpriteSheets['turret'];
      spt = spriteSheet.getStats('turret_06.png');
      var hlf = {
        x : 20,
        y : 20
      };
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(cfg.angle);
      ctx.translate(-hlf.x, -hlf.y);
      ctx.drawImage(spriteSheet.img, spt.x, spt.y,
         spt.w, spt.h, 0, 0, 40, 40);
      ctx.restore();
      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'white';
        ctx.stroke();
      }
    },

    game_over : function( ctx, cfg ){
      ctx.font = "30px Georgia";
      ctx.fillText("Game Over!", 150, 200);

      ctx.font = "50px Verdana";
      // Create gradient
      var gradient = ctx.createLinearGradient(0, 0, TD.uc.width, 0);
      gradient.addColorStop("0", "magenta");
      gradient.addColorStop("0.5", "blue");
      gradient.addColorStop("1.0", "red");
      // Fill with gradient
      ctx.fillStyle = gradient;
      ctx.fillText("Big smile!", 120, 300);

      ctx.font = "20px Arial";
      ctx.fillStyle = 'rgba(194, 251, 50, 1)';
      ctx.fillText("Wave: " + cfg.wave, 160, 350);

      if(cfg.score == null) return;
      ctx.font = "20px Arial";
      ctx.fillStyle = 'rgba(194, 251, 50, 1)';
      ctx.fillText("Score: " + cfg.score, 160, 400);
    },

    Arsenal : {
      'bullet_small' : {
          speed : 1000,
          damageRange : 7,
          exploding : [2,3,4,5,4]
        },
      'bullet_middle' : {
          speed : 8,
          damageRange : 20,
          exploding : [3,4,5,6,5]
        },
      'bullet_large' : {
          speed : 7,
          damageRange : 30,
          exploding : [4,6,8,10,8]
        },
      'bullet_layser' : {
          speed : 1000,
          damageRange : 1,
          exploding : null
        },
      'bullet_missile' : {
          speed : 3,
          damageRange : 55,
          exploding : [3,4,5,6,7,7,5]
        }
    },

		monster_1_base_live : 125,   // setting base monster live, increase for each wave
    monster_2_base_live : 150,
    monster_3_base_live : 175,
    monster_4_base_live : 200,

    monster_1_base_price : 10,   // rewards when finish this monster
    monster_2_base_price : 12,
    monster_3_base_price : 15,
    monster_4_base_price : 20,

    monster_frequency : 500,   // monster attack frequency

    Monsters : {
      'monster-1' : {
        type : 'monster-1',
        range : 40,
        speed : 1,
        damage : 20,
        frequency : 1200,
        cannonType : 'bullet_small',
        live : function(){return TD.cfg.monster_1_base_live;},
        price : function(){return TD.cfg.monster_1_base_price;}
      },
      'monster-2' : {
        type : 'monster-2',
        range : 50,
        speed : 0.9,
        damage : 25,
        frequency : 1200,
        cannonType : 'bullet_small',
        live : function(){return TD.cfg.monster_2_base_live;},
        price : function(){return TD.cfg.monster_2_base_price;}
      },
      'monster-3' : {
        type : 'monster-3',
        range : 60,
        speed : 0.8,
        damage : 30,
        frequency : 1200,
        cannonType : 'bullet_small',
        live : function(){return TD.cfg.monster_3_base_live;},
        price : function(){return TD.cfg.monster_3_base_price;}
      },
      'monster-4' : {
        type : 'monster-4',
        range : 70,
        speed : 0.75,
        damage : 1,
        frequency : 30,
        cannonType : 'bullet_layser',
        live : function(){return TD.cfg.monster_4_base_live;},
        price : function(){return TD.cfg.monster_4_base_price;}
      }
    },

		Buildings : {
      'building-1' : {  // cfg
        type : 'building-1',
        cannonType : 'bullet_small',
        frequency : 300,  //  1 per 300ms
        live : 80,
        price : 200,
        range : 55,
        damage : 30,
        cannonLen : 10
      },
      'building-2' : {
        type : 'building-2',
        cannonType : 'bullet_middle',
        frequency : 600,
        live : 100,
        price : 250,
        range : 70,
        damage : 55,
        cannonLen : 12
      },
      'building-3' : {
        type : 'building-3',
        cannonType : 'bullet_large',
        frequency : 800,
        live : 100,
        price : 300,
        range : 80,
        damage : 90,
        cannonLen : 15
      },
      'building-4' : {
        type : 'building-4',
        cannonType : 'bullet_layser',
        frequency : 30,   //render every frame
        live : 100,
        price : 500,
        range : 60,
        damage : 5,
        cannonLen : 20
      },
      'building-5' : {   // this is the terminal building cfg
        type : 'building-5',
        cannonType : 'bullet_layser',
        frequency : 30,
        live : 1000,
        price : 500,
        range : 100,
        damage : 2,
        cannonLen : 0
      },
      'building-6' : {   // missile launcher
        type : 'building-6',
        cannonType : 'bullet_missile',
        frequency : 3000,   //render every 5 second
        live : 100,
        price : 1000,
        range : 125,
        damage : 400,
        missileNumber : 1,
        cannonLen : 5
      },
    },

		upgradeMapping : {
      'building-1' : [
        {
          'damage' : 2,
          'frequency' : 0.9,
          'range' : 1.1,
          'live' : 2,
          'price' : 1700   // +$200
        },
        {
          'damage' : 2.5,
          'frequency' : 0.8,
          'range' : 1.2,
          'live' : 3,
          'price' : 5500
        },
        {
          'damage' : 2.5,  // increase 250%
          'frequency' : 0.8,
          'range' : 1.5,
          'live' : 4,
          'price' : 7250
        }
      ],

      'building-2' : [
        {
          'damage' : 1.5,  // increase 150%
          'frequency' : 0.9,
          'range' : 1.2,
          'live' : 2,
          'price' : 1000
        },
        {
          'damage' : 2,  // increase 200%
          'frequency' : 0.8,
          'range' : 1.2,
          'live' : 3,
          'price' : 3800
        },
        {
          'damage' : 3.2,  // increase 320%
          'frequency' : 0.7,
          'range' : 1.7,
          'live' : 6,
          'price' : 9000
        }
      ],

      'building-3' : [
        {
          'damage' : 1.5,  // increase 170%
          'frequency' : 0.9,
          'range' : 1.2,
          'live' : 2,
          'price' : 1200
        },
        {
          'damage' : 1.7,  // increase 170%
          'frequency' : 0.8,
          'range' : 1.3,
          'live' : 3,
          'price' : 5000
        },
        {
          'damage' : 2.5,  // increase 250%
          'frequency' : 0.7,
          'range' : 1.5,
          'live' : 5,
          'price' : 8200
        }
      ],

      'building-4' : [
        {
          'damage' : 2,  // increase 200%
          'frequency' : 1,
          'range' : 1.2,
          'live' : 2,
          'price' : 1500
        },
        {
          'damage' : 3,  // increase 300%
          'frequency' : 1,
          'range' : 1.3,
          'live' : 3,
          'price' : 4500
        },
        {
          'damage' : 3,  // increase 300%
          'frequency' :1,
          'range' : 1.5,
          'live' : 4,
          'price' : 8700
        }
      ],

      'building-5' : [   // make sure terminal building's level always == 0
        {
          'damage' : 1,  // eventually, it's rebuild or refill blood
          'frequency' : 1,
          'range' : 1,
          'live' : 2,    // bonus, double its live
          'price' : 5000
        }
      ],

      'building-6' : [
        {
          'damage' : 1.2,
          'frequency' : 0.95,
          'missile' : 1,
          'range' : 1.2,
          'live' : 2,
          'price' : 2000
        },
        {
          'damage' : 1.2,
          'frequency' : 0.9,
          'missile' : 2,
          'range' : 1.3,
          'live' : 3,
          'price' : 3900
        },
        {
          'damage' : 1.5,  // increase 120%
          'frequency' :0.9,
          'missile' : 3,
          'range' : 1.5,
          'live' : 4,
          'price' : 7000
        }
      ]

    }

  }

});



_TD.loading.push(function(TD){

  TD.version = "0.1.0";
  TD.money = 500;
  TD.score = 0;  // score += monster's live / 100
  TD.wave = 0;  // current wave number
  TD.maxNumberOfMonsterPerWave = TD.cfg.maxNumberOfMonsterPerWave;
  TD.GameOver = false;  // if final target has been destroied, set GameOver := true
  TD.waitingForNextWave = false;  // check if is between two waves
  TD.pause = false;  // pause the game
  TD.root = null;    // root of Graph as map

  TD.map == null  // entity of TD.createMap

  TD.validMap = false;  // will set to true if get a valid one after running td-path module

  TD.bldCtrl = null;  // building controller
  TD.runner  = null;  //should conbine run with pause
  TD.beforeRun = true;  //will set to false when first click runner, used to conbine pause and run function
  TD.reStart = null;  // hold the document element that triggers new game

  TD.eventQueue = [];  //all moving or exploding events --> monster, bullet and building
  TD.monsterQueue = [];
  TD.buildingQueue = [];     // buildings outside battle field
  TD.inBuildingQueue = [];   // buildings in battle field
  TD.bulletQueue = [];
  TD.bloodBarQueue = [];

  TD.grassQueue = [];  //removable grass on map
  TD.irremovalbeGrassQueue = [];

  TD.terminalNodePool = [];
  TD.aliveTerminals = {};
  TD.deadTerminals = {};
  TD.terminalTmpBuffer = [];  // sort all tower stuffs according to their Y-axis before pushing into eventQueue

  TD.rawMapData = null;
  TD.path = null;

  TD.gSpriteSheets = {};  // used to store SpriteSheetClass entities
  TD.monsterFrame = {};   // monster use its type to search this table, get image name sequence in 4 direction
  TD.monsterTypes = ['monster-1', 'monster-2', 'monster-3', 'monster-4'];
  TD.monsterSpriteSource = 'zombie.png';
  TD.bulletTypes = ['bullet_small', 'bullet_middle', 'bullet_large', 'bullet_missile'];
  TD.explodeFrame = {};   // bullet object use its type here as key to search for its associated bullet frame sequence
  TD.explodeSpriteSource = 'explode.png';
  TD.sceneFrame = {};  // any scene including ground, grass, tower. EG. [grass] -> [grass_01.png, grass_02.png ... ]
  TD.sceneSpriteSource = 'scene.png';
  TD.turretFrame = {};
  TD.turretSpriteSource = 'turret.png';

  TD.uc = document.getElementById('td-canvas-1'); // middle layer canvas --> draw builids, monsters and bullets
  TD.ucx = TD.uc.getContext('2d');

  TD.uc2 = document.getElementById('td-canvas-2');  // upper layer canvas  --> draw cycle on mouse
  TD.ucx2 = TD.uc2.getContext('2d');

  TD.uc0 = document.getElementById('td-canvas-background'); // loweest layer canvas --> draw dust road
  TD.ucx0 = TD.uc0.getContext('2d');

  TD.mapData = null;  // bit map, consist of 0,1 and 2s

  TD.waitingToBuild = null;  // for building click event
  TD.waitingToChange = null;  // for upgrading or selling click event

  TD.moneyElement = document.getElementById('money');
  TD.waveElement  = document.getElementById('wave');
  TD.scoreElement  = document.getElementById('score');
  TD.panelElement  = document.getElementById('info');

  TD.runner = document.getElementById('run');
  TD.pauseElement = document.getElementById('pause');

  TD.canvasBody = document.getElementById('td-canvas');
  TD.redoBody = document.getElementById('redo');
  TD.undoBody = document.getElementById('undo');
  TD.submitBody = document.getElementById('submit');

  TD.catnonImg = document.getElementById('catnon');  // my lovely catnon!!!

});



_TD.loading.push(function(TD){

  // Object.size = function(obj) {
  //     var size = 0, key;
  //     for (key in obj) {
  //         if (obj.hasOwnProperty(key)) size++;
  //     }
  //     return size;
  // };

  TD.lang = {

    isOnLeft : function(e, r){
      var p = e[0];
      var q = e[1];
      if(p==r || q==r) return false;
      var prx = p[0] - r[0];
      var pry = p[1] - r[1];
      var qrx = q[0] - r[0];
      var qry = q[1] - r[1];
      var res = prx * qry - pry * qrx;
      res = Number((res-0).toFixed(5));
      if(res < 0) return true;
      else return false;
    },

    isInCircle : function(circleV, p){
      var dis = Math.sqrt((p[0]-circleV[0])*(p[0]-circleV[0]) + (p[1]-circleV[1])*(p[1]-circleV[1]));
      dis = Number(dis.toFixed(5));
      var r = Number(circleV[2].toFixed(5));
      if(dis < r) return 1;
      else if(dis == r) return 0;
      else return -1;
    },

    Create2DArray : function(rows, columns) {
      var arr = [];
      for (var i=0;i<rows;i++) {
        var arr2 = [];
        for(var j=0;j<columns; j++){
          arr2[j] = 0;
        }
         arr[i] = arr2;
      }
      return arr;
    },

    drawOneSet : function(cx, e , color){
      cx.lineWidth = 1;
      cx.lineCap = 'round';
      cx.strokeStyle = color;
      for(var idx=0; idx<e.length; idx++){
        cx.beginPath();
        cx.moveTo(e[idx][0][0], e[idx][0][1]);
        cx.lineTo(e[idx][1][0], e[idx][1][1]);
        cx.stroke();
      }
    },

    drawArray : function(cx, arr , color){
      cx.lineWidth = 1;
      cx.lineCap = 'round';
      cx.strokeStyle = color;
      cx.beginPath();
      for(var idx=0; idx<arr.length; idx++){
        if(idx==0){
          cx.moveTo(arr[idx][0][0], arr[idx][0][1]);
          continue;
        }
        cx.lineTo(arr[idx][0][0], arr[idx][0][1]);
        cx.stroke();
      }
    },

    drawOutline : function(cx, que){

      var oldx=0, oldy=0, idx, spriteSheet, spt, point = [], q = [];
      cx.globalCompositeOperation="source-over";
      spriteSheet = TD.gSpriteSheets['scene'];
      spt = spriteSheet.getStats('grass_15.png');
      var hlf = {
        x : spt.cx,
        y : spt.cy
      };
      var fence = this.randomNum(5)+3;
      idx = this.randomNum(30)+20;
      for(idx=0; idx<que.length; idx++){
        if(fence == 0){
          fence = this.randomNum(5)+3;
          idx += this.randomNum(20)+5;
          continue;
        }
        fence--;
        point = que[idx];
        if(this.ok2Draw(point[0], point[1])){
          if(this.getCurDir([oldx, oldy], point) == 4){  // from down to up, draw downer before draw upper
            if(q.length==0) q.push([oldx, oldy]);
            else if(!this.pointEq(q[q.length-1], [oldx, oldy])) q.push([oldx, oldy]);
            q.push(point);
          }else{
            cx.drawImage(spriteSheet.img, spt.x, spt.y,
               spt.w, spt.h, point[0]+hlf.x, point[1]+hlf.y-3, spt.w, spt.h);
          }
        }
        oldx=point[0];
        oldy=point[1];
      }
      while(q.length > 0){
        point = q.pop();
        cx.drawImage(spriteSheet.img, spt.x, spt.y,
           spt.w, spt.h, point[0]+hlf.x, point[1]+hlf.y-3, spt.w, spt.h);
      }
    },

    onClick_restart : function(){
      TD.reStart.removeEventListener('click', TD.lang.onClick_restart, false);
      TD.reStart = null;
      document.getElementById('over').style.display = 'none';
      TD.init();
    },

    randomNum : function( upLimit ){
      return parseInt(Math.random() * upLimit);
    },

    paintGround : function( uc, spritename ){
      var w = uc.width, h = uc.height, i, j, ctx = uc.getContext('2d');
      var spriteSheet = TD.gSpriteSheets['scene'];
      var spt = spriteSheet.getStats(spritename);
      for(j=0; j<h; j+=70){
        for(i=0; i<w; i+=70){
          ctx.drawImage(spriteSheet.img, spt.x, spt.y,
             spt.w, spt.h, i, j, 70, 70);
        }
      }
    },

    getCentrePoint : function(x1, x2, x3){
      var a=2*(x2[0]-x1[0]);
      var b=2*(x2[1]-x1[1]);
      var c=x2[0]*x2[0]+x2[1]*x2[1]-x1[0]*x1[0]-x1[1]*x1[1];
      var d=2*(x3[0]-x2[0]);
      var e=2*(x3[1]-x2[1]);
      var f=x3[0]*x3[0]+x3[1]*x3[1]-x2[0]*x2[0]-x2[1]*x2[1];
      var x=(b*f-e*c)/(b*d-e*a);
      var y=(d*c-a*f)/(b*d-e*a);
      var r=Math.sqrt((x-x1[0])*(x-x1[0])+(y-x1[1])*(y-x1[1]));
      return [x, y, r];
    },

    // compute the geo centre from a given triangle's all edges
    getGeoCentre : function( allEdges ){
      var p = allEdges[0][0];   // choose first inner edge's first point as a terminal point
      var edge = null;
      if(this.pointEq(allEdges[1][0],p) || this.pointEq(allEdges[1][1],p)) // get that terminal point's opposit edge
        edge = allEdges[2];
      else edge = allEdges[1];
      var m = this.getMiddle( edge );
      var res = [(p[0]-m[0])/3 + m[0], (p[1]-m[1])/3 + m[1]];
      return res;
    },

    getMiddle : function( e ){
      var mx = (e[0][0] + e[1][0]) / 2;
      var my = (e[0][1] + e[1][1]) / 2;
      return [mx, my];
    },

    reverseEdge : function( e ){
      return [e[1],  e[0]];
    },

    pointEq : function(p1, p2){
      return p1[0]==p2[0] && p1[1] == p2[1];
    },

    edgeEq : function(e1, e2){
      return (this.pointEq(e1[0], e2[0]) && this.pointEq(e1[1], e2[1])) ||
              (this.pointEq(e1[0], e2[1]) && this.pointEq(e1[1], e2[0]));
    },

    isInRange : function(p1, p2, r){
      var dis = this.getDistance(p1, p2);
      if( dis <= r) return true;
      else return false;
    },

    //isOnLeft(e, r)  true --> left
    ok2Draw : function(x, y, lines){  // lines --> [lineUpLeft, lineDownRight]
      if(lines == undefined) lines = TD.cfg.Restriction;
      for(var i=0; i<lines.length; i++){
        if(!TD.lang.isOnLeft(lines[i],[x,y])) return false;
      }
      return true;
    },

    getDistance : function(p1, p2){
      return Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1]));
    },

    getNextPos : function(c, s, e, speed){
      var dis = this.getDistance(s, e);
      if( dis-1 <= speed ) return e;
      var x = (e[0]-s[0])*speed/dis + c[0];
      var y = (e[1]-s[1])*speed/dis + c[1];
      var mag = this.getDistance(s, [x,y]);
      if(mag >= dis) return e;
      return [x,y];
    },

    getCurDir : function( s, e ){
      var dx = e[0] - s[0], dy = e[1] - s[1], ax = Math.abs(dx), ay = Math.abs(dy);
      if(dx > 0 && ay <= dx) return 3;
      else if(dy > 0 && ax <= dy) return 1;
      else if(dx < 0 && ay <= ax) return 2;
      else return 4;
    },

    getCannon : function(s, e, l){
      var dis = this.getDistance(s, e);
      var x = (e[0]-s[0])/dis;
      var y = (e[1]-s[1])/dis;
      return [[x*3 + s[0], y*3 + s[1]], [x*(3+l) + s[0], y*(3+l) + s[1]]];
    },

    clearGrass : function( p ){  //clear up grass to build something on it
      for(var idx=0; idx<TD.grassQueue.length; idx++){
        if(this.getDistance(p, TD.grassQueue[idx].position) <= TD.cfg.buildingR*2)
          TD.grassQueue[idx].alive = false;
      }
    },

    ableToBuild : function( p, r ){
      var x = parseInt(p[0]), y = parseInt(p[1]), idx, cur;  // parseInt to prevent float input
      if(TD.mapData == null) return false;
      if(x+r>=TD.cfg.width || x-r<0 || y+r>=TD.cfg.height || y-r<0) return -1;
      cur = TD.mapData[y][x+r];
      //if(TD.mapData[y][x+r] != 0) return false;
      if(TD.mapData[y][x-r] != cur) return -1;
      if(TD.mapData[y+r][x] != cur) return -1;
      if(TD.mapData[y-r][x] != cur) return -1;
      if(cur == 0){
        for(idx=0; idx<TD.buildingQueue.length; idx++){
          if(this.getDistance(TD.buildingQueue[idx].position, p) <= 2*r)
            return -1;
        }
        for(idx=0; idx<TD.irremovalbeGrassQueue.length; idx++){
          if(this.getDistance(TD.irremovalbeGrassQueue[idx].position, p) <= 30)
            return -1;
        }
      }else{
        for(idx=0; idx<TD.inBuildingQueue.length; idx++){
          if(this.getDistance(TD.inBuildingQueue[idx].position, p) <= 2*r)
            return -1;
        }
        // should also check for terminal towers, both alive and dead
      }
      return cur+1;  // 1: --> outside,   2: --> inside
    },

    showBuildingInfo : function ( bld ){
      if(bld == null){
        var str = "<dt>Level</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Damage</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Range</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Shot delay</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Live</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Upgrade cost</dt>" + "<dd>" + " " + "</dd>";
        this.bindingElement(TD.panelElement, str);
      }
      else{
        var str = "<dt>Level</dt>" + "<dd>" + bld.level + "</dd>"
                + "<dt>Damage</dt>" + "<dd>" + bld.damage + "</dd>"
                + "<dt>Range</dt>" + "<dd>" + bld.range + "</dd>"
                + "<dt>Shot delay</dt>" + "<dd>" + bld.frequency + "</dd>"
                + "<dt>Live</dt>" + "<dd>" + bld.live + " / " + bld.maxLive  + "</dd>"
                + "<dt>Upgrade cost</dt>" + "<dd>" + '$ ' + (bld.level==3?'-':(TD.cfg.upgradeMapping[bld.type][bld.level].price)) + "</dd>";
        this.bindingElement(TD.panelElement, str);
      }
    },

    bindingElement : function( el, text ){
      el.innerHTML = text;
    },

    setMoney : function( money ){
      TD.money = money;
      this.bindingElement(TD.moneyElement, 'money : ' + TD.money);
    },

    setWave : function( wave ){
      TD.wave = wave;
      this.bindingElement(TD.waveElement, 'wave : ' + TD.wave);
    },

    setScore : function( score ){
      TD.score = score;
      this.bindingElement(TD.scoreElement, 'score : ' + TD.score);
    },

    accuracyDestroyer : function( p, d ){
      var dfx = parseInt(Math.random()*d-d/2), dfy = parseInt(Math.random()*d-d/2);
      return [p[0]+dfx, p[1]+dfy];
    },

		getRandomMonster : function(){
      var num = parseInt(Math.random()*4+1);
      var key = 'monster-' + num;
      //var cfg = TD.cfg.Monsters[key];  // find a bug! cfg here will cumulate previous effects
      var cfg = this.copy(TD.cfg.Monsters[key]);
      if(TD.wave >= 50){
        cfg.speed += (Math.random()*0.6 - 0.1);
      }else if(TD.wave >= 40){
        cfg.speed += (Math.random()*0.5 - 0.1);
      }else if(TD.wave >= 30){
        cfg.speed += (Math.random()*0.4 - 0.1);
      }else if(TD.wave >= 20){
        cfg.speed += (Math.random()*0.3 - 0.1);
      }else{
        cfg.speed += (Math.random()*0.2 - 0.1);
      }
      cfg.range += parseInt(Math.random()*20 - 10);
      if(Math.random() > 0.7){
        cfg['shield'] = true;
      }else{
        cfg['shield'] = false;
      }
      var mst = new TD.monster(TD.root, cfg);
      return mst;
    },

    copy : function( obj ){  //not deep copy of an object
      var res = {};
      for(var key in obj){
        if(!obj.hasOwnProperty(key)) continue;
        res[key] = obj[key];
      }
      return res;
    },

		levelUp : function(){   // modify monsters' feature to increase difficulty
			if(TD.wave == 0) return;
			var rate = 1;
			var bonus = 8;
			if(TD.wave < 10){
				rate = 1.2;
			}else if(TD.wave >= 10 && TD.wave < 20){
				rate = 1.15;
				bonus = 7;
			}else if(TD.wave >= 20 && TD.wave < 30){
				rate = 1.1;
				bonus = 6;
			}
			else if(TD.wave >= 30 && TD.wave < 40){
				rate = 1.05;
				bonus = 5;
			}
			else{
				rate = 1.01;
				bonus = parseInt(TD.wave / 20);
			}
			if(TD.wave % 40 == 0){
				rate = 1.3;
				TD.maxNumberOfMonsterPerWave += 1;
			}
			if(TD.wave % 10 == 0){
				TD.maxNumberOfMonsterPerWave += 2;
			}
			TD.cfg.monster_1_base_live = parseInt(TD.cfg.monster_1_base_live * rate);
			TD.cfg.monster_2_base_live = parseInt(TD.cfg.monster_2_base_live * rate);
			TD.cfg.monster_3_base_live = parseInt(TD.cfg.monster_3_base_live * rate);
			TD.cfg.monster_4_base_live = parseInt(TD.cfg.monster_4_base_live * rate);

			TD.cfg.monster_1_base_price = parseInt(TD.cfg.monster_1_base_price + bonus);
			TD.cfg.monster_2_base_price = parseInt(TD.cfg.monster_2_base_price + bonus);
			TD.cfg.monster_3_base_price = parseInt(TD.cfg.monster_3_base_price + bonus);
			TD.cfg.monster_4_base_price = parseInt(TD.cfg.monster_4_base_price + bonus);
		},

    getBuilding : function ( p, r ){
      var x = p[0], y = p[1], idx, key;
      for(idx=0; idx<TD.buildingQueue.length; idx++){
        if(this.getDistance(TD.buildingQueue[idx].position, p) <= r)
          return TD.buildingQueue[idx];
      }
      for(idx=0; idx<TD.inBuildingQueue.length; idx++){
        if(this.getDistance(TD.inBuildingQueue[idx].position, p) <= r)
          return TD.inBuildingQueue[idx];
      }
      for(key in TD.aliveTerminals){
        if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
        if(this.getDistance(TD.aliveTerminals[key].position, p) <= r)
          return TD.aliveTerminals[key];
      }
      for(key in TD.deadTerminals){
        if(!TD.deadTerminals.hasOwnProperty(key)) continue;
        if(this.getDistance(TD.deadTerminals[key].position, p) <= r)
          return TD.deadTerminals[key];
      }
      return null;
    },

    getSignByCrossProduct : function( v1, v2 ){
      if( (v1[0]*v2[1] - v1[1]*v2[0]) >= 0 ) return 1;
      else return -1;
    },

    getAngle360 : function(e1, e2){  // from e1 to e2
      var v1 = [e1[1][0]-e1[0][0], e1[1][1]-e1[0][1]];
      var v2 = [e2[1][0]-e2[0][0], e2[1][1]-e2[0][1]];

      var sign = this.getSignByCrossProduct(v1, v2);  // careful, it's v1 anti-clockwise to v2

      var productValue = v1[0] * v2[0] + v1[1] * v2[1];
      var v1_dis = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
      var v2_dis = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1]);
      var cosValue = productValue / (v1_dis * v2_dis);

      return Math.acos(cosValue) * sign;
    },

    getAngle : function(e1, e2){
      var ps, p1, p2;
      if(this.pointEq(e1[0], e2[0]) || this.pointEq(e1[0], e2[1])){
        ps = e1[0];
        p1 = e1[1];
        if(this.pointEq(ps, e2[0])) p2 = e2[1];
        else p2 = e2[0];
      }else if(this.pointEq(e1[1], e2[0]) || this.pointEq(e1[1], e2[1])){
        ps = e1[1];
        p1 = e1[0];
        if(this.pointEq(ps, e2[0])) p2 = e2[1];
        else p2 = e2[0];
      }else{
        return null;
      }
      //console.log(ps);
      var v1 = [p1[0]-ps[0], p1[1]-ps[1]];
      var v2 = [p2[0]-ps[0], p2[1]-ps[1]];

      var productValue = v1[0] * v2[0] + v1[1] * v2[1];
      var v1_dis = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
      var v2_dis = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1]);
      var cosValue = productValue / (v1_dis * v2_dis);
      return Math.acos(cosValue)/3.1416*180;
    }


  }
});



_TD.loading.push(function(TD){

  TD.createPath = function(data){

    var Boundary = {};        // all boundary edges arranged in discover order (outer: anti-clockwise,  inner: clockwise)
    var Edge4Tri = {};        // key: edge.toString,   value = [tri1, tri2]
    var TriPool = [];         // all unique triangles here, including trimed ones
    var terminalTriPool = []; // to trim terminal tri
    var startTriangle = null; // should be up leftmost triangle
    var cdtThis = null;
    var cx = document.getElementById('td-canvas').getContext('2d');

    this.getData = function(data){
      var i, j, idx, height = TD.cfg.height, width = TD.cfg.width;
      var map = TD.lang.Create2DArray(height, width);
      for(i = 1; i<height-1; i++){
        for(j = 1; j<width-1; j++){
          idx = i*4*width + j*4;
          map[i][j] = (data[idx]==0 && data[idx+1]==0 && data[idx+2]==0 && data[idx+3]==0)? 1 : 0;
        }
      }
      map[1][1] = 2;
      map[2][1] = 2;
      map.rows = height;
      map.columns = width;
      var outputQueue = [];
      outputQueue.push([1,1,6]);
      outputQueue.push([2,1,6]);

      this.findPath(map, 2, 1, outputQueue);

      var innerLines = this.findInnerLine(map);
      var vectorQue = this.parseQue( outputQueue );
      var vectorInnerQue = [];
      //var cx = document.getElementById('td-canvas').getContext('2d');
      TD.lang.drawOutline(cx, vectorQue);
      for(idx=0; idx<innerLines.length; idx++){
        var vq = this.parseQue(innerLines[idx]);
        vectorInnerQue.push(vq);
        TD.lang.drawOutline(cx, vq);
      }

      //vectorQue
      //vectorInnerQue
      TD.mapData = map;
      return [vectorQue, vectorInnerQue];
    };

    this.getData.prototype = {

			findPath : function(table, r, c, outputQueue){
        //var _this = TD.path.pathOutline;
        var tmpR = 0, tmpC = 0, idx, dir, d;
        for(idx=0; idx<TD.cfg.Dir.length; idx++){
          dir = TD.cfg.Dir[idx];
          for(d=0; d<dir.length; d++){
            tmpR = dir[d][0]+r;
            tmpC = dir[d][1]+c;
            if(tmpR<0 || tmpR>=table.rows || tmpC<0 || tmpC>=table.columns
              || table[tmpR][tmpC]==0 || table[tmpR][tmpC]==2) continue;
            if(this.checkCross(table, tmpR, tmpC, TD.cfg.dirC)){   //direction 'Cross'
              outputQueue.push([tmpC, tmpR, dir[d][2]]);   // output should mapping to Column -> x, Row -> y
              table[tmpR][tmpC] = 2;
              return this.findPath(table, tmpR, tmpC, outputQueue);
            }
          }
        }
        return null;
      },

      checkCross : function(table, r, c, dir){
        var d, tmpR, tmpC;
        for(d=0; d<dir.length; d++){
          tmpR = dir[d][0]+r;
          tmpC = dir[d][1]+c;
          if(r<0 || r>=table.rows || c<0 || c>=table.columns) continue;
          if(table[tmpR][tmpC]==0) return true;
        }
        return false;
      },

      findInnerLine : function(table){
        var outputs = [];
        var curQue = [];
        var isOutIsland = false;
        var row, column;
        //var _this = TD.path.pathOutline;
        for(row=1; row<table.rows-1; row++){
          for(column=1; column<table.columns-1; column++){
            if(table[row][column]==0 && table[row][column+1]==1) {
              isOutIsland=true;
              continue;
            }
            if(isOutIsland && table[row][column]==1 && table[row][column+1]==0) {
              isOutIsland=false;
              continue;
            }
            if(this.isStartable(table, row, column, curQue)){
              this.findPath(table, row-1, column+1, curQue);
              outputs.push(curQue);
              curQue = [];
            }
          }
        }
        return outputs;
      },

      isStartable : function(table, r, c, que){
        if(table[r][c] != 1) return false;
        if(table[r][c+1]!=undefined && table[r][c+1]==0){
          if(table[r][c+2]!=undefined && table[r][c+2]!=0){
            table[r][c+1] = 1;
            return false;
          }
          else{
            table[r][c] = 2;       //to change on table, t[row][column]
            table[r-1][c+1] = 2;
            que.push([c,r,3]);      //note, [x,y] --> [column, row]
            que.push([c+1,r-1,3]);
            return true;
          }
        }
        return false;
      },

      parseQue : function( que ){
        var firstP = que[0], lastP = que[0], curP = null, idx;
        var ctSame = 0, ctDif = 0;
        if(que.length < 2) return null;
        var res = [];
        res.push([firstP[0], firstP[1]]);
        for(idx=0; idx<que.length; idx++){
          curP = que[idx];
          if(curP[2] == firstP[2]){
            ctSame = ctSame + 1;
            if(ctSame > 20){
              res.push([lastP[0], lastP[1]]);
              firstP = curP;
              lastP = curP;
              ctSame = 0;
              ctDif = 0;
            }else{
              lastP = curP;
            }
          }
          else{
            ctDif = ctDif + 1;
            lastP = curP;
            if((ctSame + ctDif) > 15){
              res.push([lastP[0], lastP[1]]);
              firstP = curP;
              lastP = curP;
              ctSame = 0;
              ctDif = 0;
            }
            else if(ctDif > 7){
              res.push([lastP[0], lastP[1]]);
              firstP = curP;
              lastP = curP;
              ctSame = 0;
              ctDif = 0;
            }
          }
        }
        res.push([que[0][0], que[0][1]]);
        return res;
      }
    };


    this.cdt = function(outLine, innerLines){
      cdtThis = this;
      var hashEdge = {};
      var pointPool = [];
      var idx;
      pointPool = pointPool.concat(outLine.slice(0,outLine.length-1));
      this.buildEdgeMap(hashEdge, outLine);
      for(idx=0; idx<innerLines.length; idx++){
        this.buildEdgeMap(hashEdge, innerLines[idx]);
        pointPool = pointPool.concat(innerLines[idx].slice(0,innerLines[idx].length-1));
      }
      var limit = 1000;
      while(limit > 0 && Object.keys(hashEdge).length > 0){
        limit--;
        var key = Object.keys(hashEdge)[0];
        var curEdge = hashEdge[key];
				if(TD.lang.pointEq(curEdge[0], curEdge[1])){  // I don't know why, but sometimes this happens...
          //console.log('two same edge points!');
          delete hashEdge[key];
          continue;
        }
        delete hashEdge[key];
        var theOne = [], circleV = null, leftPointPool = [];
        for(var idx=0; idx<pointPool.length; idx++){
          var point = pointPool[idx];
          if(TD.lang.isOnLeft(curEdge, point))
            leftPointPool.push(point);
        }
        for(idx=0; idx<leftPointPool.length; idx++){
          var pt = leftPointPool[idx];
          var tmpTheOne = [pt];
          var tmpCircleV = TD.lang.getCentrePoint(curEdge[0], curEdge[1], pt);
          for(var i=0; i<leftPointPool.length; i++){
            if(i == idx) continue;
            var p = leftPointPool[i];
            var inCircleRes = TD.lang.isInCircle(tmpCircleV, p);
            if(inCircleRes==1){  // in circle
              tmpTheOne = null;
              break;
            }else if(inCircleRes==0){  // on circle
              tmpTheOne.push(p);
            }
          }
          if(tmpTheOne != null && (circleV == null || circleV[2] > tmpCircleV[2])){
            theOne = tmpTheOne;
            circleV = tmpCircleV;
          }
        }
        if(theOne.length > 1){
          console.log("==> Same Circle <==");
          console.log(theOne);
          console.log(curEdge);
          this.resolveCircleProblem(curEdge, theOne, hashEdge);
          continue;
        }
        var Line1start = curEdge[0];
        var Line1end   = theOne[0];
        var Line2start = theOne[0];
        var Line2end   = curEdge[1];
        //'rgb(100, 100, 0)'
        if(hashEdge[[Line1end, Line1start]]!=undefined || hashEdge[[Line1start, Line1end]]!=undefined){
          delete hashEdge[[Line1end, Line1start]];
          delete hashEdge[[Line1start, Line1end]];
          //console.log("delete line!");
          //drawOneSet(cx, [[Line1end, Line1start]], 'rgb(0, 0, 0)');
        }else{
          hashEdge[[Line1start, Line1end]] = [Line1start, Line1end];
          //console.log("insert line!");
          //drawOneSet(cx, [[Line1start, Line1end]]);
        }
        if(hashEdge[[Line2end, Line2start]]!=undefined || hashEdge[[Line2start, Line2end]]!=undefined){
          delete hashEdge[[Line2end, Line2start]];
          delete hashEdge[[Line2start, Line2end]];
          //console.log("delete line!");
          //drawOneSet(cx, [[Line2end, Line2start]], 'rgb(0, 0, 0)');
        }else{
          hashEdge[[Line2start, Line2end]] = [Line2start, Line2end];
          //console.log("insert line!");
          //drawOneSet(cx, [[Line2start, Line2end]]);
        }
        //TD.lang.drawOneSet(cx, [curEdge, [Line1start, Line1end], [Line2start, Line2end]], 'rgb(255, 255, 255)');
        this.processTriangle(curEdge, [Line1start, Line1end], [Line2start, Line2end]);
      }

    };

    this.cdt.prototype = {

      buildEdgeMap : function( hash, que ){
        var idx;
        for(idx=0; idx<que.length-1; idx++){
          hash[[que[idx],que[idx+1]]] = [que[idx],que[idx+1]];
          Boundary[[que[idx],que[idx+1]]] = [que[idx],que[idx+1]];
          Boundary[[que[idx+1],que[idx]]] = [que[idx+1],que[idx]];
        }
      },


      // Boundary = {}
      // Edge4Tri = {}
      processTriangle : function(e1, e2, e3){
        var ct = 0;
        var outerEdge = [], innerEdge = [];
        var triangle = null;
        if(Boundary[e1]!=undefined){
          ct++;
          outerEdge.push(e1);
        }else{
          innerEdge.push(e1);
        }
        if(Boundary[e2]!=undefined){
          ct++;
          outerEdge.push(e2);
        }else{
          innerEdge.push(e2);
        }
        if(Boundary[e3]!=undefined){
          ct++;
          outerEdge.push(e3);
        }else{
          innerEdge.push(e3);
        }
        if(ct == 0){
          triangle = new this.Tri(innerEdge, outerEdge, 'J');
          triangle.processJunction();
        }else if(ct == 1){
          triangle = new this.Tri(innerEdge, outerEdge, 'L');
          triangle.processLinker();
        }else if(ct == 2){
          triangle = new this.Tri(innerEdge, outerEdge, 'T');
          triangle.processTerminal();
          if(TD.lang.pointEq(triangle.value['T'], [1,1])){
            startTriangle = triangle;
            console.log("start triangle:")
            console.log(triangle);
          }
          terminalTriPool.push(triangle);
        }else{
          console.log("too many terminal edges!");
        }
        TriPool.push(triangle);
        for(var idx=0; idx<innerEdge.length; idx++){
          var edge = innerEdge[idx]
          if(Edge4Tri[edge]==undefined){
            Edge4Tri[edge] = [];
            Edge4Tri[TD.lang.reverseEdge(edge)] = [];
          }
          Edge4Tri[edge].push(triangle);
          Edge4Tri[TD.lang.reverseEdge(edge)].push(triangle);
        }
        return triangle;
      },


      //compute the area from a given triangle's all edges
      computeTriAreaByEdges : function(allEdges){
        var x1 = allEdges[0][0][0];
        var y1 = allEdges[0][0][1];
        var x2 = allEdges[0][1][0];
        var y2 = allEdges[0][1][1];
        var x3 = 0;
        var y3 = 0;
        if(TD.lang.pointEq(allEdges[0][0], allEdges[1][0]) || TD.lang.pointEq(allEdges[0][1], allEdges[1][0])){
          x3 = allEdges[1][1][0];
          y3 = allEdges[1][1][1];
        }else{
          x3 = allEdges[1][0][0];
          y3 = allEdges[1][0][1];
        }
        // cross product: AXB = |A||B|sin0 where |B|sin0 is the height of quadrangle
        return Math.abs((x2-x1)*(y3-y1) - (x3-x1)*(y2-y1)) / 2;
      },

      Tri : function(innerEdge, outerEdge, feature){
        this.Inner = innerEdge;
        this.Outer = outerEdge;
        this.Feature = feature;
        this.isVisited = false;
        this.value = {};
        this.area = cdtThis.computeTriAreaByEdges(innerEdge.concat(outerEdge));
        this.toString = function(){
          return this.Inner + ' ' + this.Outer;  // used when compare two triangles
        };
        this.position = null;
        // first delete input edge because it eventually turned into a terminal edge
        // remove the input edge from this.Inner array
        // add it to this.Outer
        // modify feature based on current Inner and Outer edge numbers
        // do post work -->
        this.changeFeature = function ( e ){
          for(var idx=0; idx<this.Inner.length; idx++){
            if(TD.lang.edgeEq(e, this.Inner[idx])){
              this.Outer.push(this.Inner[idx]);
              this.Inner.splice(idx,1);
              break;
            }
          }
          if(this.Outer.length == 1){
            this.Feature = 'L';
            this.processLinker();
          }else if(this.Outer.length == 2){
            this.Feature = 'T';
            //do sth about value
            this.processTerminal();
            //don't forget to put this tri into terminalTriPool
          }else{
            console.log("In changeFeature function: too many terminal edges!");
          }
        };

        this.processTerminal = function(){
          this.value = {};
          var tp = null, mid = null;
          if(this.Outer[0][0] == this.Outer[1][0] || this.Outer[0][0] == this.Outer[1][1])
            tp = this.Outer[0][0];
          else tp = this.Outer[0][1];
          this.value['T'] = tp;   //terminal point
          this.value['M'] = TD.lang.getMiddle( this.Inner[0] );  //middle point on Inner edge
          this.value['A'] = TD.lang.getAngle( this.Outer[0], this.Outer[1] );  // get angle of two outer edge
          this.position = tp;
        };

        this.processJunction = function(){
          this.value = {};
          var centre = TD.lang.getGeoCentre(this.Inner);  // to compute geocentre
          var mid1 = TD.lang.getMiddle(this.Inner[0]);
          var mid2 = TD.lang.getMiddle(this.Inner[1]);
          var mid3 = TD.lang.getMiddle(this.Inner[2]);
          // key = inner edge,   value = [geocentre point,  two other inner edge's Middle point and edge itself]
          this.value[this.Inner[0]] = [centre, mid2, this.Inner[1], mid3, this.Inner[2]];
          this.value[TD.lang.reverseEdge(this.Inner[0])] = [centre, mid2, this.Inner[1], mid3, this.Inner[2]];
          this.value[this.Inner[1]] = [centre, mid1, innerEdge[0], mid3, innerEdge[2]];
          this.value[TD.lang.reverseEdge(this.Inner[1])] = [centre, mid1, this.Inner[0], mid3, this.Inner[2]];
          this.value[this.Inner[2]] = [centre, mid1, this.Inner[0], mid2, this.Inner[1]];
          this.value[TD.lang.reverseEdge(this.Inner[2])] = [centre, mid1, this.Inner[0], mid2, this.Inner[1]];
          this.position = centre;
        };

        this.processLinker = function(){
          this.value = {};
          var mid1 = TD.lang.getMiddle(this.Inner[0]);
          var mid2 = TD.lang.getMiddle(this.Inner[1]);
          // key = inner edge,   value = [the other inner edge's Middle point and edge itself]
          this.value[this.Inner[0]] = [mid2, this.Inner[1]];
          this.value[TD.lang.reverseEdge(this.Inner[0])] = [mid2, this.Inner[1]];
          this.value[this.Inner[1]] = [mid1, this.Inner[0]];
          this.value[TD.lang.reverseEdge(this.Inner[1])] = [mid1, this.Inner[0]];

          this.position = mid1;
        };

      },// end of Tri

      resolveCircleProblem : function(curEdge, theOnes, hashEdge, cx){
        var directEdges = [], circleTri = [];
        for(var idx=0; idx<theOnes.length; idx++){
          directEdges.push([curEdge[0], theOnes[idx], TD.lang.getAngle(curEdge, [curEdge[0], theOnes[idx]])]);
        }
        directEdges.sort(function(a,b){
          return b[2] - a[2];
        });
        directEdges.push([curEdge[0], curEdge[1], 0]);
        for(var idx=0; idx<directEdges.length-1; idx++){
          var e1 = [directEdges[idx][1], curEdge[0]];
          var e2 = [directEdges[idx+1][1], directEdges[idx][1]];
          var e3 = [curEdge[0], directEdges[idx+1][1]];
          var tri = this.processTriangle(e1, e2, e3);
          console.log("in circle get a tri:");
          console.log(tri);
          for(var i=0; i<tri.Outer.length; i++){
            delete hashEdge[tri.Outer[i]];
            //drawOneSet(cx, [tri.Outer[i]] , 'rgb(255, 255, 255)');
          }
          for(var j=0; j<tri.Inner.length; j++){
            var p1 = tri.Inner[j][0];
            var p2 = tri.Inner[j][1];
            if(hashEdge[[p1, p2]]!=undefined || hashEdge[[p2, p1]]!=undefined){
              delete hashEdge[[p1, p2]];
              delete hashEdge[[p2, p1]];
            }else{
              hashEdge[[p1, p2]] = [p1, p2];
            }
            //TD.lang.drawOneSet(cx, [[p1, p2]] , 'rgb(0, 0, 255)');
          }
        }
      } // end of resolveCircleProblem

    }; // end of cdt prototype


    //terminalTriPool = [tri1, tri2, tri3...]
    //Edge4Tri = {}  --> key: edge.toString, value = [tri1, tri2]
    //reverseEdge
    this.trimRedundantTerminalTriangle = function(){
      while(terminalTriPool.length > 0){
        var curTri = terminalTriPool.shift();
        if(curTri.value['A'] < 100) continue;
        //drawTriangleOutline(cx, curTri);
        var terminalInnerEdge = curTri.Inner[0];
        var edgeRelatedTriPool = Edge4Tri[terminalInnerEdge];
        var relatedTri = null;
        if(edgeRelatedTriPool[0]==curTri){
          relatedTri = edgeRelatedTriPool[1];
          //edgeRelatedTriPool.splice(0,1);   --> no need to pop out this terminal tri, will eventually delete this key!
          //Edge4Tri[reverseEdge(terminalInnerEdge)].splice(0,1);
        }else{
          relatedTri = edgeRelatedTriPool[0];
          //edgeRelatedTriPool.splice(1,1);
          //Edge4Tri[reverseEdge(terminalInnerEdge)].splice(1,1);
        }
        console.log("trim this bad triangle!");
        console.log(curTri);
        relatedTri.changeFeature(terminalInnerEdge);  // now this tri is nolonger it's origin feature!
        if(relatedTri.Feature == 'T'){
          console.log("add new terminal tri");
          console.log(relatedTri);
          terminalTriPool.push(relatedTri);
        }
        delete Edge4Tri[terminalInnerEdge];
        delete Edge4Tri[TD.lang.reverseEdge(terminalInnerEdge)];
      }
    };


    this.buildPath = function( startTriangle ){
      if(startTriangle == null){
        console.log("failed to find start Triangle");
        return;
      }
      var queue = [], depth = 0, size = 0, curNode = null, edges = null;
      var startNode = new this.Node(startTriangle.position, startTriangle, null, null, 'TS');
      queue.push(startNode);
      while(queue.length > 0){
        size = queue.length;
        var tmpHashTable = {}; //eliminate creating duplicate node for the same junction triangle
        while(size > 0){
          size--;
          curNode = queue.shift();
          curNode.depth = depth;
          if(curNode.Feature == 'TS'){
            edges = [curNode.triangle.Inner[0]];  //'T' node only has one available edge
          }else if(curNode.Feature == 'J' && curNode.parentEdge.length == 1){
            var jVal = curNode.triangle.value[curNode.parentEdge];
            edges = [jVal[2], jVal[4]];
          }else if(curNode.Feature == 'J' && curNode.parentEdge.length == 2){
            //a node with two parents
            for(var i=0; i<curNode.triangle.Inner.length; i++){
              if(TD.lang.edgeEq(curNode.triangle.Inner[i], curNode.parentEdge[0]) ||
                TD.lang.edgeEq(curNode.triangle.Inner[i], curNode.parentEdge[1])) continue;
              edges = [curNode.triangle.Inner[i]];
              break;
            }
          }else if(curNode.Feature == 'J' && curNode.parentEdge.length == 3){
            // in case a Junction node has Three parents  --> weird, but real
            curNode.Feature == 'TJ'  // this node is equivlent to a Terminal, so treat it just as 'TJ'
            this.recordTerminal(curNode);
            continue;
          }else{
            console.log("Function<buildPath>: do not push 'T' feature node into queue");
          }

          for(var idx=0; idx<edges.length; idx++){   // 1 or 2 times
            var res = this.singlePath( curNode.triangle , edges[idx] );  // res = [path, tri, tri-edge]
            var path = res[0];
            var childTri = res[1];
            var childTriEdge = res[2];

            if(childTri == curNode.triangle){
              // if a J node find a single path to itself, then this J node should be treated as a Terminal node
              // in the above case, set Feature to 'TJ'
              curNode.Feature = 'TJ';
              curNode.fellow.push(curNode);   // put itself to its fellows, because every node always has 20% chance to direct visit a fellow
              curNode.fellow.push(curNode);
              curNode.pathToFellow.push(path);
              curNode.pathToFellow.push(this.copyReversePath(path));
              this.recordTerminal(curNode);
              break;  // break for loop to inner while loop
            }else if(childTri.Feature == 'T'){
              // a terminal node will not have two parents
              var childNode = new this.Node( childTri.position , childTri, curNode, childTriEdge, 'T' );
              curNode.children.push(childNode);
              curNode.pathToChildren.push(path);
              childNode.pathToParent.push(this.copyReversePath(path));  //mutually connect to each other
              childTri.isVisited = true;
              childNode.depth = depth+1;
              this.recordTerminal(childNode);
            }else{  // must be 'J'
              if(tmpHashTable[childTri] != undefined){
                // find a tri/node that discovered in current layer/while loop
                // previously discovered node, so neight create a same one, nor push it into the queue
                // a node can has two or three parents
                // a node can has same or different parents
                var childNode = tmpHashTable[childTri];
                curNode.children.push(childNode);
                curNode.pathToChildren.push(path);
                childNode.pathToParent.push(this.copyReversePath(path));
                childNode.parentnode.push(curNode);
                childNode.parentEdge.push(childTriEdge);
              }else if(childTri.isVisited){
                // also already be discovered, but must not be discovered in this layer
                // so this one is a node on the same layer
                // two node on the same level will see each other, therefore no need to add to queue
                // also no need to add each other to parent
                // beside, it's possible a J node has two on-same-layer fellow nodes
                // even more crazy, a J node's two fellows may be the same (one node, two fellow paths)
                var sameLayerNode = tmpHashTable[childTri];
                if( sameLayerNode == undefined ){
                  tmpHashTable[curNode.triangle] = curNode;
                  continue;
                }
                curNode.fellow.push(sameLayerNode);
                curNode.pathToFellow.push(path);
                sameLayerNode.fellow.push(curNode);
                sameLayerNode.pathToFellow.push(this.copyReversePath(path));
                if(curNode.fellow.length==2){
                  curNode.Feature = 'TJ';
                  // do something to process terminal
                  recordTerminal(curNode);
                }
                if(sameLayerNode.fellow.length==2){
                  sameLayerNode.Feature = 'TJ';
                  this.recordTerminal(sameLayerNode);
                }
              }else{
                // normal case, need to push to queue
                // parent could be TS could be J
                // childTri is unvisited
                // childTri is not a terminal
                // childTri is not a terminal Junction YET (we don't know if it will be later)
                // so childTri must be junction
                var childNode = new this.Node( childTri.position , childTri, curNode, childTriEdge, 'J' );
                curNode.children.push(childNode);
                curNode.pathToChildren.push(path);
                childNode.pathToParent.push(this.copyReversePath(path));  //mutually connect to each other
                queue.push(childNode);
                childTri.isVisited = true;
                tmpHashTable[childTri] = childNode;
              }
            }
          }  // end of for loop:  explore a node's branch
        } // end of inner while loop:  node on the same layer
        depth++;
      } // enf of outer while loop: all nodes should be discovered
      return startNode;
    };


    this.buildPath.prototype = {

      Node : function( position , tri, parentnode, parentEdge, feature ){
        this.position = position;  // p = [x, y]
        this.Feature = feature;  // 'T' for terminal, 'J' for junction, 'TA' for target terminal, 'TS' for start terminal
        this.depth = 0;  // use BFS to set depth for each nodes
        this.weight = 0;  // this node and all its sub notes' accumulated weight, used to compute probability
        this.reachable = {};  //{key = T-Node :   value = -1, 0 or 1} where -1:false, 0:indirect true,  1:true

        this.triangle = tri;  // the super tishen standing behand this node
        this.parentEdge = [parentEdge];  // the edge in this node/tri that associate with its parent node

        //this.probabiltiy = [];  // prob = [[0,0.25],[0.25,1]]   random number drops in which slot, choose that direction!

        this.parentnode = [parentnode];  // parent node
        this.pathToParent = [];   // [[point, speed], [point, speed], ...]

        this.fellow = [];    // fellow node, only direct connected same-layer node can be fellow node
        this.pathToFellow = [];

        this.children = []; // a list of object [node1, node2]
        this.pathToChildren = [];  // [  [[point, speed], [point, speed], ...],      [ ... ]  ]

        this.toString = function(){return this.position.toString();};  // we can use Node as key in hashtable
        // if this node has lived direct nodes, return 1
        // if has indirect nodes return 0;
        // else return -1;
        this.worthToVisit = function(){
          if(this.Feature == 'TA') return 1;  //since I manually modifies TA's position, I have to add this check statement to prevent a bug
          if(typeof TD.aliveTerminals === 'undefined') return true;
          var res = -1;
          for(var key in TD.aliveTerminals){
            if(!TD.aliveTerminals.hasOwnProperty(key))
              continue;
            if(this.reachable[key] == 0)
              res = 0;
            else if(this.reachable[key] == 1)
              return 1;
          }
          return res;
        }
      },

      singlePath : function( tri , e ){
        var path = [], cur = [];
        if(tri.Feature=='T' || tri.Feature=='J'){
          cur = [tri.position, TD.cfg.speedMapping(tri.area)];
        }else{
          console.log("can not create single path starting from linker triangle");
          return null;
        }
        path.push(cur);
        do{
          tri = Edge4Tri[e][0]==tri ? Edge4Tri[e][1] : Edge4Tri[e][0];
          cur = [TD.lang.getMiddle(e), TD.cfg.speedMapping(tri.area)];
          path.push(cur);
          if(tri.Feature=='T' || tri.Feature=='J'){
            cur = [tri.position, TD.cfg.speedMapping(tri.area)];
            path.push(cur);
          }else{
            e = tri.value[e][1];
          }
        }while(tri.Feature == 'L');
        //TD.lang.drawArray(cx, path, 'rgb(255,255,102)');
        return [path, tri, e];
      },

      // var terminalNodePool = [] --> global variable: [target-terminal,  terminal1, terminal2, ... ]
      // var Restriction = [[[100,0],[0,100]],[[width-100,height],[width,height-100]]]
      // isOnLeft(e, r)
      recordTerminal : function( node ){
        if(!TD.lang.isOnLeft(TD.cfg.taRestriction, node.position)){
          TD.terminalNodePool.unshift(node);
          node.Feature = 'TA';
					node.position[0] -= 15;
          node.position[1] -= 10;  // move the TA tower a little bit in order to display all of it
          TD.validMap = true;
        }else{
          TD.terminalNodePool.push(node);
        }
      },

      copyReversePath : function( path ){
        var res = [];
        for(var idx=path.length-1; idx>=0; idx--){
          res.push(path[idx]);
        }
        return res;
      } // end of copyReversePath

    }; // end of buildPath.prototype


    this.setPath = function( terminalNodePool ){
      for(var idx=0; idx<terminalNodePool.length; idx++){  // for each terminal node do following:
        var curTerminalNode = terminalNodePool[idx];
        // first do dfs from each terminal node
        // only explore parentnode
        // set all encounter node:  {key = current terminal,   value = 'direct reachable' or 1}
        // 1  -->  direct reachable
        var directNodes = [];
        this.dfs4Node(curTerminalNode, curTerminalNode, ['parentnode'], 1, directNodes);
        // then for all explored direct reachable nodes
        // do dfs to both parent and fellow branches
        // set all non-setted node:  {key = current terminal,   value = 'indirect reachable' or 0}
        // 0  -->  indirect reachable
        var indirectNodes = [];
        for(var i=0; i<directNodes.length; i++){
          var dirN = directNodes[i];
          this.dfs4Node(curTerminalNode, dirN, ['parentnode', 'fellow'], 0, []);
        }
      }
    };


    // terminalNode -->  key of Node.reachable
    // curNode  -->  dfs current searching node
    // branchNames  -->  name of branch:  parentnode or fellow or children
    // value  -->  1 as direct,  0 as indirect
    // pool  -->  return all setted nodes during dfs
    this.dfs4Node = function( terminalNode, curNode, branchNames, value, pool){
      if(curNode.Feature == 'TS'){  // 'TS' MUST be a Terminal, Must not be any kind of Junction or Linker
        return;
      }
      if(curNode.reachable[terminalNode] == undefined){  // never set a seted value a value
        curNode.reachable[terminalNode] = value;
        pool.push(curNode);
      }

      for(var i=0; i<branchNames.length; i++){
        var list = curNode[branchNames[i]];
        for(var idx=0; idx<list.length; idx++){
          if(list[idx].reachable[terminalNode] == undefined)
            this.dfs4Node( terminalNode, list[idx], branchNames, value, pool);
        }
      }
    };


    // start from 'TS' node
    // recursively compute weight = [path to children] + [weight of children]
    // 'TA' worth 10 point
    // 'T' and 'TJ' 5 point
    // path to child just count length (# of triangles)
    this.setWeight = function( node ){
      if(node.Feature == 'T' || node.Feature == 'TJ'){
        node.weight = 5;
        return node.weight;
      }else if(node.Feature == 'TA'){
        node.weight = 10;
        return node.weight;
      }
      for(var idx=0; idx<node.children.length; idx++){
        node.weight += node.pathToChildren[idx].length + this.setWeight( node.children[idx] );
      }
      return node.weight;
    };


    this.pathOutline = new this.getData(data);
    new this.cdt(this.pathOutline[0], this.pathOutline[1]);
    this.trimRedundantTerminalTriangle();
    TD.root = new this.buildPath(startTriangle);
    if(!TD.validMap){
      TD.terminalNodePool = [];
      TD.aliveTerminals = {};
      alert("Please connect start point to end point!");
      TD.init();
      return;
    }
    this.setPath(TD.terminalNodePool);
    this.setWeight( TD.root );
    TD.plantMap(TD.cfg.density);  // plant grass onto map

    // console.log(TD.root);
    // console.log(TD.terminalNodePool);
    TD.start();
  }

});







_TD.loading.push(function(TD){

  // new this entity before using it
  // choose a neighbour node to go based on current situation
  // return [nextNode, pathToThatNode]
  TD.strategy = function( curNode ){
    if(curNode.Feature == 'TS') return [curNode.children[0], curNode.pathToChildren[0]];
    var idx = 0;
    var pool = [];

    // pick a random based on weight
    // doing well when pool.length < 3
    var pickOne = function( pool, curNode ){
      var pathName = pool.pop(), branchName = pool.pop(), sum = 0, curW = 0, pre = 0;
      pool.shift();
      var idx = pool.shift();
      sum = curNode[branchName][idx].weight + curNode[pathName][idx].length;
      pre = sum;
      for(var i=0; i<pool.length; i++){
        curW = curNode[branchName][pool[i]].weight + curNode[pathName][pool[i]].length;
        sum += curW;
        if(Math.random() < (curW / sum)){
          sum -= pre;
          pre = sum;
          idx = pool[i];
        }else{
          sum -= curW;
        }
      }
      return idx;
    };

    if(curNode.fellow.length > 0 && Math.random() > 0.1){
      // choose a fellow
      for(var i=0; i<curNode.fellow.length; i++){
        pool.push(i);
      }
      pool.push('fellow');
      pool.push('pathToFellow');
      pool.unshift(1);
      idx = pickOne( pool, curNode );
      return [curNode.fellow[idx], curNode.pathToFellow[idx]];
    }else{
      if(curNode.children.length>0){
        // choose a children
        for(var i=0; i<curNode.children.length; i++){
          var res = curNode.children[i].worthToVisit();
          if(res == 1){
            if(pool.length==0 || pool[0] != 1) pool = [1, i];
            else pool.push(i);
          }else if(res == 0){
            if(pool.length==0 || pool[0] == -1) pool = [0, i];
            else if(pool[0] == 0) pool.push(i);
          }else{
            if(pool.length==0) pool = [-1, i];
            else if(pool[0] == -1) pool.push(i);
          }
        }
        if(pool[0] == -1){
          pool = [];
        }else{
          pool.push('children');
          pool.push('pathToChildren');
          idx = pickOne( pool, curNode );
          return [curNode.children[idx], curNode.pathToChildren[idx]];
        }
      }
      if(curNode.fellow.length>0){
        // choose a fellow
        for(var i=0; i<curNode.fellow.length; i++){
          var res = curNode.fellow[i].worthToVisit();
          if(res == 1){
            if(pool.length==0 || pool[0] != 1) pool = [1, i];
            else pool.push(i);
          }else if(res == 0){
            if(pool.length==0 || pool[0] == -1) pool = [0, i];
            else if(pool[0] == 0) pool.push(i);
          }else{
            if(pool.length==0) pool = [-1, i];
            else if(pool[0] == -1) pool.push(i);
          }
        }
        if(pool[0] == -1){
          pool = [];
        }else{
          pool.push('fellow');
          pool.push('pathToFellow');
          idx = pickOne( pool, curNode );
          return [curNode.fellow[idx], curNode.pathToFellow[idx]];
        }
      }
      if(curNode.parentnode.length>0){
        // choose a parent
        for(var i=0; i<curNode.parentnode.length; i++){
          var res = curNode.parentnode[i].worthToVisit();
          if(res == 1){
            if(pool.length==0 || pool[0] != 1) pool = [1, i];
            else pool.push(i);
          }else if(res == 0){
            if(pool.length==0 || pool[0] == -1) pool = [0, i];
            else if(pool[0] == 0) pool.push(i);
          }else{
            if(pool.length==0) pool = [-1, i];
            else if(pool[0] == -1) pool.push(i);
          }
        }
        pool.push('parentnode');
        pool.push('pathToParent');
        idx = pickOne( pool, curNode );
        return [curNode.parentnode[idx], curNode.pathToParent[idx]];
      }
      else{
        console.log("No available strategy");
      }
    }
    return null;
  };

});




_TD.loading.push(function(TD){


  //TD.eventQueue
  //TD.buildingsInBattleField
  TD.monster = function( node, cfg ){
    this.position = node.position;
    this.node = node;

		this.shield = cfg.shield;  //this feature is added at TD.lang.getRandomMonster()

    this.type = cfg.type;
    this.speed = cfg.speed;
    this.baseSpeed = cfg.speed;
    this.range = cfg.range;   // attack range
    this.damage = cfg.damage;
    this.cannonType = cfg.cannonType;
    this.frequency = cfg.frequency;
    this.target = null;     // monster target buildings
    this.fire_st = null;
    this.setTarget = function( tar ){
      this.target = tar;
      this.controlFire();
    };

    this.controlFire = function(){  // let's make consistent fire as long as find a target
      if(this.fire_st != null){
        clearInterval(this.fire_st);
      }
      if(this.target == null || this.target.live <= 0){
        return;
      }
      var that = this;
      this.fire_st = setInterval(
        function(){
          if(that.cannonType == 'bullet_layser'){
            that.fire(that.position, that.target, that.damage, that.cannonType);
          }else{
            var tarP = TD.lang.accuracyDestroyer(that.target.position, 8);
            that.fire(that.position, tarP, that.damage, that.cannonType);
          }
        },
        that.frequency);
    };

    this.live = cfg.live();
    this.maxLive = cfg.live();
    this.price = cfg.price();

    this.from = node;
    this.to = null;
    this.path = null;
    this.probe = 0;    // indicate current location on a single path

    this.alive = true;

    this.dirFrameArray = TD.monsterFrame[this.type];
    this.frame = 0;  // used to show images
    this.Dir = 0;  // current direction

    this.move = function(){
      if(TD.pause){
        this.setTarget(null);
        return true;
      }
      if(this.live <= 0) {      // current monster is dead
        // can add exploding view later
        this.alive = false;
        clearInterval(this.fire_st);
        TD.lang.setMoney(TD.money + this.price);
        TD.lang.setScore(TD.score + parseInt(this.maxLive/100));
        return false;
      }
      var tmpTar = this.findTarget();
      if(tmpTar == null && this.target != null){
        this.setTarget(tmpTar);
      }
      if(tmpTar != null){   // if this monster find a target, it will not move until destroy that target
        TD.eventQueue.push({   // stay at the same position
          position : this.position,
          type : this.type,
          spritename : this.dirFrameArray[this.Dir][5],
          dir : this.Dir
        });
        if(this.target != tmpTar){
          this.setTarget(tmpTar);
        }
        return true;
      }
      if(this.from == null) return false;  // actually, I don't think it's possible
      if(this.to == null){                 //find next station
        var res = TD.strategy(this.from);
        this.to = res[0];
        this.path = res[1];
        this.probe = 1;
      }
      // this monster get to a terminal station
      if(TD.lang.pointEq(this.position, this.to.position) || this.probe==this.path.length){
        if(this.to.Feature == 'TA'){   // the monster reaches the final Terminal, Game over
          this.alive = false;  // make sure blood bar will eventually disappear at this moment
          this.live = 0;
          return false;
        }else{      // the monster reaches an ordinary terminal
          this.from = this.to;
          this.to = null;
          if(this.from.Feature=='T' || this.from.Feature == 'TJ'){
            var tbld = TD.aliveTerminals[this.from];
            if(tbld != undefined){
              tbld.live = -1;
              //TD.deadTerminals[this.from] = TD.aliveTerminals[this.from];
              //delete TD.aliveTerminals[this.from];
            }
          }
          //this.move();
          return this.move();
        }
      }

      // -------- set direction --------
      var nextDir = TD.lang.getCurDir(this.position, this.path[this.probe][0]);
      if(this.Dir != nextDir){
        this.frame = 0;
        this.Dir = nextDir;
      }else{
        this.frame++;
        this.frame %= this.dirFrameArray[this.Dir].length;
      }
      // -------- end of set direction --------

      this.speed = this.baseSpeed * this.path[this.probe-1][1];
      this.position = TD.lang.getNextPos(this.position, this.path[this.probe-1][0], this.path[this.probe][0], this.speed);
      if(TD.lang.pointEq(this.position, this.path[this.probe][0])){
        this.probe++;
      }
      TD.eventQueue.push({
        position : this.position,
        type : this.type,
        spritename : this.dirFrameArray[this.Dir][this.frame],
        dir : this.Dir
      });
      return true;
    };

    this.findTarget = function(){
      var theBuilding = null, dis = this.range, key, idx;
      if(this.target != null && this.target.live > 0 &&
         TD.lang.getDistance(this.position, this.target.position) <= dis){
         return this.target;
      }
      for(key in TD.aliveTerminals){
        if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
        theBuilding = TD.aliveTerminals[key];  // the terminal tower
        if(TD.lang.getDistance(this.position, theBuilding.position) <= dis){
          return theBuilding;
        }
      }
      for(idx=0; idx<TD.inBuildingQueue.length; idx++){
        if(TD.lang.isInRange(this.position, TD.inBuildingQueue[idx].position, dis)){
          return TD.inBuildingQueue[idx];
        }
      }
      return null;
    };

    this.fire = function(s, e, damage, cannonType){
      // s: start point,  e: end point,  damage: damage,  type: draw style
      // this.target.position as end point
      // create a bullet object
      // push that bullet object into TD.bulletQueue
      var bulletCfg = {
        position : s,
        start : s,
        end : e,
        gender : false,    // this from evil
        damage : damage,   // may increase when flying through something in the map
        type : cannonType
      };
      var blt = new TD.bullet( bulletCfg );
      TD.bulletQueue.push(blt);
    }


  };

});

_TD.loading.push(function(TD){

  TD.drawer = function( obj ){
    if(obj.type == 'Monster'){
      TD.cfg.monster(TD.ucx, obj.position);
    }
    else if(obj.type == 'mouse'){
      TD.cfg.mouse(TD.ucx2, TD.uc2, obj);
    }
    else if(obj.type == 'bar'){
      TD.cfg.bar(TD.ucx, obj);
    }
    else if(obj.type == 'monster-1'){
      TD.cfg.mst1(TD.ucx, obj);
    }
    else if(obj.type == 'monster-2'){
      TD.cfg.mst2(TD.ucx, obj);
    }
    else if(obj.type == 'monster-3'){
      TD.cfg.mst3(TD.ucx, obj);
    }
    else if(obj.type == 'monster-4'){
      TD.cfg.mst4(TD.ucx, obj);
    }
    else if(obj.type == 'building-1'){
      TD.cfg.bld1(TD.ucx, obj);
    }
    else if(obj.type == 'building-2'){
      TD.cfg.bld2(TD.ucx, obj);
    }
    else if(obj.type == 'building-3'){
      TD.cfg.bld3(TD.ucx, obj);
    }
    else if(obj.type == 'building-4'){
      TD.cfg.bld4(TD.ucx, obj);
    }
    else if(obj.type == 'building-5'){
      if(obj.alive==true){
        TD.cfg.bld5(TD.ucx, obj);
      }
      else {
        TD.cfg.bld5_2(TD.ucx, obj);
      }
    }
    else if(obj.type == 'building-6'){
      TD.cfg.bld6(TD.ucx, obj);
    }
    else if(obj.type == 'bullet_small'){
      TD.cfg.bullet_small(TD.ucx, obj);
    }
    else if(obj.type == 'bullet_middle'){
      TD.cfg.bullet_middle(TD.ucx, obj);
    }
    else if(obj.type == 'bullet_large'){
      TD.cfg.bullet_large(TD.ucx, obj);
    }
    else if(obj.type == 'bullet_layser'){
      TD.cfg.bullet_layser(TD.ucx, obj);
    }
    else if(obj.type == 'bullet_missile'){
      TD.cfg.bullet_missile(TD.ucx, obj);
    }
    else if(obj.type == 'grass'){
      TD.cfg.grass(TD.ucx, obj);
    }
    else if(obj.type == 'game_over'){
      TD.cfg.game_over(TD.ucx, obj);
    }
  }

});

_TD.loading.push(function(TD){

  /*
  A building will run move function every step,
  pipeline:  run move() -> find target monster -> cumputer cannon direction --> create an drawable object
  --> if current building is on clicked by user, add range to drawable object
  --> set target and create a thread looping on fire function
  --> main thread push the drawable to queue and return
  */
  TD.building = function( position, cfg ){
    this.position = position;
    this.type = cfg.type;

    this.price = cfg.price;
    this.level = 0;  // building level, upgradable, Level is binding with building View.

    this.frameArray = TD.turretFrame[this.type];
    this.frameIndex = 0;
    this.baseLine = [this.position, [this.position[0]-10,this.position[1]]];  // <s, e>
    this.angle = 0;  // control rotation of building

    this.live = cfg.live;
    this.maxLive = cfg.live;
    this.frequency = cfg.frequency;  // fire frequency
    this.range = cfg.range;   // fire range
    this.damage = cfg.damage;   // weapon damage
    this.upgrade = function(){
      if(this.level == TD.cfg.maxLevel) return false;
      var up = TD.cfg.upgradeMapping[this.type][this.level];
      if(TD.money < up.price) return false;
      TD.lang.setMoney(TD.money - up.price);
      this.price += up.price;
      this.level++;
      this.damage = parseInt(this.damage*up.damage);
      this.range  = parseInt(this.range*up.range);
      this.maxLive= parseInt(this.maxLive*up.live);
      this.live   = this.maxLive;  // immediately refresh the live of building to max
      this.frequency = parseInt(this.frequency*up.frequency);
      if(this.type=='building-6') this.missileNumber = up.missile;
      TD.lang.showBuildingInfo(this);
      return true;
    };

    this.onClick = false; // set to true if current building is selected by user's mouse
    this.remove = false;  // if true, then remove it from queue
    this.target = null;  // building's target monster

    this.cannonLen = cfg.cannonLen;
    this.cannonType = cfg.cannonType;  // bullet? layser?
    this.cannonDir = TD.lang.getCannon(this.position, [this.position[0]-10,this.position[1]],this.cannonLen); //default cannon direction

    this.fire_st = null;
    this.setTarget = function( tar ){
      this.target = tar;
      this.controlFire();
    };

    this.controlFire = function(){  // let's make consistent fire as long as find a target
      if(this.fire_st != null){
        clearInterval(this.fire_st);
      }
      if(this.target == null){
        return;
      }
      var that = this;
      this.fire_st = setInterval(
        function(){
          if(that.cannonType == 'bullet_missile'){
            that.fire(null, null, that.damage, that.cannonType);
          }else if(that.cannonType == 'bullet_layser'){
            that.fire(that.cannonDir[1], that.target.position, that.damage, that.cannonType);
          }else{
            var tarP = TD.lang.accuracyDestroyer(that.target.position, 10);
            that.fire(that.cannonDir[1], tarP, that.damage, that.cannonType);
          }
        },
        that.frequency);
    };

    this.cumputeAngle = function(target){
      this.cannonDir = TD.lang.getCannon(this.position, target.position, this.cannonLen);
      var Dir = [this.position, this.cannonDir[1]];
      this.angle = TD.lang.getAngle360(this.baseLine, Dir);  //get angle from baseLine(nver changes) to cannonDir
    };

    this.move = function(){
      if(TD.pause){
        this.setTarget(null);
        return true;
      }
      if(this.live <= 0) {       // this terminal building has been destroied
        clearInterval(this.fire_st);  // don't forget to shut down its cannon :)
        return false;  // td.js will move it to TD.deadTerminals
      }
      if(this.remove == true) {       // this building has been removed
        clearInterval(this.fire_st);  // don't forget to shut down its cannon :)
        return false;
      }
      var obj = {
        position : this.position,
        type : this.type,   //building type, indicate the outline of building
        angle : this.angle,
        frame : this.frameIndex
      };
      var tmpTar = this.findTarget();
      if(tmpTar != null){
        this.cumputeAngle(tmpTar);
        obj['frame'] = this.frameIndex;
        this.frameIndex++;
        this.frameIndex %= this.frameArray.length;
      }
      if(this.onClick){
        obj['showRange'] = this.range;
        TD.lang.showBuildingInfo(this);
      }
      if(this.target != tmpTar){
        this.setTarget(tmpTar);
      }
      TD.eventQueue.push(obj);
      return true;
    };

    this.findTarget = function(){  // find the nearest monster if any, or return null
      var theMonster = null, dis = this.range, tmp = 0;
      if(this.target != null && this.target.alive==true &&
         TD.lang.getDistance(this.position, this.target.position) <= dis){
         return this.target;
       }
      for(var idx=0; idx<TD.monsterQueue.length; idx++){
        tmp = TD.lang.getDistance(this.position, TD.monsterQueue[idx].position);
        if( tmp <= dis){
          dis = tmp;
          theMonster = TD.monsterQueue[idx];
        }
      }
      return theMonster;
    };

    this.fire = function(s, e, damage, cannonType){
      // s: start point,  e: end point,  damage: damage,  type: draw style
      // this.cannonDir[1] as start point
      // this.target.position as end point
      // create a bullet object
      // push that bullet object into TD.bulletQueue
      var bulletCfg = {
        position : s,
        start : s,
        end : e,
        gender : true,  // this is justice
        damage : damage,   // may increase when flying through something in the map
        type : cannonType,
        hostType : this.type
      };
      if(cannonType == 'bullet_missile'){
        bulletCfg['end'] = this.target;
        var blt = new TD.missile( bulletCfg );
      }else if(cannonType == 'bullet_layser'){
        bulletCfg['end'] = this.target;
        var blt = new TD.bullet( bulletCfg );
      }
      else{
        var blt = new TD.bullet( bulletCfg );
      }
      TD.bulletQueue.push(blt);
    }

  };


  TD.missileBuilding = function (position, cfg){
    this.__proto__ = new TD.building(position, cfg);
    this.missileNumber = cfg.missileNumber;  // number of missiles available in each attack (max: 7)
    this.curLauncher = [];
    this.curLaunchPoint = [];
    // Curbs are used to filter out monsters that are lay outside of its front face
    this.leftCurb = [this.position, [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR]];
    this.rightCurb = [this.position, [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR]];
    this.baseLauncher = [     // 4 points, first two is the front face
                     [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR],
                     [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR],
                    // [this.position[0]+TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR],
                    // [this.position[0]+TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR]
                    ];
    this.baseLaunchPoint = [    //7 points indicate the place the missile will be launched
                        [this.position[0]-TD.cfg.buildingR/2,this.position[1]],
                      //  [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR/3],
                      //  [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR/3],
                        [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR/3*2],
                        [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR/3*2],
                      //  [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR],
                      //  [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR]
                       ];

    //modify launcher body, launch-point and Curbs
    this.computeLaunchPointAndCurbRestriction = function(){
      var idx, tmpX, tmpY, x, y;
      for(idx=0; idx<2; idx++){
        tmpX = this.baseLauncher[idx][0] - this.position[0];
        tmpY = this.baseLauncher[idx][1] - this.position[1];
        x = tmpX*Math.cos(this.angle) - tmpY*Math.sin(this.angle) + this.position[0];
        y = tmpX*Math.sin(this.angle) + tmpY*Math.cos(this.angle) + this.position[1];
        this.curLauncher[idx] = [x, y];
      }
      this.leftCurb = [this.position, this.curLauncher[0]];
      this.rightCurb = [this.position, this.curLauncher[1]];
      for(idx=0; idx<this.missileNumber; idx++){
        tmpX = this.baseLaunchPoint[idx][0] - this.position[0];
        tmpY = this.baseLaunchPoint[idx][1] - this.position[1];
        x = tmpX*Math.cos(this.angle) - tmpY*Math.sin(this.angle) + this.position[0];
        y = tmpX*Math.sin(this.angle) + tmpY*Math.cos(this.angle) + this.position[1];
        this.curLaunchPoint[idx] = [x, y];
      }
    };


    this.move = function(){
      if(TD.pause){
        this.setTarget(null);
        return true;
      }
      if(this.live <= 0) {       // this terminal building has been destroied
        clearInterval(this.fire_st);  // don't forget to shut down its cannon :)
        return false;  // td.js will move it to TD.deadTerminals
      }
      if(this.remove == true) {       // this building has been removed
        clearInterval(this.fire_st);  // again don't forget to shut down its cannon :)
        return false;
      }
      var tmpTar = this.findTarget();
      if(tmpTar != null){
        this.cumputeAngle(tmpTar);
      }
      this.computeLaunchPointAndCurbRestriction();
      var obj = {
        position : this.position,
        type : this.type,   //building type, indicate the outline of building
        angle : this.angle
      };
      if(this.onClick){
        obj['showRange'] = this.range;
        TD.lang.showBuildingInfo(this);
      }
      if(this.target != tmpTar){
        this.setTarget(tmpTar);
      }
      TD.eventQueue.push(obj);
      return true;
    };

    this.findAllTargets = function(){
      var allMonsters = [], range = this.range,  dis, ms;
      for(var idx=0; idx<TD.monsterQueue.length; idx++){
        if(allMonsters.length > this.missileNumber) break;
        ms = TD.monsterQueue[idx];
        dis = TD.lang.getDistance(this.position, ms.position);
        if(dis > range) continue;
        if(!TD.lang.isOnLeft(this.leftCurb, ms.position) && TD.lang.isOnLeft(this.rightCurb, ms.position)){
          allMonsters.push(ms);
        }
      }
      return allMonsters;
    };

    this.fire = function(s, e, damage, cannonType){
      var all = this.findAllTargets(), idx=0, i=0, tar;
      for(idx=0; idx<this.missileNumber; idx++){
        if(i==all.length) i=0;
        tar = all[i++];
        var bulletCfg = {
          position : this.curLaunchPoint[idx],
          start : this.curLaunchPoint[idx],
          end : tar,
          gender : true,
          damage : damage,
          type : cannonType,
          hostType : this.type
        };
        var blt = new TD.missile( bulletCfg );
        TD.bulletQueue.push(blt);
      }
    };

  };

  // terminalBuilding inhert from TD.building object
  TD.terminalBuilding = function( position, terminalId, cfg ){
    this.__proto__ = new TD.building( position, cfg );
    this.type = 'building-5';
    this.tid = terminalId;  // infact, this is a node itself
    this.firePos = [position[0],position[1]-33];
    this.upgrade = function(){
      var up = TD.cfg.upgradeMapping[this.type][this.level];
      if(TD.money < up.price) return false;
      TD.lang.setMoney(TD.money - up.price);
      this.price += up.price; // do not increase level for terminal building
      this.maxLive *= up.live;
      this.live = this.maxLive;  // immediately refresh the live of building to max
      TD.lang.showBuildingInfo(this);
      if(TD.aliveTerminals[this.tid] == undefined){
        TD.aliveTerminals[this.tid] = TD.deadTerminals[this.tid];
        TD.bloodBarQueue.push(new TD.bloodBar(TD.aliveTerminals[this.tid]));
        delete TD.deadTerminals[this.tid];
      }
      return true;
    };
    this.move = function(){
      if(TD.pause){
        this.setTarget(null);
        return true;
      }
      var obj = {
        position : this.position,
        type : this.type,   //building type, indicate the outline of building
        tid : this.tid.Feature,  // 'TA' or not
        alive : true
      };
      if(this.onClick){
        obj['showRange'] = this.range;
        TD.lang.showBuildingInfo(this);
      }
      if(this.live <= 0) {       // this terminal building has been destroied
        clearInterval(this.fire_st);  // don't forget to shut down its cannon :)
        obj.alive = false;
        //TD.eventQueue.push(obj);
        TD.terminalTmpBuffer.push(obj);
        if(TD.deadTerminals[this.position] != undefined) return false;  // prevent a dead terminal keeps decreasing score
        TD.lang.setScore(TD.score - parseInt(this.maxLive/100));
        if(this.tid.Feature =='TA') TD.GameOver = true;
        return false;  // td.js will move it to TD.deadTerminals
      }
      var tmpTar = this.findTarget();
      if(this.target != tmpTar){
        this.setTarget(tmpTar);
      }
      //TD.eventQueue.push(obj);
      TD.terminalTmpBuffer.push(obj);
      return true;
    };

    this.controlFire = function(){  // let's make consistent fire as long as find a target
      if(this.fire_st != null){
        clearInterval(this.fire_st);
      }
      if(this.target == null){
        return;
      }
      var that = this;
      this.fire_st = setInterval(
        function(){ that.fire(that.firePos,that.target.position, that.damage, that.cannonType); },
        that.frequency);
    };

    (function(that){
      if(that.tid.Feature=='TA'){
        // that.position[0] -= 15;
        // that.position[1] -= 10;
        that.firePos = [that.position[0],that.position[1]-33];
      }
    })(this);

  };


});


_TD.loading.push(function(TD){

  //before using buildingController, new it
  TD.buildingController = function(){
    this.bld1 = document.getElementById('building-1');
    this.bld2 = document.getElementById('building-2');
    this.bld3 = document.getElementById('building-3');
    this.bld4 = document.getElementById('building-4');
    this.bld6 = document.getElementById('building-6');

    this.ug = document.getElementById('upgrade');
    this.sl = document.getElementById('sell');

    this.c = document.getElementById('td-canvas');

    this.bld1.addEventListener('click', this.onClick_building_1, false);
    this.bld2.addEventListener('click', this.onClick_building_2, false);
    this.bld3.addEventListener('click', this.onClick_building_3, false);
    this.bld4.addEventListener('click', this.onClick_building_4, false);
    this.bld6.addEventListener('click', this.onClick_building_6, false);

    this.ug.addEventListener('click', this.onClick_upgrade, false);
    this.sl.addEventListener('click', this.onClick_sell, false);

    this.c.addEventListener('mousemove', this.onmouseMove, false);
    this.c.addEventListener('click', this.onClick, false);

  };

  TD.buildingController.prototype = {

    onClick_upgrade : function(ev){  // can upgrade weapon damage, 'exploding range'?, frequency, fire range, live.
      if(TD.waitingToChange == null) return;
      TD.waitingToChange.upgrade();
    },

    onClick_sell : function(ev){
      if(TD.waitingToChange == null) return;
      TD.lang.setMoney(TD.money + (TD.waitingToChange.price * 0.5));
      TD.waitingToChange.onClick = false;
      TD.waitingToChange.remove = true;
      TD.waitingToChange = null;
    },

    onClick_building_1 : function(ev){
      if(TD.waitingToBuild == 'building-1'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-1';
      }
    },

    onClick_building_2 : function(ev){
      if(TD.waitingToBuild == 'building-2'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-2';
      }
    },

    onClick_building_3 : function(ev){
      if(TD.waitingToBuild == 'building-3'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-3';
      }
    },

    onClick_building_4 : function(ev){
      if(TD.waitingToBuild == 'building-4'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-4';
      }
    },

    onClick_building_6 : function(ev){
      if(TD.waitingToBuild == 'building-6'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-6';
      }
    },

    onmouseMove : function (ev){
      var rect = TD.uc2.getBoundingClientRect();
      var x = ev.clientX - rect.left;
      var y = ev.clientY - rect.top;
      if(TD.waitingToBuild != null){
        var obj = {
          position : [x,y],
          type : 'mouse',
          buildable : true
        };
        if(TD.lang.ableToBuild([x,y], TD.cfg.buildingR)==-1)
          obj['buildable'] = false;
        TD.drawer(obj);
      }
    },

    onClick : function(ev){
      var rect = TD.uc2.getBoundingClientRect();
      var x = ev.clientX - rect.left;
      var y = ev.clientY - rect.top;
      var isAble = TD.lang.ableToBuild([x,y], TD.cfg.buildingR);
      if(TD.waitingToBuild != null && isAble!=-1){  // click to build?
        var cfg = TD.cfg.Buildings[TD.waitingToBuild];
        if(TD.money >= cfg.price){
          TD.lang.setMoney(TD.money - cfg.price);
          TD.waitingToBuild = null;
          TD.cfg.clearAll(TD.ucx2, TD.uc2); // clear the view of upper layer
          TD.lang.clearGrass([x,y]);  // clear up grass if anyone near this place
          if(cfg.type == 'building-6') {
            var bld = new TD.missileBuilding([x,y], cfg);
            cfg['position'] = bld.position;
            cfg['frame'] = 0;
          }
          else {
            var bld = new TD.building([x,y], cfg);
            cfg['angle'] = 0;
            cfg['position'] = bld.position;
            cfg['frame'] = 0;
          }
          TD.lang.showBuildingInfo(bld);   // missile building should add missile number feature
          TD.drawer(cfg);
          if(isAble==1){   // builid outside the road
            TD.buildingQueue.push(bld);
          }else{
            TD.inBuildingQueue.push(bld);
            TD.bloodBarQueue.push(new TD.bloodBar(bld));
          }
        }
      }
      else if(TD.waitingToBuild == null){  //just click to show details?
        var bld = TD.lang.getBuilding([x,y], TD.cfg.buildingR);
        if(bld != null){
          if(TD.waitingToChange != null){  // enable previously choosed builing in map
            TD.waitingToChange.onClick = false;
          }
          TD.waitingToChange = bld;
          TD.lang.showBuildingInfo(bld);
          bld.onClick = true;
        }else{                              // click on empty place
          if(TD.waitingToChange != null){
            TD.waitingToChange.onClick = false;
            TD.waitingToChange = null;
            TD.lang.showBuildingInfo(null);
          }
        }
      }
    },

  };

});





_TD.loading.push(function(TD){


  TD.bullet = function( cfg ){
    this.position = cfg.position;
    this.origin = cfg.start;
    this.target = cfg.end;   // in missile/layser type, this stores the monster object
    this.type = cfg.type;
    this.damage = cfg.damage;
    this.gender = cfg.gender;  // true: from building, false: from monster
    this.speed = TD.cfg.Arsenal[this.type].speed;  //bullet speed
    this.range = TD.cfg.Arsenal[this.type].damageRange;
    //this.exploding = TD.cfg.Arsenal[this.type].exploding;  // exploding style
    this.exploding = TD.explodeFrame[this.type];  // if layser then undefined
    this.index = 0;  //exploding frame index
    this.hostType = cfg.hostType;  // used to identify different Layser Hoster --> draw differently

    this.move = function(){
      if(this.type == 'bullet_layser'){
        var obj = {
          position : this.target.position,
          origin : this.origin,
          type : this.type,
          hostType : this.hostType
        };
        this.makeDamage();
        TD.eventQueue.push(obj);
        return false;
      }
      if(TD.lang.pointEq(this.target, this.position)==true){
        if(this.index < this.exploding.length){
          var obj = {
            position : this.position,
            type : this.type,
            exploding : this.exploding[this.index],
            hostType : this.hostType
          };
          this.index++;
          TD.eventQueue.push(obj);
          return true;
        }else{
          return false;
        }
      }
      var nextPosition = TD.lang.getNextPos(this.position, this.origin, this.target, this.speed);
      this.position = nextPosition;
      var obj = {
        position : nextPosition,
        type : this.type,
        hostType : this.hostType
      };
      if(TD.lang.pointEq(this.target, this.position)==true){
        this.makeDamage();
        obj['exploding'] = this.exploding[this.index];
        this.index++;
      }
      TD.eventQueue.push(obj);
      return true;
    };

		this.makeDamage = function(){   // now, makeDamage function can process both justice and evil bullets
			if(this.type == 'bullet_layser'){
				if(this.target.shield!=undefined && this.target.shield==true){
					this.target.live -= this.damage*1.5;
				}
				else{
					this.target.live -= this.damage;
				}
				return;
			}
			var idx, ms, key, monsterPosition;
			if(this.gender==true){
				for(idx=0; idx<TD.monsterQueue.length; idx++){
					ms = TD.monsterQueue[idx];
					monsterPosition = this.target;
					if(this.type=='bullet_missile') monsterPosition = this.position;
					if(TD.lang.getDistance(monsterPosition, ms.position) <= this.range){
						if(ms.shield==true){
							if(this.type=='bullet_missile'){
								ms.live -= this.damage*0.3;
							}else if(this.type=='bullet_large'){
								ms.live -= this.damage*0.5;
							}else if(this.type=='bullet_middle'){
								ms.live -= this.damage*0.9;
							}else{
								ms.live -= this.damage;
							}
						}else{
							ms.live -= this.damage;
						}
					}
				}
			}else{
				for(idx=0; idx<TD.inBuildingQueue.length; idx++){
					ms = TD.inBuildingQueue[idx];
					if(TD.lang.getDistance(this.target, ms.position) <= this.range){
						ms.live -= this.damage;
					}
				}
				for(key in TD.aliveTerminals){
					if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
					ms = TD.aliveTerminals[key];
					if(TD.lang.getDistance(this.target, ms.position) <= this.range){
						ms.live -= this.damage;
					}
				}
			}
		};
  };

  // inherit from bullet
  // make sure cfg.end = monster object
  TD.missile = function( cfg ){
    this.__proto__ = new TD.bullet( cfg );
    this.track = [];
    this.count = 15;
    this.hit = false;
    this.curTargetPosition = this.target.position;  // previous position, if target has been destroied, use this curTargetPosition

    this.move = function(){
      if(!this.hit && this.target != undefined && this.target != null && this.target.live > 0){
        this.curTargetPosition = this.target.position;
      }

      if(TD.lang.pointEq(this.curTargetPosition, this.position)==true){
        //if( this.track.length > 1){
        if(this.index < this.exploding.length){
          this.track.shift();
          var obj = {
            position : this.curTargetPosition,
            type : this.type,
            exploding : this.exploding[this.index],
            track : this.track
            //hostType : this.hostType
          };
          this.index++;
          TD.eventQueue.push(obj);
          return true;
        }else{
          return false;
        }
      }
      var nextPosition = TD.lang.getNextPos(this.position, this.position, this.curTargetPosition, this.speed);
      var point = [this.position, nextPosition], idx;
      this.track.push(point);
      this.position = nextPosition;
      if(this.track.length > this.count) this.track.shift();
      var obj = {
        position : this.curTargetPosition,
        type : this.type,
        track : this.track,
        //hostType : this.hostType,
        catnon : this.damage > 500
      };
      if(TD.lang.pointEq(this.curTargetPosition, this.position)==true){
        this.hit = true;
        this.makeDamage();
        obj['exploding'] = this.exploding[this.index];
        this.index++;
      }
      TD.eventQueue.push(obj);
      return true;
    };

  };

});







_TD.loading.push(function(TD){

  TD.createMap = function (){
    //this.rawData = null;
    TD.uc.width = 500;
    TD.uc.height = 500;
    TD.uc2.width = 500;
    TD.uc2.height = 500;
    TD.uc0.width = 500;
    TD.uc0.height = 500;

    this.getRawMapFromStroke = function (){
      this.mousedown = false;
      this.oldx = null;
      this.oldy = null;
      this.height = TD.cfg.height;
      this.width = TD.cfg.width;
      this.c = TD.canvasBody;
      this.cx = TD.canvasBody.getContext('2d');
      this.u = TD.undoBody;
      this.r = TD.redoBody;
      this.s = TD.submitBody;
      this.history = [];  // a buffer stroing recent view in historical order
      this.index = -1;    // indicate current view

      this._init();
    };

    this.getRawMapFromStroke.prototype = {

      setupCanvas : function() {
        this.c.height = this.height;
        this.c.width = this.width;
        this.cx.lineWidth = 25;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = 'rgba(0, 0, 0, 1)';
      },

      onmousedown : function(ev) {
        var _this = TD.map.rawMap;  // to reach out the envirnment data, get Closure handler
        _this.mousedown = true;
        ev.preventDefault();
      },

      onmouseup : function(ev) {
        var _this = TD.map.rawMap;
        _this.mousedown = false;
        var data = _this.cx.getImageData(0,0,_this.width,_this.height);
        while(_this.history.length > _this.index+1){
          _this.history.pop();
        }
        _this.history.push( data );
        _this.index++;
        _this.oldx = -1;
        _this.oldy = -1;
        ev.preventDefault();
      },

      onmouseout : function(ev){
        var _this = TD.map.rawMap;
        if(_this.mousedown == false) return;
        _this.mousedown = false;
        var data = _this.cx.getImageData(0,0,_this.width,_this.height);
        while(_this.history.length > _this.index+1){
          _this.history.pop();
        }
        _this.history.push( data );
        _this.index++;
        _this.oldx = -1;
        _this.oldy = -1;
        ev.preventDefault();
      },

      onmousemove : function(ev) {
        var _this = TD.map.rawMap;
        var rect = _this.c.getBoundingClientRect();
        var x = ev.clientX - rect.left;
        var y = ev.clientY - rect.top;
        if (_this.mousedown && TD.lang.ok2Draw(x,y,TD.cfg.Restriction)) {
          _this.paint(x, y);
        }
      },

      paint : function(x, y) {
        var _this = TD.map.rawMap;
        if (_this.oldx > 0 && _this.oldy > 0) {
          _this.cx.globalCompositeOperation="destination-out";
          _this.cx.beginPath();
          _this.cx.moveTo(_this.oldx, _this.oldy);
          _this.cx.lineTo(x, y);
          _this.cx.stroke();
          _this.cx.closePath();
        }
        _this.oldx = x;
        _this.oldy = y;
      },

      onClickUndo : function(){  // undo recent drawing
        var _this = TD.map.rawMap;
        if(_this.index > 0){
          _this.index--;
          var data = _this.history[_this.index];
          _this.cx.clearRect(0,0,_this.width,_this.height);
          _this.cx.putImageData(data, 0, 0);
        }
      },

      onClickRedo : function(){   // redo recent drawing
        var _this = TD.map.rawMap;
        if(_this.index+1 < _this.history.length){
          _this.index++;
          var data = _this.history[_this.index];
          _this.cx.clearRect(0,0,_this.width,_this.height);
          _this.cx.putImageData(data, 0, 0);
        }
      },

      onClickSubmit : function(){   // cut off event listener, send data to create path
        var _this = TD.map.rawMap;
        _this.c.removeEventListener('mousedown', _this.onmousedown, false);
        _this.c.removeEventListener('mouseup', _this.onmouseup, false);
        _this.c.removeEventListener('mousemove', _this.onmousemove, false);
        _this.c.removeEventListener('mouseout', _this.onmouseout, false);

        _this.u.removeEventListener('click', _this.onClickUndo, false);
        _this.r.removeEventListener('click', _this.onClickRedo, false);
        _this.s.removeEventListener('click', _this.onClickSubmit, false);

        document.getElementById('post').style.display = 'block';
				document.getElementById('pre').style.display = 'none';
        document.getElementById('run').style.display = 'block';
        document.getElementById('pause').style.display = 'none';

        TD.rawMapData = _this.history[_this.index].data;
        TD.path = new TD.createPath(TD.rawMapData);
        //console.log(TD.path);
        //new TD.path.cdt(TD.path.pathOutline[0], TD.path.pathOutline[1]);
      },

      preDraw : function(){
        this.cx.clearRect(0,0,this.cx.width, this.cx.height);
        TD.lang.paintGround( TD.uc0, 'ground_02.png' );
        TD.lang.paintGround( this.c, 'ground_01.png' );
        this.cx.beginPath();
        this.cx.strokeStyle = 'rgba(0, 0, 0, 1)';
        this.cx.globalCompositeOperation="destination-out";
        this.cx.lineWidth = 30;
        this.cx.moveTo(0,0);
        this.cx.lineTo(60,60);
        this.cx.stroke();

        this.cx.moveTo(this.width,this.height);
        this.cx.lineTo(this.width-60,this.height-60);
        this.cx.stroke();
        this.cx.closePath();
      },

      // //isOnLeft(e, r)  true --> left
      // ok2Draw : function(x, y, lines){  // lines --> [lineUpLeft, lineDownRight]
      //     for(var i=0; i<lines.length; i++){
      //       if(!TD.lang.isOnLeft(lines[i],[x,y])) return false;
      //     }
      //     return true;
      // },

      _init : function(){
        this.setupCanvas();
        this.preDraw();

        var data = this.cx.getImageData(0, 0, this.width, this.height);
        this.history.push(data);
        this.index = 0;

        this.c.addEventListener('mousedown', this.onmousedown, false);
        this.c.addEventListener('mouseup', this.onmouseup, false);
        this.c.addEventListener('mousemove', this.onmousemove, false);
        this.c.addEventListener('mouseout', this.onmouseout, false);

        this.u.addEventListener('click', this.onClickUndo, false);
        this.r.addEventListener('click', this.onClickRedo, false);
        this.s.addEventListener('click', this.onClickSubmit, false);

      }

    };

    this.rawMap = new this.getRawMapFromStroke();
  }

});



_TD.loading.push(function(TD){

  TD.buildNextWave = function(){
    TD.waitingForNextWave = false;
    var total = TD.maxNumberOfMonsterPerWave;
    var _st = null, time;
    var createMave = function(){
      if(total <= 0){
        clearTimeout(_st);
        return;
      }
      total--;
      var mst = TD.lang.getRandomMonster();
      TD.monsterQueue.push(mst);
      var bar = new TD.bloodBar(mst);
      TD.bloodBarQueue.push(bar);
      time = parseInt(Math.random() * 500) + 1000;
      _st = setTimeout( function(){createMave();} , time);
    };
    createMave();
  }

});



_TD.loading.push(function(TD){

  TD.bloodBar = function( host ){
    this.host = host;
		this.shield = host.shield==undefined?false:host.shield;

    this.move = function(){
      if(this.host == undefined || this.host == null) return false;
      if(this.host.live <= 0) return false;
			if(this.host.remove != undefined && this.host.remove) return false;
      var posLX = this.host.position[0] - 10,
          posRX = this.host.position[0] + 10;
          posY = this.host.position[1] - 11;
          posRx = 18 * this.host.live / this.host.maxLive + posLX + 1;
      if(this.host.type == 'building-5'){
        posY -= 37;
      }
      if(this.host.type[1] == 'o'){
        posY -= 17;
      }
      var obj = {
        type : 'bar',
        position : [[posLX, posY],[posRX, posY]],
        positionIn : [[posLX+1, posY],[posRx, posY]],
				shield : this.shield
      };
      TD.eventQueue.push(obj);
      return true;
    };
  };

});


_TD.loading.push(function(TD){

  TD.gameOver = function(){

    TD.bldCtrl.bld1.removeEventListener('click', TD.bldCtrl.onClick_building_1, false);
    TD.bldCtrl.bld2.removeEventListener('click', TD.bldCtrl.onClick_building_2, false);
    TD.bldCtrl.bld3.removeEventListener('click', TD.bldCtrl.onClick_building_3, false);
    TD.bldCtrl.bld4.removeEventListener('click', TD.bldCtrl.onClick_building_4, false);
    TD.bldCtrl.bld6.removeEventListener('click', TD.bldCtrl.onClick_building_6, false);

    TD.runner.removeEventListener('click', TD.onClick_runner, false);
    TD.pauseElement.removeEventListener('click', TD.onClick_pause, false);

    TD.bldCtrl.ug.removeEventListener('click', TD.bldCtrl.onClick_upgrade, false);
    TD.bldCtrl.sl.removeEventListener('click', TD.bldCtrl.onClick_sell, false);

    TD.bldCtrl.c.removeEventListener('mousemove', TD.bldCtrl.onmouseMove, false);
    TD.bldCtrl.c.removeEventListener('click', TD.bldCtrl.onClick, false);

    var key, cur;
    while(TD.monsterQueue.length > 0){
      cur = TD.monsterQueue.shift();
      if(cur.fire_st != null) clearTimeout(cur.fire_st);
    }

    while(TD.buildingQueue.length > 0){
      cur = TD.buildingQueue.shift();
      if(cur.fire_st != null) clearTimeout(cur.fire_st);
    }

    while(TD.inBuildingQueue.length > 0){
      cur = TD.inBuildingQueue.shift();
      if(cur.fire_st != null) clearTimeout(cur.fire_st);
    }

    for(key in TD.aliveTerminals){
      if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
      cur = TD.aliveTerminals[key];
      if(cur.fire_st != null) clearTimeout(cur.fire_st);
      delete TD.aliveTerminals[key];
    }

    for(key in TD.deadTerminals){
      if(!TD.deadTerminals.hasOwnProperty(key)) continue;
      cur = TD.deadTerminals[key];
      if(cur.fire_st != null) clearTimeout(cur.fire_st);
      delete TD.deadTerminals[key];
    }

    TD.eventQueue = [];
    TD.bulletQueue = [];
    TD.bloodBarQueue = [];
    TD.terminalNodePool = [];

    TD.maxNumberOfMonsterPerWave = TD.cfg.maxNumberOfMonsterPerWave;
    TD.money = TD.cfg.money;
    TD.GameOver = false;
    TD.waitingForNextWave = false;
    TD.pause = false;
    TD.root = null;
    TD.validMap = false;
    TD.beforeRun = true;

    TD.waitingToBuild = null;
    TD.waitingToChange = null;

    var obj = {
      type : 'game_over',
      score : TD.score,
      wave : TD.wave
    };

    TD.drawer(obj);

		TD.score = 0;
		TD.wave = 0;

    // addEventListener to the NextLevel buttom
    // onClick, refresh the initial map, run TD.init() again
    document.getElementById('post').style.display = 'none';
    document.getElementById('pre').style.display = 'none';
    document.getElementById('over').style.display = 'block';
    TD.reStart = document.getElementById('restart');
    TD.reStart.addEventListener( 'click', TD.lang.onClick_restart, false );

  };

});




_TD.loading.push(function(TD){

  TD.plantMap = function(density){
    var grassName = TD.sceneFrame['grass'];
    var existGrass = [], idx;
    var getRandomPoint = function(){
      // notice, [width, height]--> for canvas , not [height, width]--> this is just for map[][]
      return [parseInt(TD.cfg.width * Math.random()), parseInt(TD.cfg.height * Math.random())];
    };

    var getRandomGrassNumber = function(){
      var r = Math.random();
      if(r > 0.7){
        return parseInt(12*Math.random());
      }else if(r < 0.5){
        return parseInt(4*Math.random());
      }else{
        return 5;
      }
    };

    var isValid = function( p ){
      if(TD.lang.ableToBuild( p , TD.cfg.buildingR) == 1){
        for(idx=0; idx<existGrass.length; idx++){
          if(TD.lang.getDistance(existGrass[idx].position, p) < TD.cfg.buildingR*2) return false;
        }
        return true;
      }
      else{
        return false;
      }
    };

    var counter = 0, map = TD.mapData, pt, num, obj;
    while(density > 0){
      density--;
      counter = 5;
      pt = null;
      while(counter > 0){
        counter--;
        pt = getRandomPoint();
        if(isValid(pt)) break;
        else pt = null;
      }
      if(pt != null){
        num = getRandomGrassNumber();
        obj = {
          type : 'grass',
          position : pt,
          spritename : grassName[num],
          alive : true   // turn false if this grass is removed
        };
        if(num == 8 || num == 9){
          TD.irremovalbeGrassQueue.push(obj);
        }else{
          TD.grassQueue.push(obj);
        }
        existGrass.push(obj);
      }
    }
  };

});




_TD.loading.push(function(TD){

  TD.spriteSheetHandler = function(){

    this.init = function( cfg ){  // monster-1, 2, 3 ...; source-->zombie.png
      if(cfg.type == 'monster'){
        var tmp = TD.monsterTypes, idx;
        for(idx=0; idx<tmp.length; idx++){
          var zombieSheet = new this.SpriteSheetClass( tmp[idx] );
          zombieSheet.load(TD.monsterSpriteSource);
          zombieSheet.parseAtlasDefinition(zombieJSON);
          TD.monsterFrame[tmp[idx]] = this.monsterNameGenerator(idx*3+1);
        }
      }else if(cfg.type == 'explode'){
        var explodeSheet = new this.SpriteSheetClass( 'explode' );
        explodeSheet.load(TD.explodeSpriteSource);
        explodeSheet.parseAtlasDefinition(explodeJSON);
        var tmp = TD.bulletTypes, idx;
        for(idx=0; idx<tmp.length; idx++){
          TD.explodeFrame[tmp[idx]] = this.explodeNameGenerator(tmp[idx]);
        }
      }else if(cfg.type == 'scene'){
        var sceneSheet = new this.SpriteSheetClass( 'scene' );
        sceneSheet.load(TD.sceneSpriteSource);
        sceneSheet.parseAtlasDefinition(sceneJSON);
        TD.sceneFrame['grass'] = this.sceneNameGenerator('grass', 14);
        TD.sceneFrame['ground'] = this.sceneNameGenerator('ground', 2);
        TD.sceneFrame['tower'] = this.sceneNameGenerator('tower', 3);
        sceneSheet.img.onload = function(){
          console.log('IMAGEs!!!');
        };
      }else if(cfg.type == 'turret'){
        var turretSheet = new this.SpriteSheetClass( 'turret' );
        turretSheet.load(TD.turretSpriteSource);
        turretSheet.parseAtlasDefinition(turretJSON);
        TD.turretFrame['building-1'] = ['turret_01_1.png','turret_01_1.png','turret_01_1.png',
                                        'turret_01_2.png','turret_01_2.png','turret_01_2.png',
                                        'turret_01_3.png','turret_01_3.png','turret_01_3.png'];
        TD.turretFrame['building-2'] = ['turret_02.png'];
        TD.turretFrame['building-3'] = ['turret_03.png'];
        TD.turretFrame['building-4'] = ['turret_04.png'];
        TD.turretFrame['building-6'] = ['turret_06.png'];
      }
    };

    // get 4 direction name list for sprite display
    this.monsterNameGenerator = function(name){  // 01, 02 ... 12
      var num = parseInt(name);
      if(num == 'NaN') return null;
      var postFix = [num<10?'0'+num:num, num+1<10?'0'+(num+1):num+1,num+2<10?'0'+(num+2):num+2];
      var res = {}, tmpList, idx, i;
      for(idx=1; idx<5; idx++){
        tmpList=[];
        for(i=0; i<3; i++){
          tmpList.push('0'+idx+'_'+postFix[i]+'.png');
          tmpList.push('0'+idx+'_'+postFix[i]+'.png');
          tmpList.push('0'+idx+'_'+postFix[i]+'.png');
        }
        tmpList.push('0'+idx+'_'+postFix[1]+'.png');
        tmpList.push('0'+idx+'_'+postFix[1]+'.png');
        tmpList.push('0'+idx+'_'+postFix[1]+'.png');
        res[idx] = tmpList;
      }
      return res;
    };

    this.sceneNameGenerator = function(name, num){
      var res = [];
      for(var idx=1; idx<=num; idx++){
        res.push(name+'_'+ (idx<10?('0'+idx):idx) + '.png');
      }
      return res;
    };

    this.explodeNameGenerator = function(name){
      if(name == 'bullet_small'){
        return ['01_01.png','01_02.png','01_03.png','01_04.png','01_05.png'];
      }else if(name == 'bullet_middle'){
        return ['02_01.png','02_02.png','02_03.png','02_04.png',
        '02_05.png','02_06.png','02_07.png','02_08.png','02_09.png',
        '02_10.png','02_11.png'];
      }else if(name == 'bullet_large'){
        return  ['03_01.png','03_02.png','03_03.png','03_04.png',
        '03_05.png','03_06.png','03_07.png','03_08.png','03_9.png',
        '03_10.png','03_11.png','03_12.png','03_13.png'];
      }else if(name == 'bullet_missile'){
        return ['06_01.png','06_02.png','06_03.png','06_04.png','06_05.png',
        '06_06.png','06_07.png','06_08.png'];
      }else{
        return null;
      }
    };

    this.SpriteSheetClass = function(type){  // input monster type: eg monster-1
      this.type = type;  // identifier

      this.img = null;

      this.url = "";

      this.sprites = []; // An array of all the sprites in our atlas.

      this.dirList = null; // a list of list of names like: 01_02.png

      // Load the atlas at the path 'imgName' into memory.
      this.load = function(imgName){
        this.url = imgName;
        var img = new Image();
        img.src = imgName;
        this.img = img;
        TD.gSpriteSheets[type] = this;
      };

      this.defSprite = function(name, x, y, w, h, cx, cy){
        // define a single sprite in atlas
        var spt = {
          'id' : name,
          'x'  : x,
          'y'  : y,
          'w'  : w,
          'h'  : h,
          'cx' : cx == null ? 0 : cx,
          'cy' : cy == null ? 0 : cy
        };

        this.sprites.push(spt);
      };

      // input the JSON file location
      // parse raw JSON and store them as spt object in sprites array
      this.parseAtlasDefinition = function(atlasJSON){
        //var parsed = JSON.parse(atlasJSON);
        var parsed = atlasJSON;
        var spriteList = parsed['frames'];
        for(var name in spriteList){
          var body = spriteList[name];
          var cx   = -0.5 * body.frame.w;
          var cy   = -0.5 * body.frame.h;
          if(body.trimmed == true){
            var sourceSize = body.sourceSize, spriteSourceSize = body.spriteSourceSize;
            cx = spriteSourceSize.x - (sourceSize.w*0.5);
            cy = spriteSourceSize.y - (sourceSize.h*0.5);
          }
          this.defSprite(name, body.frame.x, body.frame.y, body.frame.w,
            body.frame.h, cx, cy);
        }
      };

      this.getStats = function(name){
        for(var idx=0; idx < this.sprites.length; idx++){
          if(this.sprites[idx].id == name){
            return this.sprites[idx];
          }
        }
        return null;
      };

      this.toString = function(){
        return this.type;  // monster-1 or monster-2 or ...
      }

    };

  };

  TD.drawSprite =  function(ctx, type, spritename, posX, posY){
    var spriteSheet = TD.gSpriteSheets[type];
    if(spriteSheet == null) return false;
    var spt = spriteSheet.getStats(spritename);
    if(spt == null) return false;
    var hlf = {
      x : spt.cx,
      y : spt.cy
    };
    // posX+hlf.x, posY+hlf.y  --> make sure we actually put the image centre at the point we want
    if(type[1] == 'o')
      ctx.drawImage(spriteSheet.img, spt.x, spt.y, spt.w, spt.h, posX+hlf.x, posY+hlf.y-10, spt.w, spt.h);
    else {
      ctx.drawImage(spriteSheet.img, spt.x, spt.y, spt.w, spt.h, posX+hlf.x, posY+hlf.y, spt.w, spt.h);
    }
  };

});


explodeJSON = {"frames": {

"01_01.png":
{
	"frame": {"x":93,"y":502,"w":6,"h":6},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":27,"y":28,"w":6,"h":6},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"01_02.png":
{
	"frame": {"x":174,"y":169,"w":10,"h":10},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":25,"y":25,"w":10,"h":10},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"01_03.png":
{
	"frame": {"x":45,"y":487,"w":17,"h":17},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":22,"y":22,"w":17,"h":17},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"01_04.png":
{
	"frame": {"x":64,"y":487,"w":17,"h":17},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":22,"y":22,"w":17,"h":17},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"01_05.png":
{
	"frame": {"x":83,"y":487,"w":13,"h":13},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":26,"y":26,"w":13,"h":13},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_01.png":
{
	"frame": {"x":83,"y":502,"w":8,"h":8},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":26,"y":26,"w":8,"h":8},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_02.png":
{
	"frame": {"x":189,"y":69,"w":12,"h":12},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":24,"y":24,"w":12,"h":12},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_03.png":
{
	"frame": {"x":25,"y":487,"w":18,"h":18},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":21,"y":21,"w":18,"h":18},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_04.png":
{
	"frame": {"x":1,"y":487,"w":22,"h":23},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":19,"y":19,"w":22,"h":23},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_05.png":
{
	"frame": {"x":159,"y":259,"w":27,"h":28},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":17,"y":16,"w":27,"h":28},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_06.png":
{
	"frame": {"x":128,"y":474,"w":33,"h":33},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":14,"y":14,"w":33,"h":33},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_07.png":
{
	"frame": {"x":163,"y":474,"w":33,"h":32},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":14,"y":14,"w":33,"h":32},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_08.png":
{
	"frame": {"x":232,"y":470,"w":32,"h":30},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":14,"y":15,"w":32,"h":30},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_09.png":
{
	"frame": {"x":94,"y":259,"w":31,"h":28},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":15,"y":16,"w":31,"h":28},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_10.png":
{
	"frame": {"x":127,"y":259,"w":30,"h":28},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":15,"y":16,"w":30,"h":28},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"02_11.png":
{
	"frame": {"x":98,"y":474,"w":28,"h":26},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":16,"y":18,"w":28,"h":26},
	"sourceSize": {"w":60,"h":60},
	"pivot": {"x":0.5,"y":0.5}
},
"03_01.png":
{
	"frame": {"x":241,"y":132,"w":45,"h":42},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":45,"h":42},
	"sourceSize": {"w":45,"h":42},
	"pivot": {"x":0.5,"y":0.5}
},
"03_02.png":
{
	"frame": {"x":244,"y":176,"w":50,"h":48},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":50,"h":48},
	"sourceSize": {"w":50,"h":48},
	"pivot": {"x":0.5,"y":0.5}
},
"03_03.png":
{
	"frame": {"x":240,"y":254,"w":54,"h":54},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":54,"h":54},
	"sourceSize": {"w":54,"h":54},
	"pivot": {"x":0.5,"y":0.5}
},
"03_04.png":
{
	"frame": {"x":241,"y":69,"w":60,"h":61},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":60,"h":61},
	"sourceSize": {"w":60,"h":61},
	"pivot": {"x":0.5,"y":0.5}
},
"03_05.png":
{
	"frame": {"x":189,"y":1,"w":66,"h":66},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":66,"h":66},
	"sourceSize": {"w":66,"h":66},
	"pivot": {"x":0.5,"y":0.5}
},
"03_06.png":
{
	"frame": {"x":175,"y":289,"w":63,"h":61},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":0,"w":63,"h":61},
	"sourceSize": {"w":64,"h":63},
	"pivot": {"x":0.5,"y":0.5}
},
"03_07.png":
{
	"frame": {"x":174,"y":100,"w":65,"h":67},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":0,"w":65,"h":67},
	"sourceSize": {"w":67,"h":69},
	"pivot": {"x":0.5,"y":0.5}
},
"03_08.png":
{
	"frame": {"x":171,"y":181,"w":71,"h":71},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":0,"w":71,"h":71},
	"sourceSize": {"w":72,"h":73},
	"pivot": {"x":0.5,"y":0.5}
},
"03_9.png":
{
	"frame": {"x":94,"y":181,"w":75,"h":76},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":0,"w":75,"h":76},
	"sourceSize": {"w":77,"h":77},
	"pivot": {"x":0.5,"y":0.5}
},
"03_10.png":
{
	"frame": {"x":94,"y":100,"w":78,"h":79},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":78,"h":79},
	"sourceSize": {"w":78,"h":79},
	"pivot": {"x":0.5,"y":0.5}
},
"03_11.png":
{
	"frame": {"x":90,"y":388,"w":80,"h":84},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":80,"h":84},
	"sourceSize": {"w":80,"h":84},
	"pivot": {"x":0.5,"y":0.5}
},
"03_12.png":
{
	"frame": {"x":1,"y":300,"w":86,"h":92},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":86,"h":92},
	"sourceSize": {"w":86,"h":92},
	"pivot": {"x":0.5,"y":0.5}
},
"03_13.png":
{
	"frame": {"x":89,"y":300,"w":84,"h":86},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":84,"h":86},
	"sourceSize": {"w":84,"h":86},
	"pivot": {"x":0.5,"y":0.5}
},
"06_01.png":
{
	"frame": {"x":198,"y":470,"w":32,"h":31},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":35,"y":34,"w":32,"h":31},
	"sourceSize": {"w":100,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"06_02.png":
{
	"frame": {"x":257,"y":1,"w":60,"h":61},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":20,"y":19,"w":60,"h":61},
	"sourceSize": {"w":100,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"06_03.png":
{
	"frame": {"x":172,"y":388,"w":76,"h":80},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":12,"y":9,"w":76,"h":80},
	"sourceSize": {"w":100,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"06_04.png":
{
	"frame": {"x":1,"y":394,"w":87,"h":91},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":7,"y":4,"w":87,"h":91},
	"sourceSize": {"w":100,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"06_05.png":
{
	"frame": {"x":93,"y":1,"w":94,"h":97},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":3,"y":3,"w":94,"h":97},
	"sourceSize": {"w":100,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"06_06.png":
{
	"frame": {"x":1,"y":202,"w":91,"h":96},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":5,"y":3,"w":91,"h":96},
	"sourceSize": {"w":100,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"06_07.png":
{
	"frame": {"x":1,"y":102,"w":91,"h":98},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":4,"y":1,"w":91,"h":98},
	"sourceSize": {"w":100,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"06_08.png":
{
	"frame": {"x":1,"y":1,"w":90,"h":99},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":6,"y":1,"w":90,"h":99},
	"sourceSize": {"w":100,"h":100},
	"pivot": {"x":0.5,"y":0.5}
}},
"meta": {
	"app": "http://www.codeandweb.com/texturepacker",
	"version": "1.0",
	"image": "explode.png",
	"format": "RGBA8888",
	"size": {"w":512,"h":512},
	"scale": "1",
	"smartupdate": "$TexturePacker:SmartUpdate:50831b6d4189548a20836f168e97f252:9ccd415734d1cf3e4d04471aa818a1cb:133b2ce0197d17ada5c779ea3e08f404$"
}
};


zombieJSON = {"frames": {

"01_01.png":
{
	"frame": {"x":110,"y":67,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"01_02.png":
{
	"frame": {"x":1,"y":141,"w":23,"h":33},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":33},
	"sourceSize": {"w":23,"h":33},
	"pivot": {"x":0.5,"y":0.5}
},
"01_03.png":
{
	"frame": {"x":78,"y":171,"w":24,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":24,"h":31},
	"sourceSize": {"w":24,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"01_04.png":
{
	"frame": {"x":79,"y":135,"w":24,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":24,"h":31},
	"sourceSize": {"w":24,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"01_05.png":
{
	"frame": {"x":1,"y":71,"w":24,"h":33},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":24,"h":33},
	"sourceSize": {"w":24,"h":33},
	"pivot": {"x":0.5,"y":0.5}
},
"01_06.png":
{
	"frame": {"x":82,"y":67,"w":26,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":26,"h":31},
	"sourceSize": {"w":26,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"01_07.png":
{
	"frame": {"x":25,"y":211,"w":30,"h":32},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":30,"h":32},
	"sourceSize": {"w":30,"h":32},
	"pivot": {"x":0.5,"y":0.5}
},
"01_08.png":
{
	"frame": {"x":1,"y":1,"w":31,"h":33},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":31,"h":33},
	"sourceSize": {"w":31,"h":33},
	"pivot": {"x":0.5,"y":0.5}
},
"01_09.png":
{
	"frame": {"x":30,"y":36,"w":32,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":32,"h":31},
	"sourceSize": {"w":32,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"01_10.png":
{
	"frame": {"x":34,"y":1,"w":31,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":31,"h":31},
	"sourceSize": {"w":31,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"01_11.png":
{
	"frame": {"x":1,"y":36,"w":27,"h":33},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":27,"h":33},
	"sourceSize": {"w":27,"h":33},
	"pivot": {"x":0.5,"y":0.5}
},
"01_12.png":
{
	"frame": {"x":27,"y":105,"w":31,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":31,"h":31},
	"sourceSize": {"w":31,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"02_01.png":
{
	"frame": {"x":182,"y":67,"w":19,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":19,"h":31},
	"sourceSize": {"w":19,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"02_02.png":
{
	"frame": {"x":25,"y":176,"w":20,"h":33},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":33},
	"sourceSize": {"w":20,"h":33},
	"pivot": {"x":0.5,"y":0.5}
},
"02_03.png":
{
	"frame": {"x":130,"y":133,"w":20,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":31},
	"sourceSize": {"w":20,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"02_04.png":
{
	"frame": {"x":27,"y":71,"w":20,"h":32},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":32},
	"sourceSize": {"w":20,"h":32},
	"pivot": {"x":0.5,"y":0.5}
},
"02_05.png":
{
	"frame": {"x":26,"y":141,"w":20,"h":33},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":33},
	"sourceSize": {"w":20,"h":33},
	"pivot": {"x":0.5,"y":0.5}
},
"02_06.png":
{
	"frame": {"x":141,"y":100,"w":20,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":31},
	"sourceSize": {"w":20,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"02_07.png":
{
	"frame": {"x":1,"y":176,"w":22,"h":33},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":22,"h":33},
	"sourceSize": {"w":22,"h":33},
	"pivot": {"x":0.5,"y":0.5}
},
"02_08.png":
{
	"frame": {"x":1,"y":211,"w":22,"h":33},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":22,"h":33},
	"sourceSize": {"w":22,"h":33},
	"pivot": {"x":0.5,"y":0.5}
},
"02_09.png":
{
	"frame": {"x":57,"y":210,"w":23,"h":32},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":32},
	"sourceSize": {"w":23,"h":32},
	"pivot": {"x":0.5,"y":0.5}
},
"02_10.png":
{
	"frame": {"x":124,"y":34,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"02_11.png":
{
	"frame": {"x":1,"y":106,"w":24,"h":33},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":24,"h":33},
	"sourceSize": {"w":24,"h":33},
	"pivot": {"x":0.5,"y":0.5}
},
"02_12.png":
{
	"frame": {"x":97,"y":34,"w":25,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":25,"h":31},
	"sourceSize": {"w":25,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_01.png":
{
	"frame": {"x":196,"y":34,"w":19,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":19,"h":31},
	"sourceSize": {"w":19,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_02.png":
{
	"frame": {"x":160,"y":67,"w":20,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":31},
	"sourceSize": {"w":20,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_03.png":
{
	"frame": {"x":174,"y":34,"w":20,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":31},
	"sourceSize": {"w":20,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_04.png":
{
	"frame": {"x":176,"y":1,"w":20,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":31},
	"sourceSize": {"w":20,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_05.png":
{
	"frame": {"x":152,"y":133,"w":20,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":31},
	"sourceSize": {"w":20,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_06.png":
{
	"frame": {"x":163,"y":100,"w":20,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":20,"h":31},
	"sourceSize": {"w":20,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_07.png":
{
	"frame": {"x":107,"y":201,"w":22,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":22,"h":31},
	"sourceSize": {"w":22,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_08.png":
{
	"frame": {"x":129,"y":166,"w":22,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":22,"h":31},
	"sourceSize": {"w":22,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_09.png":
{
	"frame": {"x":126,"y":1,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_10.png":
{
	"frame": {"x":99,"y":1,"w":25,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":25,"h":31},
	"sourceSize": {"w":25,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_11.png":
{
	"frame": {"x":90,"y":100,"w":24,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":24,"h":31},
	"sourceSize": {"w":24,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"03_12.png":
{
	"frame": {"x":82,"y":204,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_01.png":
{
	"frame": {"x":104,"y":168,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_02.png":
{
	"frame": {"x":105,"y":133,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_03.png":
{
	"frame": {"x":116,"y":100,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_04.png":
{
	"frame": {"x":135,"y":67,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_05.png":
{
	"frame": {"x":149,"y":34,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_06.png":
{
	"frame": {"x":151,"y":1,"w":23,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":23,"h":31},
	"sourceSize": {"w":23,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_07.png":
{
	"frame": {"x":67,"y":1,"w":30,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":30,"h":31},
	"sourceSize": {"w":30,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_08.png":
{
	"frame": {"x":60,"y":102,"w":28,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":28,"h":31},
	"sourceSize": {"w":28,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_09.png":
{
	"frame": {"x":48,"y":138,"w":29,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":29,"h":31},
	"sourceSize": {"w":29,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_10.png":
{
	"frame": {"x":49,"y":69,"w":31,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":31,"h":31},
	"sourceSize": {"w":31,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"04_11.png":
{
	"frame": {"x":47,"y":176,"w":29,"h":32},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":29,"h":32},
	"sourceSize": {"w":29,"h":32},
	"pivot": {"x":0.5,"y":0.5}
},
"04_12.png":
{
	"frame": {"x":64,"y":34,"w":31,"h":31},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":31,"h":31},
	"sourceSize": {"w":31,"h":31},
	"pivot": {"x":0.5,"y":0.5}
}},
"meta": {
	"app": "http://www.codeandweb.com/texturepacker",
	"version": "1.0",
	"image": "zombie.png",
	"format": "RGBA8888",
	"size": {"w":256,"h":256},
	"scale": "1",
	"smartupdate": "$TexturePacker:SmartUpdate:b1a8239df44e5fd06d095f7e7c0f3e84:de4104427ba80a233fc29931863a18a5:671cfcca2facf02865d2d7530477df67$"
}
};


sceneJSON = {"frames": {

"grass_01.png":
{
	"frame": {"x":115,"y":90,"w":27,"h":21},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":3,"y":6,"w":27,"h":21},
	"sourceSize": {"w":31,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_02.png":
{
	"frame": {"x":115,"y":35,"w":31,"h":30},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":1,"w":31,"h":30},
	"sourceSize": {"w":31,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_03.png":
{
	"frame": {"x":115,"y":67,"w":30,"h":21},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":1,"y":6,"w":30,"h":21},
	"sourceSize": {"w":31,"h":31},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_04.png":
{
	"frame": {"x":205,"y":80,"w":44,"h":43},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":1,"y":2,"w":44,"h":43},
	"sourceSize": {"w":45,"h":45},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_05.png":
{
	"frame": {"x":155,"y":1,"w":50,"h":44},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":3,"w":50,"h":44},
	"sourceSize": {"w":50,"h":50},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_06.png":
{
	"frame": {"x":79,"y":175,"w":48,"h":45},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":2,"y":4,"w":48,"h":45},
	"sourceSize": {"w":50,"h":50},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_07.png":
{
	"frame": {"x":205,"y":48,"w":45,"h":30},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":4,"y":10,"w":45,"h":30},
	"sourceSize": {"w":50,"h":50},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_08.png":
{
	"frame": {"x":115,"y":1,"w":36,"h":32},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":7,"y":9,"w":36,"h":32},
	"sourceSize": {"w":50,"h":50},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_09.png":
{
	"frame": {"x":155,"y":47,"w":48,"h":44},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":1,"y":4,"w":48,"h":44},
	"sourceSize": {"w":50,"h":50},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_10.png":
{
	"frame": {"x":207,"y":1,"w":48,"h":45},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":1,"y":5,"w":48,"h":45},
	"sourceSize": {"w":50,"h":50},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_11.png":
{
	"frame": {"x":113,"y":222,"w":40,"h":32},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":5,"y":12,"w":40,"h":32},
	"sourceSize": {"w":50,"h":50},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_12.png":
{
	"frame": {"x":36,"y":67,"w":31,"h":26},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":9,"y":13,"w":31,"h":26},
	"sourceSize": {"w":50,"h":50},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_13.png":
{
	"frame": {"x":54,"y":175,"w":23,"h":66},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":8,"y":2,"w":23,"h":66},
	"sourceSize": {"w":39,"h":70},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_14.png":
{
	"frame": {"x":34,"y":175,"w":18,"h":18},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":1,"y":2,"w":18,"h":18},
	"sourceSize": {"w":20,"h":20},
	"pivot": {"x":0.5,"y":0.5}
},
"grass_15.png":
{
	"frame": {"x":144,"y":90,"w":9,"h":15},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":1,"y":0,"w":9,"h":15},
	"sourceSize": {"w":10,"h":15},
	"pivot": {"x":0.5,"y":0.5}
},
"ground_01.png":
{
	"frame": {"x":34,"y":99,"w":79,"h":74},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":79,"h":74},
	"sourceSize": {"w":79,"h":74},
	"pivot": {"x":0.5,"y":0.5}
},
"ground_02.png":
{
	"frame": {"x":1,"y":197,"w":50,"h":52},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":50,"h":52},
	"sourceSize": {"w":50,"h":52},
	"pivot": {"x":0.5,"y":0.5}
},
"tower_01.png":
{
	"frame": {"x":1,"y":1,"w":33,"h":96},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":33,"h":96},
	"sourceSize": {"w":33,"h":96},
	"pivot": {"x":0.5,"y":0.5}
},
"tower_02.png":
{
	"frame": {"x":1,"y":99,"w":31,"h":96},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":31,"h":96},
	"sourceSize": {"w":31,"h":96},
	"pivot": {"x":0.5,"y":0.5}
},
"tower_03.png":
{
	"frame": {"x":79,"y":222,"w":32,"h":33},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":63,"w":32,"h":33},
	"sourceSize": {"w":32,"h":96},
	"pivot": {"x":0.5,"y":0.5}
}},
"meta": {
	"app": "http://www.codeandweb.com/texturepacker",
	"version": "1.0",
	"image": "scene.png",
	"format": "RGBA8888",
	"size": {"w":256,"h":256},
	"scale": "1",
	"smartupdate": "$TexturePacker:SmartUpdate:42a07bebeec4a6063545b2f12f816a57:981322ee434e4365c29a90d5f2bc91e4:b5ae526252a9bb5f811c6329b74d8d84$"
}
};

turretJSON = {"frames": {

"turret_01_1.png":
{
	"frame": {"x":103,"y":1,"w":128,"h":86},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":7,"w":128,"h":86},
	"sourceSize": {"w":128,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"turret_01_2.png":
{
	"frame": {"x":1,"y":95,"w":128,"h":88},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":5,"w":128,"h":88},
	"sourceSize": {"w":128,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"turret_01_3.png":
{
	"frame": {"x":131,"y":89,"w":128,"h":86},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":0,"y":7,"w":128,"h":86},
	"sourceSize": {"w":128,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"turret_02.png":
{
	"frame": {"x":1,"y":185,"w":69,"h":56},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":3,"y":4,"w":69,"h":56},
	"sourceSize": {"w":76,"h":65},
	"pivot": {"x":0.5,"y":0.5}
},
"turret_03.png":
{
	"frame": {"x":131,"y":177,"w":96,"h":76},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":3,"y":12,"w":96,"h":76},
	"sourceSize": {"w":103,"h":100},
	"pivot": {"x":0.5,"y":0.5}
},
"turret_04.png":
{
	"frame": {"x":1,"y":1,"w":100,"h":92},
	"rotated": false,
	"trimmed": false,
	"spriteSourceSize": {"x":0,"y":0,"w":100,"h":92},
	"sourceSize": {"w":100,"h":92},
	"pivot": {"x":0.5,"y":0.5}
},
"turret_06.png":
{
	"frame": {"x":72,"y":185,"w":47,"h":52},
	"rotated": false,
	"trimmed": true,
	"spriteSourceSize": {"x":1,"y":0,"w":47,"h":52},
	"sourceSize": {"w":50,"h":52},
	"pivot": {"x":0.5,"y":0.5}
}},
"meta": {
	"app": "http://www.codeandweb.com/texturepacker",
	"version": "1.0",
	"image": "turret.png",
	"format": "RGBA8888",
	"size": {"w":260,"h":254},
	"scale": "1",
	"smartupdate": "$TexturePacker:SmartUpdate:2514075745d851438dfc3478c612e327:47edb90f578132f7b9be299225601cdc:26057a831b32959680a28025ef05a3b1$"
}
};
