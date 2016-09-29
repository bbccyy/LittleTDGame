_TD.loading.push(function(TD){

  /*
  A building will run move function every step,
  pipeline:  run move() -> find target monster -> cumputer cannon direction --> create an drawable object
  --> if current building is on clicked by user, add range to drawable object
  --> set target and create a thread looping on fire function
  --> main thread push the drawable to queue and return
  */
  TD.building = function( position, cfg ){
    this.position = position;
    this.type = cfg.type;

    this.price = cfg.price;
    this.level = 0;  // building level, upgradable, Level is binding with building View.

    this.live = cfg.live;
    this.maxLive = cfg.live;
    this.frequency = cfg.frequency;  // fire frequency
    this.range = cfg.range;   // fire range
    this.damage = cfg.damage;   // weapon damage
    this.upgrade = function(){
      if(this.level == TD.cfg.maxLevel) return false;
      var up = TD.cfg.upgradeMapping[this.type][this.level];
      if(TD.money < up.price) return false;
      TD.lang.setMoney(TD.money - up.price);
      this.price += up.price;
      this.level++;
      this.damage = parseInt(this.damage*up.damage);
      this.range  = parseInt(this.range*up.range);
      this.maxLive= parseInt(this.maxLive*up.live);
      this.live   = parseInt(this.live*this.maxLive);  // immediately refresh the live of building to max
      this.frequency = parseInt(this.frequency*up.frequency);
      if(this.type=='building-6') this.missileNumber = up.missile;
      TD.lang.showBuildingInfo(this);
      return true;
    };

    this.onClick = false; // set to true if current building is selected by user's mouse
    this.remove = false;  // if true, then remove it from queue
    this.target = null;  // building's target monster

    this.cannonLen = cfg.cannonLen;
    this.cannonType = cfg.cannonType;  // bullet? layser?
    this.cannonDir = TD.lang.getCannon(this.position, [this.position[0]-10,this.position[1]],this.cannonLen); //default cannon direction

    this.fire_st = null;
    this.setTarget = function( tar ){
      this.target = tar;
      this.controlFire();
    };

    this.controlFire = function(){  // let's make consistent fire as long as find a target
      if(this.fire_st != null){
        clearInterval(this.fire_st);
      }
      if(this.target == null){
        return;
      }
      var that = this;
      this.fire_st = setInterval(
        function(){
          that.fire(that.cannonDir[1],that.target.position, that.damage, that.cannonType);
        },
        that.frequency);
    };

    this.move = function(){
      if(TD.pause){
        this.setTarget(null);
        return true;
      }
      if(this.live <= 0) {       // this terminal building has been destroied
        clearInterval(this.fire_st);  // don't forget to shut down its cannon :)
        return false;  // td.js will move it to TD.deadTerminals
      }
      if(this.remove == true) {       // this building has been removed
        clearInterval(this.fire_st);  // don't forget to shut down its cannon :)
        return false;
      }
      var tmpTar = this.findTarget();
      if(tmpTar != null){
        this.cannonDir = TD.lang.getCannon(this.position, tmpTar.position, this.cannonLen);
      }
      var obj = {
        position : this.position,
        type : this.type,   //building type, indicate the outline of building
        cannon : this.cannonDir
      };
      if(this.onClick){
        obj['showRange'] = this.range;
        TD.lang.showBuildingInfo(this);
      }
      if(this.target != tmpTar){
        this.setTarget(tmpTar);
      }
      TD.eventQueue.push(obj);
      return true;
    };

    this.findTarget = function(){  // find the nearest monster if any, or return null
      var theMonster = null, dis = this.range, tmp = 0;
      if(this.target != null && this.target.alive==true &&
         TD.lang.getDistance(this.position, this.target.position) <= dis){
         return this.target;
       }
      for(var idx=0; idx<TD.monsterQueue.length; idx++){
        tmp = TD.lang.getDistance(this.position, TD.monsterQueue[idx].position);
        if( tmp <= dis){
          dis = tmp;
          theMonster = TD.monsterQueue[idx];
        }
      }
      return theMonster;
    };

    this.fire = function(s, e, damage, cannonType){
      // s: start point,  e: end point,  damage: damage,  type: draw style
      // this.cannonDir[1] as start point
      // this.target.position as end point
      // create a bullet object
      // push that bullet object into TD.bulletQueue
      var bulletCfg = {
        position : s,
        start : s,
        end : e,
        gender : true,  // this is justice
        damage : damage,   // may increase when flying through something in the map
        type : cannonType
      };
      if(cannonType == 'bullet_missile'){
        bulletCfg['end'] = this.target;
        var blt = new TD.missile( bulletCfg );
      }else if(cannonType == 'bullet_layser'){
        bulletCfg['end'] = this.target;
        var blt = new TD.bullet( bulletCfg );
      }
      else{
        var blt = new TD.bullet( bulletCfg );
      }
      TD.bulletQueue.push(blt);
    }

  };


  TD.missileBuilding = function (position, cfg){
    this.__proto__ = new TD.building(position, cfg);
    this.missileNumber = cfg.missileNumber;  // number of missiles available in each attack (max: 7)
    this.curLauncher = [];
    this.curLauncherPoint = [];
    // Curbs are used to filter out monsters that are lay outside of its front face
    this.leftCurb = [this.position, [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR]];
    this.rightCurb = [this.position, [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR]];
    this.baseLauncher = [     // 4 points, first two is the front face
                     [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR],
                     [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR],
                     [this.position[0]+TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR],
                     [this.position[0]+TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR]
                    ];
    this.baseLaunchPoint = [    //7 points indicate the place the missile will be launched
                        [this.position[0]-TD.cfg.buildingR/2,this.position[1]],
                      //  [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR/3],
                      //  [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR/3],
                        [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR/3*2],
                        [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR/3*2],
                      //  [this.position[0]-TD.cfg.buildingR/2,this.position[1]-TD.cfg.buildingR],
                      //  [this.position[0]-TD.cfg.buildingR/2,this.position[1]+TD.cfg.buildingR]
                       ];
    this.baseLine = [this.position, [this.position[0]-10,this.position[1]]];  // <s, e>

    this.getLauncher = function(){  //modify launcher body, launch-point and Curbs
      var Dir = [this.position, this.cannonDir[1]], idx, tmpX, tmpY, x, y;
      var angle = TD.lang.getAngle360(this.baseLine, Dir);  //get angle from baseLine(nver changes) to cannonDir
      for(idx=0; idx<4; idx++){
        tmpX = this.baseLauncher[idx][0] - this.position[0];
        tmpY = this.baseLauncher[idx][1] - this.position[1];
        x = tmpX*Math.cos(angle) - tmpY*Math.sin(angle) + this.position[0];
        y = tmpX*Math.sin(angle) + tmpY*Math.cos(angle) + this.position[1];
        this.curLauncher[idx] = [x, y];
      }
      this.leftCurb = [this.position, this.curLauncher[0]];
      this.rightCurb = [this.position, this.curLauncher[1]];
      for(idx=0; idx<this.missileNumber; idx++){
        tmpX = this.baseLaunchPoint[idx][0] - this.position[0];
        tmpY = this.baseLaunchPoint[idx][1] - this.position[1];
        x = tmpX*Math.cos(angle) - tmpY*Math.sin(angle) + this.position[0];
        y = tmpX*Math.sin(angle) + tmpY*Math.cos(angle) + this.position[1];
        this.curLauncherPoint[idx] = [x, y];
      }
    };

    this.move = function(){
      if(TD.pause){
        this.setTarget(null);
        return true;
      }
      if(this.live <= 0) {       // this terminal building has been destroied
        clearInterval(this.fire_st);  // don't forget to shut down its cannon :)
        return false;  // td.js will move it to TD.deadTerminals
      }
      if(this.remove == true) {       // this building has been removed
        clearInterval(this.fire_st);  // again don't forget to shut down its cannon :)
        return false;
      }
      var tmpTar = this.findTarget();
      if(tmpTar != null){
        this.cannonDir = TD.lang.getCannon(this.position, tmpTar.position, this.cannonLen);
      }
      this.getLauncher();
      var obj = {
        position : this.position,
        type : this.type,   //building type, indicate the outline of building
        launcher : this.curLauncher
      };
      if(this.onClick){
        obj['showRange'] = this.range;
        TD.lang.showBuildingInfo(this);
      }
      if(this.target != tmpTar){
        this.setTarget(tmpTar);
      }
      TD.eventQueue.push(obj);
      return true;
    };

    this.findAllTargets = function(){
      var allMonsters = [], range = this.range,  dis, ms;
      for(var idx=0; idx<TD.monsterQueue.length; idx++){
        if(allMonsters.length > this.missileNumber) break;
        ms = TD.monsterQueue[idx];
        dis = TD.lang.getDistance(this.position, ms.position);
        if(dis > range) continue;
        if(!TD.lang.isOnLeft(this.leftCurb, ms.position) && TD.lang.isOnLeft(this.rightCurb, ms.position)){
          allMonsters.push(ms);
        }
      }
      return allMonsters;
    };

    this.fire = function(s, e, damage, cannonType){
      var all = this.findAllTargets(), idx=0, i=0, tar;
      for(idx=0; idx<this.missileNumber; idx++){
        if(i==all.length) i=0;
        tar = all[i++];
        var bulletCfg = {
          position : this.curLauncherPoint[idx],
          start : this.curLauncherPoint[idx],
          end : tar,
          gender : true,
          damage : damage,
          type : cannonType
        };
        var blt = new TD.missile( bulletCfg );
        TD.bulletQueue.push(blt);
      }
    };

  };

  // terminalBuilding inhert from TD.building object
  TD.terminalBuilding = function( position, terminalId, cfg ){
    this.__proto__ = new TD.building( position, cfg );
    this.type = 'building-5';
    this.tid = terminalId;  // infact, this is a node itself
    this.firePos = [position[0],position[1]-13];
    this.upgrade = function(){
      var up = TD.cfg.upgradeMapping[this.type][this.level];
      if(TD.money < up.price) return false;
      TD.lang.setMoney(TD.money - up.price);
      this.price += up.price; // do not increase level for terminal building
      this.maxLive   *= up.live;
      this.live = this.maxLive;  // immediately refresh the live of building to max
      TD.lang.showBuildingInfo(this);
      if(TD.aliveTerminals[this.tid] == undefined){
        TD.aliveTerminals[this.tid] = TD.deadTerminals[this.tid];
        TD.bloodBarQueue.push(new TD.bloodBar(TD.aliveTerminals[this.tid]));
        delete TD.deadTerminals[this.tid];
      }
      return true;
    };
    this.move = function(){
      if(TD.pause){
        this.setTarget(null);
        return true;
      }
      var obj = {
        position : this.position,
        type : this.type,   //building type, indicate the outline of building
        alive : true
      };
      if(this.onClick){
        obj['showRange'] = this.range;
        TD.lang.showBuildingInfo(this);
      }
      if(this.live <= 0) {       // this terminal building has been destroied
        clearInterval(this.fire_st);  // don't forget to shut down its cannon :)
        obj.alive = false;
        TD.eventQueue.push(obj);
        if(this.tid.Feature =='TA') TD.GameOver = true;
        return false;  // td.js will move it to TD.deadTerminals
      }
      var tmpTar = this.findTarget();
      if(this.target != tmpTar){
        this.setTarget(tmpTar);
      }
      TD.eventQueue.push(obj);
      return true;
    };

    this.controlFire = function(){  // let's make consistent fire as long as find a target
      if(this.fire_st != null){
        clearInterval(this.fire_st);
      }
      if(this.target == null){
        return;
      }
      var that = this;
      this.fire_st = setInterval(
        function(){ that.fire(that.firePos,that.target.position, that.damage, that.cannonType); },
        that.frequency);
    };

  };


});
