let svgElement = document.getElementById("mainCanvas");
let handler = SvgZoomAndDrag(svgElement);
handler.setZoom(0.5);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
let simulation;

function restartSimulation() {
    if (simulation !== null && simulation !== undefined){
        simulation.stop();
    }

    CircleNode.clearData();
    svgElement.innerHTML = '<g class="canvasGroup" id="mainGroup"></g>';
    let numberOfCirles = parseInt(document.getElementById("numberOfCircles").value);
    let numberOfBranches= parseInt(document.getElementById("numberOfBranches").value);


    for (let branch = 0; branch < numberOfBranches; branch++) {
        let startNode = new CircleNode(null);
        let branchNodes = [startNode];
        startNode.x = branch* numberOfCirles * 5;
        for (let i = 0; i < numberOfCirles; i++) {
            let index = getRandomInt(0, branchNodes.length);
            if (branchNodes[index].children.length < 2 && Math.random() > 0.1)
                index = getRandomInt(0, branchNodes.length);
            if (branchNodes[index].children.length < 2 && Math.random() > 0.1)
                index = getRandomInt(0, branchNodes.length);
            let newNode = new CircleNode(branchNodes[index]);

            branchNodes.push(newNode);
        }
    }
    let mainGroup = document.getElementById("mainGroup");


    simulation = circleSimulation(mainGroup);
    handler.setZoom(0.5);
}
restartSimulation();
