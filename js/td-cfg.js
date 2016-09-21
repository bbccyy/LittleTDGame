_TD.loading.push(function(TD){
  TD.cfg = {
    height : 500,

    width : 500,

    Restriction : [[[100,0],[0,100]],[[500-100, 500],[500, 500-100]]],

    taRestriction : [[450,500],[500,450]],

    dirC : [[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]],

    dirD : [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]],

    Dir : [[[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]], [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]]],

    buildingR : 5,

    speedMapping : function( area ){
      if(area <= 350) return 1;
      else if(area <= 700) return 0.9;
      else return 0.5;
    },

    monster : function( ctx, position ){
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.arc(position[0],position[1],3,0,2*Math.PI);
      ctx.fill();
    },

    Arsenal : {
      'small' : [10, 3, [1,2,3,4,3]],  //[speed, damge range, exploding style]
      'middle' : [7, 5, [2,3,4,5,4]],
      'large' : [5, 10, [4,6,8,10,8]],
      'layser' : [500, 1]
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
