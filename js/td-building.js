_TD.loading.push(function(TD){

  /*
  A building will run move function every step,
  pipeline:  run move() -> find target monster -> cumputer cannon direction --> create an drawable object
  --> if current building is on clicked by user, add range to drawable object
  --> set target and create a thread looping on fire function
  --> main thread push the drawable to queue and return
  */
  TD.building = function( cfg ){
    this.position = cfg.position;
    this.type = cfg.type;
    this.cannonType = cfg.cannonType;  // bullet? layser?
    this.frequency = cfg.frequency;
    this.live = cfg.live;
    this.range = cfg.range;
    this.damage = cfg.damage;
    this.onClick = false; // set to true if current building is selected by user's mouse
    this.target = null;  // building's target monster
    this.price = cfg.price;
    this.cannonDir = TD.lang.getCannon(this.position, [this.position[0]-10,this.position[1]],5); //default cannon direction
    this.fire_st = null;
    this.setTarget = function( tar ){
      this.target = tar;
      this.controlFire();
    };

    this.controlFire = function(){  // let's make consistent fire as long as find a target
      if(this.fire_st != null){
        clearTimeout(this.fire_st);
      }
      if(this.target == null){
        return;
      }
      this.fire_st = setTimeout(
        this.fire(this.cannonDir[1],this.target.position, this.damage, this.cannonType),
        this.frequency);
    };

    this.move = function(){
      var tmpTar = this.findTarget();
      if(tmpTar != null){
        this.cannonDir = TD.lang.getCannon(this.position, tmpTar.position, 5);
      }
      var obj = {
        position : this.position,
        type : this.type,   //building type, indicate the outline of building
        cannon : this.cannonDir
      };
      if(this.onClick){
        obj['showRange'] = this.range;
      }
      TD.eventQueue.push(obj);
      this.setTarget(tmpTar);
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
        damage : damage,   // may increase when flying through something in the map
        type : cannonType
      };
      var blt = new TD.bullet( bulletCfg );
      TD.bulletQueue.push(blt);
    }

  };

});
