


function testSimulation(svgElement) {
    let data = [
        {id: 0, x: -100, y: 100},
        {id: 1, x: -200, y: 300},
        {id: 2, x: 200, y: 200},
        {id: 3, x: -300, y: -200},
        {id: 4, x: 500, y: 100},
        {id: 5, x: 500, y: 100},
        {id: 6, x: 500, y: 100},
    ];

    let links = [
        {source : 0, target: 1, value: 1},
        {source : 1, target: 0, value: 1},
        {source : 1, target: 2, value: 1},
        {source : 2, target: 3, value: 1},
        {source : 3, target: 0, value: 1},
        {source : 4, target: 0, value: 1},
        {source : 5, target: 0, value: 1},
        {source : 6, target: 0, value: 1},
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

    let link = d3.select(svgElement).append("g").append("g")
        // .attr("class", "links")
        .selectAll("line")
        .data(links).enter().append("line")
        .attr("x1", function(d) { return data[d.source].x; })
        .attr("y1", function(d) { return data[d.source].y; })
        .attr("x2", function(d) { return data[d.target].x; })
        .attr("y2", function(d) { return data[d.target].y; })
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); })
        .attr("stroke", "red")
    ;

    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        // .force("link", d3.forceLink())
        // .force("center", d3.forceCenter(0, 0))
        .force("charge", d3.forceManyBody())
    ;

    simulation.nodes(data);
    simulation.force("link")
        .links(links);
    simulation.on("tick", ticked);


    function ticked(){
        selection
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; })
        ;

        // console.log("update: " + data[0].x);
    }





}
