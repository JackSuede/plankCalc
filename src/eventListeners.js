(() => {
    const inputsWrapper = document.querySelector(".inputs-wrapper");

    inputsWrapper.addEventListener("keyup", e => {
        const id = e.target.id;
    
        
        const measurement = parseInt(addCutInput.value);
        const plankSize = (parseInt(boardLengthInput.value));
        const checkCriteria = checkMeasurement(measurement) && checkPlankLength(plankSize)
    
        if (checkCriteria) {
            
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
    
    function checkMeasurement(measurement) {
    
        if (measurement && !isNaN(measurement) ) {
            return true;    
            
        } else {
            return false;
        }
    }

})();