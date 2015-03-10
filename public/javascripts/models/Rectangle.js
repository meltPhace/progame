//Rectangle.js
define(['../lib/knockout-3.3.0.js'], function (ko) {
	var numRect = 1;
	function Rectangle(){
		this.name = ko.observable('rect' + numRect++);
		this.x = ko.observable(0);
		this.y = ko.observable(0);
		this.width = ko.observable(100);
		this.height = ko.observable(100);

		this.rect = ko.computed(function(){
			return {x:this.x, y:this.y, w:this.width, h:this.height};	
		});
	}
	return Rectangle;
});