//indexVM.js
require(['./javascripts/lib/knockout-3.3.0.js', './javascripts/lib/d3.js', './javascripts/ajaxhelpers/ajaxGet.js', './javascripts/models/Rectangle.js', './javascripts/lib/domready.js'], function (ko, d3, ajaxGet, Rectangle) {

	function ViewModel() {
		this.lastSavedJson = ko.observable();
		this.rectangles = ko.observableArray([]);
        this.innerWidth = ko.observable(
            isNaN(window.innerWidth) ? window.clientWidth : window.innerWidth - (100)
        );
        this.svgHeight = 400;

		//function bindings
		this.addRect = this.addRect.bind(this);
		this.removeRect = this.removeRect.bind(this);
		this.saveRects = this.saveRects.bind(this);
	};

	ViewModel.prototype.addRect = function() {
		this.rectangles.push(new Rectangle());
	};

	ViewModel.prototype.removeRect = function() {
		this.rectangles.shift();
	};

	ViewModel.prototype.saveRects = function() {
		this.lastSavedJson(ko.toJSON(this.rectangles(), null, 2));
	};

	var drag = d3.behavior.drag()
	    .origin(Object)
	    .on("drag", function (d) {

            if(parseInt(d.x()) + d3.event.dx <= 0){
                d3.event.dx = 0;
                d.x(0);
            }

            if(parseInt(d.x()) + d3.event.dx >= vm.innerWidth() - 100){
                d3.event.dx = 0;
                d.x(vm.innerWidth() - 100);
            }

            if(parseInt(d.y()) + d3.event.dy <= 0){
                d3.event.dy = 0;
                d.y(0);
            }

            if(parseInt(d.y()) + d3.event.dy >= (vm.svgHeight - parseInt(d.height()))){
                d3.event.dy = 0;
                d.y((vm.svgHeight - parseInt(d.height())));
            }

            vm.rectangles.foreach(function (rect) {
                
            });

            //update de la position du rectangle dans le viewmodel
	    	d.x(parseInt(d.x()) + d3.event.dx);
			d.y(parseInt(d.y()) + d3.event.dy);
		});


    var vm = new ViewModel();
    ko.applyBindings(vm);

    function update(data) {

        // selection des rectangles selon les données
        var rects = d3.select("#svg")
            .selectAll("rect")
            .data(data, function (d) { return d.name(); });

        // Creation des nouveaux elements avec une transition
        rects.enter()
            .append("rect")
            .attr("id", function (d) { return d.name(); })
            .attr("opacity", 0.0)
            .style("fill", "#337AB7")//bleu
            .transition()
            .duration(1000)
            .attr("opacity", 0.8);

        // Update des rectangles existants
        rects.attr("x", function (d) { return d.x(); })
            .attr("y", function (d) { return d.y(); })
            .attr("width", function (d) { return d.width(); })
            .attr("height", function (d) { return d.height(); })
            .attr("cursor", "move")
            .call(drag);

        //rectangle events
        rects.on("dblclick", function (e) {
            alert("Double clic on " + e.name());
        });

        rects.exit().remove();
    };

    var subs = []; // souscriptions
    // Souscription à la liste des rectangles
    vm.rectangles.subscribe(function (newValue) {
        update(newValue);
        // Dispose pour les souscriptions existantes 
        ko.utils.arrayForEach(subs, function (sub) { 
        	sub.dispose(); 
        });
        // les nouvelles souscriptions en cas d'ajout
        ko.utils.arrayForEach(newValue, function (item) {
            subs.push(item.rect.subscribe(function () {
                update(newValue);
            }));
        });
    });
});