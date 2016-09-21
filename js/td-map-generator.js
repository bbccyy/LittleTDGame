

_TD.loading.push(function(TD){

  TD.rawMapData = null;
  TD.path = null;
  TD.uc = document.getElementById('td-canvas-1');
  TD.ucx = this.uc.getContext('2d');
  TD.uc2 = document.getElementById('td-canvas-2');
  TD.ucx2 = this.uc.getContext('2d');
  TD.mapData = null;  // bit map, consist of 0,1 and 2s 

  TD.createMap = function ( canvasBody, undoBody, redoBody, submitBody ){
    //this.rawData = null;
    TD.uc.width = 500;
    TD.uc.height = 500;
    TD.uc2.width = 500;
    TD.uc2.height = 500;

    this.getRawMapFromStroke = function (){
      this.mousedown = false;
      this.oldx = null;
      this.oldy = null;
      this.height = TD.cfg.height;
      this.width = TD.cfg.width;
      this.c = canvasBody;
      this.cx = canvasBody.getContext('2d');
      this.u = undoBody;
      this.r = redoBody;
      this.s = submitBody;
      this.history = [];  // a buffer stroing recent view in historical order
      this.index = -1;    // indicate current view

      this._init();
    };

    this.getRawMapFromStroke.prototype = {

      setupCanvas : function() {
        this.c.height = this.height;
        this.c.width = this.width;
        this.cx.lineWidth = 25;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = 'rgb(0, 0, 0)';
      },

      onmousedown : function(ev) {
        var _this = TD.map.rawMap;  // to reach out the envirnment data, get Closure handler
        _this.mousedown = true;
        ev.preventDefault();
      },

      onmouseup : function(ev) {
        var _this = TD.map.rawMap;
        _this.mousedown = false;
        var data = _this.cx.getImageData(0,0,_this.width,_this.height);
        while(_this.history.length > _this.index+1){
          _this.history.pop();
        }
        _this.history.push( data );
        _this.index++;
        _this.oldx = -1;
        _this.oldy = -1;
        ev.preventDefault();
      },

      onmouseout : function(ev){
        var _this = TD.map.rawMap;
        if(_this.mousedown == false) return;
        _this.mousedown = false;
        var data = _this.cx.getImageData(0,0,_this.width,_this.height);
        while(_this.history.length > _this.index+1){
          _this.history.pop();
        }
        _this.history.push( data );
        _this.index++;
        _this.oldx = -1;
        _this.oldy = -1;
        ev.preventDefault();
      },

      onmousemove : function(ev) {
        var _this = TD.map.rawMap;
        var x = ev.clientX;
        var y = ev.clientY;
        if (_this.mousedown && _this.ok2Draw(x,y,TD.cfg.Restriction)) {
          _this.paint(x, y);
        }
      },

      paint : function(x, y) {
        var _this = TD.map.rawMap;
        if (_this.oldx > 0 && _this.oldy > 0) {
          _this.cx.beginPath();
          _this.cx.moveTo(_this.oldx, _this.oldy);
          _this.cx.lineTo(x, y);
          _this.cx.stroke();
          _this.cx.closePath();
        }
        _this.oldx = x;
        _this.oldy = y;
      },

      onClickUndo : function(){  // undo recent drawing
        var _this = TD.map.rawMap;
        if(_this.index > 0){
          _this.index--;
          var data = _this.history[_this.index];
          _this.cx.clearRect(0,0,_this.width,_this.height);
          _this.cx.putImageData(data, 0, 0);
        }
      },

      onClickRedo : function(){   // redo recent drawing
        var _this = TD.map.rawMap;
        if(_this.index+1 < _this.history.length){
          _this.index++;
          var data = _this.history[_this.index];
          _this.cx.clearRect(0,0,_this.width,_this.height);
          _this.cx.putImageData(data, 0, 0);
        }
      },

      onClickSubmit : function(){   // cut off event listener, send data to create path
        var _this = TD.map.rawMap;
        _this.c.removeEventListener('mousedown', _this.onmousedown, false);
        _this.c.removeEventListener('mouseup', _this.onmouseup, false);
        _this.c.removeEventListener('mousemove', _this.onmousemove, false);
        _this.c.removeEventListener('mouseout', _this.onmouseout, false);

        _this.u.removeEventListener('click', _this.onClickUndo, false);
        _this.r.removeEventListener('click', _this.onClickRedo, false);
        _this.s.removeEventListener('click', _this.onClickSubmit, false);

        TD.rawMapData = _this.history[_this.index].data;
        TD.path = new TD.createPath(TD.rawMapData);
        console.log(TD.path);
        //new TD.path.cdt(TD.path.pathOutline[0], TD.path.pathOutline[1]);
      },

      preDraw : function(){
        this.cx.beginPath();
        this.cx.strokeStyle = 'rgb(0, 0, 0)';
        this.cx.lineWidth = 30;
        this.cx.moveTo(0,0);
        this.cx.lineTo(60,60);
        this.cx.stroke();

        this.cx.moveTo(this.width,this.height);
        this.cx.lineTo(this.width-60,this.height-60);
        this.cx.stroke();
        this.cx.closePath();
      },

      //isOnLeft(e, r)  true --> left
      ok2Draw : function(x, y, lines){  // lines --> [lineUpLeft, lineDownRight]
          for(var i=0; i<lines.length; i++){
            if(!TD.lang.isOnLeft(lines[i],[x,y])) return false;
          }
          return true;
      },

      _init : function(){
        this.setupCanvas();
        this.preDraw();

        var data = this.cx.getImageData(0, 0, this.width, this.height);
        this.history.push(data);
        this.index = 0;

        this.c.addEventListener('mousedown', this.onmousedown, false);
        this.c.addEventListener('mouseup', this.onmouseup, false);
        this.c.addEventListener('mousemove', this.onmousemove, false);
        this.c.addEventListener('mouseout', this.onmouseout, false);

        this.u.addEventListener('click', this.onClickUndo, false);
        this.r.addEventListener('click', this.onClickRedo, false);
        this.s.addEventListener('click', this.onClickSubmit, false);

      }

    };

    this.rawMap = new this.getRawMapFromStroke();
  }

});
