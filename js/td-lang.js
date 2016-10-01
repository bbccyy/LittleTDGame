
_TD.loading.push(function(TD){

  // Object.size = function(obj) {
  //     var size = 0, key;
  //     for (key in obj) {
  //         if (obj.hasOwnProperty(key)) size++;
  //     }
  //     return size;
  // };

  TD.lang = {

    isOnLeft : function(e, r){
      var p = e[0];
      var q = e[1];
      if(p==r || q==r) return false;
      var prx = p[0] - r[0];
      var pry = p[1] - r[1];
      var qrx = q[0] - r[0];
      var qry = q[1] - r[1];
      var res = prx * qry - pry * qrx;
      res = Number((res-0).toFixed(5));
      if(res < 0) return true;
      else return false;
    },

    isInCircle : function(circleV, p){
      var dis = Math.sqrt((p[0]-circleV[0])*(p[0]-circleV[0]) + (p[1]-circleV[1])*(p[1]-circleV[1]));
      dis = Number(dis.toFixed(5));
      var r = Number(circleV[2].toFixed(5));
      if(dis < r) return 1;
      else if(dis == r) return 0;
      else return -1;
    },

    Create2DArray : function(rows, columns) {
      var arr = [];
      for (var i=0;i<rows;i++) {
        var arr2 = [];
        for(var j=0;j<columns; j++){
          arr2[j] = 0;
        }
         arr[i] = arr2;
      }
      return arr;
    },

    drawOneSet : function(cx, e , color){
      cx.lineWidth = 1;
      cx.lineCap = 'round';
      cx.strokeStyle = color;
      for(var idx=0; idx<e.length; idx++){
        cx.beginPath();
        cx.moveTo(e[idx][0][0], e[idx][0][1]);
        cx.lineTo(e[idx][1][0], e[idx][1][1]);
        cx.stroke();
      }
    },

    drawArray : function(cx, arr , color){
      cx.lineWidth = 1;
      cx.lineCap = 'round';
      cx.strokeStyle = color;
      cx.beginPath();
      for(var idx=0; idx<arr.length; idx++){
        if(idx==0){
          cx.moveTo(arr[idx][0][0], arr[idx][0][1]);
          continue;
        }
        cx.lineTo(arr[idx][0][0], arr[idx][0][1]);
        cx.stroke();
      }
    },

    drawOutline : function(cx, que){

      var oldx=0, oldy=0, idx, spriteSheet, spt, point = [], q = [];
      cx.globalCompositeOperation="source-over";
      spriteSheet = TD.gSpriteSheets['scene'];
      spt = spriteSheet.getStats('grass_15.png');
      var hlf = {
        x : spt.cx,
        y : spt.cy
      };
      var fence = this.randomNum(5)+3;
      idx = this.randomNum(30)+20;
      for(idx=0; idx<que.length; idx++){
        if(fence == 0){
          fence = this.randomNum(5)+3;
          idx += this.randomNum(20)+5;
          continue;
        }
        fence--;
        point = que[idx];
        if(this.ok2Draw(point[0], point[1])){
          if(this.getCurDir([oldx, oldy], point) == 4){  // from down to up, draw downer before draw upper
            if(q.length==0) q.push([oldx, oldy]);
            else if(!this.pointEq(q[q.length-1], [oldx, oldy])) q.push([oldx, oldy]);
            q.push(point);
          }else{
            cx.drawImage(spriteSheet.img, spt.x, spt.y,
               spt.w, spt.h, point[0]+hlf.x, point[1]+hlf.y-3, spt.w, spt.h);
          }
        }
        oldx=point[0];
        oldy=point[1];
      }
      while(q.length > 0){
        point = q.pop();
        cx.drawImage(spriteSheet.img, spt.x, spt.y,
           spt.w, spt.h, point[0]+hlf.x, point[1]+hlf.y-3, spt.w, spt.h);
      }
    },

    onClick_restart : function(){
      TD.reStart.removeEventListener('click', TD.lang.onClick_restart, false);
      TD.reStart = null;
      document.getElementById('over').style.display = 'none';
      TD.init();
    },

    randomNum : function( upLimit ){
      return parseInt(Math.random() * upLimit);
    },

    paintGround : function( uc, spritename ){
      var w = uc.width, h = uc.height, i, j, ctx = uc.getContext('2d');
      var spriteSheet = TD.gSpriteSheets['scene'];
      var spt = spriteSheet.getStats(spritename);
      for(j=0; j<h; j+=70){
        for(i=0; i<w; i+=70){
          ctx.drawImage(spriteSheet.img, spt.x, spt.y,
             spt.w, spt.h, i, j, 70, 70);
        }
      }
    },

    getCentrePoint : function(x1, x2, x3){
      var a=2*(x2[0]-x1[0]);
      var b=2*(x2[1]-x1[1]);
      var c=x2[0]*x2[0]+x2[1]*x2[1]-x1[0]*x1[0]-x1[1]*x1[1];
      var d=2*(x3[0]-x2[0]);
      var e=2*(x3[1]-x2[1]);
      var f=x3[0]*x3[0]+x3[1]*x3[1]-x2[0]*x2[0]-x2[1]*x2[1];
      var x=(b*f-e*c)/(b*d-e*a);
      var y=(d*c-a*f)/(b*d-e*a);
      var r=Math.sqrt((x-x1[0])*(x-x1[0])+(y-x1[1])*(y-x1[1]));
      return [x, y, r];
    },

    // compute the geo centre from a given triangle's all edges
    getGeoCentre : function( allEdges ){
      var p = allEdges[0][0];   // choose first inner edge's first point as a terminal point
      var edge = null;
      if(this.pointEq(allEdges[1][0],p) || this.pointEq(allEdges[1][1],p)) // get that terminal point's opposit edge
        edge = allEdges[2];
      else edge = allEdges[1];
      var m = this.getMiddle( edge );
      var res = [(p[0]-m[0])/3 + m[0], (p[1]-m[1])/3 + m[1]];
      return res;
    },

    getMiddle : function( e ){
      var mx = (e[0][0] + e[1][0]) / 2;
      var my = (e[0][1] + e[1][1]) / 2;
      return [mx, my];
    },

    reverseEdge : function( e ){
      return [e[1],  e[0]];
    },

    pointEq : function(p1, p2){
      return p1[0]==p2[0] && p1[1] == p2[1];
    },

    edgeEq : function(e1, e2){
      return (this.pointEq(e1[0], e2[0]) && this.pointEq(e1[1], e2[1])) ||
              (this.pointEq(e1[0], e2[1]) && this.pointEq(e1[1], e2[0]));
    },

    isInRange : function(p1, p2, r){
      var dis = this.getDistance(p1, p2);
      if( dis <= r) return true;
      else return false;
    },

    //isOnLeft(e, r)  true --> left
    ok2Draw : function(x, y, lines){  // lines --> [lineUpLeft, lineDownRight]
      if(lines == undefined) lines = TD.cfg.Restriction;
      for(var i=0; i<lines.length; i++){
        if(!TD.lang.isOnLeft(lines[i],[x,y])) return false;
      }
      return true;
    },

    getDistance : function(p1, p2){
      return Math.sqrt((p1[0]-p2[0])*(p1[0]-p2[0]) + (p1[1]-p2[1])*(p1[1]-p2[1]));
    },

    getNextPos : function(c, s, e, speed){
      var dis = this.getDistance(s, e);
      if( dis-1 <= speed ) return e;
      var x = (e[0]-s[0])*speed/dis + c[0];
      var y = (e[1]-s[1])*speed/dis + c[1];
      var mag = this.getDistance(s, [x,y]);
      if(mag >= dis) return e;
      return [x,y];
    },

    getCurDir : function( s, e ){
      var dx = e[0] - s[0], dy = e[1] - s[1], ax = Math.abs(dx), ay = Math.abs(dy);
      if(dx > 0 && ay <= dx) return 3;
      else if(dy > 0 && ax <= dy) return 1;
      else if(dx < 0 && ay <= ax) return 2;
      else return 4;
    },

    getCannon : function(s, e, l){
      var dis = this.getDistance(s, e);
      var x = (e[0]-s[0])/dis;
      var y = (e[1]-s[1])/dis;
      return [[x*3 + s[0], y*3 + s[1]], [x*(3+l) + s[0], y*(3+l) + s[1]]];
    },

    clearGrass : function( p ){  //clear up grass to build something on it
      for(var idx=0; idx<TD.grassQueue.length; idx++){
        if(this.getDistance(p, TD.grassQueue[idx].position) <= TD.cfg.buildingR*2)
          TD.grassQueue[idx].alive = false;
      }
    },

    ableToBuild : function( p, r ){
      var x = parseInt(p[0]), y = parseInt(p[1]), idx, cur;  // parseInt to prevent float input
      if(TD.mapData == null) return false;
      if(x+r>=TD.cfg.width || x-r<0 || y+r>=TD.cfg.height || y-r<0) return -1;
      cur = TD.mapData[y][x+r];
      //if(TD.mapData[y][x+r] != 0) return false;
      if(TD.mapData[y][x-r] != cur) return -1;
      if(TD.mapData[y+r][x] != cur) return -1;
      if(TD.mapData[y-r][x] != cur) return -1;
      if(cur == 0){
        for(idx=0; idx<TD.buildingQueue.length; idx++){
          if(this.getDistance(TD.buildingQueue[idx].position, p) <= 2*r)
            return -1;
        }
        for(idx=0; idx<TD.irremovalbeGrassQueue.length; idx++){
          if(this.getDistance(TD.irremovalbeGrassQueue[idx].position, p) <= 30)
            return -1;
        }
      }else{
        for(idx=0; idx<TD.inBuildingQueue.length; idx++){
          if(this.getDistance(TD.inBuildingQueue[idx].position, p) <= 2*r)
            return -1;
        }
        // should also check for terminal towers, both alive and dead
      }
      return cur+1;  // 1: --> outside,   2: --> inside
    },

    showBuildingInfo : function ( bld ){
      if(bld == null){
        var str = "<dt>Level</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Damage</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Range</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Frequency</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Live</dt>" + "<dd>" + " " + "</dd>"
                + "<dt>Price</dt>" + "<dd>" + " " + "</dd>";
        this.bindingElement(TD.panelElement, str);
      }
      else{
        var str = "<dt>Level</dt>" + "<dd>" + bld.level + "</dd>"
                + "<dt>Damage</dt>" + "<dd>" + bld.damage + "</dd>"
                + "<dt>Range</dt>" + "<dd>" + bld.range + "</dd>"
                + "<dt>Frequency</dt>" + "<dd>" + bld.frequency + "</dd>"
                + "<dt>Live</dt>" + "<dd>" + bld.live + " / " + bld.maxLive  + "</dd>"
                + "<dt>Price</dt>" + "<dd>" + bld.price + "</dd>";
        this.bindingElement(TD.panelElement, str);
      }
    },

    bindingElement : function( el, text ){
      el.innerHTML = text;
    },

    setMoney : function( money ){
      TD.money = money;
      this.bindingElement(TD.moneyElement, 'money : ' + TD.money);
    },

    setWave : function( wave ){
      TD.wave = wave;
      this.bindingElement(TD.waveElement, 'wave : ' + TD.wave);
    },

    setScore : function( score ){
      TD.score = score;
      this.bindingElement(TD.scoreElement, 'score : ' + TD.score);
    },

    getRandomMonster : function(){
      var num = parseInt(Math.random()*4+1);
      var key = 'monster-' + num;
      //var cfg = TD.cfg.Monsters[key];  // find a bug! cfg here will cumulate previous effects
      var cfg = this.copy(TD.cfg.Monsters[key]);
      cfg['live'] = TD.cfg.Monsters[key].live;
      cfg['price'] = TD.cfg.Monsters[key].price;
      cfg.speed += (Math.random()*0.2 - 0.1);
      cfg.range += parseInt(Math.random()*20 - 10);
      var mst = new TD.monster(TD.root, cfg);
      return mst;
    },

    copy : function( obj ){  //not deep copy of an object
      var res = {};
      for(var key in obj){
        if(!obj.hasOwnProperty(key)) continue;
        res[key] = obj[key];
      }
      return res;
    },

    levelUp : function(){   // modify monsters' feature to increase difficulty
      if(TD.wave == 0) return;
      var rate = 1;
      if(TD.wave < 10){
        rate = 1.2;
      }else if(TD.wave >= 10 && TD.wave < 20){
        rate = 1.15;
      }else if(TD.wave >= 20 && TD.wave < 30){
        rate = 1.1;
      }
      else if(TD.wave >= 30 && TD.wave < 40){
        rate = 1.05;
      }
      else{
        rate = 1.025;
      }
      if(TD.wave % 20 == 0){
        rate = 1.5;
        TD.cfg.maxNumberOfMonsterPerWave += 1;
      }
      if(TD.wave % 10 == 0){
        TD.cfg.maxNumberOfMonsterPerWave += 1;
      }
      TD.cfg.monster_1_base_live = parseInt(TD.cfg.monster_1_base_live * rate);
      TD.cfg.monster_2_base_live = parseInt(TD.cfg.monster_2_base_live * rate);
      TD.cfg.monster_3_base_live = parseInt(TD.cfg.monster_3_base_live * rate);
      TD.cfg.monster_4_base_live = parseInt(TD.cfg.monster_4_base_live * rate);

      TD.cfg.monster_1_base_price = parseInt(TD.cfg.monster_1_base_price * rate);
      TD.cfg.monster_2_base_price = parseInt(TD.cfg.monster_2_base_price * rate);
      TD.cfg.monster_3_base_price = parseInt(TD.cfg.monster_3_base_price * rate);
      TD.cfg.monster_4_base_price = parseInt(TD.cfg.monster_4_base_price * rate);
    },

    getBuilding : function ( p, r ){
      var x = p[0], y = p[1], idx, key;
      for(idx=0; idx<TD.buildingQueue.length; idx++){
        if(this.getDistance(TD.buildingQueue[idx].position, p) <= r)
          return TD.buildingQueue[idx];
      }
      for(idx=0; idx<TD.inBuildingQueue.length; idx++){
        if(this.getDistance(TD.inBuildingQueue[idx].position, p) <= r)
          return TD.inBuildingQueue[idx];
      }
      for(key in TD.aliveTerminals){
        if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
        if(this.getDistance(TD.aliveTerminals[key].position, p) <= r)
          return TD.aliveTerminals[key];
      }
      for(key in TD.deadTerminals){
        if(!TD.deadTerminals.hasOwnProperty(key)) continue;
        if(this.getDistance(TD.deadTerminals[key].position, p) <= r)
          return TD.deadTerminals[key];
      }
      return null;
    },

    getSignByCrossProduct : function( v1, v2 ){
      if( (v1[0]*v2[1] - v1[1]*v2[0]) >= 0 ) return 1;
      else return -1;
    },

    getAngle360 : function(e1, e2){
      var v1 = [e1[1][0]-e1[0][0], e1[1][1]-e1[0][1]];
      var v2 = [e2[1][0]-e2[0][0], e2[1][1]-e2[0][1]];

      var sign = this.getSignByCrossProduct(v1, v2);  // careful, it's v1 anti-clockwise to v2

      var productValue = v1[0] * v2[0] + v1[1] * v2[1];
      var v1_dis = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
      var v2_dis = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1]);
      var cosValue = productValue / (v1_dis * v2_dis);

      return Math.acos(cosValue) * sign;
    },

    getAngle : function(e1, e2){
      var ps, p1, p2;
      if(this.pointEq(e1[0], e2[0]) || this.pointEq(e1[0], e2[1])){
        ps = e1[0];
        p1 = e1[1];
        if(this.pointEq(ps, e2[0])) p2 = e2[1];
        else p2 = e2[0];
      }else if(this.pointEq(e1[1], e2[0]) || this.pointEq(e1[1], e2[1])){
        ps = e1[1];
        p1 = e1[0];
        if(this.pointEq(ps, e2[0])) p2 = e2[1];
        else p2 = e2[0];
      }else{
        return null;
      }
      //console.log(ps);
      var v1 = [p1[0]-ps[0], p1[1]-ps[1]];
      var v2 = [p2[0]-ps[0], p2[1]-ps[1]];

      var productValue = v1[0] * v2[0] + v1[1] * v2[1];
      var v1_dis = Math.sqrt(v1[0]*v1[0] + v1[1]*v1[1]);
      var v2_dis = Math.sqrt(v2[0]*v2[0] + v2[1]*v2[1]);
      var cosValue = productValue / (v1_dis * v2_dis);
      return Math.acos(cosValue)/3.1416*180;
    }


  }
});
