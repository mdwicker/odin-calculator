function Calculator() {
    // operation variables
    this.numA = null;
    this.numB = null;
    this.operator = null;
    this.prevResult = null;
    
    // possible states:
    // "awaitingInput", "enteringNumA", "operatorSet", "enteringNumB", "resultDisplayed"
    this.state = "awaitingInput"; 

    // input variables
    this.currentInput = "";
    this.maxDisplayLength = 13;

    this.editInput = function (entry){
        switch (entry) {
            case "decimal":
                this.appendDecimal();
                break;
            case "backspace":
                this.backspace();
                break;
            default:
                this.appendDigit(entry);
                break;
        } 
    }

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

    this.storeNumA = function () {
        this.numA = Number(this.currentInput);
        this.currentInput = "";
    }

    this.setOperator = function (operator) {
        this.operator = operator;
        this.state = "operatorSet";
    }

    this.evaluate = function () {
        // make sure operation is complete
        if (this.operationReady()) {
            this.numB = Number(this.currentInput);
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
        this.state = "awaitingInput";
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

function parseInput(btn) {
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
            setSelectedOperator("none");
            break;
        default:
            console.log(`Unknown button: ${btn}`);
    }
}

function processEntry(entry) {
    // trim the leading "d" from the digit ids
    if (entry.charAt(0) === "d" && entry.length === 2) {
        entry = entry.slice(1);
    }
    switch (calculator.state) {
        case "awaitingInput":
            calculator.state = "enteringNumA";
            break;
        case "operatorSet":
            calculator.state = "enteringNumB";
            break;
        case "resultDisplayed":
            calculator.clearAll();
            break;
    }
    calculator.editInput(entry);
    display.update(calculator.currentInput);
}

function processOperator(operator) {  
    switch (calculator.state) {
        case "awaitingInput":
            // Can't operate on nothing
            return;
        case "enteringNumA":
            calculator.storeNumA();
            calculator.setOperator(operator);
            break;
        case "operatorSet":
            calculator.setOperator(operator);
            break;
        case "enteringNumB":
            handleEvaluation();
            calculator.setOperator(operator);
            break;
        case "resultDisplayed":
            calculator.setOperator(operator);
            break;
    }
    if (calculator.state != "awaitingInput") {
        calculator.setOperator(operator);
        setSelectedOperator(operator);
    }
}

function processEquals() {
    if (calculator.state === "enteringNumB") {
        handleEvaluation();
    }
}

function handleEvaluation() {
    if (calculator.state != "enteringNumB") {
        console.log("Handling evaluation too soon!")
        return;
    }

    let result = calculator.evaluate();
    display.update(result);
    calculator.numA = result;
    calculator.state = "resultDisplayed";
    setSelectedOperator("none");
}

function setSelectedOperator (operator) {
    const operatorBtns = document.querySelectorAll("button.operator");
    operatorBtns.forEach(btn => {
        btn.classList.remove("selected");
    })

    if (operator != "none") {
        document.querySelector(`#${operator}`).classList.add("selected");
    }
}

const display = new Display();
const calculator = new Calculator();


document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", (e) => {
        parseInput(e.target);
    });
});

// keyboard support
document.addEventListener("keydown", (e) => {
    // only fire once per keypress
    if (e.repeat) return;

    const btn = getButton(e.key);
    if (btn) {
        btn.classList.add("active");
    }
});

document.addEventListener("keyup", (e) => {
    const btn = getButton(e.key);
    if (btn) {
        btn.classList.remove("active");
        parseInput(btn);
    }
});

function getButton(key) {
    const digits = "0123456789";
    let id = null;
    if (digits.includes(key)) {
        id = `d${key}`;
    }
    
    switch (key) {
        case "Escape":
            id = "clear";
            break;
        case "/":
            id = "divide";
            break;
        case "x":
            id = "multiply";
            break;
        case "*":
            id = "multiply";
            break;
        case "-":
            id = "subtract";
            break;
        case "+":
            id = "add";
            break;
        case ".":
            id = "decimal";
            break;
        case "Backspace":
            id = "backspace";
            break;
        case "Enter":
            id = "equals";
            break;
        case "=":
            id = "equals";
            break;
    }

    if (id) {
        return document.querySelector(`#${id}`);
    }

    return null;
}

