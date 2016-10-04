
_TD.loading.push(function(TD){

  // new this entity before using it
  // choose a neighbour node to go based on current situation
  // return [nextNode, pathToThatNode]
  TD.strategy = function( curNode ){
    if(curNode.Feature == 'TS') return [curNode.children[0], curNode.pathToChildren[0]];
    var idx = 0;
    var pool = [];

    // pick a random based on weight
    // doing well when pool.length < 3
    var pickOne = function( pool, curNode ){
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
    };

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
  };



});
