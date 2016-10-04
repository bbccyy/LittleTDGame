
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
