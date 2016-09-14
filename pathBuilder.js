//var Boundary = {};
//var Edge4Tri = {};
//var TriPool = [];

function buildPath(startTri, Edge4Tri){

}

function pointEq(p1, p2){
  return p1[0]==p2[0] && p1[1] == p2[1];
}

function edgeEq(e1, e2){
  return (pointEq(e1[0], e2[0]) && pointEq(e1[1], e2[1])) ||
          (pointEq(e1[0], e2[1]) && pointEq(e1[1], e2[0]));
}

function getAngle(e1, e2){
  var ps, p1, p2;
  // console.log(e1);
  // console.log(e2);
  // console.log(e1[0] == e2[0]);
  if(pointEq(e1[0], e2[0]) || pointEq(e1[0], e2[1])){
    ps = e1[0];
    p1 = e1[1];
    if(pointEq(ps, e2[0])) p2 = e2[1];
    else p2 = e2[0];
  }else if(pointEq(e1[1], e2[0]) || pointEq(e1[1], e2[1])){
    ps = e1[1];
    p1 = e1[0];
    if(pointEq(ps, e2[0])) p2 = e2[1];
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

function Node(x, y, val){
  this.posX = x;
  this.posY = y;
  this.value = val;
  this.children = [];
}
