_TD.loading.push(function(TD){
  TD.cfg = {
    height : 500,   // main canvas size

    width : 500,

    Restriction : [[[100,0],[0,100]],[[500-100, 500],[500, 500-100]]],   //  use to check user's stroke if out of boundary

    taRestriction : [[450,500],[500,450]],   // use to find which one the our final target

    dirC : [[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]],

    dirD : [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]],

    Dir : [[[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]], [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]]],

    buildingR : 10,    // show how large the building is on map

    monsterR : 10,    // the max radius of a monster could be

    bulletSize1 : 2,   // the size of bullet, radius of bullet

    bulletSize2 : 3,

    bulletSize3 : 4,

    maxLevel : 3,

    maxNumberOfMonsterPerWave : 10,

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
      ctx.strokeStyle = "lightgreen";
      ctx.lineWidth = 3;
      ctx.moveTo(posIn[0][0],posIn[0][1]);
      ctx.lineTo(posIn[1][0],posIn[1][1]);
      ctx.stroke();
    },

    bullet_small : function( ctx, cfg ){
      ctx.beginPath();
      if(cfg.exploding == undefined){
        ctx.arc(cfg.position[0], cfg.position[1], this.bulletSize1, 0, 2*Math.PI, false);
        ctx.fillStyle = "blue";
      }else{
        ctx.arc(cfg.position[0], cfg.position[1], cfg.exploding, 0, 2*Math.PI, false);
        ctx.fillStyle = "rgba(215, 140, 66, 0.7)";
      }
      ctx.fill();
    },

    bullet_middle : function( ctx, cfg ){
      ctx.beginPath();
      if(cfg.exploding == undefined){
        ctx.arc(cfg.position[0], cfg.position[1], this.bulletSize2, 0, 2*Math.PI, false);
        ctx.fillStyle = "#40CF8E";
      }else{
        ctx.arc(cfg.position[0], cfg.position[1], cfg.exploding, 0, 2*Math.PI, false);
        ctx.fillStyle = "rgba(215, 140, 66, 0.7)";
      }
      ctx.fill();
    },

    bullet_large : function( ctx, cfg ){
      ctx.beginPath();
      if(cfg.exploding == undefined){
        ctx.arc(cfg.position[0], cfg.position[1], this.bulletSize3, 0, 2*Math.PI, false);
        ctx.fillStyle = "#AB4F80";
      }else{
        ctx.arc(cfg.position[0], cfg.position[1], cfg.exploding, 0, 2*Math.PI, false);
        ctx.fillStyle = "rgba(215, 140, 66, 0.7)";
      }
      ctx.fill();
    },

    bullet_layser : function( ctx, cfg ){
      ctx.beginPath();
      ctx.strokeStyle = '#E084B5';
      ctx.lineWidth = 3;
      ctx.moveTo(cfg.origin[0], cfg.origin[1]);
      ctx.lineTo(cfg.position[0], cfg.position[1]);
      ctx.stroke();
    },

    mst1 : function ( ctx, cfg ){
      ctx.beginPath();
      ctx.fillStyle = 'rgba(130, 142, 16, 1)';
      ctx.arc(cfg.position[0], cfg.position[1], this.monsterR/2, 0, 2*Math.PI, false);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();
    },

    mst2 : function ( ctx, cfg ){
      ctx.beginPath();
      ctx.fillStyle = 'rgba(142, 16, 41, 1)';
      ctx.arc(cfg.position[0], cfg.position[1], this.monsterR, 0, 2*Math.PI, false);
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();
    },

    mst3 : function ( ctx, cfg ){
      var d1 = 0.866* this.monsterR, d2 = this.monsterR/2;
      ctx.beginPath();
      ctx.moveTo(cfg.position[0], cfg.position[1]+this.monsterR);
      ctx.lineTo(cfg.position[0] - d1, cfg.position[1]-d2);
      ctx.lineTo(cfg.position[0] + d1, cfg.position[1]-d2);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.fillStyle = 'rgba(16, 66, 142, 1)';
      ctx.fill();
    },

    mst4 : function ( ctx, cfg ){
      var d1 = this.monsterR * 0.707;
      ctx.beginPath();
      ctx.rect(cfg.position[0]-d1, cfg.position[1]-d1, 2*d1, 2*d1);
      ctx.fillStyle = 'rgba(142, 83, 16, 1)';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      ctx.stroke();
    },

    bld1 : function( ctx, cfg ){
      ctx.beginPath();
      ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(cfg.cannon[0][0], cfg.cannon[0][1]);
      ctx.lineTo(cfg.cannon[1][0], cfg.cannon[1][1]);
      ctx.stroke();
      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'grey';
        ctx.stroke();
      }
    },

    bld2 : function( ctx, cfg ){
      ctx.beginPath();
      ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.moveTo(cfg.cannon[0][0], cfg.cannon[0][1]);
      ctx.lineTo(cfg.cannon[1][0], cfg.cannon[1][1]);
      ctx.stroke();
      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'grey';
        ctx.stroke();
      }
    },

    bld3 : function( ctx, cfg ){
      ctx.beginPath();
      ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      ctx.fillStyle = "brown";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.moveTo(cfg.cannon[0][0], cfg.cannon[0][1]);
      ctx.lineTo(cfg.cannon[1][0], cfg.cannon[1][1]);
      ctx.stroke();
      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'grey';
        ctx.stroke();
      }
    },

    bld4 : function( ctx, cfg ){
      ctx.beginPath();
      ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      ctx.fillStyle = "purple";
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.moveTo(cfg.cannon[0][0], cfg.cannon[0][1]);
      ctx.lineTo(cfg.cannon[1][0], cfg.cannon[1][1]);
      ctx.stroke();
      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'grey';
        ctx.stroke();
      }
    },

    bld5 : function( ctx, cfg ){
      var x = cfg.position[0], y = cfg.position[1];
      ctx.beginPath();
      ctx.arc(x, y-13, 3, 0, 2*Math.PI, false);
      ctx.fillStyle = "rgba(63, 190, 207, 1)";
      ctx.fill();
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'black';
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(x, y-10);
      ctx.lineTo(x-5, y+3);
      ctx.lineTo(x+5, y+3);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "rgba(34, 65, 98, 1)";
      ctx.fill();

      if(cfg.showRange != undefined){
        var range = cfg.showRange;
        ctx.beginPath();
        ctx.arc(x, y, range, 0, 2*Math.PI, false);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'grey';
        ctx.stroke();
      }
    },

    bld5_2 : function( ctx, cfg ){  // show as ruin
      var x = cfg.position[0], y = cfg.position[1];
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(x, y);
      ctx.lineTo(x-5, y+3);
      ctx.lineTo(x+5, y+3);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = "rgba(34, 65, 98, 1)";
      ctx.fill();
    },

    Arsenal : {
      'bullet_small' : {
          speed : 12,
          damageRange : 7,
          exploding : [2,3,4,5,4]
        },
      'bullet_middle' : {
          speed : 10,
          damageRange : 8,
          exploding : [3,4,5,6,5]
        },
      'bullet_large' : {
          speed : 7,
          damageRange : 15,
          exploding : [4,6,8,10,8]
        },
      'bullet_layser' : {
          speed : 1000,
          damageRange : 1,
          exploding : null
        }
    },

    monster_1_base_live : 100,   // setting base monster live, increase for each wave
    monster_2_base_live : 150,
    monster_3_base_live : 200,
    monster_4_base_live : 300,

    monster_1_base_price : 20,   // rewards when finish this monster
    monster_2_base_price : 30,
    monster_3_base_price : 40,
    monster_4_base_price : 50,

    monster_frequency : 500,   // monster attack frequency

    Monsters : {
      'monster-1' : {
        type : 'monster-1',
        range : 40,
        speed : 1,
        damage : 25,
        frequency : 1000,
        cannonType : 'bullet_small',
        live : function(){return TD.cfg.monster_1_base_live;},
        price : function(){return TD.cfg.monster_1_base_price;}
      },
      'monster-2' : {
        type : 'monster-2',
        range : 50,
        speed : 0.9,
        damage : 30,
        frequency : 1000,
        cannonType : 'bullet_middle',
        live : function(){return TD.cfg.monster_2_base_live;},
        price : function(){return TD.cfg.monster_2_base_price;}
      },
      'monster-3' : {
        type : 'monster-3',
        range : 60,
        speed : 0.8,
        damage : 35,
        frequency : 1000,
        cannonType : 'bullet_large',
        live : function(){return TD.cfg.monster_3_base_live;},
        price : function(){return TD.cfg.monster_3_base_price;}
      },
      'monster-4' : {
        type : 'monster-4',
        range : 70,
        speed : 0.7,
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
        frequency : 300,  //  1 per 100ms
        live : 100,
        price : 100,
        range : 50,
        damage : 10,
        cannonLen : 10
      },
      'building-2' : {
        type : 'building-2',
        cannonType : 'bullet_middle',
        frequency : 400,
        live : 100,
        price : 200,
        range : 40,
        damage : 20,
        cannonLen : 12
      },
      'building-3' : {
        type : 'building-3',
        cannonType : 'bullet_large',
        frequency : 500,
        live : 100,
        price : 300,
        range : 45,
        damage : 50,
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
        cannonLen : 5
      },
      'building-5' : {   // this is the terminal building cfg
        type : 'building-5',
        cannonType : 'bullet_large',
        frequency : 500,
        live : 1000,
        price : 500,
        range : 100,
        damage : 10,
        cannonLen : 0
      }
    },

    upgradeMapping : {
      'building-1' : [
        {
          'damage' : 1.5,  // increase to 150%
          'frequency' : 0.8,
          'range' : 1.2,
          'live' : 2,
          'price' : 200   // +$200
        },
        {
          'damage' : 1.9,  // increase 190%
          'frequency' : 0.7,
          'range' : 1.5,
          'live' : 3,
          'price' : 500
        },
        {
          'damage' : 2.5,  // increase 250%
          'frequency' : 0.6,
          'range' : 1.7,
          'live' : 4,
          'price' : 2000
        }
      ],

      'building-2' : [
        {
          'damage' : 1.5,  // increase 150%
          'frequency' : 0.8,
          'range' : 1.2,
          'live' : 2,
          'price' : 400
        },
        {
          'damage' : 2,  // increase 200%
          'frequency' : 0.8,
          'range' : 1.5,
          'live' : 3,
          'price' : 800
        },
        {
          'damage' : 3,  // increase 300%
          'frequency' : 0.7,
          'range' : 2,
          'live' : 4,
          'price' : 3500
        }
      ],

      'building-3' : [
        {
          'damage' : 1.7,  // increase 170%
          'frequency' : 0.8,
          'range' : 1.2,
          'live' : 2,
          'price' : 600
        },
        {
          'damage' : 2.5,  // increase 250%
          'frequency' : 0.8,
          'range' : 1.5,
          'live' : 3,
          'price' : 1500
        },
        {
          'damage' : 3.5,  // increase 350%
          'frequency' : 0.8,
          'range' : 2,
          'live' : 4,
          'price' : 5200
        }
      ],

      'building-4' : [
        {
          'damage' : 3,  // increase 300%
          'frequency' : 1,
          'range' : 1.2,
          'live' : 2,
          'price' : 1500
        },
        {
          'damage' : 5,  // increase 500%
          'frequency' : 1,
          'range' : 1.5,
          'live' : 3,
          'price' : 5000
        },
        {
          'damage' : 10,  // increase 1000%
          'frequency' :1,
          'range' : 1.7,
          'live' : 4,
          'price' : 12000
        }
      ],

      'building-5' : [   // make sure terminal building's level always == 0
        {
          'damage' : 1,  // eventually, it's rebuild or refill blood
          'frequency' : 1,
          'range' : 1,
          'live' : 2,    // bonus, double its live
          'price' : 500
        }
      ]

    }

  }

});
