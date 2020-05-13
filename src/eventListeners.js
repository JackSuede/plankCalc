(() => {
    const inputsWrapper = document.querySelector(".inputs-wrapper");

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
    
        
        if (id === 'add-cut-button' && checkPlankLength(plankSize) && checkMeasurement(measurement)) {
         
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
        console.log('hiiiiiiiiii')
        const parent = e.target.parentNode;
        const grandparent = parent.parentNode;
        const parentHasStepsBody = parent.classList.contains("step-body");
        const grandparentDoes = grandparent.classList.contains("step-body");

        console.log(parentHasStepsBody);
        console.log(grandparentDoes);
        
        
        if ( parentHasStepsBody) {
            const lines = parent.querySelector('.lines');
            toggleLineVisibility(lines);
            
        } else if (grandparentDoes) {
            console.log(parent.querySelector('.lines'));
            
            const lines = grandparent.querySelector('.lines');
            toggleLineVisibility(lines);
        }
    });

    function toggleLineVisibility(lines) {
        console.log(lines);
        
        lines.classList.toggle('hide-lines');
    }
    
    function checkMeasurement(measurement) {
    
        if (measurement && !isNaN(measurement) ) {
            return true;    
            
        } else {
            return false;
        }
    }



})();