
_TD.loading.push(function(TD){

  TD.spriteSheetHandler = function(){

    this.init = function( cfg ){  // monster-1, 2, 3 ...; source-->zombie.png
      if(cfg.type == 'monster'){
        var tmp = TD.monsterTypes, idx;
        for(idx=0; idx<tmp.length; idx++){
          var zombieSheet = new this.SpriteSheetClass( tmp[idx] );
          zombieSheet.load(TD.monsterSpriteSource);
          zombieSheet.parseAtlasDefinition(zombieJSON);
          TD.monsterFrame[tmp[idx]] = this.monsterNameGenerator(idx*3+1);
        }
      }else if(cfg.type == 'explode'){
        var explodeSheet = new this.SpriteSheetClass( 'explode' );
        explodeSheet.load(TD.explodeSpriteSource);
        explodeSheet.parseAtlasDefinition(explodeJSON);
        var tmp = TD.bulletTypes, idx;
        for(idx=0; idx<tmp.length; idx++){
          TD.explodeFrame[tmp[idx]] = this.explodeNameGenerator(tmp[idx]);
        }
      }else if(cfg.type == 'scene'){
        var sceneSheet = new this.SpriteSheetClass( 'scene' );
        sceneSheet.load(TD.sceneSpriteSource);
        sceneSheet.parseAtlasDefinition(sceneJSON);
        TD.sceneFrame['grass'] = this.sceneNameGenerator('grass', 14);
        TD.sceneFrame['ground'] = this.sceneNameGenerator('ground', 2);
        TD.sceneFrame['tower'] = this.sceneNameGenerator('tower', 3);
        sceneSheet.img.onload = function(){
          console.log('IMAGEs!!!');
        };
      }else if(cfg.type == 'turret'){
        var turretSheet = new this.SpriteSheetClass( 'turret' );
        turretSheet.load(TD.turretSpriteSource);
        turretSheet.parseAtlasDefinition(turretJSON);
        TD.turretFrame['building-1'] = ['turret_01_1.png','turret_01_1.png','turret_01_1.png',
                                        'turret_01_2.png','turret_01_2.png','turret_01_2.png',
                                        'turret_01_3.png','turret_01_3.png','turret_01_3.png'];
        TD.turretFrame['building-2'] = ['turret_02.png'];
        TD.turretFrame['building-3'] = ['turret_03.png'];
        TD.turretFrame['building-4'] = ['turret_04.png'];
        TD.turretFrame['building-6'] = ['turret_06.png'];
      }
    };

    // get 4 direction name list for sprite display
    this.monsterNameGenerator = function(name){  // 01, 02 ... 12
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
    };

    this.sceneNameGenerator = function(name, num){
      var res = [];
      for(var idx=1; idx<=num; idx++){
        res.push(name+'_'+ (idx<10?('0'+idx):idx) + '.png');
      }
      return res;
    };

    this.explodeNameGenerator = function(name){
      if(name == 'bullet_small'){
        return ['01_01.png','01_02.png','01_03.png','01_04.png','01_05.png'];
      }else if(name == 'bullet_middle'){
        return ['02_01.png','02_02.png','02_03.png','02_04.png',
        '02_05.png','02_06.png','02_07.png','02_08.png','02_09.png',
        '02_10.png','02_11.png'];
      }else if(name == 'bullet_large'){
        return  ['03_01.png','03_02.png','03_03.png','03_04.png',
        '03_05.png','03_06.png','03_07.png','03_08.png','03_9.png',
        '03_10.png','03_11.png','03_12.png','03_13.png'];
      }else if(name == 'bullet_missile'){
        return ['06_01.png','06_02.png','06_03.png','06_04.png','06_05.png',
        '06_06.png','06_07.png','06_08.png'];
      }else{
        return null;
      }
    };

    this.SpriteSheetClass = function(type){  // input monster type: eg monster-1
      this.type = type;  // identifier

      this.img = null;

      this.url = "";

      this.sprites = []; // An array of all the sprites in our atlas.

      this.dirList = null; // a list of list of names like: 01_02.png

      // Load the atlas at the path 'imgName' into memory.
      this.load = function(imgName){
        this.url = imgName;
        var img = new Image();
        img.src = imgName;
        this.img = img;
        TD.gSpriteSheets[type] = this;
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
          if(body.trimmed == true){
            var sourceSize = body.sourceSize, spriteSourceSize = body.spriteSourceSize;
            cx = spriteSourceSize.x - (sourceSize.w*0.5);
            cy = spriteSourceSize.y - (sourceSize.h*0.5);
          }
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

  };

  TD.drawSprite =  function(ctx, type, spritename, posX, posY){
    var spriteSheet = TD.gSpriteSheets[type];
    if(spriteSheet == null) return false;
    var spt = spriteSheet.getStats(spritename);
    if(spt == null) return false;
    var hlf = {
      x : spt.cx,
      y : spt.cy
    };
    // posX+hlf.x, posY+hlf.y  --> make sure we actually put the image centre at the point we want
    if(type[1] == 'o')
      ctx.drawImage(spriteSheet.img, spt.x, spt.y, spt.w, spt.h, posX+hlf.x, posY+hlf.y-10, spt.w, spt.h);
    else {
      ctx.drawImage(spriteSheet.img, spt.x, spt.y, spt.w, spt.h, posX+hlf.x, posY+hlf.y, spt.w, spt.h);
    }
  };

});
