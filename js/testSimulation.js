


function testSimulation(svgElement) {
    let data = [
        {x: -100, y: 100},
        {x: -200, y: 300},
        {x: 200, y: 200},
        {x: -300, y: -200},
        {x: 500, y: 100},
    ];
    for (let i = 0; i < data.length; i++){
        data[i].x = data[i].x/50;
        data[i].y = data[i].y/50;
    }


    let selection = d3.select(svgElement).append("g").append("g")
        .selectAll("ellipse")
        .data(data).enter().append("ellipse")
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    var simulation = d3.forceSimulation()
        // .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody());
        // .force("center", d3.forceCenter(width / 2, height / 2));

    function ticked(){
        selection
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        // console.log("update: " + data[0].x);
    }

    simulation
        .nodes(data)
        .on("tick", ticked);



}