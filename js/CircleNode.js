let linkData = [];
let xStretch = 1.5;
let r = 50;
let dataWidth = 50;
let bodyHeight = 50;

class CircleNode {

    constructor(parentCircle) {
        this.radius = ((Math.random() - 0.5) * 1 + 1) * r;
        this.fill = "rgb(200,200,150)";
        this.level = 0;
        this.drawLevel = 0;
        this.text = "Level " + this.level;
        this.parent = parentCircle;
        this.children = [];
        this.data = null;
        this.collisionRadiusFactor = 1;
        this.stuckToParent = false;
        this.relativeParentPosition = null;

        // Add to list of all circles
        if (CircleNode.allCircles === undefined)
            CircleNode.allCircles = [];
        if  (CircleNode.linkData === undefined)
            CircleNode.linkData = [];
        this.id = CircleNode.allCircles.length;
        CircleNode.allCircles.push(this);

        let angle;
        // Assign values dependent on parent
        if (parentCircle === null) {
            // this.x = Math.random() * (dataWidth - 2 * r) + r - 0.5 * dataWidth;  //New random number position
            // this.y = Math.random() * (bodyHeight - 2 * r) + r - 0.5 * bodyHeight;  //New random number position
            this.x = Math.random() * (dataWidth - 2 * r) + r;  //New random number position
            this.y = Math.random() * (bodyHeight - 2 * r) + r;  //New random number position
        }
        else {
            parentCircle.children.push(this);
            this.stuckToParent = true;
            this.level = parentCircle.level + 1;
            this.drawLevel = this.level;
            this.text = "Level " + this.level;
            angle = parentCircle.getChildStartAngle();
            // console.log(angle);
            this.x = parentCircle.x + parentCircle.radius * 0.01 * Math.cos(angle) * r*10;
            this.y = parentCircle.y + parentCircle.radius * 0.01 * Math.sin(angle) * r*10;
            this.relativeParentPosition = {dx: this.x - parentCircle.x, dy: this.y - parentCircle.y};
            // linkData.push({"source" : this.id, "target" : parent.id})
            CircleNode.linkData.push({"source": parentCircle.id, "target": this.id})
        }

        // Determines if node should be revealed
        if (Math.random() > 0.2) {
            this.collisionRadiusFactor = 0.5;
            this.fill = "rgb(150,140,200)";
            // this.level = -1;
        } else {
            this.drawLevel = -1;
            this.radius = this.radius * 1;
        }

        // Finds child starting angle
        this.childAngleCount = 0;
        if (parentCircle === null)
            this.childrenStartAngle = Math.random() * Math.PI * 2;
        else {
            let dx = this.x - parentCircle.x;
            let dy = this.y - parentCircle.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            this.childrenStartAngle = Math.acos(dx / dist);
            if (dy < 0) {
                this.childrenStartAngle = 2 * Math.PI - angle;
            }
        }
    }

    // getHtml() {
    //     let html = '<g>' +
    //         '<ellipse ' +
    //         'fill="rgb(200,200,150)" ' +
    //         'stroke="black" ' +
    //         'stroke-width="' + this.radius / 10 + '" ' +
    //         // 'cx="' + this.x * xStretch + '" ' +
    //         // 'cy="' + this.y + '" ' +
    //         'rx="' + this.radius * xStretch + '" ' +
    //         'ry="' + this.radius + '" ' +
    //         '></ellipse>' +
    //         '<text ' +
    //         'text-anchor="middle" ' +
    //         'alignment-baseline="middle" ' +
    //         'font-size="20" ' +
    //         'width="' + this.radius * 1.8 * xStretch + '">' +
    //         // 'x="' + this.x * xStretch + '" ' +
    //         // 'y="' + this.y + '" ' +
    //         '</text>' +
    //         '</g>';
    //     // if (this.parent !== null) {
    //     //     html += '<line ' +
    //     //         'text-anchor="middle" ' +
    //     //         'alignment-baseline="middle" ' +
    //     //         'font-size="20" ' +
    //     //         'width="' + this.radius * 1.8 * xStretch + '" ' +
    //     //         // 'x="' + this.x * xStretch + '" ' +
    //     //         // 'y="' + this.y + '" ' +
    //     //         '></line>';
    //     // }
    //
    //     // links = svg.selectAll("line").data(Circle.allCircles).enter().append("line")
    //     //     .attr("x1", function (d, i){return screenCoordX(d.x);})
    //     //     .attr("y1", function (d, i){return screenCoordY(d.y);})
    //     //     .attr("x2", function (d, i){if (d.parent !== null) return screenCoordX(d.parent.x); return screenCoordX(d.x);})
    //     //     .attr("y2", function (d, i){if (d.parent !== null) return screenCoordY(d.parent.y); return screenCoordY(d.y);})
    //     //     .attr("style", "stroke:rgba(0,0,0,0.5)")
    //     //     .attr("stroke-width", 4 * zoomFactor);
    //
    //     return html;
    // }


    // This method returns an appropriate randoms child start angle.
    getChildStartAngle () {
        let angle;
        if (this.parent === null) {
             angle = this.childrenStartAngle + Math.PI * 2 / this.children.length * this.childAngleCount;
        } else {
            angle = this.childrenStartAngle + 3 * (1 - 1.0 / (1 + this.childAngleCount * this.childAngleCount)) * Math.pow(-1, this.childAngleCount);
        }
        this.childAngleCount += 1;
        return angle;
    };

}

let groupNodes;
let linkNodes;

CircleNode.updateCircles = function () {
    CircleNode.allCircles = CircleNode.allCircles.sort(function (a, b) {
        return b.drawLevel - a.drawLevel;
    });
    CircleNode.groupNodes
        .attr("transform", d => "translate(" + d.x * xStretch + "," + d.y + ")")
    ;
    CircleNode.linkNodes
        .attr("x1", d => {return d.x * xStretch})
        .attr("y1", d => {return d.y})
        .attr("x2", d => {return d.parent !== null ? d.parent.x * xStretch: d.x * xStretch})
        .attr("y2", d => {return d.parent !== null ? d.parent.y: d.y })
    ;
};

CircleNode.drawCircles = function (svgParentElement, simulation) {

    let lastDrag;

    function dragstarted(d) {
        if (!d3.event.active && (simulation !== null || simulation !== undefined)){
            simulation.restart();
            simulation.alpha(1);
        }
        lastDrag = d3.mouse(svgParentElement);
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        if ((simulation !== null || simulation !== undefined)){
            simulation.restart();
            simulation.alpha(1);
        }
        let newDrag = d3.mouse(svgParentElement);
        // d.fx += newDrag[0] - lastDrag[0];
        // d.fy += (newDrag[1] - lastDrag[1]);
        d.fx += (newDrag[0] - lastDrag[0]) / xStretch;
        d.fy += (newDrag[1] - lastDrag[1]);
        lastDrag = newDrag;

    }

    function dragended(d){
        if (!d3.event.active && (simulation !== null || simulation !== undefined)){
            simulation.restart();
            simulation.alpha(1);
        }
        if (!d3.event.active && (simulation !== null || simulation !== undefined)) simulation.restart();
        d.fx = null;
        d.fy = null;
    }

    CircleNode.allCircles = CircleNode.allCircles.sort(function (a, b) {
        return b.drawLevel - a.drawLevel;
    });

    CircleNode.linkNodes = d3.select(svgParentElement).append("g").selectAll("g").data(CircleNode.allCircles).enter()
        .append("g")
        .append("line")
        .attr("x1", d => {return d.x * xStretch})
        .attr("y1", d => {return d.y})
        .attr("x2", d => {return d.parent !== null ? d.parent.x * xStretch: d.x * xStretch})
        .attr("y2", d => {return d.parent !== null ? d.parent.y: d.y })
        .attr("style", "stroke:rgba(0,0,0,0.5)")
        .attr("style", d.parent != null ? "stroke:rgba(0,0,0,0.5)" : "stroke:rgba(0,0,0,0.0)")
        .attr("stroke-width", d.parent != null ? 4 : 0);

    CircleNode.groupNodes = d3.select(svgParentElement).append("g").selectAll("g").data(CircleNode.allCircles).enter()
        .append("g")
        .attr("transform", d => "translate(" + d.x * xStretch + "," + d.y + ")")
    ;


    let circles = CircleNode.groupNodes.append("ellipse")
        // .attr("cx", function (d, i) {
        //     return d.x;
        // })
        // .attr("cy", function (d, i) {
        //     return d.y;
        // })
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
            return d.radius / 10;
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
    ;

    let circleTexts = CircleNode.groupNodes.append("text")
        // .attr("x", function (d, i) {
        //     return d.x;
        // })
        // .attr("y", function (d, i) {
        //     return d.y;
        // })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")

        .attr("width", function (d, i) {
            return d.radius * 2 - 10;
        })
        .attr("font-size", d => d.radius * 0.4)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .text(function (d) {
            return d.text;
        });
};