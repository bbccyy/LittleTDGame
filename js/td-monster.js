_TD.loading.push(function(TD){


  //TD.eventQueue
  //TD.buildingsInBattleField
  TD.monster = function( node, cfg ){
    this.position = node.position;
    this.node = node;

    this.type = cfg.type;
    this.speed = cfg.speed;
    this.baseSpeed = cfg.speed;
    this.range = cfg.range;   // attack range
    this.damage = cfg.damage;
    this.cannonType = cfg.cannonType;
    this.frequency = cfg.frequency;
    this.target = null;     // monster target buildings
    this.fire_st = null;
    this.setTarget = function( tar ){
      this.target = tar;
      this.controlFire();
    };

    this.controlFire = function(){  // let's make consistent fire as long as find a target
      if(this.fire_st != null){
        clearInterval(this.fire_st);
      }
      if(this.target == null || this.target.live <= 0){
        return;
      }
      var that = this;
      this.fire_st = setInterval(
        function(){
          if(that.cannonType == 'bullet_layser'){
            that.fire(that.position, that.target, that.damage, that.cannonType);
          }else{
            var tarP = TD.lang.accuracyDestroyer(that.target.position, 8);
            that.fire(that.position, tarP, that.damage, that.cannonType);
          }
        },
        that.frequency);
    };

    this.live = cfg.live();
    this.maxLive = cfg.live();
    this.price = cfg.price();

    this.from = node;
    this.to = null;
    this.path = null;
    this.probe = 0;    // indicate current location on a single path

    this.alive = true;

    this.dirFrameArray = TD.monsterFrame[this.type];
    this.frame = 0;  // used to show images
    this.Dir = 0;  // current direction

    this.move = function(){
      if(TD.pause){
        this.setTarget(null);
        return true;
      }
      if(this.live <= 0) {      // current monster is dead
        // can add exploding view later
        this.alive = false;
        clearInterval(this.fire_st);
        TD.lang.setMoney(TD.money + this.price);
        TD.lang.setScore(TD.score + parseInt(this.maxLive/100));
        return false;
      }
      var tmpTar = this.findTarget();
      if(tmpTar == null && this.target != null){
        this.setTarget(tmpTar);
      }
      if(tmpTar != null){   // if this monster find a target, it will not move until destroy that target
        TD.eventQueue.push({   // stay at the same position
          position : this.position,
          type : this.type,
          spritename : this.dirFrameArray[this.Dir][5],
          dir : this.Dir
        });
        if(this.target != tmpTar){
          this.setTarget(tmpTar);
        }
        return true;
      }
      if(this.from == null) return false;  // actually, I don't think it's possible
      if(this.to == null){                 //find next station
        var res = TD.strategy(this.from);
        this.to = res[0];
        this.path = res[1];
        this.probe = 1;
      }
      // this monster get to a terminal station
      if(TD.lang.pointEq(this.position, this.to.position) || this.probe==this.path.length){
        if(this.to.Feature == 'TA'){   // the monster reaches the final Terminal, Game over
          this.alive = false;  // make sure blood bar will eventually disappear at this moment
          this.live = 0;
          return false;
        }else{      // the monster reaches an ordinary terminal
          this.from = this.to;
          this.to = null;
          if(this.from.Feature=='T' || this.from.Feature == 'TJ'){
            var tbld = TD.aliveTerminals[this.from];
            if(tbld != undefined){
              tbld.live = -1;
              //TD.deadTerminals[this.from] = TD.aliveTerminals[this.from];
              //delete TD.aliveTerminals[this.from];
            }
          }
          //this.move();
          return this.move();
        }
      }

      // -------- set direction --------
      var nextDir = TD.lang.getCurDir(this.position, this.path[this.probe][0]);
      if(this.Dir != nextDir){
        this.frame = 0;
        this.Dir = nextDir;
      }else{
        this.frame++;
        this.frame %= this.dirFrameArray[this.Dir].length;
      }
      // -------- end of set direction --------

      this.speed = this.baseSpeed * this.path[this.probe-1][1];
      this.position = TD.lang.getNextPos(this.position, this.path[this.probe-1][0], this.path[this.probe][0], this.speed);
      if(TD.lang.pointEq(this.position, this.path[this.probe][0])){
        this.probe++;
      }
      TD.eventQueue.push({
        position : this.position,
        type : this.type,
        spritename : this.dirFrameArray[this.Dir][this.frame],
        dir : this.Dir
      });
      return true;
    };

    this.findTarget = function(){
      var theBuilding = null, dis = this.range, key, idx;
      if(this.target != null && this.target.live > 0 &&
         TD.lang.getDistance(this.position, this.target.position) <= dis){
         return this.target;
      }
      for(key in TD.aliveTerminals){
        if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
        theBuilding = TD.aliveTerminals[key];  // the terminal tower
        if(TD.lang.getDistance(this.position, theBuilding.position) <= dis){
          return theBuilding;
        }
      }
      for(idx=0; idx<TD.inBuildingQueue.length; idx++){
        if(TD.lang.isInRange(this.position, TD.inBuildingQueue[idx].position, dis)){
          return TD.inBuildingQueue[idx];
        }
      }
      return null;
    };

    this.fire = function(s, e, damage, cannonType){
      // s: start point,  e: end point,  damage: damage,  type: draw style
      // this.target.position as end point
      // create a bullet object
      // push that bullet object into TD.bulletQueue
      var bulletCfg = {
        position : s,
        start : s,
        end : e,
        gender : false,    // this from evil
        damage : damage,   // may increase when flying through something in the map
        type : cannonType
      };
      var blt = new TD.bullet( bulletCfg );
      TD.bulletQueue.push(blt);
    }


  };

});
