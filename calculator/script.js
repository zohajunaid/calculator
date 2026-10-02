const currentDisplay = document.getElementById("current");
const historyDisplay = document.getElementById("history");

let currentInput = "0"
let previousValue = null
let operator = null;
let shouldResetInput = false;

function updateDisplay() {
    currentDisplay.textContent = currentInput;
}

function inputNumber(num) {
    if (shouldResetInput) {
        currentInput = num;
        shouldResetInput = false;
    } else {
        if (currentInput === "0" && num !== ".")
            currentInput = num;
        else {
            if (num === "." && currentInput.includes(".")) return;
            currentInput += num;
        }
    }
    updateDisplay();
}

function inputOperator(op) {
    if (operator !== null && !shouldResetInput) {
        calculate();
    }
    previousValue = parseFloat(currentInput);
    operator = op;
    shouldResetInput = true;
    historyDisplay.textContent = `${previousValue} ${symbolFor(op)}`;
}

function calculate() {
    if (operator === null || previousValue === null) return;

    const current = parseFloat(currentInput);
    let result = 0;

    switch (operator) {
        case "+": result = previousValue + current; break;
        case "-": result = previousValue - current; break;
        case "*": result = previousValue * current; break;
        case "/":
            if (current === 0) {
                currentInput = "Error";
                updateDisplay();
                resetAfterError();
                return;
            }
            result = previousValue / current;
            break;

    }
    result = Math.round(result * 1e10) / 1e10;

    historyDisplay.textContent = `${previousValue} ${symbolFor(operator)} ${current} =`;
    currentInput = String(result);
    previousValue = null;
    operator = null;
    shouldResetInput = true;
    updateDisplay();
}

function handleAction(action) {
    switch (action) {
        case "clear":
            currentInput = "0"
            previousValue = null;
            operator= null;
            shouldResetInput = false;
            historyDisplay.textContent = "";
            updateDisplay();
            break;

        case "sign":
            currentInput = String(parseFloat(currentInput) * -1);
            updateDisplay();
            break;

        case "percent":
            currentInput = String(parseFloat(currentInput) / 100);
            updateDisplay();
            break;

        case "equals":
            calculate();
            break;
    }
}

function resetAfterError() {
    previousValue = null;
    operator = null;
    shouldResetInput = true;
}

function symbolFor(op) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    if (op === "-") return "-"
    return op;
}

document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
        if (button.dataset.num) {
            inputNumber(button.dataset.num)
        } else if (button.dataset.op !== undefined) {
            inputOperator(button.dataset.op);
        } else if (button.dataset.action !== undefined) {
            handleAction(button.dataset.action);
        }
    });
});

document.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") inputNumber(e.key);
    else if (e.key === ".") inputNumber(".");
    else if (e.key === "+") inputOperator("+")
    else if (e.key === "-") inputOperator("-");
    else if (e.key === "*") inputOperator("*");
    else if (e.key === "/") {
        e.preventDefault();
        inputOperator("/");
    }
    else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleAction("equals");
    }
    else if (e.key === "Escape") handleAction("clear");
    else if (e.key === "Backspace") {
        currentInput = currentInput.slice(0, -1) || "0";
        updateDisplay()
    }

})