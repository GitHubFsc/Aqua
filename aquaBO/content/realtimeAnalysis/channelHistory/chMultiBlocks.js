// @formatter:off
(function(JS){
    var analysis = JS.namespace('auAnalysis'),
        RatingLineChart = JS.checkExist('auAnalysis.RatingLineChart');
// @formatter:on
    var CHMultiBlocks = analysis.CHMultiBlocks = function(option) {
        this.channels = option && option.channels || [];
        this.params = option && option.params;
        this.init();
    };

    CHMultiBlocks.prototype = {
        availableSteps: [{
            steps: [50, 25, 10, 5, 2],
            intervals: [1, 2, 5, 10, 25],
        }],

        init: function() {
            this.container = this.params && this.params.container;
            this.unitRate = this.params && this.params.unitRate;
            this.topSpare = this.params && this.params.topSpare;
            this.blockHeight = this.params && this.params.blockHeight;
            this.widthRef = this.container.width();
            this.availableStep = this.availableSteps[0];
            this.stepWidth = this.availableStep.steps[0];
            this.indiSpace = this.availableStep.steps[0];
            this.firstSpare = Math.floor(this.indiSpace/2);
            this.setStepWidth();
        },

        setStepWidth: function() {
            var channel = this.channels[0];
            if (!channel) {
                return;
            }
            var days = channel.days || [];
            var times = days[0] && days[0].details || [];

            var timeRecords = [];
            times.forEach(function(e, i) {
                timeRecords.push(e.time);
            });

            this.timeRecords = timeRecords;

            var lmt = timeRecords.length;
            var total = lmt * days.length;
            var needs = this.stepWidth * total;

            var steps = this.availableStep.steps;
            var stepIndex = 0;
            while (stepIndex < 4) {
                if (needs < this.widthRef) {
                    break;
                } else {
                    stepIndex++;
                    this.stepWidth = steps[stepIndex];
                    needs = this.stepWidth * total;
                }
            }
            var interval = this.availableStep.intervals[stepIndex];
            
            var tmpLabels = [];
            for (var k = 0; k < lmt; k += interval) {
                tmpLabels.push(timeRecords[k]);
            }
            this.indiLabels = tmpLabels;
        },

        getBlocks: function() {
            var days = this.channels && this.channels[0] && this.channels[0].days || [];
            var frag = document.createDocumentFragment();
            for (var i = 0, len = days.length; i < len; i++) {
                var lineChart = new RatingLineChart({
                    channels: this.channels,
                    params: {
                        unitRate: this.unitRate,
                        blockHeight: this.blockHeight,
                        topSpare: this.topSpare,
                        indiSpace: this.indiSpace,
                        stepWidth: this.stepWidth,
                        firstSpare: this.firstSpare
                    },
                    dayIndex: i,
                    timeRecords: this.timeRecords,
                    indiLabels: this.indiLabels,
                }).getChart();
                frag.appendChild(lineChart);
            }
            this.container.empty().append(frag);
        },

    };

    // @formatter:off
}(window.JS));
// @formatter:on