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

let operator;
let numA;
let numB;

console.log(operate("plus", 1, 2));
console.log(operate("minus", 1, 2));
console.log(operate("times", 1, 2));
console.log(operate("divide", 1, 2));