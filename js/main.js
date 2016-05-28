$(document).ready(function() {
    $('#fullpage').fullpage({
        sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', 'whitesmoke', '#ccddff'],
        anchors: ['firstPage', 'secondPage', '3rdPage', '4thpage', 'lastPage'],
        menu: '#menu',
        css3: true,
        scrollingSpeed: 1000
    });

    $('#showExamples').click(function(e){
        e.stopPropagation();
        e.preventDefault();
        $('#examplesList').toggle();
    });

    $('html').click(function(){
        $('#examplesList').hide();
    });
    
    d3.csv('data/population.csv', display);

    var graph = GroupedBarChart()
                    .width(1000)
                    .height(600)
                    .showLegend(true);

    function display(error, data) {
        console.log(data);
        graph.x(function(d) {return d.year})
                .y(function(d) {return [
                    {india: +d.india},
                    {us: +d.us},
                    // {uk: +d.uk},
                    // {russia: +d.russia},
                    // {china: +d.china},
                    // {japan: +d.japan},
                    // {germany: +d.germany}
                ]});

        var chartWrapper = d3.select('#map3')
                            .datum([data])
                            .call(graph);
    }
    
    var test = heatMap()
           .width(1200) 
           .height(580);
    
    var graph = MapPlot()
                .lat("lat")
                .lon("lon")
                .size("pop");

    d3_queue.queue()
        .defer(d3.json, 'json/us.json')
        .defer(d3.csv, 'data/1970.csv')
        .defer(d3.csv, 'data/1980.csv')
        .defer(d3.csv, 'data/1990.csv')
        .defer(d3.csv, 'data/2000.csv')
        .defer(d3.csv, 'data/2010.csv')
        .await(function(error, s, a, b, c, d, e) {
            graph.map(s);
            draw();
            console.log(a);
            $('#button1').on('click', function() {
                draw(a);
            });
            $('#button2').on('click', function() {
                draw(b);
            });
            $('#button3').on('click', function() {
                draw(c);
            });
            $('#button4').on('click', function() {
                draw(d);
            });
            $('#button5').on('click', function() {
                draw(e);
            });
        });
    
    function draw(set) {
        var guy = [];
        if (arguments.length) {
            guy = set;
        }
        d3.select('#map2')
            .datum(guy)
            .call(graph);
    }
});