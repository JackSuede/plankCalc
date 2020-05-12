/*

New module? Either way, restructure code.
Look for tidying oportunities.

User needs to be able to input their own measurements.

Once the user knows their parameters, they will recognize them.
So, when they generate instructions, the param fields will
stand alone at the top. There will be a button to edit measurements.

*/



// Display divs
const appDiv = document.getElementById("app");
const countDiv = document.getElementById("count");

// Input divs
const boardLengthInput = document.getElementById('board-length');
const sizeLimitInput = document.getElementById("size-limit");
const extendCheckbox = document.getElementById("extend-checkbox");
const extendFromNewCheckbox = document.getElementById("extend-reduced-checkbox");
const addCutInput = document.getElementById('add-cut');
const repeatMeasurement = document.getElementById('repeat-measurement');

// Other selection
const instructions = new Instructions();
const inputsWrapper = document.querySelector(".inputs-wrapper");


let measurements = [];


/*
**
** Event Listeners:
**
*/

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
            
            console.log('true');
            
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
        
        
    } else if (id === extendCheckbox.id) {
        toggleHideSizeLimit();
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
    
        
    console.log(measurements);
    
}


function displayResults() {

    
        clearResults();
        calculatePlanks(getBoardLength())
}

function clearResults() {
    appDiv.textContent = "";
}


/*
**
** Core logic:
**
*/

// size limit is ready to add.. 

let overages = [];
let totalCentimetersCut = 0;
let length;
let boardCount = 1;

function calculatePlanks(boardLength) {

    resetTotalCuts();
    resetBoardCount();
    
    length = boardLength;
    overages = [];
    
    // printItem("Important!: Start with one full board.");
    
    for (let ii = 0; ii < measurements.length; ii++) {
        
        resetTotalCuts();
        instructions.reset();
        
        let measurement = measurements[ii];
        instructions.measurement = measurement;
        instructions.startingLength = length;
        instructions.iteration = ii;
        
        /*
        if the measurement is larger than the full board size.
        */

        while(measurement > boardLength) {
            
            measurement -= boardLength;
            cut(boardLength);
            newBoard("preserve length")
            instructions.addLine(`Get additional full board: ${boardLength} cm`)

        }

        if (measurement <= length) {
            const bestFit = findBestBit(measurement);
            isCuttingCurrentBoard = true;

            if (bestFit && ii > 9  && bestFit != length) {
                cut(cutFromBestBit(bestFit, measurement));
                instructions.addLine(`Get the set aside plank of ${bestFit}cm.`);
                instructions.addLine(`Cut off ${measurement}cm from it..`);
                instructions.addLine(`Set aside the remaining ${bestFit - measurement}cm.`);
            
            } else if (ii != 0) {
                instructions.addLine(`From the ${length}cm left over from the previous cut:`)
                instructions.addLine(`Cut ${measurement}cm.`);
                cutLength(measurement);
                
                
            } else {
                cutLength(measurement);
                instructions.addLine(`Cut ${measurement}cm from the first board.`);
            }
            
            
            
        } else if (measurement > length) {

            const desiredCut = measurement - length;
            const bestFit = findBestBit(measurement);
            const bestExtension = findBestBit(desiredCut);

            if (bestFit && bestFit !== length) {

                cut(cutFromBestBit(bestFit, measurement));
                instructions.addLine(`Get the set aside plank of ${bestFit}cm`);
                instructions.addLine(`Cut off ${measurement}cm from it.`);
                

            } else if (bestExtension && desiredCut >= getReusableSizeLimit() && willExtendBoards()) {

                const finalCut = cut(cutFromBestBit(bestExtension, desiredCut));
                instructions.addLine(`Get the ${bestExtension}cm piece you set aside earlier.`)
                instructions.addLine(`Cut it down to ${finalCut}cm.`);
                
                const leftover = bestExtension - finalCut;
                instructions.addLine(`Set aside the remaining ${leftover}cm.`);
                instructions.addLine(`Extend the ${length}cm length with the ${finalCut}cm piece.`);
                
                
                instructions.totalCut = length + finalCut;
                cut(length);
                newBoard(boardLength);
                instructions.addLine(`Get a new ${boardLength}cm plank.`);
                instructions.cutLength = length;
                


            } else if ((getBoardLength() - length >= measurement) && willExtendFromNewPlanks() && isLongEnough(measurement - length)) {
                
                const prevLength = length;
                cutLength(length);
                instructions.addLine(`In addition to the leftover ${prevLength}cm...`);
                newBoard(getBoardLength()); // sets length to new board length
                
                const difference = measurement - prevLength;
                instructions.addLine(`Grab a new board and cut ${difference}cm from it.`);
                cutLength(difference);
                instructions.addLine(`Now join the ${prevLength}cm piece to the ${difference}cm piece.`);
                
                
            } else {

                instructions.addLine(`Set aside the extra: ${length}cm.`);
                addToOverage(length);
                newBoard(boardLength);
                
                cutLength(measurement);
                instructions.addLine(`Cut ${measurement}cm from a new plank.`);

                isCuttingCurrentBoard = true;

            }
            
            
        }

        // printItem("")
        // printItem("TOTAL CUT: " + totalCentimetersCut + "cm");

        instructions.totalCut = totalCentimetersCut;
        instructions.setLengthRemaining(length);
        instructions.total = totalCentimetersCut;
        instructions.render();
  }
  
  countDiv.innerHTML = `You will need ${boardCount} boards<br/>if each board is ${boardLength}cm.`
  
  
}




/* 
**
** Used while running:
**
*/

function cutLength(amount) {
    instructions.cutLength = length;
    length -= amount;
    totalCentimetersCut += amount;
}

function resetBoardCount() {
    boardCount = 1;
}

function cut(amount) {
    instructions.cutLength = length;
    totalCentimetersCut += amount;
    return amount;
}

function resetTotalCuts() {
    totalCentimetersCut = 0;
}

function newBoard(boardLength){
    if (typeof boardLength === "number") {
        length = boardLength;
    }
    boardCount++
}

function cutFromBestBit(bestBit, desiredCut) {

  bestBit -= desiredCut;
  addToOverage(bestBit);
  return desiredCut;

}

function addToOverage(overage) {
  if(isLongEnough(overage)) {
          overages.push(overage);

        }
}

function findBestBit(requiredAmount) {
  
    if(overages.length) {

        let bestBitIndex;
        let bestBit = 9999999;
        let passed = true;

        for(ii = 0; ii < overages.length; ii++){
            const bit = overages[ii];
            
            if(bit >= requiredAmount) {

                if(bit <= bestBit) {
                    passed = true;
                    bestBit = bit;
                    bestBitIndex = ii;
                }

        
            } else {
                if (ii == 0) {
                    passed = false;
                }
            }
        }

        if(passed) {
            overages.splice(bestBitIndex, 1);      
            return bestBit;

        } else {

            return false;
        }
  }

}

toggleHideSizeLimit();

function willExtendBoards() {
    return extendCheckbox.checked;
}

function willExtendFromNewPlanks() {
    return extendFromNewCheckbox.checked;
}

function toggleHideSizeLimit() {

    const sizeLimitWrapper = document.querySelector(".size-limit");

    if (willExtendBoards()) {
        sizeLimitWrapper.classList.remove("hidden");
    } else {
        sizeLimitWrapper.classList.add("hidden");
    }
}

/*
**
** Bools and getters (some day setters?):
**
*/

function isLongEnough(overage) {
    return overage >= getReusableSizeLimit();
    console.log(getReusableSizeLimit());

  }

function getReusableSizeLimit() {
    return parseInt(sizeLimitInput.value)|| 0;
    console.log(getReusableSizeLimit());
    
}

function getBoardLength() {
    boardLength = parseInt(boardLengthInput.value);
    return (boardLength && boardLength >= 1) ? boardLength : 1;
}
