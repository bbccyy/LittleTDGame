// var Boundary = {};        // all boundary edges arranged in discover order (outer: anti-clockwise,  inner: clockwise)
// var Edge4Tri = {};        // key: edge.toString,   value = [tri1, tri2]
// var TriPool = [];         // all unique triangles here, including trimed ones
// var terminalTriPool = []; // to trim terminal tri
// var startTriangle = null; // should be up leftmost triangle

// Tri --> all field data
// this.Inner = innerEdge;
// this.Outer = outerEdge;
// this.Feature = feature;
// this.isVisited = false;
// this.value = {};
// this.area = computeTriAreaByEdges(innerEdge.concat(outerEdge));

// J
// key = inner edge,   value = [geocentre point,  two other inner edge's Middle point and edge itself]
// this.value[this.Inner[0]] = [centre, mid2, this.Inner[1], mid3, this.Inner[2]];
// this.value[reverseEdge(this.Inner[0])] = [centre, mid2, this.Inner[1], mid3, this.Inner[2]];
// T
// this.value['T'] = tp;   //terminal point
// this.value['M'] = getMiddle( this.Inner[0] );  //middle point on Inner edge
// this.value['A'] = getAngle( this.Outer[0], this.Outer[1] );  // get angle of two outer edge
// L
// key = inner edge,   value = [the other inner edge's Middle point and edge itself]
// this.value[this.Inner[0]] = [mid2, this.Inner[1]];
// this.value[reverseEdge(this.Inner[0])] = [mid2, this.Inner[1]];
// this.value[this.Inner[1]] = [mid1, this.Inner[0]];
// this.value[reverseEdge(this.Inner[1])] = [mid1, this.Inner[0]];

function buildPath( Edge4Tri ){
  if(startTriangle == null){
    console.log("failed to find start Triangle");
    return;
  }
  var queue = [], depth = 0, size = 0, curNode = null, edges = null;
  var startNode = new Node(startTriangle.position, startTriangle, null, null, 'TS');
  queue.push(startNode);
  while(queue.length > 0){
    size = queue.length;
    var tmpHashTable = {}; //eliminate creating duplicate node for the same junction triangle
    while(size > 0){
      size--;
      curNode = queue.shift();
      curNode.depth = depth;
      if(curNode.Feature == 'TS'){
        edges = [curNode.triangle.Inner[0]];  //'T' node only has one available edge
      }else if(curNode.Feature == 'J' && curNode.parentEdge.length == 1){
        var jVal = curNode.triangle.value[curNode.parentEdge];
        edges = [jVal[2], jVal[4]];
      }else if(curNode.Feature == 'J' && curNode.parentEdge.length > 1){
        //a node with two parents
        for(var i=0; i<curNode.triangle.Inner.length; i++){
          if(!(curNode.triangle.Inner[i] in curNode.parentEdge)){
            edges = [curNode.triangle.Inner[i]];
            break;
          }
        }
      }else{
        console.log("Function<buildPath>: do not push 'T' feature node into queue");
      }

      for(var idx=0; idx<edges.length; idx++){   // 1 or 2 times
        var res = singlePath( curNode.triangle , edges[idx] );  // res = [path, tri, tri-edge]
        var path = res[0];
        var childTri = res[1];
        var childTriEdge = res[2];

        if(childTri == curNode.triangle){
          // if a J node find a single path to itself, then this J node should be treated as a Terminal node
          // in the above case, set Feature to 'TJ'
          curNode.Feature = 'TJ';
          curNode.children.push(curNode);
          curNode.children.push(curNode);
          curNode.pathToChildren.push(path);
          curNode.pathToChildren.push(copyReversePath(path));
          // targetReachable = false;
          break;  // break for loop to inner while loop
        }else if(childTri.Feature == 'T'){
          // a terminal node will not have two parents
          var childNode = Node( childTri.position , childTri, curNode, childTriEdge, 'T' );
          curNode.children.push(childNode);
          curNode.pathToChildren.push(path);
          childNode.pathToParent.push(copyReversePath(path));  //mutually connect to each other
          childTri.isVisited = true;
          childNode.depth = depth+1;
        }else{  // must be 'J'
          if(tmpHashTable[childTri] != undefined){
            // find a tri/node that discovered in current layer/while loop
            // previously discovered node, so neight create a same one, nor push it into the queue
            // a node can has two parents
            // a node can has two same or different parents
            var childNode = tmpHashTable[childTri];
            curNode.children.push(childNode);
            curNode.pathToChildren.push(path);
            childNode.pathToParent.push(copyReversePath(path));
            childNode.parentnode.push(curNode);
            childNode.parentEdge.push(childTriEdge);
          }else if(childTri.isVisited){
            // also already be discovered, but must not be discovered in this layer
            // so this one is a node on the same layer
            // two node on the same level will see each other, therefore no need to add to queue
            // also no need to add each other to parent
            // beside, it's possible a J node has two on-same-layer child nodes
            var sameLayerNode = tmpHashTable[childTri];
            if( sameLayerNode == undefined ){
              tmpHashTable[curNode.triangle] = curNode;
              continue;
            }
            curNode.children.push(sameLayerNode);
            curNode.pathToChildren.push(path);
            sameLayerNode.children.push(curNode);
            sameLayerNode.pathToChildren.push(copyReversePath(path));
          }else{
            // normal case, need to push to queue
            // parent could be TS could be J
            // childTri is unvisited
            // childTri is not a terminal
            // childTri is not a terminal Junction
            // so childTri must be junction
            var childNode = Node( childTri.position , childTri, curNode, childTriEdge, 'J' );
            curNode.children.push(childNode);
            curNode.pathToChildren.push(path);
            childNode.pathToParent.push(copyReversePath(path));  //mutually connect to each other
            childTri.isVisited = true;
            queue.push(childNode);
            tmpHashTable[childTri] = childNode;
          }
        }
      }  // end of for loop:  explore a node's branch
    } // end of inner while loop:  node on the same layer
    depth++;
  } // enf of outer while loop: all nodes should be discovered
  return startNode;
}

// weight + children.length --> probability  --> children[idx] & pathToChildren[idx]
function Node( position , tri, parentnode, parentEdge, feature ){
  this.position = position;  // p = [x, y]
  this.triangle = tri;  // the super tishen standing behand this node
  this.toString = function(){return this.position.toString();}  // we can use Node as key in hashtable
  this.weight = -1;  // this node and all its sub notes' accumulated weight, used to compute probability
  this.probabiltiy = [];  // prob = [[0,0.25],[0.25,1]]   random number drops in which slot, choose that direction!

  this.parentnode = [parentnode];  // parent node
  this.pathToParent = [];   // [[point, speed], [point, speed], ...]
  this.parentEdge = [parentEdge];  // the edge in this node/tri that associate with its parent node
  this.children = []; // a list of object [node1, node2]
  this.pathToChildren = [];  // [  [[point, speed], [point, speed], ...],      [ ... ]  ]

  this.targetReachable = false;  // indicate this node or any node in its subtree is a target terminal
  this.terminalReachable = {};  // {key = T-Node :   value = true or false}
  this.Feature = feature;  // 'T' for terminal, 'J' for junction, 'TA' for target terminal, 'TS' for start terminal
  this.depth = -1;  // use BFS to set depth for each nodes

}


// get the entile single path from node to node
function singlePath( tri , e ){
  var path = [], cur = [];
  if(tri.Feature=='T' || tri.Feature=='J'){
    cur = [tri.position, speedMapping(tri.area)];
  }else{
    console.log("can not create single path starting from linker triangle");
    return null;
  }
  path.push(cur);
  do{
    tri = Edge4Tri[e][0]==tri ? Edge4Tri[e][1] : Edge4Tri[e][0];
    cur = [getMiddle(e), speedMapping(tri.area)];
    path.push(cur);
    if(tri.Feature=='T' || tri.Feature=='J'){
      cur = [tri.position, speedMapping(tri.area)];
      path.push(cur);
    }else{
      e = tri.value[e][1];
    }
  }while(tri.Feature == 'L');
  return [path, tri, e];
}

function copyReversePath( path ){
  var res = [];
  for(var idx=path.length-1; idx>=0; idx--){
    res.push(path[idx]);
  }
  return res;
}

// mapping area to speed discount
function speedMapping( area ){
  if(area <= 350) return 1;
  else if(area <= 700) return 0.9;
  else return 0.5;
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
