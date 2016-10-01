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
    TD.score = 0;
    TD.wave = 0;
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
      score : null,
      wave : TD.wave
    };

    TD.drawer(obj);

    // addEventListener to the NextLevel buttom
    // onClick, refresh the initial map, run TD.init() again
    document.getElementById('post').style.display = 'none';
    document.getElementById('pre').style.display = 'none';
    document.getElementById('over').style.display = 'block';
    TD.reStart = document.getElementById('restart');
    TD.reStart.addEventListener( 'click', TD.lang.onClick_restart, false );

  };

});
