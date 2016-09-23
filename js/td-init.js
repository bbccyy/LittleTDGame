
_TD.loading.push(function(TD){

  TD.version = "0.0.1";
  TD.money = 5000;
  TD.wave = 0;  // current wave number
  TD.GameOver = false;  // if final target has been destroied, set GameOver := true
  TD.waitingForNextWave = false;  // check if is between two waves
  TD.pause = false;  // pause the game
  TD.root = null;

  TD.eventQueue = [];  //all moving or exploding events --> monster, bullet and building
  TD.monsterQueue = [];
  TD.buildingQueue = [];
  TD.bulletQueue = [];
  TD.bloodBarQueue = [];

  TD.terminalNodePool = [];
  TD.aliveTerminals = {};
  TD.deadTerminals = {};

  TD.rawMapData = null;
  TD.path = null;

  TD.uc = document.getElementById('td-canvas-1'); // middle layer canvas --> draw builids, monsters and bullets
  TD.ucx = TD.uc.getContext('2d');

  TD.uc2 = document.getElementById('td-canvas-2');  // upper layer canvas  --> draw cycle on mouse
  TD.ucx2 = TD.uc2.getContext('2d');

  TD.mapData = null;  // bit map, consist of 0,1 and 2s

  TD.waitingToBuild = null;  // for building click event
  TD.waitingToChange = null;  // for upgrading or selling click event

  TD.moneyElement = document.getElementById('money');
  TD.waveElement  = document.getElementById('wave');
  TD.panelElement  = document.getElementById('info');

});
