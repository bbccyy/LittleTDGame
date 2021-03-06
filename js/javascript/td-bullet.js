

_TD.loading.push(function(TD){


  TD.bullet = function( cfg ){
    this.position = cfg.position;
    this.origin = cfg.start;
    this.target = cfg.end;   // in missile/layser type, this stores the monster object
    this.type = cfg.type;
    this.damage = cfg.damage;
    this.gender = cfg.gender;  // true: from building, false: from monster
    this.speed = TD.cfg.Arsenal[this.type].speed;  //bullet speed
    this.range = TD.cfg.Arsenal[this.type].damageRange;
    //this.exploding = TD.cfg.Arsenal[this.type].exploding;  // exploding style
    this.exploding = TD.explodeFrame[this.type];  // if layser then undefined
    this.index = 0;  //exploding frame index
    this.hostType = cfg.hostType;  // used to identify different Layser Hoster --> draw differently

    this.move = function(){
      if(this.type == 'bullet_layser'){
        var obj = {
          position : this.target.position,
          origin : this.origin,
          type : this.type,
          hostType : this.hostType
        };
        this.makeDamage();
        TD.eventQueue.push(obj);
        return false;
      }
      if(TD.lang.pointEq(this.target, this.position)==true){
        if(this.index < this.exploding.length){
          var obj = {
            position : this.position,
            type : this.type,
            exploding : this.exploding[this.index],
            hostType : this.hostType
          };
          this.index++;
          TD.eventQueue.push(obj);
          return true;
        }else{
          return false;
        }
      }
      var nextPosition = TD.lang.getNextPos(this.position, this.origin, this.target, this.speed);
      this.position = nextPosition;
      var obj = {
        position : nextPosition,
        type : this.type,
        hostType : this.hostType
      };
      if(TD.lang.pointEq(this.target, this.position)==true){
        this.makeDamage();
        obj['exploding'] = this.exploding[this.index];
        this.index++;
      }
      TD.eventQueue.push(obj);
      return true;
    };

    this.makeDamage = function(){   // now, makeDamage function can process both justice and evil bullets
      if(this.type == 'bullet_layser'){
        if(this.target.shield!=undefined && this.target.shield==true){
          this.target.live -= this.damage*1.5;
        }
        else{
          this.target.live -= this.damage;
        }
        return;
      }
      var idx, ms, key, monsterPosition;
      if(this.gender==true){
        for(idx=0; idx<TD.monsterQueue.length; idx++){
          ms = TD.monsterQueue[idx];
          monsterPosition = this.target;
          if(this.type=='bullet_missile') monsterPosition = this.position;
          if(TD.lang.getDistance(monsterPosition, ms.position) <= this.range){
            if(ms.shield==true){
              if(this.type=='bullet_missile'){
                ms.live -= this.damage*0.3;
              }else if(this.type=='bullet_large'){
                ms.live -= this.damage*0.5;
              }else if(this.type=='bullet_middle'){
                ms.live -= this.damage*0.9;
              }else{
                ms.live -= this.damage;
              }
            }else{
              ms.live -= this.damage;
            }
          }
        }
      }else{
        for(idx=0; idx<TD.inBuildingQueue.length; idx++){
          ms = TD.inBuildingQueue[idx];
          if(TD.lang.getDistance(this.target, ms.position) <= this.range){
            ms.live -= this.damage;
          }
        }
        for(key in TD.aliveTerminals){
          if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
          ms = TD.aliveTerminals[key];
          if(TD.lang.getDistance(this.target, ms.position) <= this.range){
            ms.live -= this.damage;
          }
        }
      }
    };
  };

  // inherit from bullet
  // make sure cfg.end = monster object
  TD.missile = function( cfg ){
    this.__proto__ = new TD.bullet( cfg );
    this.track = [];
    this.count = 15;
    this.hit = false;
    this.curTargetPosition = this.target.position;  // previous position, if target has been destroied, use this curTargetPosition

    this.move = function(){
      if(!this.hit && this.target != undefined && this.target != null && this.target.live > 0){
        this.curTargetPosition = this.target.position;
      }

      if(TD.lang.pointEq(this.curTargetPosition, this.position)==true){
        //if( this.track.length > 1){
        if(this.index < this.exploding.length){
          this.track.shift();
          var obj = {
            position : this.curTargetPosition,
            type : this.type,
            exploding : this.exploding[this.index],
            track : this.track
            //hostType : this.hostType
          };
          this.index++;
          TD.eventQueue.push(obj);
          return true;
        }else{
          return false;
        }
      }
      var nextPosition = TD.lang.getNextPos(this.position, this.position, this.curTargetPosition, this.speed);
      var point = [this.position, nextPosition], idx;
      this.track.push(point);
      this.position = nextPosition;
      if(this.track.length > this.count) this.track.shift();
      var obj = {
        position : this.curTargetPosition,
        type : this.type,
        track : this.track,
        //hostType : this.hostType,
        catnon : this.damage > 500
      };
      if(TD.lang.pointEq(this.curTargetPosition, this.position)==true){
        this.hit = true;
        this.makeDamage();
        obj['exploding'] = this.exploding[this.index];
        this.index++;
      }
      TD.eventQueue.push(obj);
      return true;
    };

  };

});
