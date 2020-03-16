(function(win) {
    win.dropdownHelper = {
        handlers: [],

        addDropdownHandler: function(handler) {
            if ( typeof handler !== 'undefined') {
                if (this.handlers.indexOf(handler) === -1) {
                    this.handlers.push(handler);
                }
            }
        },

        removeDropdownHandler: function(handler) {
            var tmp = [], i, len;

            for ( i = 0, len = this.handlers.length; i < len; i++) {
                if (this.handlers[i] === handler) {

                } else {
                    tmp.push(this.handlers[i]);
                }
            }

            this.handlers = tmp;
        },

        handleDropdowns: function(target, delegate) {
            var i, len;

            for ( i = 0, len = this.handlers.length; i < len; i++) {
                var handler = this.handlers[i];
                if (handler && (typeof handler.handleDropdowns == 'function')) {
                    handler.handleDropdowns(target, delegate);
                }
            }
        },

        checkIsChild: function(parent, target, delegate){
            if((typeof parent === 'undefined') || (parent === null)){
                return false;
            }

            if(parent === target){
                return true;
            }
            if(parent === delegate){
                return true;
            }

            var isChild = false;
            var tParents = jQuery(target).parents();
            for(var i = 0, len = tParents.length; i < len; i++){
                var tParent = tParents[i];
                if(tParent === parent){
                    isChild = true;
                    break;
                }
            }

            if(delegate){
                var dParents = jQuery(delegate).parents();
                for(var j = 0, jMax = dParents.length; j < jMax; j++){
                    var dParent = dParents[j];
                    if(dParent === parent){
                        isChild = true;
                        break;
                    }
                }
            }

            return isChild;
        },

    };

    jQuery(document).bind('click', function(ev) {
        var delegate = ev.originalEvent && ev.originalEvent.dropdownDelegate;
        win.dropdownHelper.handleDropdowns(ev.target, delegate);
    });
}(window));
