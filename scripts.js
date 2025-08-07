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
    if (b === 0) {
        throw new Error("DIV BY 0");
    }
    return a / b;
}

function operate(operator, a, b) {
    if (operator === "add") {
        return add(a, b);
    } else if (operator === "subtract") {
        return subtract(a, b);
    } else if (operator === "multiply") {
        return multiply(a, b);
    } else if (operator === "divide") {
        return divide(a, b);
    } else {
        console.log(`Error! "${operator}" is not a valid operator.`);
    }
}

function handleEntryBtn(btn) {
    let entry;
    if (btn === "clear") {
        clearOperation();
    } else if (btn === "backspace") {
        currentInput = currentInput.slice(0, -1);
    } else if (btn === "decimal") {
        entry = ".";
    } else {
        entry = btn;
    }

    if (isValidEntry(entry)) {
        // don't allow leading zeroes
        if (Number(currentInput) === 0 && !currentInput.includes(".")) {
            if (entry === ".") {
                currentInput = "0";
            } else {
                currentInput = "";
            }
        }
        currentInput += entry;
    }

    updateDisplay();
}

function isValidEntry(entry) {
    // don't allow two decimal points in the same number
    if (entry === "." && currentInput.includes(".")){
        return false;
    }

    const validEntryRegex = /[\d\.]/
    if (!validEntryRegex.test(entry)) {
        return false;
    }

    // don't accept input that would make the number too long
    if (currentInput && currentInput.length > 13) { 
        return false;
    }

    return true;
}

function handleOperatorBtn(btn) {
    const operations = ["add", "subtract", "multiply", "divide"];
    
    // operator has been pressed ("plus," "minus," etc)
    if (operations.includes(btn)) {
        // check if there's already an operation in progress
        // operator and numA should always be defined simultaneously
        if (operation.operator != undefined) {
            // if a new number hasn't been input yet, just update the operator
            if (currentInput === "") {
                operation.operator = btn;
            } else {
                // otherwise, evaluate the existing operation
                // and use the result as the new input
                let result = evaluateOperation();
                clearOperation();
                currentInput = result;
                updateDisplay();
            }
        }

        // now that existing operations have been handled, process the new one
        if (operation.operator === undefined) {
            operation.numA = Number(currentInput);
            operation.operator = btn;
            updateDisplay();
            currentInput = "";
        }
    }

    if (btn === "equals") {
        if (operation.numA != undefined &&
            operation.operator != undefined &&
            currentInput
        ) {
            updateDisplay(evaluateOperation());
            clearOperation;
            currentInput = "";
        }
    }
}

function clearOperation() {
    operation.numA = undefined;
    operation.operator = undefined;
    currentInput = "";
}

function evaluateOperation() {
    let result;
    try {
        result = operate(operation.operator, operation.numA, Number(currentInput));
        result = Math.round(result * 100) / 100;
        return result;
    } catch(e) {
        clearOperation();
        currentInput = "";
        updateDisplay(e.message);
    }
}

function updateDisplay(displayContent = currentInput) {
    if (displayContent === "") {
        displayContent = "0";
    }
    if (displayContent.length > 13) { // display can't handle long numbers
        displayContent = "ERR: TOO LONG";
        currentInput = "";
    }
    document.querySelector("#display").textContent = displayContent;
}


let currentInput = "";
let operation = {operator: undefined, numA: undefined};


document.querySelectorAll("button.entry").forEach(btn => {
    btn.addEventListener("click", (e) => {handleEntryBtn(e.target.id)});
});

document.querySelectorAll("button.operator").forEach(btn => {
    btn.addEventListener("click", (e) => {handleOperatorBtn(e.target.id)});
});

updateDisplay();