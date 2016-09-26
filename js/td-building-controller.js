
_TD.loading.push(function(TD){

  //before using buildingController, new it
  TD.buildingController = function(){
    this.bld1 = document.getElementById('building-1');
    this.bld2 = document.getElementById('building-2');
    this.bld3 = document.getElementById('building-3');
    this.bld4 = document.getElementById('building-4');
    this.bld6 = document.getElementById('building-6');

    this.ug = document.getElementById('upgrade');
    this.sl = document.getElementById('sell');

    this.c = document.getElementById('td-canvas');

    this.bld1.addEventListener('click', this.onClick_building_1, false);
    this.bld2.addEventListener('click', this.onClick_building_2, false);
    this.bld3.addEventListener('click', this.onClick_building_3, false);
    this.bld4.addEventListener('click', this.onClick_building_4, false);
    this.bld6.addEventListener('click', this.onClick_building_6, false);

    this.ug.addEventListener('click', this.onClick_upgrade, false);
    this.sl.addEventListener('click', this.onClick_sell, false);

    this.c.addEventListener('mousemove', this.onmouseMove, false);
    this.c.addEventListener('click', this.onClick, false);

  };

  TD.buildingController.prototype = {

    onClick_upgrade : function(ev){  // can upgrade weapon damage, 'exploding range'?, frequency, fire range, live.
      if(TD.waitingToChange == null) return;
      TD.waitingToChange.upgrade();
    },

    onClick_sell : function(ev){
      if(TD.waitingToChange == null) return;
      TD.lang.setMoney(TD.money + (TD.waitingToChange.price * 0.5));
      TD.waitingToChange.onClick = false;
      TD.waitingToChange.remove = true;
      TD.waitingToChange = null;
    },

    onClick_building_1 : function(ev){
      if(TD.waitingToBuild == 'building-1'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-1';
      }
    },

    onClick_building_2 : function(ev){
      if(TD.waitingToBuild == 'building-2'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-2';
      }
    },

    onClick_building_3 : function(ev){
      if(TD.waitingToBuild == 'building-3'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-3';
      }
    },

    onClick_building_4 : function(ev){
      if(TD.waitingToBuild == 'building-4'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-4';
      }
    },

    onClick_building_6 : function(ev){
      if(TD.waitingToBuild == 'building-6'){
        TD.waitingToBuild = null;
        TD.cfg.clearAll(TD.ucx2, TD.uc2);
      }else{
        TD.waitingToBuild = 'building-6';
      }
    },

    onmouseMove : function (ev){
      var rect = TD.uc2.getBoundingClientRect();
      var x = ev.clientX - rect.left;
      var y = ev.clientY - rect.top;
      if(TD.waitingToBuild != null){
        var obj = {
          position : [x,y],
          type : 'mouse',
          buildable : true
        };
        if(TD.lang.ableToBuild([x,y], TD.cfg.buildingR)==-1)
          obj['buildable'] = false;
        TD.drawer(obj);
      }
    },

    onClick : function(ev){
      var rect = TD.uc2.getBoundingClientRect();
      var x = ev.clientX - rect.left;
      var y = ev.clientY - rect.top;
      var isAble = TD.lang.ableToBuild([x,y], TD.cfg.buildingR);
      if(TD.waitingToBuild != null && isAble!=-1){  // click to build?
        var cfg = TD.cfg.Buildings[TD.waitingToBuild];
        if(TD.money >= cfg.price){
          TD.lang.setMoney(TD.money - cfg.price);
          TD.waitingToBuild = null;
          TD.cfg.clearAll(TD.ucx2, TD.uc2); // clear the view of upper layer
          if(cfg.type == 'building-6') {
            var bld = new TD.missileBuilding([x,y], cfg);
            cfg['position'] = bld.position;
            cfg['launcher'] = bld.baseLauncher;
          }
          else {
            var bld = new TD.building([x,y], cfg);
            cfg['cannon'] = bld.cannonDir;
            cfg['position'] = bld.position;
          }
          TD.lang.showBuildingInfo(bld);   // missile building should add missile number feature
          TD.drawer(cfg);
          if(isAble==1){   // builid outside the road
            TD.buildingQueue.push(bld);
          }else{
            TD.inBuildingQueue.push(bld);
            TD.bloodBarQueue.push(new TD.bloodBar(bld));
          }
        }
      }
      else if(TD.waitingToBuild == null){  //just click to show details?
        var bld = TD.lang.getBuilding([x,y], TD.cfg.buildingR);
        if(bld != null){
          if(TD.waitingToChange != null){  // enable previously choosed builing in map
            TD.waitingToChange.onClick = false;
          }
          TD.waitingToChange = bld;
          TD.lang.showBuildingInfo(bld);
          bld.onClick = true;
        }else{                              // click on empty place
          if(TD.waitingToChange != null){
            TD.waitingToChange.onClick = false;
            TD.waitingToChange = null;
            TD.lang.showBuildingInfo(null);
          }
        }
      }
    },

  };

});
