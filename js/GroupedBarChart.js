function GroupedBarChart() {
    //global variables (fields)
    //initialize default values
    var margin = {
        top: 50,
        left: 100,
        bottom: 50,
        right: 100
    };
    var width = 1000;
    var height = 600;
    var xScale = d3.scale.ordinal();
    var xScale1 = d3.scale.ordinal();   /*is this right?*/
    var yScale = d3.scale.linear();
    var xValue = function(d) {return d[0]};
    var yValues = function(d) {return d[1]};
    var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
    var yAxis = d3.svg.axis().scale(yScale).orient('left');
    var xAxisLabel = '';
    var yAxisLabel = '';
    var color = d3.scale.ordinal()
                    .domain(xScale.domain())
                    .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '##8c564b', '#e377c2', '#7f7f7f', '#bcbd22', ' #17becf']);
    var isLegend = false;
    var titlePadding = 40;
    
    //constructor
    function chart(selection) {
        selection.each(function(data) {
            
            //Convert data to standard representation greedily;
            //this is needed for nondeterministic accessors.
            data = data[0].map(function(d, i) {
                return [xValue.call(data, d, i), yValues.call(data, d, i)];
            });
            
            var groupNames = [];
            var categoryNames = [];
            var values = [];
            console.log(values);
            
            //get names of categories within each group
            data[0][1].forEach(function(d) {
                groupNames.push(Object.keys(d)[0]);
            });
            
            data.forEach(function(d) {
                categoryNames.push(d[0]);
            });
            
            data.forEach(function(d) {
                d.groups = groupNames.map(function(name, i) {values.push(+d[1][i][name]); return {name: name, value: +d[1][i][name]}; });
                d.categories = categoryNames.map(function(cat) {return {category: cat}});
            });
            
            //update xScale
            xScale.domain(data.map(function(d) {return d[0]})).rangeRoundBands([0, (width - margin.left - margin.right)], 0.1);
            
            //update xScale1
            xScale1.domain(groupNames).rangeRoundBands([0, xScale.rangeBand()]);
            
            //update yScale
            yScale.domain([0, d3.max(values)]).range([height - margin.top - margin.bottom, 0]);
            console.log(yScale.domain());
            
            
            //Select the svg element, if it exists.
            var svg = d3.select(this).selectAll('svg').data([data]);
            
            //otherwise create skeletal chart
            var gEnter = svg.enter().append("svg").append("g");
            
            gEnter.append('g').attr('class', 'x axis');
            gEnter.append('g').attr('class', 'y axis');
            gEnter.append('text').attr('class', 'x-title');
            gEnter.append('text').attr('class', 'y-title');
            
            //update outer dimensions
            svg.attr('width', width)
                .attr('height', height);
            
            //update inner dimensions
            var otherG = svg.select('g')
                            .attr('title', 'inner')
                            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
              
            gEnter.attr('width', width - margin.left - margin.right)
                .attr('height', height - margin.top - margin.bottom)
                .attr('title', 'genter')
                .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
                
            var g = svg.selectAll('g');
            
            var legend = otherG.selectAll('.legend')
                            .data(color.range().slice(0, groupNames.length));
                            
            legend.enter().append('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d, i) {return 'translate(-30, ' + (i * 19) + ')'});
                            
            legend.append('rect')
                    .attr('x', width - margin.right - 28)
                    .attr('width', 18)
                    .attr('height', 18)
                    .style('visibility', function(d) {    
                        if(!isLegend) {
                            return 'hidden';
                        } else {
                            return 'visible';
                        }
                    })
                    .attr('fill', function(d, i) {return (color.range())[i]; });
                    
            legend.append('text')
                    .attr('x', width - margin.right - 9)
                    .attr('y', 9)
                    .attr("dy", ".35em")
                    .attr('class', 'legend-text')
                    .style('visibility', function(d) {    
                        if(!isLegend) {
                            return 'hidden';
                        } else {
                            return 'visible';
                        }
                    })
                    .style("text-anchor", "start")
                    .text(function(d, i) {
                        return groupNames[i];
                    });
                    
            legend.exit().remove();
                    
            
            //update x-axis    
            g.select('.x.axis')
                .attr('transform', 'translate(0, ' + (height - margin.bottom - margin.top) + ')')
                .attr('title', 'xaxis')
                .transition()
                .duration(1000)
                .call(xAxis);

            //update y-axis    
            g.select('.y.axis')
                .transition()
                .duration(1000)
                .call(yAxis);
                
            g.select('.x-title')
                .attr('transform', 'translate(' + (((width - margin.right - margin.left) / 2) - (titlePadding / 2)) + ', ' + (height - margin.bottom - titlePadding) + ')')
                .attr('class', 'title')
                .text(xAxisLabel);
                
            g.select('.y-title')
                .attr('transform', 'translate(' + (-1 * titlePadding) + ', ' + ((height - margin.bottom) / 2) + ') rotate(-90)')
                .attr('class', 'title')
                .text(yAxisLabel);

            var barGroups = otherG.selectAll('.group')
                            .data(data);
                            
            barGroups.enter().append('g')
                        .attr('class', 'group')
                        .attr('title', function(d) {return d[0]})
                        .attr('transform', function(d) {return 'translate(' + xScale(d[0]) + ', 0)'});
                        
            barGroups.exit().remove();
            
            barGroups.transition().duration(1000)
                        .attr('transform', function(d) {return 'translate(' + xScale(d[0]) + ', 0)'});
                                   
            var bars = barGroups.selectAll('rect')
                            .data(function(d) {return d.groups});  
            
            bars.enter().append('rect')
                    .attr('x', function(d) {return xScale1(d.name)})
                    .attr('y', height - margin.top - margin.bottom)
                    .attr('width', xScale1.rangeBand())
                    .attr('height', 0)
                    .attr('fill', function(d) {return color(d.name)})
                    .attr('opacity', 1);
        
            bars.exit().remove();
            
            bars.transition().duration(1000)
                    .attr('x', function(d) {return xScale1(d.name)})
                    .attr('y', function(d) {return yScale(+d.value)})
                    .attr('width', xScale1.rangeBand())
                    .attr('fill', function(d) {return color(d.name)})
                    .attr('opacity', 1)
                    .attr('height', function(d) {return (height - margin.top - margin.bottom) - yScale(+d.value)});
            
        });
    };
    
    //set margins
    chart.margin = function(margins) {
        if(!arguments.length) {
            return margin;
        }
        margin = margins;
        return chart;
    };
    
    //set width of chart if parameter, returns current width otherwise
    chart.width = function(val) {
        if (!arguments.length) {
            return width;
        }
        width = val;
        return chart;
    };
    
    //set height of chart if parameter, returns current height otherwise
    chart.height = function(val) {
        if (!arguments.length) {
            return height;
        }
        height = val;
        return chart;
    };
    
    //specifies column id from data to use as values for x
    chart.x = function(val) {
        if (!arguments.length) {
            return xValue;
        }
        xValue = val;
        return chart;
    };
    
    //specifies column id from data to use as values for y
    //takes array of objects as parameter
    chart.y = function(arr) {
        if (!arguments.length) {
            return yValues;
        }
        yValues = arr;
        return chart;
    };
    
    //color by ordinal category. takes an array as parameter
    chart.colorScale = function(arr) {
        if(!arguments.length) {
            return color;
        }
        color.range(arr);
        return chart;
    };
    
    //set x axis label
    chart.xLabel = function(str) {
        if(!arguments.length) {
            return xAxisLabel;
        }
        xAxisLabel = str;
        return chart;
    };
    
    //set y axis label
    chart.yLabel = function(str) {
        if(!arguments.length) {
            return yAxisLabel;
        }
        yAxisLabel = str;
        return chart;
    };
    
    chart.showLegend = function(bool) {
        if(!arguments.length) {
            return isLegend;
        }
        isLegend = bool;
        return chart;
    };
   
  return chart;
}