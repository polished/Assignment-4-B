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

    console.log(dataByType);
    draw(dataByType);
    return dataByType;
    //console.log(rows);
}

var lineGenerator = d3.svg.line()
    .x(function(d){return scaleX(d.year)})
    .y(function(d){return scaleY(d.value)})
    .interpolate('basis');

function draw(data){
    console.log("I AM IN DRAW!");
    console.log(data);

    //var timeSeries = d3.selectAll('.data-line') //yields a selection of 0 <path> elements
    var timeSeries = d3.selectAll('path') //yields a selection of 0 <path> elements
        .data(data) //joins to an array of two objects
        .enter()
        .append('path') //creates two new <path> elements as the enter set
        .style("stroke", "#f00")
        .attr('class', function(item){return item.key}); //each element will have class of either "coffee" or "tea"

    timeSeries
        .attr('d', function(item){
            return lineGenerator(item.values);
    });
}