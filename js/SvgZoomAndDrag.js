/**
 * This script lets you assign a svg elements to be zoomable and draggable with the mouse (zoom using scroll bar).
 *
 * Requirements: d3
 *
 * Example of usage:
 * let svgElement = document.getElementById("mySvgElementId");
 * let handler = SvgZoomAndDrag(svgElement);
 */

/**
 * This function lets you assign an svg element to be zoomable with the mouse scroll bar and to be draggable also by
 * the mouse.
 *
 * The return objects is a object with following properties, and allows you to set zoom and translational offset
 * manually if so desired:
 * {
 *    setZoom: function(newZoomFactor),
 *    getZoom: function(),
 *    getTranslateOffset: function(),
 *    setTranslateOffset: function(newOffset)
 * }
 * @param svgElement
 * @returns (object)
 * @constructor
 */



function SvgZoomAndDrag(svgElement) {
    if (svgElement === null)
        return null;
    let zoomFactor = 1;
    let translateOffset = {x: 0, y: 0};
    let lastDrag;
    let maxZoom = 4;
    let minZoom = 0.01;
    let zoomStep = 0.075;

    /**
     *
     * Handless mouse scroll event
     * @param e scroll-event
     */
    function MouseWheelHandler(e) {
        // cross-browser wheel delta
        e = window.event || e; // old IE support
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        zoomFactor = (1 + delta * zoomStep) * zoomFactor;
        zoomFactor = Math.max(zoomFactor, minZoom);
        zoomFactor = Math.min(zoomFactor, maxZoom);
        UpdateZoom()
    }

    /**
     * Updates scale to current zoom factor value
     */
    function UpdateZoom() {
        let translateCenter = {
            x: svgElement.getBoundingClientRect().width / 2 + translateOffset.x,
            y: svgElement.getBoundingClientRect().height / 2 + translateOffset.y
        };
        let children = svgElement.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            let transformObj = matrixToTransformObj(cssToMatrix(child));
            transformObj.translate = translateCenter;
            transformObj.scale = {x: zoomFactor, y: zoomFactor};
            child.setAttribute("transform", ObjToTransform(transformObj));
            // console.log(transformObj);
        }
    }

    function dragstarted(d) {
        lastDrag = d3.mouse(svgElement);
    }

    function dragged(d) {
        let newDrag = d3.mouse(svgElement);
        translateOffset.x += newDrag[0] - lastDrag[0];
        translateOffset.y += (newDrag[1] - lastDrag[1]);
        lastDrag = newDrag;
        UpdateZoom();
    }

    // Add listener to svgElement
    if (svgElement.addEventListener) {
        // IE9, Chrome, Safari, Opera
        svgElement.addEventListener("mousewheel", MouseWheelHandler, false);
        // Firefox
        svgElement.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
        // IE 6/7/8
    } else {
        svgElement.attachEvent("onmousewheel", MouseWheelHandler);
    }
    window.addEventListener("resize", UpdateZoom);
    svgElement.addEventListener("resize", UpdateZoom);
    d3.select(svgElement)
        .call(d3.drag()
            .on("drag", dragged)
            .on("start", dragstarted)
        );


    UpdateZoom();
    return {
        setZoom: function(newZoomFactor) {
            zoomFactor = newZoomFactor;
            UpdateZoom();
        },
        getZoom: function() {
            return zoomFactor;
        },
        getTranslateOffset: function() {
            return translateOffset;
        },
        setTranslateOffset: function(newOffset) {
            translateOffset = newOffset;
            UpdateZoom();
        }
    };
}

/**
 * Retrieves element transformation as a matrix
 *
 * Note that this will only take translate and rotate in account,
 * also it always reports px and deg, never % or turn!
 *
 * @param element
 * @return string matrix
 */
let cssToMatrix = function (element) {
    // let element = document.getElementById(elementId),
    let style = window.getComputedStyle(element);

    return style.getPropertyValue("-webkit-transform") ||
        style.getPropertyValue("-moz-transform") ||
        style.getPropertyValue("-ms-transform") ||
        style.getPropertyValue("-o-transform") ||
        style.getPropertyValue("transform");
};

/**
 * Transforms matrix into an object
 *
 * @param string matrix
 * @return object
 */
let matrixToTransformObj = function (matrix) {
    // this happens when there was no rotation yet in CSS
    if (matrix === 'none') {
        matrix = 'matrix(1,0,0,0,0)';
    }
    let obj = {},
        values = matrix.match(/([-+]?[\d\.]+)/g);

    obj.rotate = (Math.round(
            Math.atan2(
                parseFloat(values[1]),
                parseFloat(values[0])) * (180 / Math.PI)) || 0
    );
    obj.translate = {x: Number(values[4]), y: Number(values[5])};
    obj.scale = {x: Number(values[0]), y: Number(values[3])};
    if (obj.scale.x === undefined)
        obj.scale.x = 1;
    if (obj.scale.y === undefined)
        obj.scale.y = 1;

    return obj;
};

/**
 * Converts a object return from the matrixToTransformObj into a transform string
 * @return {string}
 */
function ObjToTransform(obj) {
    return 'rotate(' + obj.rotate + ') ' +
        'translate(' + obj.translate.x + ',' + obj.translate.y + ') ' +
        'scale(' + obj.scale.x + ',' + obj.scale.y + ')';
}
