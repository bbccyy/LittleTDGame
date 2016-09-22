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

    bulletSize1 : 2,   // the size of bullet, radius of bullet

    bulletSize2 : 3,

    bulletSize3 : 4,

    maxLevel : 3,

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

    bullet_small : function( ctx, cfg ){
      ctx.beginPath();
      if(cfg.exploding == undefined){
        ctx.arc(cfg.position[0], cfg.position[1], this.bulletSize1, 0, 2*Math.PI, false);
        ctx.fillStyle = "blue";
      }else{
        ctx.arc(cfg.position[0], cfg.position[1], cfg.exploding, 0, 2*Math.PI, false);
        ctx.fillStyle = "origin";
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
        ctx.fillStyle = "origin";
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
        ctx.fillStyle = "origin";
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

    Arsenal : {
      'bullet_small' : {
          speed : 10,
          damageRange : 5,
          exploding : [1,2,3,4,3]
        },
      'bullet_middle' : {
          speed : 8,
          damageRange : 7,
          exploding : [2,3,4,5,4]
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
        range : 30,
        damage : 20,
        cannonLen : 12
      },
      'building-3' : {
        type : 'building-3',
        cannonType : 'bullet_large',
        frequency : 500,
        live : 100,
        price : 300,
        range : 40,
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
      ]
    }

  }

});
