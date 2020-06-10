var divs = (function(d) {
    
    var i = d.input = d.input || {};
    var cb = d.checkbox = d.checkbox || {};

    const app = document.getElementById("app");
    const count = document.querySelector('.count');

    // Input divs
    const boardLength = document.getElementById('board-length__input');
    const extend = document.getElementById("extensions__input");
    const extendFromNew = document.getElementById("extend__from-new-checkbox");
    const sizeLimit = document.getElementById("extension-size__input");
    const addCut = document.getElementById('add-cut');
    const repeatMeasurement = document.getElementById('add-cuts__measurements__repeat__input');
    const inputsContainer = document.querySelector('.inputs-container');
    const parameterInputs = document.querySelector('.parameter-inputs');

    // Divs and containers
    d.app = app;
    d.count = count;
    d.repeatMeasurement = repeatMeasurement;
    d.inputsContainer = inputsContainer;
    d.parameterInputs = parameterInputs;
    
    // Text/number inputs
    i.boardLength = boardLength;
    i.sizeLimit = sizeLimit;
    i.addCut = addCut;
    
    // Checkboxes
    cb.extend = extend;
    cb.extendFromNew = extendFromNew;
    
    return d;

})(divs || {});
