function Calculator() {
    // status : awaitNumA inputNumA awaitNumB inputNumB result
    // operation variables
    this.numA = null;
    this.numB = null;
    this.operator = null;
    this.prevResult = null;

    // input variables
    this.currentInput = "";
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

    this.setOperator = function (operator) {            
        if (this.operationReady()) {
            console.log("Too late, can't set an operator at this stage of the operation.");
            return;
        }

        if (this.numA === null && this.currentInput === "") {
            console.log("Sorry, can't operate on nothing!");
            return;
        }

        this.numA = this.numA ? this.numA : Number(this.currentInput);
        this.currentInput = "";
        this.operator = operator;
    }

    this.evaluate = function () {
        // make sure operation is complete
        if (this.operationReady()) {
            this.numB = Number(this.currentInput);
            this.currentInput = "";
            let result = this.round(this.operate());
            this.clearOperation();
            return result;
        } else {
            console.log("Can't evaluate incomplete operation!");
        }
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

    this.operationReady = function () {
        return (this.operator != null && !(calculator.currentInput === ""));
    }

    this.round = function (num, digits = 2) {
        const factor = 10 ** digits;
        return (Math.round(num * factor) / factor);
    }

    this.isValidDigit = function (digit) {
        const validDigitRegex = /^\d$/;
        return validDigitRegex.test(digit);
    }

    this.trimLeadingZeroes = function () {
        this.currentInput = this.currentInput.replace(/^0+/, "");
    }

    this.clearOperation = function() {
        this.numA = null;
        this.numB = null;
        this.operator = null;
        this.currentInput = "";
    }

    this.clearAll = function () {
        this.clearOperation();
        this.prevResult = null;
    }
}

function Display() {
    this.display = document.querySelector("#display");
    this.maxDisplayLength = 13;

    this.update = function (content) {
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

        return content;
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
            baseNum = this.round(baseNum, maxDigits);
        }

        return `${baseNum}${eSuffix}`;
    }

    this.round = function (num, digits = 2) {
        const factor = 10 ** digits;
        return (Math.round(num * factor) / factor);
    }

    this.clear = function () {
        this.update("");
    }
}

function parseInput(e) {
    const btn = e.target;

    switch (btn.className) {
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
            calculator.clearAll();
            display.clear();
            break;
        default:
            console.log(`Unknown button: ${btn}`);
    }
}

function processEntry(entry) {
    switch (entry) {
        case "decimal":
            calculator.appendDecimal();
            break;
        case "backspace":
            calculator.backspace();
            break;
        default:
            calculator.appendDigit(Number(entry));
            break;
    }
    display.update(calculator.currentInput);
}

function processOperator(operator) {
    display.update("0");
    
    // if there's a complete operation ready, process it first
    if (calculator.operationReady()) {
        processEquals();
    }

    calculator.setOperator(operator);
}

function processEquals() {
    if (calculator.operationReady()) {
        let result = calculator.evaluate();
        display.update(result);
        calculator.numA = result;
    }
}

const display = new Display();
const calculator = new Calculator();


document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", parseInput);
});