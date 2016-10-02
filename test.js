
var canvas, ctx, monsterFrames = [], curFrame = 0;
var assets = [
              'img/robowalk00.png',
              'img/robowalk01.png',
              'img/robowalk02.png',
              'img/robowalk03.png',
              'img/robowalk04.png',
              'img/robowalk05.png',
              'img/robowalk06.png',
              'img/robowalk07.png',
              'img/robowalk08.png',
              'img/robowalk09.png',
              'img/robowalk10.png',
              'img/robowalk11.png',
              'img/robowalk12.png',
              'img/robowalk13.png',
              'img/robowalk14.png',
              'img/robowalk15.png',
              'img/robowalk16.png',
              'img/robowalk17.png',
              'img/robowalk18.png'
              ];
var z1 = frameNameGenerator('01');
var list;
setup = function(){

  var body = document.getElementById('canvas-holder');
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = 1200;
  canvas.height = 720;

  body.appendChild(canvas);

  var zombieSheet = new SpriteSheetClass('monster-1');
  zombieSheet.load('zombie.png');
  zombieSheet.parseAtlasDefinition(zombieJSON);
  list = z1[1];

  //drawSprite('monster-1', list[curFrame], 100, 100);
  setInterval(function(){animate('monster-1', list, 100, 100);}, 70);

}

onImageLoad = function(){
  console.log('Image!');
}

var animate = function(type, nameList, posX, posY){
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawSprite(type, nameList[curFrame], posX, posY);
  curFrame++;
  curFrame %= nameList.length;
}

// get 4 direction name list for sprite display
function frameNameGenerator(name){  // 01, 02 ... 12
  var num = parseInt(name);
  if(num == 'NaN') return null;
  var postFix = [num<10?'0'+num:num, num+1<10?'0'+(num+1):num+1,num+2<10?'0'+(num+2):num+2];
  var res = {}, tmpList, idx, i;
  for(idx=1; idx<5; idx++){
    tmpList=[];
    for(i=0; i<3; i++){
      tmpList.push('0'+idx+'_'+postFix[i]+'.png');
      tmpList.push('0'+idx+'_'+postFix[i]+'.png');
      tmpList.push('0'+idx+'_'+postFix[i]+'.png');
    }
    tmpList.push('0'+idx+'_'+postFix[1]+'.png');
    tmpList.push('0'+idx+'_'+postFix[1]+'.png');
    tmpList.push('0'+idx+'_'+postFix[1]+'.png');
    res[idx] = tmpList;
  }
  return res;
}

var gSpriteSheets = {};  // used to store SpriteSheetClass entities

SpriteSheetClass = function(type){
  this.type = type;  // identifier

  this.img = null;

  this.url = "";

  this.sprites = []; // An array of all the sprites in our atlas.

  // Load the atlas at the path 'imgName' into memory.
  this.load = function(imgName){
    this.url = imgName;
    var img = new Image();
    img.src = imgName;
    this.img = img;
    gSpriteSheets[this.type] = this;
  };

  this.defSprite = function(name, x, y, w, h, cx, cy){
    // define a single sprite in atlas
    var spt = {
      'id' : name,
      'x'  : x,
      'y'  : y,
      'w'  : w,
      'h'  : h,
      'cx' : cx == null ? 0 : cx,
      'cy' : cy == null ? 0 : cy
    };

    this.sprites.push(spt);
  };

  // input the JSON file location
  // parse raw JSON and store them as spt object in sprites array
  this.parseAtlasDefinition = function(atlasJSON){
    //var parsed = JSON.parse(atlasJSON);
    var parsed = atlasJSON;
    var spriteList = parsed['frames'];
    for(var name in spriteList){
      var body = spriteList[name];
      var cx   = -0.5 * body.frame.w;
      var cy   = -0.5 * body.frame.h;
      this.defSprite(name, body.frame.x, body.frame.y, body.frame.w,
        body.frame.h, cx, cy);
    }
  };

  this.getStats = function(name){
    for(var idx=0; idx < this.sprites.length; idx++){
      if(this.sprites[idx].id == name){
        return this.sprites[idx];
      }
    }
    return null;
  };

  this.toString = function(){
    return this.type;  // monster-1 or monster-2 or ...
  }

};

function drawSprite(type, spritename, posX, posY){
  var spriteSheet = gSpriteSheets[type];
  if(spriteSheet == null) return false;
  var spt = spriteSheet.getStats(spritename);
  if(spt == null) return false;
  var hlf = {
    x : spt.cx,
    y : spt.cy
  };
  // posX+hlf.x, posY+hlf.y  --> make sure we actually put the image centre at the point we want
  ctx.drawImage(spriteSheet.img, spt.x, spt.y, spt.w, spt.h, posX+hlf.x, posY+hlf.y, spt.w, spt.h);
}
