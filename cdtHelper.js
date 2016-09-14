var Boundary = {};        // all boundary edges arranged in discover order (outer: anti-clockwise,  inner: clockwise)
var Edge4Tri = {};        // key: edge.toString,   value = [tri1, tri2]
var TriPool = [];         // all unique triangles here, including trimed ones
var terminalTriPool = []; // to trim terminal tri
var startTriangle = null; // should be up leftmost triangle

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
    Boundary[[que[idx+1],que[idx]]] = [que[idx+1],que[idx]];
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
  var limit = 1000;
  while(limit > 0 && Object.keys(hashEdge).length > 0){
    limit--;
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
        if(i == idx) continue;
        var p = leftPointPool[i];
        var inCircleRes = isInCircle(tmpCircleV, p);
        if(inCircleRes==1){  // in circle
          tmpTheOne = null;
          break;
        }else if(inCircleRes==0){  // on circle
          tmpTheOne.push(p);
        }
      }
      if(tmpTheOne != null && (circleV == null || circleV[2] > tmpCircleV[2])){
        theOne = tmpTheOne;
        circleV = tmpCircleV;
      }
    }
    if(theOne.length > 1){
      console.log("==> Same Circle <==");
      console.log(theOne);
      console.log(curEdge);
      resolveCircleProblem(curEdge, theOne, hashEdge, cx)
      continue;
    }
    var Line1start = curEdge[0];
    var Line1end   = theOne[0];
    var Line2start = theOne[0];
    var Line2end   = curEdge[1];
    //'rgb(100, 100, 0)'
    if(hashEdge[[Line1end, Line1start]]!=undefined || hashEdge[[Line1start, Line1end]]!=undefined){
      delete hashEdge[[Line1end, Line1start]];
      delete hashEdge[[Line1start, Line1end]];
      //console.log("delete line!");
      //drawOneSet(cx, [[Line1end, Line1start]], 'rgb(0, 0, 0)');
    }else{
      hashEdge[[Line1start, Line1end]] = [Line1start, Line1end];
      //console.log("insert line!");
      //drawOneSet(cx, [[Line1start, Line1end]]);
    }
    if(hashEdge[[Line2end, Line2start]]!=undefined || hashEdge[[Line2start, Line2end]]!=undefined){
      delete hashEdge[[Line2end, Line2start]];
      delete hashEdge[[Line2start, Line2end]];
      //console.log("delete line!");
      //drawOneSet(cx, [[Line2end, Line2start]], 'rgb(0, 0, 0)');
    }else{
      hashEdge[[Line2start, Line2end]] = [Line2start, Line2end];
      //console.log("insert line!");
      //drawOneSet(cx, [[Line2start, Line2end]]);
    }
    drawOneSet(cx, [curEdge, [Line1start, Line1end], [Line2start, Line2end]], 'rgb(255, 255, 255)');
    processTriangle(curEdge, [Line1start, Line1end], [Line2start, Line2end]);
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
    triangle.processJunction();
  }else if(ct == 1){
    triangle = new Tri(innerEdge, outerEdge, 'L');
    triangle.processLinker();
  }else if(ct == 2){
    triangle = new Tri(innerEdge, outerEdge, 'T');
    triangle.processTerminal();
    if(pointEq(triangle.value['T'], [1,1])){
      startTriangle = triangle;
      console.log("start triangle:")
      console.log(triangle);
    }
    terminalTriPool.push(triangle);
  }else{
    console.log("too many terminal edges!");
  }
  TriPool.push(triangle);
  for(var idx=0; idx<innerEdge.length; idx++){
    var edge = innerEdge[idx]
    if(Edge4Tri[edge]==undefined){
      Edge4Tri[edge] = [];
      Edge4Tri[reverseEdge(edge)] = [];
    }
    Edge4Tri[edge].push(triangle);
    Edge4Tri[reverseEdge(edge)].push(triangle);
  }
  return triangle;
}

function Tri(innerEdge, outerEdge, feature){
  this.Inner = innerEdge;
  this.Outer = outerEdge;
  this.Feature = feature;
  this.isVisited = false;
  this.value = {};
  this.area = computeTriAreaByEdges(innerEdge.concat(outerEdge));
  this.toString = function(){
    return this.Inner + ' ' + this.Outer;  // used when compare two triangles
  }
  // first delete input edge because it eventually turned into a terminal edge
  // remove the input edge from this.Inner array
  // add it to this.Outer
  // modify feature based on current Inner and Outer edge numbers
  // do post work -->
  this.changeFeature = function ( e ){
    for(var idx=0; idx<this.Inner.length; idx++){
      if(edgeEq(e, this.Inner[idx])){
        this.Outer.push(this.Inner[idx]);
        this.Inner.splice(idx,1);
        break;
      }
    }
    if(this.Outer.length == 1){
      this.Feature = 'L';
      this.processLinker();
    }else if(this.Outer.length == 2){
      this.Feature = 'T';
      //do sth about value
      this.processTerminal();
      //don't forget to put this tri into terminalTriPool
    }else{
      console.log("In changeFeature function: too many terminal edges!");
    }
  };

  this.processTerminal = function(){
    this.value = {};
    var tp = null, mid = null;
    if(this.Outer[0][0] == this.Outer[1][0] || this.Outer[0][0] == this.Outer[1][1])
      tp = this.Outer[0][0];
    else tp = this.Outer[0][1];
    this.value['T'] = tp;   //terminal point
    this.value['M'] = getMiddle( this.Inner[0] );  //middle point on Inner edge
    this.value['A'] = getAngle( this.Outer[0], this.Outer[1] );  // get angle of two outer edge
  };

  this.processJunction = function(){
    this.value = {};
    var centre = getGeoCentre(this.Inner);  // to compute geocentre
    var mid1 = getMiddle(this.Inner[0]);
    var mid2 = getMiddle(this.Inner[1]);
    var mid3 = getMiddle(this.Inner[2]);
    // key = inner edge,   value = [geocentre point,  two other inner edge's Middle point and edge itself]
    this.value[this.Inner[0]] = [centre, mid2, this.Inner[1], mid3, this.Inner[2]];
    this.value[reverseEdge(this.Inner[0])] = [centre, mid2, this.Inner[1], mid3, this.Inner[2]];
    this.value[this.Inner[1]] = [centre, mid1, innerEdge[0], mid3, innerEdge[2]];
    this.value[reverseEdge(this.Inner[1])] = [centre, mid1, this.Inner[0], mid3, this.Inner[2]];
    this.value[this.Inner[2]] = [centre, mid1, this.Inner[0], mid2, this.Inner[1]];
    this.value[reverseEdge(this.Inner[2])] = [centre, mid1, this.Inner[0], mid2, this.Inner[1]];
  };

  this.processLinker = function(){
    this.value = {};
    var mid1 = getMiddle(this.Inner[0]);
    var mid2 = getMiddle(this.Inner[1]);
    // key = inner edge,   value = [the other inner edge's Middle point and edge itself]
    this.value[this.Inner[0]] = [mid2, this.Inner[1]];
    this.value[reverseEdge(this.Inner[0])] = [mid2, this.Inner[1]];
    this.value[this.Inner[1]] = [mid1, this.Inner[0]];
    this.value[reverseEdge(this.Inner[1])] = [mid1, this.Inner[0]];
  };

}

//terminalTriPool = [tri1, tri2, tri3...]
//Edge4Tri = {}  --> key: edge.toString, value = [tri1, tri2]
//reverseEdge
function trimRedundantTerminalTriangle(){
  while(terminalTriPool.length > 0){
    var curTri = terminalTriPool.shift();
    if(curTri.value['A'] < 100) continue;
    drawTriangleOutline(cx, curTri);
    var terminalInnerEdge = curTri.Inner[0];
    var edgeRelatedTriPool = Edge4Tri[terminalInnerEdge];
    var relatedTri = null;
    if(edgeRelatedTriPool[0]==curTri){
      relatedTri = edgeRelatedTriPool[1];
      //edgeRelatedTriPool.splice(0,1);   --> no need to pop out this terminal tri, will eventually delete this key!
      //Edge4Tri[reverseEdge(terminalInnerEdge)].splice(0,1);
    }else{
      relatedTri = edgeRelatedTriPool[0];
      //edgeRelatedTriPool.splice(1,1);
      //Edge4Tri[reverseEdge(terminalInnerEdge)].splice(1,1);
    }
    console.log("trim this bad triangle!");
    console.log(curTri);
    relatedTri.changeFeature(terminalInnerEdge);  // now this tri is nolonger it's origin feature!
    if(relatedTri.Feature == 'T'){
      console.log("add new terminal tri");
      console.log(relatedTri);
      terminalTriPool.push(relatedTri);
    }
    delete Edge4Tri[terminalInnerEdge];
    delete Edge4Tri[reverseEdge(terminalInnerEdge)];
  }
}

function resolveCircleProblem(curEdge, theOnes, hashEdge, cx){
  var directEdges = [], circleTri = [];
  for(var idx=0; idx<theOnes.length; idx++){
    directEdges.push([curEdge[0], theOnes[idx], getAngle(curEdge, [curEdge[0], theOnes[idx]])]);
  }
  directEdges.sort(function(a,b){
    return b[2] - a[2];
  });
  directEdges.push([curEdge[0], curEdge[1], 0]);
  for(var idx=0; idx<directEdges.length-1; idx++){
    var e1 = [directEdges[idx][1], curEdge[0]];
    var e2 = [directEdges[idx+1][1], directEdges[idx][1]];
    var e3 = [curEdge[0], directEdges[idx+1][1]];
    var tri = processTriangle(e1, e2, e3);
    console.log("in circle get a tri:");
    console.log(tri);
    for(var i=0; i<tri.Outer.length; i++){
      delete hashEdge[tri.Outer[i]];
      drawOneSet(cx, [tri.Outer[i]] , 'rgb(255, 255, 255)');
    }
    for(var j=0; j<tri.Inner.length; j++){
      var p1 = tri.Inner[j][0];
      var p2 = tri.Inner[j][1];
      if(hashEdge[[p1, p2]]!=undefined || hashEdge[[p2, p1]]!=undefined){
        delete hashEdge[[p1, p2]];
        delete hashEdge[[p2, p1]];
      }else{
        hashEdge[[p1, p2]] = [p1, p2];
      }
      drawOneSet(cx, [[p1, p2]] , 'rgb(0, 0, 255)');
    }
  }
}

// get middle point of an edge
function getMiddle( e ){
  var mx = (e[0][0] + e[1][0]) / 2;
  var my = (e[0][1] + e[1][1]) / 2;
  return [mx, my];
}

function reverseEdge( e ){
  return [e[1],  e[0]];
}

// compute the geo centre from a given triangle's all edges
function getGeoCentre( allEdges ){
  var p = allEdges[0][0];   // choose first inner edge's first point as a terminal point
  var edge = null;
  if(pointEq(allEdges[1][0],p) || pointEq(allEdges[1][1],p)) // get that terminal point's opposit edge
    edge = allEdges[2];
  else edge = allEdges[1];
  var m = getMiddle( edge );
  var res = [(p[0]-m[0])/3 + m[0], (p[1]-m[1])/3 + m[1]];
  return res;
}

//compute the area from a given triangle's all edges
function computeTriAreaByEdges(allEdges){
  var x1 = allEdges[0][0][0];
  var y1 = allEdges[0][0][1];
  var x2 = allEdges[0][1][0];
  var y2 = allEdges[0][1][1];
  var x3 = 0;
  var y3 = 0;
  if(pointEq(allEdges[0][0], allEdges[1][0]) || pointEq(allEdges[0][1], allEdges[1][0])){
    x3 = allEdges[1][1][0];
    y3 = allEdges[1][1][1];
  }else{
    x3 = allEdges[1][0][0];
    y3 = allEdges[1][0][1];
  }
  // cross product: AXB = |A||B|sin0 where |B|sin0 is the height of quadrangle
  return Math.abs((x2-x1)*(y3-y1) - (x3-x1)*(y2-y1)) / 2;
}

function drawOneSet(cx, e , color){
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

function drawTriangleOutline(cx, triangle){
  cx.lineWidth = 2;
  cx.lineCap = 'round';
  cx.strokeStyle = 'rgb(75,0,130)';

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
