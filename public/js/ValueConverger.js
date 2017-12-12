/**
 * This class converges a starting value towards an end value in a given number of steps (ticks), which in most
 * cases represent a specified time interval.
 * The increase at each tick linearly
 */
class ValueConverger {
    constructor(startValue, endValue, numberOfSteps) {
        this.startValue = startValue;
        this.currentValue = startValue;
        this.stepsLeft = numberOfSteps;
        this.setEndValue(endValue);
    }

    setEndValue(endValue){
        this.endValue = endValue;
        this.stepSize = (this.endValue - this.startValue) / this.stepsLeft;
    }

    setNumberOfSteps(numberOfSteps){
        this.stepsLeft = numberOfSteps;
        this.stepSize = (this.endValue - this.startValue) / this.stepsLeft;
    }

    tick() {
        if (this.stepSize < 0)
            this.currentValue = Math.max(this.currentValue + this.stepSize, this.endValue);
        else
            this.currentValue = Math.min(this.currentValue + this.stepSize, this.endValue);
        this.stepsLeft = Math.max(0, this.stepsLeft - 1);
    }
}

