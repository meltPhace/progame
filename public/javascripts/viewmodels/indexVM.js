//indexVM.js
require(['./javascripts/lib/knockout-3.3.0.js', './javascripts/lib/d3.js', './javascripts/ajaxhelpers/ajaxGet.js', './javascripts/models/Rectangle.js', './javascripts/lib/domready.js'], function (ko, d3, ajaxGet, Rectangle) {

	function ViewModel() {
		this.lastSavedJson = ko.observable();
		this.selectedRect = ko.observable();
		this.rectangles = ko.observableArray([]);

		//function bindings
		this.addRect = this.addRect.bind(this);
		this.removeRect = this.removeRect.bind(this);
		this.saveRects = this.saveRects.bind(this);
	};

	ViewModel.prototype.addRect = function() {
		this.selectedRect(new Rectangle());
		this.rectangles().push(this.selectedRect());
	};

	ViewModel.prototype.removeRect = function() {
		this.rectangles().remove(this.selectedRect());
	};

	ViewModel.prototype.saveRects = function() {
		this.lastSavedJson(ko.toJSON(this.rectangles(), null, 2));
	};

	var drag = d3.behavior.drag()
	    .origin(Object)
	    .on("drag", function (d) {
	    	// Update the view model
	    	d.x(parseInt(d.x()) + d3.event.dx);
			d.y(parseInt(d.y()) + d3.event.dy);
		});


    var vm = new ViewModel();
    ko.applyBindings(vm);

    function update(data) {
        // Join elements with data
        var rects = d3.select("#svg")
            .selectAll("rect")
            .data(data, function (d) { return d.name(); });
        // Create new elements by transitioning them in
        rects.enter()
            .append("rect")
            .attr("id", function (d) { return d.name(); })
            .attr("opacity", 0.0)
            .transition()
            .duration(1000)
            .attr("opacity", 0.5);
        // Update existing ones by setting their x, y, etc
        rects.attr("x", function (d) { return d.x(); })
            .attr("y", function (d) { return d.y(); })
            .attr("width", function (d) { return d.width(); })
            .attr("height", function (d) { return d.height(); })
            .call(drag);
        rects.exit().remove();
    };

    var subs = []; // for keeping track of subscriptions
    // Listen for changes to the view model data...
    vm.rectangles.subscribe(function (newValue) {
        update(newValue);
        // Dispose any existing subscriptions 
        ko.utils.arrayForEach(subs, function (sub) { 
        	sub.dispose(); 
        });
        // And create new ones...
        ko.utils.arrayForEach(newValue, function (item) {
            subs.push(item.rect.subscribe(function () {
                update(newValue);
            }));
        });
    });
    // Add one to get us started
    vm.rectangles.push(new Rectangle());
});