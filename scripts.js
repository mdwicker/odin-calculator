/*
Operation
    num a
    num b
    operator

    evaluate
        round

    setOperator?
    inputNumber?

Display
    DOES this just model the visual, or the inputted number as well?
    like, is this about handing what to display, or what to remember?
    probably both. mostly about what to display tho
    current inputted value
    clear
    display (with option to display error)
    eNotation?
    addDigit?
    backspace?

parseInput
    clear
    digit
    backspace
    operator
    equals
*/

function Calculator() {
    /// operation variables
    this.numA = null;
    this.numB = null;
    this.operator = null;
    this.result = null;

    // input variables
    this.currentInput = "0";
    this.maxDisplayLength = 13;


    this.appendDigit = function (digit) {
        if (this.isValidDigit(digit) && this.currentInput.length < this.maxDisplayLength) {
            this.currentInput += digit;
            this.trimLeadingZeroes();
        }
    }

    this.appendDecimal = function () {
        // don't allow a second decimal
        if (!this.currentInput.includes(".")) {
            this.currentInput = this.currentInput ? this.currentInput + "." : "0.";
        }
    }

    this.backspace = function () {
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
        }
    }

    this.inputNumber = function () {
        if (this.numA === null) {
            this.numA = Number(this.currentInput);
        } else {
            this.numB = Number(this.currentInput);
        }
    }

    this.setOperator = function (operator) {
        if (this.numA === null) {
            console.log("Error! Can't set operator without numA.");
        } else if (this.numB != null) {
            console.log("Error! Can't set operator when numB exists.");
        } else {
            this.operator = operator;
        }
    }

    this.evaluate = function () {
        if (this.numA === null || this.numB === null || this.operator === null) {
            console.log("Error! Cannot evaluate incomplete function.");
        } else {
            this.result = round(this.operate());
            return this.result;
        }
    }

    this.clear = function () {
        this.numA = null;
        this.numB = null;
        this.operator = null;
        this.result = null;
        this.currentInput = "0";
    }

    this.isValidDigit = function (digit) {
        const validDigitRegex = /^\d$/;
        return validDigitRegex.test(digit);
    }

    this.trimLeadingZeroes = function () {
        this.currentInput = this.currentInput.replace(/^0+/, "");
    }

    this.operate = function () {
        const operator = this.operator;
        const a = this.numA;
        const b = this.numB;

        switch (operator) {
            case "add":
                return a + b;
            case "subtract":
                return a - b;
            case "multiply":
                return a * b;
            case "divide":
                if (b === 0) {
                    throw new Error("DIV BY 0");
                }
                return a / b;
            default:
                console.log(`Invalid operator "${operator}".`);
        }
    }
}

function Display() {
    this.display = document.querySelector("#display");
    this.maxDisplayLength = 13;

    this.updateDisplay = function (content) {
        content = this.formatContent(content)
        this.display.textContent = content;
    }

    this.formatContent = function (content) {
        if (!content) {
            return "0";
        }

        if (typeof content === "number") {
            return this.formatNumber(content);
        }
        
        if (content.length > this.maxDisplayLength) {
            console.log(`Message exceeded max character length: ${content}`);
            return "TOO LONG"
        }
    }

    this.formatNumber = function (num) {
        if (num > 10 ** 100) {
            return "ERR: BIG NUM";
        }
        let display_num = num.toString();
        if (display_num.length > this.maxDisplayLength) {
            return this.eNotation(num);
        }
        return display_num;
    }

    this.eNotation = function (num) {
        // No need to handle decimal points like 0.00005
        // because Operation already rounds down to two digits
        
        let powersOfTen = 0;
        while (num >= 10) {
            num /= 10;
            powersOfTen++;
        }
        const eSuffix = `E${powersOfTen}`;

        let baseNum = num.toString();
        if (baseNum.length + eSuffix.length > this.maxDisplayLength) {
            // account for suffix as well as first digit and decimal
            maxDigits = this.maxDisplayLength - (eSuffix.length + 2);
            baseNum = round(baseNum, maxDigits);
        }

        return `${baseNum}${eSuffix}`;
    }

    this.clear = function () {
        this.updateDisplay("");
    }
}

function round(num, digits) {
        const factor = 10 ** digits;
        return (Math.round(num * factor) / factor);
}

function parseInput(e) {
    const btn = e.target;

    switch (btn.class) {
        case "entry":
            processEntry(btn.id);
            break;
        case "operator":
            processOperator(btn.id);
            break;
        case "equals":
            processEquals();
            break;
        case "clear":
            calc.clear();
            displayHandler.clear();
            break;
        default:
            console.log(`Unknown button: ${btn}`);
    }
}

function processEntry(entry) {
    switch (entry) {
        case "decimal":
            calc.appendDecimal();
            break;
        case "backspace":
            calc.backspace();
            break;
        default:
            calc.appendDigit(Number(entry));
            break;
    }
    displayHandler.updateDisplay(calc.currentInput);
}

function processOperator(operator) {
    // if an operation just finished, use it as the new baseline
    if (calc.result != null) {
        calc.currentInput = calc.result;
    }

    // if there is nothing to operate on, just update the operator
    if (calc.currentInput === "") {
        calc.setOperator(operator);
    }

    // if there's already two numbers 
    if (calc.numB != null) {

    }
    /*
    if there is nothing in the current input....do nothing UNLESS there's something in the result field?
    if there 
    Big question is whether or not we're in the middle of an operation*/

    
}

const displayHandler = new Display();
const calc = new Calculator();


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