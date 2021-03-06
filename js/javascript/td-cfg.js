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
        ctx.strokeStyle = 'rgba(156, 58, 153, 1)';
        ctx.lineWidth = 1;
        ctx.moveTo(cfg.origin[0], cfg.origin[1]);
        ctx.lineTo(cfg.position[0], cfg.position[1]);
        ctx.stroke();
      }
      else if(cfg.hostType == 'monster-4'){
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(156, 81, 58, 1)';
        ctx.lineWidth = 1;
        ctx.moveTo(cfg.origin[0], cfg.origin[1]);
        ctx.lineTo(cfg.position[0], cfg.position[1]);
        ctx.stroke();
      }
      else{  // should be terminal building
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(226, 116, 167, 1)';
        ctx.lineWidth = 1;
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

    //if modify here, don't forget change TD.gameover as well
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
        speed : 1.1,
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
        speed : 0.85,
        damage : 1.2,
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
