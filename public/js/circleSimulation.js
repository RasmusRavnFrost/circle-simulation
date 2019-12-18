

function circleSimulation(svgParentElement) {

// var simulation = d3.forceSimulation()
// // .force("link", d3.forceLink().id(function(d) { return d.id; }))
//     .force("charge", d3.forceManyBody());
// .force("center", d3.forceCenter(width / 2, height / 2));

    let simulation = d3.forceSimulation()
        .force("repulsion_force", d3.forceManyBody())
        .force("center_force", d3.forceCenter(0, 0))
        .force("collision_force", d3.forceCollide(d => {return d.collisionRadiusFactor * d.radius;}))
        .force("link_force", d3.forceLink().id(function (d) {return d.id;}))
    ;
    simulation.nodes(CircleNode.allCircles);

    CircleNode.drawCircles(svgParentElement, simulation);

    let tickCount = 0;
    function ticked(){
        CircleNode.updateCircles(svgParentElement);
        tickCount++;
        // if (tickCount === 1000){
        //     simulation.force("center_force", null);
        // }

    }

    let strengthFactor = 10;
    simulation.force("link_force").iterations(strengthFactor / 10 * Math.sqrt(CircleNode.allCircles.length));
    simulation.force("repulsion_force").strength(() => {return -100 * strengthFactor / Math.sqrt(CircleNode.allCircles.length)});

    simulation.force("collision_force").strength(0.35);
    simulation.force("link_force").links(CircleNode.linkData);
    simulation.force("link_force").distance(link => {
        return (link.target.radius * link.target.collisionRadiusFactor + link.source.radius * link.source.collisionRadiusFactor)*1.1;
    });

    simulation.alphaTarget(0.1);
    // simulation.alphaDecay(0.01);
    simulation.velocityDecay(0.4);

    simulation.on("tick", ticked);
    // simulation.stop();
    return simulation;

}
