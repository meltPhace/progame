//Rectangle.js
define(['../lib/knockout-3.3.0.js'], function (ko) {
	var numRect = 1;
	function Rectangle(){
		this.name = ko.observable('rect' + numRect++);
		this.x = ko.observable(0);
		this.y = ko.observable(0);
		this.width = ko.observable(120);
		this.height = ko.observable(80);
		this.lastPosition = ko.observable();

		this.rect = ko.computed(function () {
			return { 
				x: this.x(), y: this.y(), width: this.width(), height: this.height() 
			};
		}, this);

		this.saveLastPosition = this.saveLastPosition.bind(this);
	};

	Rectangle.prototype.saveLastPosition = function(rect) {
		this.lastPosition({
			x: rect.x, y: rect.y, width: rect.width, height: rect.height 
		});
	};

	return Rectangle;
});