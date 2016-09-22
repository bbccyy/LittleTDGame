
_TD.loading.push(function(TD){

  TD.buildNextWave = function(){
    TD.waitingForNextWave = false;
    var total = TD.cfg.maxNumberOfMonsterPerWave;
    var _st = null;
    var createMave = function(){
      if(total <= 0){
        clearTimeout(_st);
        return;
      }
      var loop = parseInt(Math.random()*3 + 1);  // 1~3 monsters
      total -= loop;
      while(loop > 0){
        loop--;
        var mst = TD.lang.getRandomMonster();
        TD.monsterQueue.push(mst);
      }
      _st = setTimeout( function(){createMave();} , 1000);
    };
    createMave();
  }

});
