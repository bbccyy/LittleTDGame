var _TD = {
	loading: [],
	init: function () {

    var i, TD = {

      init: function () {

				TD.lang.setMoney(TD.money);

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
					var node = this.terminalNodePool[idx];
					this.aliveTerminals[node] =
						new TD.terminalBuilding(node.position, node, TD.cfg.Buildings['building-5']);
					TD.bloodBarQueue.push(new TD.bloodBar(this.aliveTerminals[node]));
				}
				//TD.buildNextWave();
				//this.monsterQueue.push(new this.monster(this.root, 10, 1));
				this.ucx.clearRect(0, 0, this.width, this.height);
				TD.lang.showBuildingInfo();
			},

			step : function(){
				_this = TD;

				if(TD.GameOver){
					clearTimeout(_this._st);
					return;
				}

				if(TD.waitingForNextWave==false && _this.monsterQueue.length==0){
					// won't stop the main thread, but after 6s, another thread will run bulidNextWave
					// then monsterQueue will have something new
					TD.waitingForNextWave = true;  // prevent create multiple setTimeout thread
					TD.lang.levelUp();
					TD.lang.setWave(TD.wave+1);
					setTimeout(TD.buildNextWave , 3000);
				}
				else{  // not waiting for next wave OR  still has alive monsters in queue

					if(!TD.pause){
						_this.ucx.clearRect(0, 0, _this.cfg.width, _this.cfg.height);
						while(_this.eventQueue.length>0){
							var e = _this.eventQueue.shift();
							_this.drawer(e);
						}
					}

					//1
					var size = _this.monsterQueue.length, key;
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
					if(!TD.pause){
						size = _this.bulletQueue.length;
						while(size > 0){
							size--;
							var el = _this.bulletQueue.shift();
							if(el.move() == true){
								_this.bulletQueue.push(el);
							}
						}

						//4
						size = _this.bloodBarQueue.length;
						while(size > 0){
							size--;
							var el = _this.bloodBarQueue.shift();
							if(el.move() == true){
								_this.bloodBarQueue.push(el);
							}
						}

						for(key in TD.deadTerminals){
							if(!TD.deadTerminals.hasOwnProperty(key)) continue;
							var el = TD.deadTerminals[key];
							el.move();
						}
					}

					for(key in TD.aliveTerminals){
						if(!TD.aliveTerminals.hasOwnProperty(key)) continue;
						var el = TD.aliveTerminals[key];
						if(el.move() == false){
							TD.deadTerminals[key] = el;
							delete TD.aliveTerminals[key];
						}
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
