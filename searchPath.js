// var terminalNodePool = [];  // global variable, [target-terminal,  terminal1, terminal2, ... ]
// var root   -->  startNode

// this.position = position;  // p = [x, y]
// this.Feature = feature;  // 'T' for terminal, 'J' for junction, 'TA' for target terminal, 'TS' for start terminal
// this.depth = -1;  // use BFS to set depth for each nodes
// this.weight = -1;  // this node and all its sub notes' accumulated weight, used to compute probability
// this.reachable = {};  //{key = T-Node :   value = -1, 0 or 1} where -1:false, 0:indirect true,  1:true
//
// this.triangle = tri;  // the super tishen standing behand this node
// this.parentEdge = [parentEdge];  // the edge in this node/tri that associate with its parent node
//
// this.probabiltiy = [];  // prob = [[0,0.25],[0.25,1]]   random number drops in which slot, choose that direction!
//
// this.parentnode = [parentnode];  // parent node
// this.pathToParent = [];   // [[point, speed], [point, speed], ...]
//
// this.fellow = [];    // fellow node, only direct connected same-layer node can be fellow node
// this.pathToFellow = [];
//
// this.children = []; // a list of object [node1, node2]
// this.pathToChildren = [];  // [  [[point, speed], [point, speed], ...],      [ ... ]  ]
//
// this.toString = function(){return this.position.toString();}  // we can use Node as key in hashtable


// var liveTerminalPool = [];  // [terminalNode1, terminalNode2, ...]  only store terminal that yet been distroyed
// var deadTerminalPool = [];


// terminalNode -->  key of Node.reachable
// curNode  -->  dfs current searching node
// branchNames  -->  name of branch:  parentnode or fellow or children
// value  -->  1 as direct,  0 as indirect
// pool  -->  return all setted nodes during dfs
function dfs4Node( terminalNode, curNode, branchNames, value, pool){
  if(curNode.Feature == 'TS'){  // 'TS' MUST be a Terminal, Must not be any kind of Junction or Linker
    return;
  }
  if(curNode.reachable[terminalNode] == undefined){  // never set a seted value a value
    curNode.reachable[terminalNode] = value;
    pool.push(curNode);
  }

  for(var i=0; i<branchNames.length; i++){
    var list = curNode[branchNames[i]];
    for(var idx=0; idx<list.length; idx++){
      if(list[idx].reachable[terminalNode] == undefined)
        dfs4Node( terminalNode, list[idx], branchNames, value, pool);
    }
  }
  return;
}

// 1  -->  direct reachable
// 0  -->  indirect reachable
// undefined  -->  non-reachable
function setReachableFlag( terminalNodePool ){
  for(var idx=0; idx<terminalNodePool.length; idx++){  // for each terminal node do following:
    var curTerminalNode = terminalNodePool[idx];
    // first do dfs from each terminal node
    // only explore parentnode
    // set all encounter node:  {key = current terminal,   value = 'direct reachable' or 1}
    // 1  -->  direct reachable
    var directNodes = [];
    dfs4Node(curTerminalNode, curTerminalNode, ['parentnode'], 1, directNodes);
    // then for all explored direct reachable nodes
    // do dfs to both parent and fellow branches
    // set all non-setted node:  {key = current terminal,   value = 'indirect reachable' or 0}
    // 0  -->  indirect reachable
    var indirectNodes = [];
    for(var i=0; i<directNodes.length; i++){
      var dirN = directNodes[i];
      dfs4Node(curTerminalNode, dirN, ['parentnode', 'fellow'], 0, []);
    }
  }
}

// start from 'TS' node
// recursively compute weight = [path to children] + [weight of children]
// 'TA' worth 10 point
// 'T' and 'TJ' 5 point
// path to child just count length (# of triangles)
function setWeight( node ){
  if(node.Feature == 'T' || node.Feature == 'TJ'){
    node.weight = 5;
    return node.weight;
  }else if(node.Feature == 'TA'){
    node.weight = 10;
    return node.weight;
  }
  for(var idx=0; idx<node.children.length; idx++){
    node.weight += node.pathToChildren[idx].length + setWeight( node.children[idx] );
  }
  return node.weight;
}

// choose a neighbour node to go based on current situation
// return [nextNode, pathToThatNode]
function strategy( curNode ){
  if(curNode.Feature == 'TS') return [curNode.children[0], curNode.pathToChildren[0]];
  var idx = 0;
  var pool = [];
  if(curNode.fellow.length > 0 && Math.random() > 0.1){
    // choose a fellow
    for(var i=0; i<curNode.fellow.length; i++){
      pool.push(i);
    }
    pool.push('fellow');
    pool.push('pathToFellow');
    pool.unshift(1);
    idx = pickOne( pool, curNode );
    return [curNode.fellow[idx], curNode.pathToFellow[idx]];
  }else{
    if(curNode.children.length>0){
      // choose a children
      for(var i=0; i<curNode.children.length; i++){
        var res = curNode.children[i].worthToVisit();
        if(res == 1){
          if(pool.length==0 || pool[0] != 1) pool = [1, i];
          else pool.push(i);
        }else if(res == 0){
          if(pool.length==0 || pool[0] == -1) pool = [0, i];
          else if(pool[0] == 0) pool.push(i);
        }else{
          if(pool.length==0) pool = [-1, i];
          else if(pool[0] == -1) pool.push(i);
        }
      }
      if(pool[0] == -1){
        pool = [];
      }else{
        pool.push('children');
        pool.push('pathToChildren');
        idx = pickOne( pool, curNode );
        return [curNode.children[idx], curNode.pathToChildren[idx]];
      }
    }
    if(curNode.fellow.length>0){
      // choose a fellow
      for(var i=0; i<curNode.fellow.length; i++){
        var res = curNode.fellow[i].worthToVisit();
        if(res == 1){
          if(pool.length==0 || pool[0] != 1) pool = [1, i];
          else pool.push(i);
        }else if(res == 0){
          if(pool.length==0 || pool[0] == -1) pool = [0, i];
          else if(pool[0] == 0) pool.push(i);
        }else{
          if(pool.length==0) pool = [-1, i];
          else if(pool[0] == -1) pool.push(i);
        }
      }
      if(pool[0] == -1){
        pool = [];
      }else{
        pool.push('fellow');
        pool.push('pathToFellow');
        idx = pickOne( pool, curNode );
        return [curNode.fellow[idx], curNode.pathToFellow[idx]];
      }
    }
    if(curNode.parentnode.length>0){
      // choose a parent
      for(var i=0; i<curNode.parentnode.length; i++){
        var res = curNode.parentnode[i].worthToVisit();
        if(res == 1){
          if(pool.length==0 || pool[0] != 1) pool = [1, i];
          else pool.push(i);
        }else if(res == 0){
          if(pool.length==0 || pool[0] == -1) pool = [0, i];
          else if(pool[0] == 0) pool.push(i);
        }else{
          if(pool.length==0) pool = [-1, i];
          else if(pool[0] == -1) pool.push(i);
        }
      }
      pool.push('parentnode');
      pool.push('pathToParent');
      idx = pickOne( pool, curNode );
      return [curNode.parentnode[idx], curNode.pathToParent[idx]];
    }
    else{
      console.log("No available strategy");
    }
  }
  return null;
}



// pick a random based on weight
// doing well when pool.length < 3
function pickOne( pool, curNode ){
  var pathName = pool.pop(), branchName = pool.pop(), sum = 0, curW = 0, pre = 0;
  pool.shift();
  var idx = pool.shift();
  sum = curNode[branchName][idx].weight + curNode[pathName][idx].length;
  pre = sum;
  for(var i=0; i<pool.length; i++){
    curW = curNode[branchName][pool[i]].weight + curNode[pathName][pool[i]].length;
    sum += curW;
    if(Math.random() < (curW / sum)){
      sum -= pre;
      pre = sum;
      idx = pool[i];
    }else{
      sum -= curW;
    }
  }
  return idx;
}
