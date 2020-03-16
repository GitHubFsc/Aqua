// @formatter:off
(function(JS){
    
    var analysis = JS.namespace('auAnalysis'),
        RatingBlockView = JS.checkExist('auAnalysis.RatingBlockView');
    // @formatter:on
    var RatingSplitChart = analysis.RatingSplitChart = function(option) {
        this.channel = option && option.channel;
        this.params = option && option.params;
        this.init();
    };

    RatingSplitChart.prototype = {
        // @formatter:off
        availableSteps: [null,
            [4, 2, 1],
            [8, 4, 2],
            [12, 6, 3]
        ],
        // @formatter:on
        init: function() {
            this.container = this.params && this.params.container;
            this.unitRate = this.params && this.params.unitRate;
            this.topSpare = this.params && this.params.topSpare;
            this.blockHeight = this.params && this.params.blockHeight;
            this.widthRef = this.container.width();
            var pref;
            if (window.PROGRAM_HISTORY_POINT_MIN_SPAN === 1) {
                pref = 1;
            } else if (window.PROGRAM_HISTORY_POINT_MIN_SPAN === 2) {
                pref = 2;
            } else if (window.PROGRAM_HISTORY_POINT_MIN_SPAN === 3) {
                pref = 3;
            } else {
                pref = 2;
            }
            this.availableStep = this.availableSteps[pref];
            this.stepWidth = this.availableStep[0];
            this.setStepWidth();
        },

        setStepWidth: function() {
            var days = this.channel.days || [];
            var times = days[0] && days[0].details || [];

            var lmt = times.length;

            var blocks = days.length;
            var max = lmt * blocks;
            var needs = max * this.stepWidth;
            if (needs > this.widthRef) {
                this.stepWidth = this.availableStep[1];
                needs = max * this.stepWidth;
                if (needs > this.widthRef) {
                    this.stepWidth = this.availableStep[2];
                }
            }

            if (this.stepWidth * lmt < 75) {
                this.stepWidth = Math.ceil(75 / (lmt - 1));
            }
        },

        getBlocks: function() {
            var days = this.channel.days || [];
            var frag = document.createDocumentFragment();
            this.blocks = [];
            for (var i = 0, len = days.length; i < len; i++) {
                var _day = days[i];
                var dayBlock = new RatingBlockView({
                    day: _day,
                    params: {
                        blockHeight: this.blockHeight,
                        unitRate: this.unitRate,
                        topSpare: this.topSpare,
                        stepWidth: this.stepWidth
                    }
                });
                this.blocks.push(dayBlock);
                var dbView = dayBlock.getBlockView();
                jQuery(dbView).attr('blockindex', i);
                frag.appendChild(dbView);
            }

            var self = this;
            this.container.empty().append(frag);
            this.container.unbind().on('click', function(ev) {
                var target = ev.target;
                self.toggleZoom(target);
            });
        },

        toggleZoom: function(target) {
            var $block, $target = jQuery(target);
            if ($target.attr('blockindex')) {
                $block = $target;
            } else {
                $block = $target.parent('div[blockindex]');
            }
            if ($block && $block.length > 0) {
                var index = $block.attr('blockindex');
                var blockViews = this.container.children('div');
                var block = this.blocks[index];
                if (this.blockZoomIn) {
                    this.blockZoomIn.zoomOut();
                    blockViews.each(function(i, e) {
                        var $e = jQuery(e);
                        if ($e.hasClass('program_history_zoom_one')) {
                            $e.removeClass('program_history_zoom_one');
                        }
                        if ($e.hasClass('program_history_zoom_others')) {
                            $e.removeClass('program_history_zoom_others');
                        }
                    });

                    if(this.blockZoomIn === block) {
                        this.blockZoomIn = null;
                        return;
                    }
                    this.blockZoomIn = null;
                }
                
                this.blockZoomIn = block;
                this.blockZoomIn.zoomIn();
                blockViews.each(function(i, e) {
                    var $e = jQuery(e);
                    if ($e.attr('blockindex') == index) {
                        if (!$e.hasClass('program_history_zoom_one')) {
                            $e.addClass('program_history_zoom_one');
                        }
                    } else {
                        if (!$e.hasClass('program_history_zoom_others')) {
                            $e.addClass('program_history_zoom_others');
                        }
                    }
                });

            }
        }

    };

    // @formatter:off
}(window.JS));
// @formatter:on