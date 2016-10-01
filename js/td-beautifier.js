
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
