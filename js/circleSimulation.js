

function circleSimulation(svgParentElement) {

// var simulation = d3.forceSimulation()
// // .force("link", d3.forceLink().id(function(d) { return d.id; }))
//     .force("charge", d3.forceManyBody());
// .force("center", d3.forceCenter(width / 2, height / 2));

    let simulation = d3.forceSimulation()
        .force("repulsion_force", d3.forceManyBody())
        // .force("center_force", d3.forceCenter(0, 0))
        .force("collision_force", d3.forceCollide(d => {return d.collisionRadiusFactor * d.radius;}))
        .force("link_force", d3.forceLink().id(function (d) {return d.id;}))
    ;

    CircleNode.drawCircles(svgParentElement, simulation);


    function ticked(){
        CircleNode.updateCircles(svgParentElement);

    }

    simulation.nodes(CircleNode.allCircles);
    simulation.force("link_force").links(CircleNode.linkData);
    simulation.force("link_force").distance(link => {return (link.target.radius + link.source.radius)*0.9});
    simulation.on("tick", ticked);

}
