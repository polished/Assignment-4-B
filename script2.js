console.log("Assignment 4-B");

var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('plot').clientWidth - margin.r - margin.l,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var canvas = d3.select('.canvas');
var plot = canvas
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


//Scales
var scaleX = d3.scale.linear().domain([1960,2015]).range([0,width]),
    scaleY = d3.scale.linear().domain([0,11000000]).range([height,0]);

//Axis
var axisX = d3.svg.axis()
    .orient('bottom')
    .scale(scaleX)
    .tickFormat( d3.format('d') ); //https://github.com/mbostock/d3/wiki/Formatting
var axisY = d3.svg.axis()
    .orient('right')
    .tickSize(width)
    .scale(scaleY);

//Draw axes
plot.append('g').attr('class','axis axis-x')
    .attr('transform','translate(0,'+height+')')
    .call(axisX);
plot.append('g').attr('class','axis axis-y')
    .call(axisY);

//Start importing data
var readyData = d3.csv('data/fao_combined_world_1963_2013.csv', parse, dataLoaded);


function parse(d){
    if(d['ItemName']=='Coffee, green'){
        d['ItemName']="Coffee";
    }
    var parsedRow = {

            item: d['ItemName'],
            value: +d["Value"],
            year: d['Year']

    };

    return parsedRow;

}

function dataLoaded(error, rows){

    var dataByType= d3.nest()
        .key(function(d) { return d.item; })
        .entries(rows);

    //console.log(dataByType);
    draw(dataByType);
    return dataByType;
    //console.log(rows);
}

var lineGenerator = d3.svg.line()
    .x(function(d){return scaleX(d.year)})
    .y(function(d){return scaleY(d.value)})
    .interpolate('basis');

function draw(data){
    //console.log("I AM IN DRAW!");
    //console.log(data);
    //
    //plot.selectAll('point')
    //    .data(data[0].values)
    //    .enter()
    //    .append('circle')
    //    .attr('class','tea-data-point data-point')
    //    .attr('r',3)
    //    .attr('cx', function(d){console.log(d);
    //        return scaleX(d.values[0].year);})
    //    .attr('cy', function(d){return scaleY(d.values[0].value);})
    //    .call(attachTooltip);


    var timeSeries = d3.select("svg").selectAll('.data-line') //yields a selection of 0 <path> elements
    //var timeSeries = d3.selectAll('path') //yields a selection of 0 <path> elements
        .data(data) //joins to an array of two objects
        .enter()
        .append('path') //creates two new <path> elements as the enter set
        //.attr('class', function(item){return item.key}); //each element will have class of either "coffee" or "tea"
        .attr('class', function(item){return item.key}); //each element will have class of either "coffee" or "tea"

    timeSeries
        .append('circle')
        .attr('r',3)
        .attr('cx', function(d,i){return 100*i})
        .attr('cy', function(d,i){return 100*i});


    timeSeries
        .call(attachTooltip)
        .attr('d', function(item){
            //console.log(item);
            return lineGenerator(item.values);
    });

    $(".Tea").attr('class', 'tea-data-line data-line'); // I have rename classes to match css styles. @Siqi, @Armin - is there a more elegant way to do that?
    $(".Coffee").attr('class', 'coffee-data-line data-line');
}

function attachTooltip(selection){
    selection
        .on('mouseenter',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip
                .transition()
                .style('opacity',1);
            //console.log(d.values[1].year);
            //console.log(d.values[2]);
            console.log(d.key);
            //tooltip.select('#type').text(d.key);
            //tooltip.select('#year').html(d.year);
            //tooltip.select('#value').html(d.values[1].value);
            $("#type").text(d.key);
            ////$("#type").attr('text', d.key);
            //$("#year").text(d.values[1].year);
            ////$("#year").attr('text', d.values[1].year);
            //$("#value").text(d.values[1].value);
            ////$("#value").attr('text', d.values[1].value);
        })
        .on('mousemove',function(){
            var xy = d3.mouse(canvas.node());
            //console.log(xy);

            var tooltip = d3.select('.custom-tooltip');

            tooltip
                .style('left',xy[0]+50+'px')
                .style('top',(xy[1]+50)+'px');

        })
        .on('mouseleave',function(){
            var tooltip = d3.select('.custom-tooltip')
                .transition()
                .style('opacity',0);
        })
}