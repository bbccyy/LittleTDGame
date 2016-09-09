//dirC = [[1,0],[-1,0],[0,1],[0,-1]]
//dirD = [[-1,-1],[-1,1],[1,-1],[1,1]]
function findPath(table, r, c, Dir, dirC, outputQueue){  // Dir = [dirC, dirD] or [dirD, dirC]
  dir1 = Dir[0];
  var tmpR = 0, tmpC = 0;
  for(var d in dir1){
    tmpR = dir1[d][0]+r;
    tmpC = dir1[d][1]+c;
    if(r<0 || r>=table.rows || c<0 || c>=table.columns
      || table[tmpR][tmpC]==0 || table[tmpR][tmpC]==2) continue;
    if(checkCross(table, tmpR, tmpC, dirC)){   //direction 'Cross'
      outputQueue.push([tmpC, tmpR, dir1[d][2]]);   // output should mapping to Column -> x, Row -> y
      table[tmpR][tmpC] = 2;
      return findPath(table, tmpR, tmpC, Dir, dirC, outputQueue);
    }
  }
  dir2 = Dir[1];
  for(var d in dir2){
    tmpR = dir2[d][0]+r;
    tmpC = dir2[d][1]+c;
    if(r<0 || r>=table.rows || c<0 || c>=table.columns
      || table[tmpR][tmpC]==0 || table[tmpR][tmpC]==2) continue;
    if(checkCross(table, tmpR, tmpC, dirC)){
      outputQueue.push([tmpC, tmpR, dir2[d][2]]);
      table[tmpR][tmpC] = 2;
      Dir[0] = dir2;
      Dir[1] = dir1;
      return findPath(table, tmpR, tmpC, Dir, dirC, outputQueue);
    }
  }
  return null;
}

function checkCross(table, r, c, dir){
  for(d in dir){
    var tmpR = dir[d][0]+r;
    var tmpC = dir[d][1]+c;
    if(r<0 || r>=table.rows || c<0 || c>=table.columns) continue;
    if(table[tmpR][tmpC]==0) return true;
  }
  return false;
}

// fp = [1,1] for outline
function parseQue( que , fp ){
  var firstP = fp, lastP = fp, curP = null;
  if(que.length < 2) return null;
  firstP[2] = que[0][2];
  var res = [];
  res.push([firstP[0], firstP[1]]);
  for(var idx=0; idx<que.length; idx++){
    curP = que[idx];
    if(curP[2] == firstP[2]){
      lastP = curP;
    }else{
      res.push([lastP[0], lastP[1]]);
      firstP = curP;
      lastP = curP;
    }
  }
  res.push(fp);
  return res;
}

function drawOutline(cx, que){
  cx.lineWidth = 2;
  cx.lineCap = 'round';
  cx.strokeStyle = 'rgb(255, 0, 0)';

  var ct = 0, oldx=0, oldy=0;
  var point = [];
  cx.beginPath();

  for(var idx=0; idx<que.length; idx++){
    point = que[idx];
    if (oldx == 0 && oldy == 0) {
      cx.moveTo(point[0], point[1]);
    }
    else{
      if(ct % 2 == 0){
        cx.strokeStyle = 'rgb(0, 255, 0)';
      }else{
        cx.strokeStyle = 'rgb(255, 0, 0)';
      }
      cx.lineTo(point[0], point[1]);
    }
    oldx = point[0];
    oldy = point[1];
    ct = ct + 1;
    cx.stroke();
  }
  cx.closePath();
}
