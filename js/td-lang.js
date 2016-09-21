
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
      cx.lineWidth = 2;
      cx.lineCap = 'round';
      cx.strokeStyle = 'rgb(255, 0, 0)';

      var fg = true;
      var oldx=0, oldy=0, idx;
      var point = [];

      for(idx=0; idx<que.length; idx++){
        point = que[idx];
        if (oldx == 0 && oldy == 0) {
          oldx = point[0];
          oldy = point[1];
          continue;
        }
        else{
          if(fg){
            fg = !fg;
            cx.beginPath();
            cx.strokeStyle = 'rgb(0, 255, 0)';
            cx.moveTo(oldx, oldy);
            cx.lineTo(point[0], point[1]);
            cx.stroke();
          }else{
            fg = !fg;
            cx.beginPath();
            cx.strokeStyle = 'rgb(255, 0, 0)';
            cx.moveTo(oldx, oldy);
            cx.lineTo(point[0], point[1]);
            cx.stroke();
          }
        }
        oldx = point[0];
        oldy = point[1];
      }
      //cx.closePath();
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

    getCannon : function(s, e, l){
      var dis = this.getDistance(s, e);
      var x = (e[0]-s[0])/dis;
      var y = (e[1]-s[1])/dis;
      return [[x*3 + s[0], y*3 + s[1]], [x*(3+l) + s[0], y*(3+l) + s[1]]];
    },

    ableToBuild : function( p, r ){
      var x = p[0], y = p[1], idx;
      if(TD.mapData == null) return false;
      if(TD.mapData[x+r][y] != 0) return false;
      if(TD.mapData[x-r][y] != 0) return false;
      if(TD.mapData[x][y+r] != 0) return false;
      if(TD.mapData[x][y-r] != 0) return false;
      for(idx=0; idx<TD.buildingQueue.length; idx++){
        if(this.getDistance(TD.buildingQueue[idx].position, p) <= r)
          return false;
      }
      return true;
    }

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
