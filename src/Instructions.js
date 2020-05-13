class Instructions {
    constructor() {
        this.measurement;
        this.iteration;

        this.steps = [];
        this.stepsFragment = document.createDocumentFragment();

        this.totalCut = 0;
        this.startingLength = 0;
        this.cutLength;
        this.lengthRemaining;

    }

    render() {
        const instructionsDiv = document.getElementById('app');

        const body = this.createBody();
        instructionsDiv.appendChild(body);

        const infoWrapper = document.createElement('div');
        infoWrapper.className = 'info-wrapper';

        infoWrapper.appendChild(this.addMeasurementInfo());
        infoWrapper.appendChild(this.addStartingLength());

        this.stepsFragment.appendChild(infoWrapper);
        
        const lines = document.createElement('div');
        lines.className = 'lines';
        lines.appendChild(this.createHeading());
        
        
        for (let ii = 0; ii < this.steps.length; ii++) {
            const step = this.steps[ii];
            const line = this.createLineElement(step);
            lines.appendChild(line);
            
            if (ii == this.steps.length - 1) {
                
                const spacer = this.createLineElement();
                spacer.classList.add("final-step-spacer");
                lines.appendChild(spacer);

            }
        }

        
        this.stepsFragment.appendChild(lines);
        this.addLengthRemaining();

        body.appendChild(this.stepsFragment);
        
    }

    reset() {
        this.steps = [];
        this.cutLength = 0;
    }

    createBody() {
        const body = document.createElement('div');
        body.className = "step-body";
        return body;
    }

    createHeading() {
        const heading = document.createElement('div');
        heading.className = 'step-heading'
        heading.textContent = `Steps:`;
        return heading;
    }

    addMeasurementInfo() {
        const measurementInfo = document.createElement('div');
        measurementInfo.className = 'measurement-info'
        measurementInfo.innerHTML = `Measurement: ${this.measurement}cm`;
        return measurementInfo;
    }

    addStartingLength() {
        const startingLength = document.createElement('div');
        startingLength.className = 'starting-length-text';
        startingLength.textContent = (this.iteration == 0) ? 
        `from the first ${this.startingLength}cm board.` : `from the ${this.startingLength}cm left over.`;
        return startingLength;
    }

    setStartingLength(length) {
        this.startingLength = length;
    }

    createLineElement(text) {
        const lineDiv = document.createElement('div');
        lineDiv.className = "step-text";
        lineDiv.textContent = text;
        return lineDiv;
        // this.stepsFragment.appendChild(lineDiv);
        
    }

    addLine(text){
        this.steps.push(text);
    }

    addLengthRemaining() {
        const remainingDiv = document.createElement('div');
        remainingDiv.className = 'length-remaining-text';
        remainingDiv.innerHTML = `Finished board is <span class="summary-highlight">${this.totalCut}cm</span> with <span class="summary-highlight">${this.lengthRemaining}cm</span> left over from <span class="summary-highlight">${this.cutLength}cm</span>.`;
        this.stepsFragment.appendChild(remainingDiv);
    }

    setLengthRemaining(remainingLength) {
       this.lengthRemaining = remainingLength;
    }
}