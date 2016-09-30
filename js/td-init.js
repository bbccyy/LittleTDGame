
_TD.loading.push(function(TD){

  TD.version = "0.1.0";
  TD.money = 50000;
  TD.score = 0;  // score += monster's live / 100
  TD.wave = 0;  // current wave number
  TD.maxNumberOfMonsterPerWave = 10;
  TD.GameOver = false;  // if final target has been destroied, set GameOver := true
  TD.waitingForNextWave = false;  // check if is between two waves
  TD.pause = false;  // pause the game
  TD.root = null;    // root of Graph as map

  TD.map == null  // entity of TD.createMap

  TD.validMap = false;  // will set to true if get a valid one after running td-path module

  TD.bldCtrl = null;  // building controller
  TD.runner  = null;  //should conbine run with pause
  TD.beforeRun = true;  //will set to false when first click runner, used to conbine pause and run function

  TD.eventQueue = [];  //all moving or exploding events --> monster, bullet and building
  TD.monsterQueue = [];
  TD.buildingQueue = [];     // buildings outside battle field
  TD.inBuildingQueue = [];   // buildings in battle field
  TD.bulletQueue = [];
  TD.bloodBarQueue = [];

  TD.terminalNodePool = [];
  TD.aliveTerminals = {};
  TD.deadTerminals = {};
  TD.terminalTmpBuffer = [];  // sort all tower stuffs according to their Y-axis before pushing into eventQueue

  TD.rawMapData = null;
  TD.path = null;

  TD.gSpriteSheets = {};  // used to store SpriteSheetClass entities
  TD.monsterFrame = {};   // monster use its type to search this table, get image name sequence in 4 direction
  TD.monsterTypes = ['monster-1', 'monster-2', 'monster-3', 'monster-4'];
  TD.monsterSpriteSource = 'zombie.png';
  TD.bulletTypes = ['bullet_small', 'bullet_middle', 'bullet_large', 'bullet_missile'];
  TD.explodeFrame = {};   // bullet object use its type here as key to search for its associated bullet frame sequence
  TD.explodeSpriteSource = 'explode.png';
  TD.sceneFrame = {};  // any scene including ground, grass, tower. EG. [grass] -> [grass_01.png, grass_02.png ... ]
  TD.sceneSpriteSource = 'scene.png';
  TD.turretFrame = {};
  TD.turretSpriteSource = 'turret.png';

  TD.uc = document.getElementById('td-canvas-1'); // middle layer canvas --> draw builids, monsters and bullets
  TD.ucx = TD.uc.getContext('2d');

  TD.uc2 = document.getElementById('td-canvas-2');  // upper layer canvas  --> draw cycle on mouse
  TD.ucx2 = TD.uc2.getContext('2d');

  TD.uc0 = document.getElementById('td-canvas-background'); // loweest layer canvas --> draw dust road
  TD.ucx0 = TD.uc0.getContext('2d');

  TD.mapData = null;  // bit map, consist of 0,1 and 2s

  TD.waitingToBuild = null;  // for building click event
  TD.waitingToChange = null;  // for upgrading or selling click event

  TD.moneyElement = document.getElementById('money');
  TD.waveElement  = document.getElementById('wave');
  TD.scoreElement  = document.getElementById('score');
  TD.panelElement  = document.getElementById('info');

  TD.runner = document.getElementById('run');
  TD.pauseElement = document.getElementById('pause');

  TD.canvasBody = document.getElementById('td-canvas');
  TD.redoBody = document.getElementById('redo');
  TD.undoBody = document.getElementById('undo');
  TD.submitBody = document.getElementById('submit');

});
