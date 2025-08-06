function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    if (operator === "plus") {
        return add(a, b);
    } else if (operator === "minus") {
        return subtract(a, b);
    } else if (operator === "times") {
        return multiply(a, b);
    } else if (operator === "divide") {
        return divide(a, b);
    } else {
        console.log(`Error! "${operator}" is not a valid operator.`);
    }
}

function handleEntry(entry) {
    if (Number(displayContent) === 0) {
        displayContent = "";
    }

    if (entry === "clear") {
        displayContent = "";
        clearOperation();
    } else if (entry === "backspace") {
        displayContent = displayContent.slice(0, -1);
    } else if (entry === "decimal") {
        entry = "."
    }

    if (isValidEntry(entry)) {
        displayContent += entry;
    }

    refreshDisplay();
}

function isValidEntry(entry) {
    const validEntryRegex = /[\d\.]/
    if (entry === "." && displayContent.includes(".")){
        return false;
    }
    if (!validEntryRegex.test(entry)) {
        return false;
    }
    if (displayContent.length > 13) { // display can't handle long numbers
        return false;
    }
    return true;
}

function handleOperation(operatorInput) {
    // [numA = N, numB = N] -> type -> OPERATOR -> [numA = Y, numB = N] -> type -> EQUAL -> [numA = Y, numB = Y] -> DISPLAY
    
    // [numA = N, numB = N] expected sequence: type a number
    // [numA = Y, numB = N]then hit an operator to store that number as numA,
    // [numA = Y, numB = Y]then type another number, then hit equal to store as numB
    // [numA = Y, numB = Y] DISPLAY RESULT
    // operator with nothing typed = nothing happens
    // equal with no numA stored == nothing happens? 
    // or just return the value entered as the result.
    // after equal, a new thing typed will clear, and an operator will chain
    if (operatorInput === "equals") {
        numB = Number(displayContent);
        displayContent = operate(operator, numA, numB).toString();
        refreshDisplay();
    } else {
        numA = Number(displayContent);
        displayContent = "";
        operator = operatorInput;
    }
}

function clearOperation() {
    numA = undefined;
    numB = undefined;
    operator = undefined;
}

function refreshDisplay() {
    if (!displayContent || displayContent === "ERROR") {
        displayContent = "00.00";
    }
    if (displayContent.length > 13) { // display can't handle long numbers
        document.querySelector("#display").textContent = "ERROR";
        displayContent = "";
    } else {
        document.querySelector("#display").textContent = displayContent;
    }
}


let displayContent;
let operator;
let numA;
let numB;

document.querySelectorAll("button.entry").forEach(btn => {
    btn.addEventListener("click", (e) => {handleEntry(e.target.id)});
});

document.querySelectorAll("button.operator").forEach(btn => {
    btn.addEventListener("click", (e) => {handleOperation(e.target.id)});
});

refreshDisplay();