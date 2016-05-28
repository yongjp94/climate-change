//This function plots circular points onto a map of the UNITED STATES
//Data is required to have latitude, longitude, and some sort of id
//to be plotted on the map
function MapPlot() {
    
    //fields and default values
    var width = 960;
    var height = 800;
    var scale = 1000; //scale for map size
    var lat;
    var lon;
    var shape;
    var size = 10;
    
    //constructs a new map with circles on it
    //the 'draw' function
    function chart(selection) {
        
        //for each element selected DOM element, draw a chart
        selection.each(function(data) {
            console.log(data);
            
            //format latitude and longitude into arrays of coordinate pairs
            data.forEach(function(d) {
                d.point = [+d.lon, +d.lat];
            });
            
            //uses an Albers projection for the USA
            var projection = d3.geo.albersUsa()
                .scale(scale)
                .translate([width / 2, height / 2]);
            
            //path of map    
            var path = d3.geo.path()
                .projection(projection);
                
            //select svg element if it exists
            var svg = d3.select(this).selectAll('svg').data([data]);
            
            //otherwise create skeletal chart
            var gEnter = svg.enter().append('svg').append('g');
            
            //update 'outer' dimensions
            svg.attr('width', width).attr('height', height);
            
            var otherG = svg.select('g').attr('title', 'weed');
            
            //update 'inner' dimensions
            gEnter.attr('width', width).attr('height', height).attr('title', 'gEnter');
            
            //appends map    
            gEnter.selectAll('.subunit')
                .data(topojson.feature(shape, shape.objects.subunits).features)
                .enter().append('path')
                    .attr('class', function(d) {return 'subunit ' + d.id; })
                    .attr('d', path);
            
            //appends borders ('boundaries') to states
            gEnter.append("path")
                .datum(topojson.mesh(shape, shape.objects.subunits, function(a, b) { return a !== b }))
                .attr("d", path)
                .attr("class", "subunit-boundary"); 
            
            //add circles
            var circles = otherG.selectAll('circle').data(data);
            
            //circles in current data set with given attributes
            circles.enter().append('circle')
                            .attr('r', function(d) {return newRange(+d[size])})
                            .attr('fill', 'blue')
                            .attr('opacity', 0)
                            .attr('cy', function(d) {var arr = projection(d.point); return arr[1]})
                            .attr('cx', function(d) {var arr = projection(d.point); return arr[0]});
            
            //remove circles not in current data set               
            circles.exit().remove();
            
            //updates circles to new positions
            circles.transition().duration(1000)
                            .attr('opacity', 0.4)
                            .attr('r', function(d) {return newRange(+d[size])})
                            .attr('cy', function(d) {var arr = projection(d.point); return arr[1]})
                            .attr('cx', function(d) {var arr = projection(d.point); return arr[0]});
                            
            //convert population to smaller range                
            function newRange(val) {
                var oldMin = d3.min(data, function(d) {return +d[size]});
                var oldMax = d3.max(data, function(d) {return +d[size]});
                var oldR = (oldMax - oldMin);
                var newR = 15;
                var newVal = (((val - oldMin) * newR) / oldR) + 6;
                return newVal;
            }
        });
    };
    
    /*--------change parameters of the chart----------*/
    
    //sets width of chart to 'value'
    chart.width = function(value) {
        if(!arguments.length) {
            return width;
        }
        width = value;
        return chart;
    };
    
    //sets height of chart to 'value'
    chart.height = function(value) {
        if(!arguments.length) {
            return height;
        }
        height = value;
        return chart;
    };
    
    //sets lat to 'value' to use to plot points on the map
    chart.lat = function(value) {
        if(!arguments.length) {
            return lat;
        }
        lat = value;
        return chart;
    };
    
    //sets lon to 'value' to use to plot points on the map
    chart.lon = function(value) {
        if(!arguments.length) {
            return lon;
        }
        lon = value;
        return chart;
    };
    
    //sets size to 'value' to use as for radius of point
    chart.size = function(value) {
        if(!arguments.length) {
            return size;
        }
        size = value;
        return chart;
    };
    
    //sets the json to make the map
    chart.map = function(obj) {
        if(!arguments.length) {
            return shape;
        }
        shape = obj;
        return chart;
    };
    
    return chart;
};