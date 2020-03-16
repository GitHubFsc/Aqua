// @formatter:off
(function(win) {
// @formatter:on
   'use strict';
    win.JS = {
        namespace: function(ns, parent) {
            if ( typeof ns !== 'string') {
                throw new Error('JS namespace needs typeof string.');
            } else {
                // @formatter:off
                var parts = ns.split('.'),
                    len = parts.length,
                    object = parent,
                    i,
                    item;
                // @formatter:on

                if(typeof object === 'undefined'){
                    object = this;
                }else if(object === null){
                    object = win;
                }

                for ( i = 0; i < len; i++) {
                    item = parts[i];
                    if (!object[item]) {
                        object[item] = {};
                    }
                    object = object[item];
                }

                return object;
            }
        },

        loadDependence: function(list) {
            if (Array.isArray(list)) {
                // @formatter:off
                var loadList = [],
                    len = list.length,
                    i,
                    item,
                    moduleName,
                    modulePath,
                    moduleRm,
                    moduleEnv;
                // @formatter:on
                for ( i = 0; i < len; i++) {
                    item = list[i];
                    moduleName = item.module;
                    modulePath = item.path;
                    moduleRm = item.removable;
                    moduleEnv = item.environment;

                    // if(!this.checkExist(moduleName, moduleEnv)){
                        loadList.push({
                            name: modulePath,
                            removable: typeof moduleRm === 'undefined' ? true : moduleRm,
                        });
                    // }
                }

                return loadList;
            } else {
                throw new Error('JS dependence list has to be an array.');
            }
        },

        checkExist: function(ns, parent) {
            if(typeof ns !== 'string'){
                throw new Error('JS namespace needs typeof string.');
            }else{
                // @formatter:off
                var parts = ns.split('.'),
                    object = parent,
                    len = parts.length,
                    i,
                    item;
                // @formatter:on

                if(typeof object === 'undefined'){
                    object = this;
                }else if(object === null){
                    object = win;
                }

                for(i = 0; i < len; i++){
                    item = parts[i];
                    object = object[item];
                    if(!object){
                        break;
                    }
                }

                return object;
            }
        },

    };
// @formatter:off
}(window));
// @formatter:on
