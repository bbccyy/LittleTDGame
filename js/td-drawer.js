_TD.loading.push(function(TD){

  TD.drawer = function( obj ){
    if(obj.type == 'Monster'){
      TD.cfg.monster(TD.ucx, obj.position);
    }
    else if(obj.type == 'mouse'){
      TD.cfg.mouse(TD.ucx2, obj);
    }
    else if(obj.type == 'building-1'){
      TD.cfg.bld1(TD.ucx, obj);
    }
    else if(obj.type == 'building-2'){
      TD.cfg.bld2(TD.ucx, obj);
    }
    else if(obj.type == 'building-3'){
      TD.cfg.bld3(TD.ucx, obj);
    }
    else if(obj.type == 'building-4'){
      TD.cfg.bld4(TD.ucx, obj);
    }
  }

});
