var _TD = {
	loading: [],
	init: function () {
    var i, TD = {
      version : "0.0.1",
			money : 5000,
			root : null,
			terminalNodePool : [],
			eventQueue : [],  //all moving or exploding events --> monster, bullet and building
			monsterQueue : [],
			buildingQueue : [],
			bulletQueue : [],
			aliveTerminals : {},
      init: function () {
				var canvas = document.getElementById('td-canvas');
				var redoBody = document.getElementById('redo');
        var undoBody = document.getElementById('undo');
        var submitBody = document.getElementById('submit');

        this.map = new TD.createMap(canvas, undoBody, redoBody, submitBody);
        console.log("haha1");
        console.log(this.rawMapData);

				// var canvas2 = document.getElementById('td-canvas-1');
				// var ctx2 = canvas2.getContext('2d');
				//this.uc.globalAlpha = 0.5
			},

			start : function(){
				this.runner = document.getElementById('run');
				this.runner.addEventListener('click', TD.step, false);
				TD.bldCtrl = new TD.buildingController();
				console.log("haha2");
				for(var idx=0; idx<this.terminalNodePool.length; idx++){
					this.aliveTerminals[this.terminalNodePool[idx]] = this.terminalNodePool[idx];
				}
				this.monsterQueue.push(new this.monster(this.root, 10, 1));
				this.ucx.clearRect(0, 0, this.width, this.height);
			},

			step : function(){
				_this = TD;
				// console.log(_this.root);
		    // console.log(_this.terminalNodePool);
				if(_this.monsterQueue.length==0){
					clearTimeout(_this._st);
					return;
				}
				_this.ucx.clearRect(0, 0, _this.cfg.width, _this.cfg.height);
				while(_this.eventQueue.length>0){
					var e = _this.eventQueue.shift();
					_this.drawer(e);
				}

				//1
				var size = _this.monsterQueue.length;
				while(size > 0){
					size--;
					var el = _this.monsterQueue.shift();
					if(el.move() == true){
						_this.monsterQueue.push(el);
					}
				}

				//2
				size = _this.buildingQueue.length;
				while(size > 0){
					size--;
					var el = _this.buildingQueue.shift();
					if(el.move() == true){
						_this.buildingQueue.push(el);
					}
				}

				//3
				size = _this.bulletQueue.length;
				while(size > 0){
					size--;
					var el = _this.bulletQueue.shift();
					if(el.move() == true){
						_this.bulletQueue.push(el);
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
