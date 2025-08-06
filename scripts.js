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
    return true;
}

function handleOperation(operator) {

}

function refreshDisplay() {
    if (!displayContent) {
        displayContent = "00.00"
    }
    document.querySelector("#display").textContent = displayContent;
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