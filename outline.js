//dirC = [[1,0],[-1,0],[0,1],[0,-1]]
//dirD = [[-1,-1],[-1,1],[1,-1],[1,1]]
var dirC = [[1,0,6],[-1,0,2],[0,1,4],[0,-1,8]];
var dirD = [[-1,-1,1],[-1,1,3],[1,-1,7],[1,1,5]];
var Dir = [dirC, dirD];

function findPath(table, r, c, outputQueue){  // Dir = [dirC, dirD] or [dirD, dirC]
  var tmpR = 0, tmpC = 0;
  for(var idx=0; idx<Dir.length; idx++){
    dir = Dir[idx];
    for(var d in dir){
      tmpR = dir[d][0]+r;
      tmpC = dir[d][1]+c;
      if(tmpR<0 || tmpR>=table.rows || tmpC<0 || tmpC>=table.columns
        || table[tmpR][tmpC]==0 || table[tmpR][tmpC]==2) continue;
      if(checkCross(table, tmpR, tmpC, dirC)){   //direction 'Cross'
        outputQueue.push([tmpC, tmpR, dir[d][2]]);   // output should mapping to Column -> x, Row -> y
        table[tmpR][tmpC] = 2;
        return findPath(table, tmpR, tmpC, outputQueue);
      }
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

function findInnerLine(table){
  var outputs = [];
  var curQue = [];
  var isOutIsland = false;
  for(var row=1; row<table.rows-1; row++){
    for(var column=1; column<table.columns-1; column++){
      if(table[row][column]==0 && table[row][column+1]==1) {
        isOutIsland=true;
        continue;
      }
      if(isOutIsland && table[row][column]==1 && table[row][column+1]==0) {
        isOutIsland=false;
        continue;
      }
      if(isStartable(table, row, column, curQue)){
        findPath(table, row-1, column+1, curQue);
        outputs.push(curQue);
        curQue = [];
      }
    }
  }
  return outputs;
}

function isStartable(table, r, c, que){
  if(table[r][c] != 1) return false;
  if(table[r][c+1]!=undefined && table[r][c+1]==0){
    if(table[r][c+2]!=undefined && table[r][c+2]!=0){
      table[r][c+1] = 1;
      return false;
    }
    else{
      table[r][c] = 2;       //to change on table, t[row][column]
      table[r-1][c+1] = 2;
      que.push([c,r,3]);      //note, [x,y] --> [column, row]
      que.push([c+1,r-1,3]);
      return true;
    }
  }
  return false;
}

// fp = [1,1] for outline
function parseQue( que ){
  var firstP = que[0], lastP = que[0], curP = null;
  if(que.length < 2) return null;
  var res = [];
  res.push([firstP[0], firstP[1]]);
  var ctSame = 0, ctDif = 0;
  for(var idx=0; idx<que.length; idx++){
    curP = que[idx];
    if(curP[2] == firstP[2]){
      ctSame = ctSame + 1;
      if(ctSame > 20){
        res.push([lastP[0], lastP[1]]);
        firstP = curP;
        lastP = curP;
        ctSame = 0;
        ctDif = 0;
      }else{
        lastP = curP;
      }
    }
    else{
      ctDif = ctDif + 1;
      lastP = curP;
      if((ctSame + ctDif) > 15){
        res.push([lastP[0], lastP[1]]);
        firstP = curP;
        lastP = curP;
        ctSame = 0;
        ctDif = 0;
      }
      else if(ctDif > 7){
        res.push([lastP[0], lastP[1]]);
        firstP = curP;
        lastP = curP;
        ctSame = 0;
        ctDif = 0;
      }
    }
  }
  res.push([que[0][0], que[0][1]]);
  return res;
}

function drawOutline(cx, que){
  cx.lineWidth = 2;
  cx.lineCap = 'round';
  cx.strokeStyle = 'rgb(255, 0, 0)';

  var fg = true;
  var oldx=0, oldy=0;
  var point = [];

  for(var idx=0; idx<que.length; idx++){
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
}
