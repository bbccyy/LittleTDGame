
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
      }else if(cfg.type == 'scene'){
        // create two classes
        // one for scene
        // the other for blowing
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
    ctx.drawImage(spriteSheet.img, spt.x, spt.y, spt.w, spt.h, posX+hlf.x, posY+hlf.y, spt.w, spt.h);
  };

});
