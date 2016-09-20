var _TD = {
	loading: [],
	init: function () {
    var i, TD = {
      version : "0.0.1",
			root : null,
			terminalNodePool : [],
			buildingsInBattleField : [],
			eventQueue : [],
			elementQueue : [],
			aliveTerminals : {},
      init: function () {
				var canvas = document.getElementById('td-canvas');
				var redoBody = document.getElementById('redo');
        var undoBody = document.getElementById('undo');
        var submitBody = document.getElementById('submit');
				this.uc = document.getElementById('td-canvas-1');
				this.ucx = this.uc.getContext('2d');


        this.map = new TD.createMap(canvas, undoBody, redoBody, submitBody);
        console.log("haha1");
        console.log(this.rawMapData);

				// var canvas2 = document.getElementById('td-canvas-1');
				// var ctx2 = canvas2.getContext('2d');
				//this.uc.globalAlpha = 0.5;
				this.uc.width = 500;
				this.uc.height = 500;
			},

			start : function(){
				this.runner = document.getElementById('run');
				this.runner.addEventListener('click', TD.step, false);
				console.log("haha2");
				for(var idx=0; idx<this.terminalNodePool.length; idx++){
					this.aliveTerminals[this.terminalNodePool[idx]] = this.terminalNodePool[idx];
				}
				this.elementQueue.push(new this.monster(this.root, 10, 3));
				this.ucx.clearRect(0, 0, this.width, this.height);
			},

			step : function(){
				_this = TD;
				// console.log(_this.root);
		    // console.log(_this.terminalNodePool);
				if(_this.elementQueue.length==0){
					clearTimeout(_this._st);
					return;
				}
				_this.ucx.clearRect(0, 0, _this.cfg.width, _this.cfg.height);
				while(_this.eventQueue.length>0){
					var e = _this.eventQueue.shift();
					_this.drawer(e);
				}
				var size = _this.elementQueue.length;
				while(size > 0){
					size--;
					var el = _this.elementQueue.shift();
					if(el.move() == true){
						_this.elementQueue.push(el);
					}
				}

				_this._st = setTimeout(function(){
					_this.step();
				},30);

			}

    };

    for (i = 0; this.loading[i]; i++) {
      this.loading[i](TD);
    }
    TD.init();
  }
};
