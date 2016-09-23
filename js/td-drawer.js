_TD.loading.push(function(TD){

  TD.drawer = function( obj ){
    if(obj.type == 'Monster'){
      TD.cfg.monster(TD.ucx, obj.position);
    }
    else if(obj.type == 'mouse'){
      TD.cfg.mouse(TD.ucx2, TD.uc2, obj);
    }
    else if(obj.type == 'bar'){
      TD.cfg.bar(TD.ucx, obj);
    }
    else if(obj.type == 'monster-1'){
      TD.cfg.mst1(TD.ucx, obj);
    }
    else if(obj.type == 'monster-2'){
      TD.cfg.mst2(TD.ucx, obj);
    }
    else if(obj.type == 'monster-3'){
      TD.cfg.mst3(TD.ucx, obj);
    }
    else if(obj.type == 'monster-4'){
      TD.cfg.mst4(TD.ucx, obj);
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
    else if(obj.type == 'bullet_small'){
      TD.cfg.bullet_small(TD.ucx, obj);
    }
    else if(obj.type == 'bullet_middle'){
      TD.cfg.bullet_middle(TD.ucx, obj);
    }
    else if(obj.type == 'bullet_large'){
      TD.cfg.bullet_large(TD.ucx, obj);
    }
    else if(obj.type == 'bullet_layser'){
      TD.cfg.bullet_layser(TD.ucx, obj);
    }
  }

});
