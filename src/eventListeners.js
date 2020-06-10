(() => {
    const inputsWrapper = document.querySelector(".parameter-inputs");

    inputsWrapper.addEventListener("keyup", e => {
        const id = e.target.id;
        
        const measurement = parseInt(divs.input.addCut.value);
        const plankSize = (parseInt(divs.input.boardLength.value));
        const allRequiredIsFilled = checkMeasurement(measurement) && checkPlankLength(plankSize)
    
        if (allRequiredIsFilled) {
            
            if ((id === divs.input.addCut.id || id === divs.repeatMeasurement.id) && e.key === "Enter") {
                    addMeasurement(measurement);
                    divs.input.addCut.value = '';
                    displayResults();
            } 
        }
        
        if ((id === divs.input.sizeLimit.id 
            || id === divs.input.boardLength.id) 
            && measurements.length) {
                
                displayResults();
        }
    });
    
    // Adds a new measurement to measurements[]
    inputsWrapper.addEventListener("click", e => {
        
        const id = e.target.id;
        const plankSize = (parseInt(divs.input.boardLength.value));
        const rawMeasurement = parseInt(divs.input.addCut.value);
        const measurement = subtractHeight(rawMeasurement);


        if (measurement <= 0) {
            alert(`The resulting cut would be "${measurement}cm" (impossible). 
            \nRequired fix: Adjust the measurements so the cut is a positve number (above zero).`);
            return;
        }
        if (id === 'add-cuts__button' && checkPlankLength(plankSize) && checkMeasurement(measurement)) {
         
            addMeasurement(measurement);
            divs.input.addCut.value = "";
            displayResults();
            
        } else if (id === divs.checkbox.extend.id) {
    
            toggleHideSizeLimit();

            if (measurements.length) {
                displayResults();
            }
    
        } else if (id === divs.checkbox.extendFromNew.id && measurements.length) {
            displayResults();
        }
    
    });


    // Hide instructions animation
    divs.app.addEventListener("click", e => {
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

function subtractHeight(measurement) {

    const plankHeightInput = document.querySelector(".plank-height__input");
    const subtractCheckbox = document.getElementById("subtract-checkbox");
    const doubleSubtractCheckbox = document.getElementById("double-subtract-checkbox");
    
    let height = parseInt(plankHeightInput.value);

    if (doubleSubtractCheckbox.checked) {
        measurement = measurement - height * 2;
    
    } else if (subtractCheckbox.checked) {
        measurement = measurement - height;
    } else {
        measurement = measurement;
        
    }

    return measurement;
}

function addMeasurement(measurement) {
    
    const repitition = parseInt(divs.repeatMeasurement.value);
    
    if (repitition && !isNaN(repitition)) {
        
        for (let ii = 0; ii < repitition; ii++) {
            measurements.push(measurement);
            
        }
    } else {
        measurements.push(measurement);
    }
    
}

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

function showCount() {
    if (divs.count.classList.contains('hide-count')) {
        divs.count.className = 'count';
    }
}


function displayResults() {
    
    showCount();
    clearResults();
    calculatePlanks(getBoardLength())
}

function clearResults() {
    divs.app.textContent = "";
}
