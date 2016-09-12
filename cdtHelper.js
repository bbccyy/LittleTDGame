var Boundary = {};
var Edge4Tri = {};
var TriPool = [];

function getCentrePoint(x1, x2, x3){
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
}

// res > 0 --> left
// res < 0 --> right
function isOnLeft(e, r) {
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
}

function isInCircle(circleV, p){
  var dis = Math.sqrt((p[0]-circleV[0])*(p[0]-circleV[0]) + (p[1]-circleV[1])*(p[1]-circleV[1]));
  dis = Number(dis.toFixed(5));
  var r = Number(circleV[2].toFixed(5));
  if(dis < r) return 1;
  else if(dis == r) return 0;
  else return -1;
}

function buildEdgeMap( hash, que ){
  for(var idx=0; idx<que.length-1; idx++){
    hash[[que[idx],que[idx+1]]] = [que[idx],que[idx+1]];
    Boundary[[que[idx],que[idx+1]]] = [que[idx],que[idx+1]];
  }
}

function cdt(outLine, innerLines, cx){
  var hashEdge = {};
  var pointPool = [];
  pointPool = pointPool.concat(outLine.slice(0,outLine.length-1));
  buildEdgeMap(hashEdge, outLine);
  for(var idx=0; idx<innerLines.length; idx++){
    buildEdgeMap(hashEdge, innerLines[idx]);
    pointPool = pointPool.concat(innerLines[idx].slice(0,innerLines[idx].length-1));
  }
  var limit = 500;
  while(limit > 0 && Object.keys(hashEdge).length > 0){
    limit--;
    console.log(Object.keys(hashEdge).length);
    var key = Object.keys(hashEdge)[0];
    var curEdge = hashEdge[key];
    delete hashEdge[key];
    var theOne = [], circleV = null, leftPointPool = [];
    for(var idx=0; idx<pointPool.length; idx++){
      var point = pointPool[idx];
      if(isOnLeft(curEdge, point))
        leftPointPool.push(point);
    }
    for(var idx=0; idx<leftPointPool.length; idx++){
      var pt = leftPointPool[idx];
      var tmpTheOne = [pt];
      var tmpCircleV = getCentrePoint(curEdge[0], curEdge[1], pt);
      for(var i=0; i<leftPointPool.length; i++){
        var p = leftPointPool[i];
        if(p == pt) continue;
        //console.log(isInCircle(tmpCircleV, p));
        //console.log(isInCircle(tmpCircleV, p)==1);
        if(isInCircle(tmpCircleV, p)==1){  // in circle
          tmpTheOne = null;
          //console.log(curEdge + " & " + pt + " contains point " + p);
          //console.log(tmpCircleV);
          //console.log(isInCircle(tmpCircleV, p));
          break;
        }else if(isInCircle(tmpCircleV, p)==0){  // on circle
          tmpTheOne.push(point);
          console.log("==> Same Circle <==");
        }
      }
      if(tmpTheOne != null && (circleV == null || circleV[2] > tmpCircleV[2])){
        theOne = tmpTheOne;
        circleV = tmpCircleV;
      }
    }
    console.log(hashEdge);

    console.log(curEdge);
    console.log(theOne);
    var Line1start = curEdge[0];
    var Line1end   = theOne[0];
    var Line2start = theOne[0];
    var Line2end   = curEdge[1];
    //'rgb(100, 100, 0)'
    if(hashEdge[[Line1end, Line1start]]!=undefined){
      delete hashEdge[[Line1end, Line1start]];
      //delete hashEdge[[Line1start, Line1end]];
      console.log("delete line!");
      //drawOneSet(cx, [[Line1end, Line1start]], 'rgb(0, 0, 0)');
    }else{
      hashEdge[[Line1start, Line1end]] = [Line1start, Line1end];
      console.log("insert line!");
      //drawOneSet(cx, [[Line1start, Line1end]]);
    }
    if(hashEdge[[Line2end, Line2start]]!=undefined){
      delete hashEdge[[Line2end, Line2start]];
      //delete hashEdge[[Line2start, Line2end]];
      console.log("delete line!");
      //drawOneSet(cx, [[Line2end, Line2start]], 'rgb(0, 0, 0)');
    }else{
      hashEdge[[Line2start, Line2end]] = [Line2start, Line2end];
      console.log("insert line!");
      //drawOneSet(cx, [[Line2start, Line2end]]);
    }
    drawOneSet(cx, [curEdge, [Line1start, Line1end], [Line2start, Line2end]]);
    //processTriangle(curEdge, [Line1start, Line1end], [Line2start, Line2end]);
  }

}

// Boundary = {}
// Edge4Tri = {}
function processTriangle(e1, e2, e3){
  var ct = 0;
  var outerEdge = [], innerEdge = [];
  var triangle = null;
  if(Boundary[e1]!=undefined){
    ct++;
    outerEdge.push(e1);
  }else{
    innerEdge.push(e1);
  }
  if(Boundary[e2]!=undefined){
    ct++;
    outerEdge.push(e2);
  }else{
    innerEdge.push(e2);
  }
  if(Boundary[e3]!=undefined){
    ct++;
    outerEdge.push(e3);
  }else{
    innerEdge.push(e3);
  }
  if(ct == 0){
    triangle = new Tri(innerEdge, outerEdge, 'J');
  }else if(ct == 1){
    triangle = new Tri(innerEdge, outerEdge, 'L');
  }else if(ct == 2){
    triangle = new Tri(innerEdge, outerEdge, 'T');
  }else{
    console.log("too many terminal edges!");
  }
  TriPool.push(triangle);
  for(var idx=0; idx<innerEdge.length; idx++){
    var edge = innerEdge[idx]
    Edge4Tri[edge] = triangle;
    edge = reverseEdge(edge);
    Edge4Tri[edge] = triangle;
  }
}

function Tri(innerEdge, outerEdge, feature){
  this.Inner = innerEdge;
  this.Outer = outerEdge;
  this.Feature = feature;
  this.isVisited = false;
  this.value = {};
  if(feature == 'T'){  // 'T' for terminal
    var tp = null, mid = null;
    if(outerEdge[0][0] == outerEdge[1][0] || outerEdge[0][0] == outerEdge[1][1])
      tp = outerEdge[0][0];
    else tp = outerEdge[0][1];
    this.value['T'] = tp;
    this.value['M'] = [getMiddle( innerEdge[0] ), innerEdge[0]];
  }else if(feature == 'J'){ // 'J' for junction
    var tp = innerEdge[0][0];
    var edge = null;
    if(innerEdge[1][0]==tp || innerEdge[1][1] ==tp)
      edge = innerEdge[2];
    else edge = innerEdge[1];
    var centre = getGeoCentre(tp, edge);
    var mid1 = getMiddle(innerEdge[0]);
    var mid2 = getMiddle(innerEdge[1]);
    var mid3 = getMiddle(innerEdge[2]);
    this.value[innerEdge[0]] = [centre, mid2, innerEdge[1], mid3, innerEdge[2]];
    this.value[reverseEdge(innerEdge[0])] = [centre, mid2, innerEdge[1], mid3, innerEdge[2]];
    this.value[innerEdge[1]] = [centre, mid1, innerEdge[0], mid3, innerEdge[2]];
    this.value[reverseEdge(innerEdge[1])] = [centre, mid1, innerEdge[0], mid3, innerEdge[2]];
    this.value[innerEdge[2]] = [centre, mid1, innerEdge[0], mid2, innerEdge[1]];
    this.value[reverseEdge(innerEdge[2])] = [centre, mid1, innerEdge[0], mid2, innerEdge[1]];
  }else{ // 'L' for link
    var mid1 = getMiddle(innerEdge[0]);
    var mid2 = getMiddle(innerEdge[1]);
    this.value[innerEdge[0]] = [mid2, innerEdge[1]];
    this.value[reverseEdge(innerEdge[0])] = [mid2, innerEdge[1]];
    this.value[innerEdge[1]] = [mid1, innerEdge[0]];
    this.value[reverseEdge(innerEdge[1])] = [mid1, innerEdge[0]];
  }
}

function getMiddle( e ){
  var mx = (e[0][0] + e[1][0]) / 2;
  var my = (e[0][1] + e[1][1]) / 2;
  return [mx, my];
}

function reverseEdge( e ){
  return [e[1],  e[0]];
}

function getGeoCentre( p, e ){
  var m = getMiddle( e );
  var res = [(p[0]-m[0])/3 + m[0], (p[1]-m[1])/3 + m[1]];
  return res;
}

function drawOneSet(cx, e , color='rgb(0, 0, 255)'){
  cx.lineWidth = 1;
  cx.lineCap = 'round';
  cx.strokeStyle = color;
  for(var idx=0; idx<e.length; idx++){
    cx.beginPath();
    cx.moveTo(e[idx][0][0], e[idx][0][1]);
    cx.lineTo(e[idx][1][0], e[idx][1][1]);
    cx.stroke();
  }
}

function drawTriangleOutline(cx){
  cx.lineWidth = 1;
  cx.lineCap = 'round';
  cx.strokeStyle = 'rgb(0, 0, 255)';

  for(var idx=0; idx<TriPool.length; idx++){
    triangle = TriPool[idx];
    for(var i=0; i<triangle.Inner.length; i++){
      var edge = triangle.Inner[i];
      cx.beginPath();
      cx.moveTo(edge[0][0], edge[0][1]);
      cx.lineTo(edge[1][0], edge[1][1]);
      cx.stroke();
    }
    for(var j=0; j<triangle.Outer.length; j++){
      var edge = triangle.Outer[j];
      cx.beginPath();
      cx.moveTo(edge[0][0], edge[0][1]);
      cx.lineTo(edge[1][0], edge[1][1]);
      cx.stroke();
    }
  }
}
