class Clock {
    constructor() {
        this.startTime = undefined;
        this.endTime = undefined;
    }

    start(){
        this.startTime = new Date();
    }

    end(){
        this.endTime = new Date();
        var timeDiff = this.endTime - this.startTime;
        timeDiff /= 1000;   // so that the unit is second, not ms
        return Math.round(timeDiff)
    }

}