function ChartAxes(options) {
	jQuery.extend(this, options);

	if (!this.container) {
		return null;
	}
	this.init();
};

ChartAxes.prototype = {
	init: function() {
		this.lineSize = 1;
		this.steps = this.steps|| 8;
		this.stepSize = this.stepSize || 45;
		this.marginLeft = this.marginLeft || 35;
		this.marginTop = this.marginTop || 35;
		this.marginRight = this.marginRight || 5;
		this.offsetLeft = this.offsetLeft || 15;
		this.offsetTop = this.offsetTop || 10;
		this.offsetBottom = this.offsetBottom || 15;
	},

	styles: {
		textColor: 'rgb(121,121,121)',
		axColor: 'rgb(154,154,154)',
		indiColor: 'rgb(226,226,226)',
		textFont: '12px Arial',
	},

	getInstance: function() {
		var totalStep = this.steps * this.stepSize;
		this.origin = {
			x: this.marginLeft + this.offsetLeft,
			y: this.marginTop + this.offsetTop + totalStep,
		};
		
		var canvsHeight = this.origin.y + this.offsetBottom;
		
		this.rect = {
			width: Number(this.width),
			height: canvsHeight
		};
		
		var canvs = document.createElement('canvas');
		canvs.width = this.width.toString();
		canvs.height = canvsHeight.toString();
		canvs.style.zIndex = '1';

		var ctx = canvs.getContext('2d');
		
		var xWidth = this.width - this.origin.x - this.marginRight;

		ctx.lineWidth = this.lineSize;
		ctx.moveTo(this.xTrans(0), this.yTrans(0 - this.offsetBottom));
		ctx.lineTo(this.xTrans(0), this.yTrans(totalStep + this.offsetTop));

		ctx.moveTo(this.xTrans(0 - this.offsetLeft), this.yTrans(0));
		ctx.lineTo(this.xTrans(xWidth), this.yTrans(0));

		ctx.stokeStyle = this.styles.axColor;
		ctx.stroke();

		this.iLabels = [];
		this.iLabelsUnfixed = [];
		ctx.fillStyle = this.styles.textColor;
		for (var i = 1; i <= this.steps; i++) {
			var yCoord = i * this.stepSize;
			ctx.moveTo(this.xTrans(0), this.yTrans(yCoord));
			ctx.lineTo(this.xTrans(xWidth), this.yTrans(yCoord));
			ctx.font = this.styles.textFont;
			ctx.textAlign = 'right';
			var iLabel = yCoord;
			if ( typeof this.pointWeight !== 'undefined') {
				iLabel *= this.pointWeight;
			}
			if ( typeof this.division !== 'undefined') {
				iLabel /= this.division;
			}
			if ( typeof this.maxLmt !== 'undefined' && iLabel > this.maxLmt) {
				continue;
			}
			if ( typeof this.minLmt !== 'undefined' && iLabel < this.minLmt) {
				continue;
			}

			var prevLabelValue = this.iLabelsUnfixed[this.iLabelsUnfixed.length - 1];
			if ( typeof this.minStep !== 'undefined' && (iLabel - prevLabelValue) < this.minStep) {
				continue;
			}

			var iLabelUnfixed = iLabel;
			iLabel = iLabel.toFixed(this.precision);
			if (this.iLabels.indexOf(iLabel) > -1) {
				continue;
			}
			this.iLabels.push(iLabel);
			this.iLabelsUnfixed.push(iLabelUnfixed);
			ctx.fillText(iLabel, this.xTrans(-5), this.yTrans(yCoord));
		}

		ctx.strokeStyle = this.styles.indiColor;
		ctx.stroke();

		return canvs;
	},

	getAxes: function() {
		if (this.object) {
			this.object.remove();
		}
		this.object = jQuery(this.getInstance()).prependTo(this.container);
	},

	xTrans: function(axX) {
		return this.origin.x + axX;
	},

	yTrans: function(axY) {
		return this.origin.y - axY;
	},

	update: function(params) {
		this.division = params && params.division;
		this.precision = params && params.precision;
		this.pointWeight = params && params.pointWeight;
		this.steps = params && params.steps;
		this.stepSize = params && params.stepSize;
		this.getAxes();
	},

}; 