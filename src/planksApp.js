/*

New module? Either way, restructure code.
Look for tidying oportunities.

Hav a bar at the top that mirrors the values in the inputs. the bar at the top is
concise and follows the scroll. It should have the option to start over.

Each step body should be both deletable and minimizable (ie marked complete).

*/



// Display divs
const appDiv = document.getElementById("app");
const countDiv = document.querySelector('.count');

// Input divs
const boardLengthInput = document.getElementById('board-length__input');
const sizeLimitInput = document.getElementById("extension-size__input");
const extendCheckbox = document.getElementById("extensions__input");
const extendFromNewCheckbox = document.getElementById("extend__from-new-checkbox");
const addCutInput = document.getElementById('add-cut');
const repeatMeasurement = document.getElementById('add-cuts__measurements__repeat__input');

// Other selection
const instructions = new Instructions();


let measurements = [];


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


            } else if ((getBoardLength() - length >= measurement) && willExtendFromNewPlanks() && willExtendBoards() && isLongEnough(measurement - length)) {
                
                const prevLength = length;
                cutLength(length);
                instructions.addLine(`In addition to the ${prevLength}cm left over:`);
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

    const sizeLimitWrapper = document.querySelector(".refine-extensions");

    if (willExtendBoards()) {
        sizeLimitWrapper.classList.remove("hidden");
    } else {
        sizeLimitWrapper.classList.add("hidden");
        extendFromNewCheckbox.checked = false;
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
