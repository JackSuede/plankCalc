(() => {
    const inputsWrapper = document.querySelector(".parameter-inputs");

    inputsWrapper.addEventListener("keyup", e => {
        const id = e.target.id;
        
        const measurement = parseInt(addCutInput.value);
        const plankSize = (parseInt(boardLengthInput.value));
        const allRequiredIsFilled = checkMeasurement(measurement) && checkPlankLength(plankSize)
    
        if (allRequiredIsFilled) {
            
            if ((id === addCutInput.id || id === repeatMeasurement.id) && e.key === "Enter") {
                    addMeasurement(measurement);
                    addCutInput.value = '';
                    displayResults();
            } 
        }
        
        if ((id === sizeLimitInput.id 
            || id === boardLengthInput.id) 
            && measurements.length) {
                
                displayResults();
        }
    });
    
    inputsWrapper.addEventListener("click", e => {
        const id = e.target.id;
        const plankSize = (parseInt(boardLengthInput.value));
        const measurement = parseInt(addCutInput.value);
    
        if (id === 'add-cuts__measurements__button' && checkPlankLength(plankSize) && checkMeasurement(measurement)) {
         
            addMeasurement(measurement);
            addCutInput.value = "";
            displayResults();
            
        } else if (id === extendCheckbox.id && measurements.length) {
    
            toggleHideSizeLimit();
            displayResults();
    
        } else if (id === extendFromNewCheckbox.id && measurements.length) {
            displayResults();
        }
    
    });

    appDiv.addEventListener("click", e => {
        const parent = e.target.parentNode;
        const grandparent = parent.parentNode;
        const parentHasStepsBody = parent.classList.contains("instructions");
        const grandparentDoes = grandparent.classList.contains("instructions");
        
        if ( parentHasStepsBody) {
            const instructions__steps = parent.querySelector('.instructions__steps');
            toggleLineVisibility(instructions__steps);
            
        } else if (grandparentDoes) {
            
            const instructions__steps = grandparent.querySelector('.instructions__steps');
            toggleLineVisibility(instructions__steps);
        }
    });

})();

function toggleLineVisibility(instructions__steps) {

    instructions__steps.classList.toggle('instructions__steps--hide');

}

function checkMeasurement(measurement) {
    
    if (measurement && !isNaN(measurement) ) {
        return true;    
        
    } else {
        return false;
    }
}

function checkPlankLength(plankLength) {
    
    if (plankLength && !isNaN(plankLength) ) {
        return true;
        
    } else {
        return false;
    }
}

function addMeasurement(measurement) {
    
    const repitition = parseInt(repeatMeasurement.value);
    
    if (repitition && !isNaN(repitition)) {
        
        for (let ii = 0; ii < repitition; ii++) {
            measurements.push(measurement);
            
        }
    } else {
        measurements.push(measurement);
    }
    
}

function showCount() {
    if (countDiv.classList.contains('hide-count')) {
        countDiv.className = 'count';
    }
}


function displayResults() {
    
    showCount();
    clearResults();
    calculatePlanks(getBoardLength())
}

function clearResults() {
    appDiv.textContent = "";
}
