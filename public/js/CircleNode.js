let xStretch = 1.5;
let r = 50;
let dataWidth = 50;
let bodyHeight = 50;



class CircleNode {

    constructor(parentCircle) {
        this.radius = r * 3;
        this.fill = "#a0c68e";
        this.level = 0;
        this.drawLevel = 0;
        this.text = "Level " + this.level;
        this.parent = parentCircle;
        this.children = [];
        this.data = null;
        this.collisionRadiusFactor = 1.2;
        this.relativesCount = undefined;
        this.angleAwayFromParent = undefined; // The angle towards the parent during instantiation.
        this.scale = 1;

        // Add to list of all circles
        if (CircleNode.allCircles === undefined)
            CircleNode.allCircles = [];
        if  (CircleNode.linkData === undefined)
            CircleNode.linkData = [];
        this.id = CircleNode.allCircles.length;
        CircleNode.allCircles.push(this);

        if (parentCircle !== null) {
            parentCircle.children.push(this);
            this.level = parentCircle.level + 1;
            this.drawLevel = this.level;
            this.text = "Level " + this.level;
            CircleNode.linkData.push({"source": parentCircle.id, "target": this.id});
            CircleNode.linkData.push({"source": this.id, "target": parentCircle.id});
        }

        this.radius = this.radius / (this.level + 2);
        // Determines if node should be colored
        if (Math.random() > 0.2) {
            this.fill = "#edf298";
        } else {
            this.drawLevel = -1;
            this.radius = this.radius * 1;
        }
    }


    setChildrenStartPositions(){
        let spawningAngle = Math.PI / 10;
        let angles = [];
        this.children.sort((a,b)=>{return a.relativesCount - b.relativesCount;});

        if (this.parent === null){
            this.angleAwayFromParent = 0;
        } else {
            this.angleAwayFromParent = getAngle(this.x - this.parent.x, this.y - this.parent.y);
        }
        for (let i = 0; i < this.children.length; i++){
            if (this.parent === null){
                angles.push(this.angleAwayFromParent + i / (this.children.length) * Math.PI * 2);
            } else{
                angles.push(this.angleAwayFromParent + (i - (this.children.length - 1) / 2) * spawningAngle);
            }
        }

        angles.sort((a,b) => {
            return (Math.abs(b - this.angleAwayFromParent) - Math.abs(a - this.angleAwayFromParent))
        });
        if (angles.length !== this.children.length)
            console.log("AssertionError");
        // }
        for (let i = 0; i < this.children.length; i++){
            let child = this.children[i];
            child.x = this.x + this.radius * 5 * Math.cos(angles[i]);
            child.y = this.y + this.radius * 5 * Math.sin(angles[i]);
        }
        return angles;
    }
}


/**
 * Return the angle of the line defined between (0,0) and (dx, dy) and a flat line.
 * @returns {number}
 */
function getAngle(dx, dy){
    let dist = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.acos(dx / dist);
    if (dy < 0) {
        angle = 2 * Math.PI - angle;
    }
    return angle;
}

CircleNode.setStartingPositions = function () {
    let sortedCircles = CircleNode.allCircles.sort(function (a, b) {
        return a.level - b.level;
    });
    for (let i = 0; i < sortedCircles.length; i++) {
        if (sortedCircles[i].parent === null){
            this.x = Math.random() * (dataWidth - 2 * r) + r;  //New random number position
            this.y = Math.random() * (bodyHeight - 2 * r) + r;  //New random number position

        }
        sortedCircles[i].setChildrenStartPositions();
    }

};

let onClick = function (d) {
        d.scale === 1 ? d.scale = 3.5 : d.scale = 1;
        d.scale === 1 ? this.drawLevel = this.level : this.drawLevel = -10;
};

CircleNode.assignRelativesCount = function () {
    let sortedCircles = CircleNode.allCircles.sort(function (a, b) {
        return b.level - a.level;
    });

    for (let i = 0; i < sortedCircles.length; i++) {
        let currentCircle = sortedCircles[i];
        currentCircle.relativesCount = 0;
        for (let j = 0; j < currentCircle.children.length; j++){
            let currentChild = currentCircle.children[j];
            currentCircle.relativesCount += currentChild.relativesCount + 1;
        }
    }

    // for (let i = 0; i < sortedCircles.length; i++) {
    //     let childCount = sortedCircles[i].children.length;
    //     sortedCircles[i].radius = r * (Math.log(childCount + 1) + 1)
    //     // sortedCircles[i].radius = r * (Math.log(childCount + 1) + 1)
    // }
};


CircleNode.clearData = function(){
    CircleNode.allCircles = [];
    CircleNode.linkData = [];
};

CircleNode.updateCircles = function () {
    CircleNode.allCircles = CircleNode.allCircles.sort(function (a, b) {
        let drawLevel = b.drawLevel - a.drawLevel;
        if (drawLevel !== 0)
            return drawLevel;
        let level = b.level - a.level;
        if (level !== 0)
            return level;
        return b.id - a.id;
    });

    CircleNode.linkNodes.data(CircleNode.allCircles)
        .attr("x1", d => {return d.x * xStretch})
        .attr("y1", d => {return d.y})
        .attr("x2", d => {return d.parent !== null ? d.parent.x * xStretch: d.x * xStretch})
        .attr("y2", d => {return d.parent !== null ? d.parent.y: d.y })
        .attr("style", "stroke:rgba(0,0,0,0.5)")
        .attr("style", d => d.parent !== null ? "stroke:rgba(0,0,0,0.5)" : "stroke:rgba(0,0,0,0.0)")
        .attr("stroke-width", d => d.parent !== null ? 6 : 0);

    CircleNode.groupNodes.data(CircleNode.allCircles)
        .attr("transform", d => "translate(" + d.x * xStretch + "," + d.y + ") scale(" + d.scale + ")")
        .attr("id", d => "CircleNode_" + d.id)
        // .on("click", d => {
        //     // if (d3.event.button === 0) {
        //     //     onClick(d);
        //     // }
        // })
    ;


    CircleNode.circles.data(CircleNode.allCircles)
        .attr("rx", function (d) {
            return d.radius * xStretch;
        })
        .attr("ry", function (d) {
            return d.radius;
        })
        .attr("fill", function (d) {
            return d.fill;
        })
        .attr("stroke", "black")
        .attr("stroke-width", function (d) {
            return d.radius / 15;
        })
    ;

    CircleNode.circleTexts.data(CircleNode.allCircles)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")

        .attr("width", function (d, i) {
            return d.radius * 2 - 10;
        })
        .attr("font-size", d => d.radius * 0.6)
        .text(function (d) {
            return d.text;
        });

};

CircleNode.drawCircles = function (svgParentElement, simulation) {
    CircleNode.assignRelativesCount();
    CircleNode.setStartingPositions();

    let lastDrag;
    let lastDragStartTime;

    let dragAlpha = 0.3;
    function dragstarted(d) {
        if (!d3.event.active && (simulation !== null || simulation !== undefined)){
            simulation.restart();
            simulation.alpha(dragAlpha);
        }
        lastDrag = d3.mouse(svgParentElement);
        d.fx = d.x;
        d.fy = d.y;
        lastDragStartTime = new Date().getTime();
    }

    function dragged(d) {
        if ((simulation !== null || simulation !== undefined)){
            simulation.restart();
            simulation.alpha(dragAlpha);
        }
        let newDrag = d3.mouse(svgParentElement);
        d.fx += (newDrag[0] - lastDrag[0]) / xStretch;
        d.fy += (newDrag[1] - lastDrag[1]);
        lastDrag = newDrag;

    }

    function dragended(d){
        if (!d3.event.active && (simulation !== null || simulation !== undefined)){
            simulation.restart();
            simulation.alpha(dragAlpha);
        }
        if (!d3.event.active && (simulation !== null || simulation !== undefined)) simulation.restart();
        d.fx = null;
        d.fy = null;
        if (new Date().getTime() - lastDragStartTime < 200){
            onClick(d);
        }
    }

    CircleNode.allCircles = CircleNode.allCircles.sort(function (a, b) {
        let drawLevel = b.drawLevel - a.drawLevel;
        if (drawLevel !== 0)
            return drawLevel;
        let level = b.level - a.level;
        if (level !== 0)
            return level;
        return b.id - a.id;
    });

    CircleNode.linkNodes = d3.select(svgParentElement).append("g").selectAll("g").data(CircleNode.allCircles).enter()
        .append("g").append("line")
    ;

    CircleNode.groupNodes = d3.select(svgParentElement).append("g").selectAll("g").data(CircleNode.allCircles)
        .enter().append("g");


    CircleNode.circles = CircleNode.groupNodes.append("ellipse")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
    ;

    CircleNode.circleTexts = CircleNode.groupNodes.append("text")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
    ;
    CircleNode.updateCircles();
};