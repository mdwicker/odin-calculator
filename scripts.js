const DEFAULT_INPUT = "0";

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
        return "/0? NICE TRY!";
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
    if (entry === undefined) {
        return false;
    }
    
    // don't allow two decimal points in the same number
    if (entry === "." && currentInput.includes(".")){
        return false;
    }

    const validEntryRegex = /[\d\.]/
    if (!validEntryRegex.test(entry)) {
        return false;
    }

    // don't accept input that would make the number too long
    if (currentInput.length > 13) { 
        return false;
    }

    return true;
}

function handleOperatorBtn(btn) {
    const operations = ["add", "subtract", "multiply", "divide"];
    
    // operator has been pressed ("plus," "minus," etc)
    if (operations.includes(btn)) {
        // number has been input but no operation is active
        if (operation.numA === undefined &&
            operation.operator === undefined &&
            currentInput != undefined
        ) {
            operation.numA = Number(currentInput);
            operation.operator = btn;
            currentInput = DEFAULT_INPUT;
            updateDisplay();
        }
    }

    if (btn === "equals") {
        if (operation.numA != undefined &&
            operation.operator != undefined &&
            currentInput != undefined
        ) {
            let result = operate(operation.operator, operation.numA, Number(currentInput));
            if (typeof result === "number") {
                result = Math.round(result * 100) / 100;
            } 
            updateDisplay(result.toString());
            clearOperation();
        }
    }
}

function clearOperation() {
    operation.numA = undefined;
    operation.operator = undefined;
    currentInput = DEFAULT_INPUT;
}

function updateDisplay(displayContent = currentInput) {
    if (displayContent === undefined || currentInput === undefined) {
        displayContent = "";
    }
    if (displayContent.length > 13) { // display can't handle long numbers
        displayContent = "ERR: TOO LONG";
        currentInput = DEFAULT_INPUT;
    }
    document.querySelector("#display").textContent = displayContent;
}


let currentInput = DEFAULT_INPUT;
let operation = {operator: undefined, numA: undefined};


document.querySelectorAll("button.entry").forEach(btn => {
    btn.addEventListener("click", (e) => {handleEntryBtn(e.target.id)});
});

document.querySelectorAll("button.operator").forEach(btn => {
    btn.addEventListener("click", (e) => {handleOperatorBtn(e.target.id)});
});

updateDisplay();