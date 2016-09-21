_TD.loading.push(function(TD){
  TD.cfg = {
    height : 500,

    width : 500,

    Restriction : [[[100,0],[0,100]],[[500-100, 500],[500, 500-100]]],

    taRestriction : [[450,500],[500,450]],

    dirC : [[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]],

    dirD : [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]],

    Dir : [[[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]], [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]]],

    buildingR : 10,

    bulletSize1 : 2,

    bulletSize2 : 3,

    bulletSize3 : 4,

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

    mouse : function ( ctx, cfg ){
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

    bld1 : function( ctx, cfg ){
      ctx.beginPath();
      ctx.arc(cfg.position[0], cfg.position[1], this.buildingR, 0, 2*Math.PI, false);
      ctx.fillStyle = "blue";
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
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 2;
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
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 2;
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
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 2;
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
        ctx.arc(cfg.position[0], cfg.position[1], range, 0, 2*Math.PI, false);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    },

    Arsenal : {
      'small' : {
          speed : 10,
          damageRange : 3,
          exploding : [1,2,3,4,3]
        },
      'middle' : {
          speed : 7,
          damageRange : 7,
          exploding : [2,3,4,5,4]
        },
      'large' : {
          speed : 5,
          damageRange : 15,
          exploding : [4,6,8,10,8]
        },
      'layser' : {
          speed : 1000,
          damageRange : 1,
          exploding : null
        }
    },

    Buildings : {
      'building-1' : {  // cfg
        type : 'building-1',
        cannonType : 'small',
        frequency : 100,  //  1 per 100ms
        live : 100,
        price : 100,
        range : 50,
        damage : 10
      },
      'building-2' : {
        type : 'building-2',
        cannonType : 'middle',
        frequency : 200,
        live : 100,
        price : 200,
        range : 30,
        damage : 20
      },
      'building-3' : {
        type : 'building-3',
        cannonType : 'large',
        frequency : 300,
        live : 100,
        price : 300,
        range : 40,
        damage : 50
      },
      'building-4' : {
        type : 'building-4',
        cannonType : 'layser',
        frequency : 30,
        live : 100,
        price : 500,
        range : 60,
        damage : 30
      }
    }

  }

});
