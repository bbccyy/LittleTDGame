
_TD.loading.push(function(TD){

  TD.createPath = function(data){

    var Boundary = {};        // all boundary edges arranged in discover order (outer: anti-clockwise,  inner: clockwise)
    var Edge4Tri = {};        // key: edge.toString,   value = [tri1, tri2]
    var TriPool = [];         // all unique triangles here, including trimed ones
    var terminalTriPool = []; // to trim terminal tri
    var startTriangle = null; // should be up leftmost triangle
    var cdtThis = null;
    var cx = document.getElementById('td-canvas').getContext('2d');

    this.getData = function(data){
      var i, j, idx, height = TD.cfg.height, width = TD.cfg.width;
      var map = TD.lang.Create2DArray(height, width);
      for(i = 1; i<height-1; i++){
        for(j = 1; j<width-1; j++){
          idx = i*4*width + j*4;
          map[i][j] = (data[idx]==0 && data[idx+1]==0 && data[idx+2]==0 && data[idx+3]>100)? 1 : 0;
        }
      }
      map[1][1] = 2;
      map[2][1] = 2;
      map.rows = height;
      map.columns = width;
      var outputQueue = [];
      outputQueue.push([1,1,6]);
      outputQueue.push([2,1,6]);

      this.findPath(map, 2, 1, outputQueue);

      var innerLines = this.findInnerLine(map);
      var vectorQue = this.parseQue( outputQueue );
      var vectorInnerQue = [];
      //var cx = document.getElementById('td-canvas').getContext('2d');
      //TD.lang.drawOutline(cx, vectorQue);
      for(idx=0; idx<innerLines.length; idx++){
        var vq = this.parseQue(innerLines[idx]);
        vectorInnerQue.push(vq);
        //TD.lang.drawOutline(cx, vq);
      }

      //vectorQue
      //vectorInnerQue
      return [vectorQue, vectorInnerQue];
    };

    this.getData.prototype = {

      findPath : function(table, r, c, outputQueue){
        //var _this = TD.path.pathOutline;
        var tmpR = 0, tmpC = 0, idx, dir, d;
        for(idx=0; idx<TD.cfg.Dir.length; idx++){
          dir = TD.cfg.Dir[idx];
          for(d=0; d<dir.length; d++){
            tmpR = dir[d][0]+r;
            tmpC = dir[d][1]+c;
            if(r<0 || r>=table.rows || c<0 || c>=table.columns
              || table[tmpR][tmpC]==0 || table[tmpR][tmpC]==2) continue;
            if(this.checkCross(table, tmpR, tmpC, TD.cfg.dirC)){   //direction 'Cross'
              outputQueue.push([tmpC, tmpR, dir[d][2]]);   // output should mapping to Column -> x, Row -> y
              table[tmpR][tmpC] = 2;
              return this.findPath(table, tmpR, tmpC, outputQueue);
            }
          }
        }
        return null;
      },

      checkCross : function(table, r, c, dir){
        var d, tmpR, tmpC;
        for(d=0; d<dir.length; d++){
          tmpR = dir[d][0]+r;
          tmpC = dir[d][1]+c;
          if(r<0 || r>=table.rows || c<0 || c>=table.columns) continue;
          if(table[tmpR][tmpC]==0) return true;
        }
        return false;
      },

      findInnerLine : function(table){
        var outputs = [];
        var curQue = [];
        var isOutIsland = false;
        var row, column;
        //var _this = TD.path.pathOutline;
        for(row=1; row<table.rows-1; row++){
          for(column=1; column<table.columns-1; column++){
            if(table[row][column]==0 && table[row][column+1]==1) {
              isOutIsland=true;
              continue;
            }
            if(isOutIsland && table[row][column]==1 && table[row][column+1]==0) {
              isOutIsland=false;
              continue;
            }
            if(this.isStartable(table, row, column, curQue)){
              this.findPath(table, row-1, column+1, curQue);
              outputs.push(curQue);
              curQue = [];
            }
          }
        }
        return outputs;
      },

      isStartable : function(table, r, c, que){
        if(table[r][c] != 1) return false;
        if(table[r][c+1]!=undefined && table[r][c+1]==0){
          if(table[r][c+2]!=undefined && table[r][c+2]!=0){
            table[r][c+1] = 1;
            return false;
          }
          else{
            table[r][c] = 2;       //to change on table, t[row][column]
            table[r-1][c+1] = 2;
            que.push([c,r,3]);      //note, [x,y] --> [column, row]
            que.push([c+1,r-1,3]);
            return true;
          }
        }
        return false;
      },

      parseQue : function( que ){
        var firstP = que[0], lastP = que[0], curP = null, idx;
        var ctSame = 0, ctDif = 0;
        if(que.length < 2) return null;
        var res = [];
        res.push([firstP[0], firstP[1]]);
        for(idx=0; idx<que.length; idx++){
          curP = que[idx];
          if(curP[2] == firstP[2]){
            ctSame = ctSame + 1;
            if(ctSame > 20){
              res.push([lastP[0], lastP[1]]);
              firstP = curP;
              lastP = curP;
              ctSame = 0;
              ctDif = 0;
            }else{
              lastP = curP;
            }
          }
          else{
            ctDif = ctDif + 1;
            lastP = curP;
            if((ctSame + ctDif) > 15){
              res.push([lastP[0], lastP[1]]);
              firstP = curP;
              lastP = curP;
              ctSame = 0;
              ctDif = 0;
            }
            else if(ctDif > 7){
              res.push([lastP[0], lastP[1]]);
              firstP = curP;
              lastP = curP;
              ctSame = 0;
              ctDif = 0;
            }
          }
        }
        res.push([que[0][0], que[0][1]]);
        return res;
      }
    };


    this.cdt = function(outLine, innerLines){
      cdtThis = this;
      var hashEdge = {};
      var pointPool = [];
      var idx;
      pointPool = pointPool.concat(outLine.slice(0,outLine.length-1));
      this.buildEdgeMap(hashEdge, outLine);
      for(idx=0; idx<innerLines.length; idx++){
        this.buildEdgeMap(hashEdge, innerLines[idx]);
        pointPool = pointPool.concat(innerLines[idx].slice(0,innerLines[idx].length-1));
      }
      var limit = 1000;
      while(limit > 0 && Object.keys(hashEdge).length > 0){
        limit--;
        var key = Object.keys(hashEdge)[0];
        var curEdge = hashEdge[key];
        delete hashEdge[key];
        var theOne = [], circleV = null, leftPointPool = [];
        for(var idx=0; idx<pointPool.length; idx++){
          var point = pointPool[idx];
          if(TD.lang.isOnLeft(curEdge, point))
            leftPointPool.push(point);
        }
        for(idx=0; idx<leftPointPool.length; idx++){
          var pt = leftPointPool[idx];
          var tmpTheOne = [pt];
          var tmpCircleV = TD.lang.getCentrePoint(curEdge[0], curEdge[1], pt);
          for(var i=0; i<leftPointPool.length; i++){
            if(i == idx) continue;
            var p = leftPointPool[i];
            var inCircleRes = TD.lang.isInCircle(tmpCircleV, p);
            if(inCircleRes==1){  // in circle
              tmpTheOne = null;
              break;
            }else if(inCircleRes==0){  // on circle
              tmpTheOne.push(p);
            }
          }
          if(tmpTheOne != null && (circleV == null || circleV[2] > tmpCircleV[2])){
            theOne = tmpTheOne;
            circleV = tmpCircleV;
          }
        }
        if(theOne.length > 1){
          console.log("==> Same Circle <==");
          console.log(theOne);
          console.log(curEdge);
          this.resolveCircleProblem(curEdge, theOne, hashEdge);
          continue;
        }
        var Line1start = curEdge[0];
        var Line1end   = theOne[0];
        var Line2start = theOne[0];
        var Line2end   = curEdge[1];
        //'rgb(100, 100, 0)'
        if(hashEdge[[Line1end, Line1start]]!=undefined || hashEdge[[Line1start, Line1end]]!=undefined){
          delete hashEdge[[Line1end, Line1start]];
          delete hashEdge[[Line1start, Line1end]];
          //console.log("delete line!");
          //drawOneSet(cx, [[Line1end, Line1start]], 'rgb(0, 0, 0)');
        }else{
          hashEdge[[Line1start, Line1end]] = [Line1start, Line1end];
          //console.log("insert line!");
          //drawOneSet(cx, [[Line1start, Line1end]]);
        }
        if(hashEdge[[Line2end, Line2start]]!=undefined || hashEdge[[Line2start, Line2end]]!=undefined){
          delete hashEdge[[Line2end, Line2start]];
          delete hashEdge[[Line2start, Line2end]];
          //console.log("delete line!");
          //drawOneSet(cx, [[Line2end, Line2start]], 'rgb(0, 0, 0)');
        }else{
          hashEdge[[Line2start, Line2end]] = [Line2start, Line2end];
          //console.log("insert line!");
          //drawOneSet(cx, [[Line2start, Line2end]]);
        }
        TD.lang.drawOneSet(cx, [curEdge, [Line1start, Line1end], [Line2start, Line2end]], 'rgb(255, 255, 255)');
        this.processTriangle(curEdge, [Line1start, Line1end], [Line2start, Line2end]);
      }

    };

    this.cdt.prototype = {

      buildEdgeMap : function( hash, que ){
        var idx;
        for(idx=0; idx<que.length-1; idx++){
          hash[[que[idx],que[idx+1]]] = [que[idx],que[idx+1]];
          Boundary[[que[idx],que[idx+1]]] = [que[idx],que[idx+1]];
          Boundary[[que[idx+1],que[idx]]] = [que[idx+1],que[idx]];
        }
      },


      // Boundary = {}
      // Edge4Tri = {}
      processTriangle : function(e1, e2, e3){
        var ct = 0;
        var outerEdge = [], innerEdge = [];
        var triangle = null;
        if(Boundary[e1]!=undefined){
          ct++;
          outerEdge.push(e1);
        }else{
          innerEdge.push(e1);
        }
        if(Boundary[e2]!=undefined){
          ct++;
          outerEdge.push(e2);
        }else{
          innerEdge.push(e2);
        }
        if(Boundary[e3]!=undefined){
          ct++;
          outerEdge.push(e3);
        }else{
          innerEdge.push(e3);
        }
        if(ct == 0){
          triangle = new this.Tri(innerEdge, outerEdge, 'J');
          triangle.processJunction();
        }else if(ct == 1){
          triangle = new this.Tri(innerEdge, outerEdge, 'L');
          triangle.processLinker();
        }else if(ct == 2){
          triangle = new this.Tri(innerEdge, outerEdge, 'T');
          triangle.processTerminal();
          if(TD.lang.pointEq(triangle.value['T'], [1,1])){
            startTriangle = triangle;
            console.log("start triangle:")
            console.log(triangle);
          }
          terminalTriPool.push(triangle);
        }else{
          console.log("too many terminal edges!");
        }
        TriPool.push(triangle);
        for(var idx=0; idx<innerEdge.length; idx++){
          var edge = innerEdge[idx]
          if(Edge4Tri[edge]==undefined){
            Edge4Tri[edge] = [];
            Edge4Tri[TD.lang.reverseEdge(edge)] = [];
          }
          Edge4Tri[edge].push(triangle);
          Edge4Tri[TD.lang.reverseEdge(edge)].push(triangle);
        }
        return triangle;
      },


      //compute the area from a given triangle's all edges
      computeTriAreaByEdges : function(allEdges){
        var x1 = allEdges[0][0][0];
        var y1 = allEdges[0][0][1];
        var x2 = allEdges[0][1][0];
        var y2 = allEdges[0][1][1];
        var x3 = 0;
        var y3 = 0;
        if(TD.lang.pointEq(allEdges[0][0], allEdges[1][0]) || TD.lang.pointEq(allEdges[0][1], allEdges[1][0])){
          x3 = allEdges[1][1][0];
          y3 = allEdges[1][1][1];
        }else{
          x3 = allEdges[1][0][0];
          y3 = allEdges[1][0][1];
        }
        // cross product: AXB = |A||B|sin0 where |B|sin0 is the height of quadrangle
        return Math.abs((x2-x1)*(y3-y1) - (x3-x1)*(y2-y1)) / 2;
      },

      Tri : function(innerEdge, outerEdge, feature){
        this.Inner = innerEdge;
        this.Outer = outerEdge;
        this.Feature = feature;
        this.isVisited = false;
        this.value = {};
        this.area = cdtThis.computeTriAreaByEdges(innerEdge.concat(outerEdge));
        this.toString = function(){
          return this.Inner + ' ' + this.Outer;  // used when compare two triangles
        }
        this.position = null;
        // first delete input edge because it eventually turned into a terminal edge
        // remove the input edge from this.Inner array
        // add it to this.Outer
        // modify feature based on current Inner and Outer edge numbers
        // do post work -->
        this.changeFeature = function ( e ){
          for(var idx=0; idx<this.Inner.length; idx++){
            if(TD.lang.edgeEq(e, this.Inner[idx])){
              this.Outer.push(this.Inner[idx]);
              this.Inner.splice(idx,1);
              break;
            }
          }
          if(this.Outer.length == 1){
            this.Feature = 'L';
            this.processLinker();
          }else if(this.Outer.length == 2){
            this.Feature = 'T';
            //do sth about value
            this.processTerminal();
            //don't forget to put this tri into terminalTriPool
          }else{
            console.log("In changeFeature function: too many terminal edges!");
          }
        };

        this.processTerminal = function(){
          this.value = {};
          var tp = null, mid = null;
          if(this.Outer[0][0] == this.Outer[1][0] || this.Outer[0][0] == this.Outer[1][1])
            tp = this.Outer[0][0];
          else tp = this.Outer[0][1];
          this.value['T'] = tp;   //terminal point
          this.value['M'] = TD.lang.getMiddle( this.Inner[0] );  //middle point on Inner edge
          this.value['A'] = TD.lang.getAngle( this.Outer[0], this.Outer[1] );  // get angle of two outer edge
          this.position = tp;
        };

        this.processJunction = function(){
          this.value = {};
          var centre = TD.lang.getGeoCentre(this.Inner);  // to compute geocentre
          var mid1 = TD.lang.getMiddle(this.Inner[0]);
          var mid2 = TD.lang.getMiddle(this.Inner[1]);
          var mid3 = TD.lang.getMiddle(this.Inner[2]);
          // key = inner edge,   value = [geocentre point,  two other inner edge's Middle point and edge itself]
          this.value[this.Inner[0]] = [centre, mid2, this.Inner[1], mid3, this.Inner[2]];
          this.value[TD.lang.reverseEdge(this.Inner[0])] = [centre, mid2, this.Inner[1], mid3, this.Inner[2]];
          this.value[this.Inner[1]] = [centre, mid1, innerEdge[0], mid3, innerEdge[2]];
          this.value[TD.lang.reverseEdge(this.Inner[1])] = [centre, mid1, this.Inner[0], mid3, this.Inner[2]];
          this.value[this.Inner[2]] = [centre, mid1, this.Inner[0], mid2, this.Inner[1]];
          this.value[TD.lang.reverseEdge(this.Inner[2])] = [centre, mid1, this.Inner[0], mid2, this.Inner[1]];
          this.position = centre;
        };

        this.processLinker = function(){
          this.value = {};
          var mid1 = TD.lang.getMiddle(this.Inner[0]);
          var mid2 = TD.lang.getMiddle(this.Inner[1]);
          // key = inner edge,   value = [the other inner edge's Middle point and edge itself]
          this.value[this.Inner[0]] = [mid2, this.Inner[1]];
          this.value[TD.lang.reverseEdge(this.Inner[0])] = [mid2, this.Inner[1]];
          this.value[this.Inner[1]] = [mid1, this.Inner[0]];
          this.value[TD.lang.reverseEdge(this.Inner[1])] = [mid1, this.Inner[0]];

          this.position = mid1;
        };

      },// end of Tri


      //terminalTriPool = [tri1, tri2, tri3...]
      //Edge4Tri = {}  --> key: edge.toString, value = [tri1, tri2]
      //reverseEdge
      trimRedundantTerminalTriangle : function(){
        while(terminalTriPool.length > 0){
          var curTri = terminalTriPool.shift();
          if(curTri.value['A'] < 100) continue;
          //drawTriangleOutline(cx, curTri);
          var terminalInnerEdge = curTri.Inner[0];
          var edgeRelatedTriPool = Edge4Tri[terminalInnerEdge];
          var relatedTri = null;
          if(edgeRelatedTriPool[0]==curTri){
            relatedTri = edgeRelatedTriPool[1];
            //edgeRelatedTriPool.splice(0,1);   --> no need to pop out this terminal tri, will eventually delete this key!
            //Edge4Tri[reverseEdge(terminalInnerEdge)].splice(0,1);
          }else{
            relatedTri = edgeRelatedTriPool[0];
            //edgeRelatedTriPool.splice(1,1);
            //Edge4Tri[reverseEdge(terminalInnerEdge)].splice(1,1);
          }
          console.log("trim this bad triangle!");
          console.log(curTri);
          relatedTri.changeFeature(terminalInnerEdge);  // now this tri is nolonger it's origin feature!
          if(relatedTri.Feature == 'T'){
            console.log("add new terminal tri");
            console.log(relatedTri);
            terminalTriPool.push(relatedTri);
          }
          delete Edge4Tri[terminalInnerEdge];
          delete Edge4Tri[TD.lang.reverseEdge(terminalInnerEdge)];
        }
      },


      resolveCircleProblem : function(curEdge, theOnes, hashEdge, cx){
        var directEdges = [], circleTri = [];
        for(var idx=0; idx<theOnes.length; idx++){
          directEdges.push([curEdge[0], theOnes[idx], TD.lang.getAngle(curEdge, [curEdge[0], theOnes[idx]])]);
        }
        directEdges.sort(function(a,b){
          return b[2] - a[2];
        });
        directEdges.push([curEdge[0], curEdge[1], 0]);
        for(var idx=0; idx<directEdges.length-1; idx++){
          var e1 = [directEdges[idx][1], curEdge[0]];
          var e2 = [directEdges[idx+1][1], directEdges[idx][1]];
          var e3 = [curEdge[0], directEdges[idx+1][1]];
          var tri = this.processTriangle(e1, e2, e3);
          console.log("in circle get a tri:");
          console.log(tri);
          for(var i=0; i<tri.Outer.length; i++){
            delete hashEdge[tri.Outer[i]];
            //drawOneSet(cx, [tri.Outer[i]] , 'rgb(255, 255, 255)');
          }
          for(var j=0; j<tri.Inner.length; j++){
            var p1 = tri.Inner[j][0];
            var p2 = tri.Inner[j][1];
            if(hashEdge[[p1, p2]]!=undefined || hashEdge[[p2, p1]]!=undefined){
              delete hashEdge[[p1, p2]];
              delete hashEdge[[p2, p1]];
            }else{
              hashEdge[[p1, p2]] = [p1, p2];
            }
            //TD.lang.drawOneSet(cx, [[p1, p2]] , 'rgb(0, 0, 255)');
          }
        }
      }


    } // end of cdt prototype



    this.pathOutline = new this.getData(data);
  }



});
