_TD.loading.push(function(TD){

  TD.gameOver = function(){

    TD.bldCtrl.bld1.removeEventListener('click', this.onClick_building_1, false);
    TD.bldCtrl.bld2.removeEventListener('click', this.onClick_building_2, false);
    TD.bldCtrl.bld3.removeEventListener('click', this.onClick_building_3, false);
    TD.bldCtrl.bld4.removeEventListener('click', this.onClick_building_4, false);
    TD.bldCtrl.bld6.removeEventListener('click', this.onClick_building_6, false);

    TD.bldCtrl.ug.removeEventListener('click', this.onClick_upgrade, false);
    TD.bldCtrl.sl.removeEventListener('click', this.onClick_sell, false);

    TD.bldCtrl.c.removeEventListener('mousemove', this.onmouseMove, false);
    TD.bldCtrl.c.removeEventListener('click', this.onClick, false);

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

  };

});
