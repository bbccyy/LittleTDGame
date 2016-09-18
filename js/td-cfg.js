_TD.loading.push(function(TD){
  TD.cfg = {
    height : 500,
    width : 500,
    Restriction : [[[100,0],[0,100]],[[500-100, 500],[500, 500-100]]],
    taRestriction : [[450,500],[500,450]],
    dirC : [[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]],
    dirD : [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]],
    Dir : [[[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]], [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]]],
    speedMapping : function( area ){
      if(area <= 350) return 1;
      else if(area <= 700) return 0.9;
      else return 0.5;
    }
  }

});
