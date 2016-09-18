var _TD = {
	loading: [],
	init: function () {
    var i, TD = {
      version : "0.0.1",
      init: function () {
				var canvas = document.getElementById('td-canvas');
				var redoBody = document.getElementById('redo');
        var undoBody = document.getElementById('undo');
        var submitBody = document.getElementById('submit');

        this.map = new TD.createMap(canvas, undoBody, redoBody, submitBody);
        console.log("haha1");
        console.log(this.rawMapData);

			}
    };

    for (i = 0; this.loading[i]; i++) {
      this.loading[i](TD);
    }
    TD.init();
  }
};
