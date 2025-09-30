import { FullDecimalVisualizer } from '../components/full-decimal-visualizer.js';

export async function renderBitShifting(container) {
    const html = `
        <div class="bit-shifting-container">
            <div class="decimal-input-group">
                <label>Число:</label>
                <input type="number" id="bit-shifting-input" value="123">
                <div id="decimal-visualizer-input"></div>
            </div>
            <div class="shift-controls">
                <label>Величина сдвига:</label>
                <button id="decrease-shift">&lt;&lt;</button>
                <input type="number" id="shift-amount-input" value="1" min="0" max="95">
                <button id="increase-shift">&gt;&gt;</button>
            </div>
            <div class="shift-direction">
                <label>Направление:</label>
                <button id="direction-left" class="active">Влево</button>
                <button id="direction-right">Вправо</button>
            </div>
            <div class="code-display">
                <pre><code id="code-output"></code></pre>
            </div>
            <div class="decimal-input-group">
                <label>Результат:</label>
                <p><code id="bit-shifting-result-output"></code></p>
                <div id="decimal-visualizer-result"></div>
            </div>
        </div>
    `;
    container.innerHTML = html;

    const input = document.getElementById('bit-shifting-input');
    const shiftAmountInput = document.getElementById('shift-amount-input');
    const resultOutput = document.getElementById('bit-shifting-result-output');
    const codeOutput = document.getElementById('code-output');
    const increaseShiftBtn = document.getElementById('increase-shift');
    const decreaseShiftBtn = document.getElementById('decrease-shift');
    const directionLeftBtn = document.getElementById('direction-left');
    const directionRightBtn = document.getElementById('direction-right');

    const visualizerInput = new FullDecimalVisualizer(document.getElementById('decimal-visualizer-input'), 'input-');
    const resultVisualizer = new FullDecimalVisualizer(document.getElementById('decimal-visualizer-result'), 'result-');

    let bits = [0, 0, 0, 0];
    let currentDirection = 'left';

    function updateInput() {
        const val = BigInt(input.value || 0);
        bits[0] = Number(val & 0xFFFFFFFFn);
        bits[1] = Number((val >> 32n) & 0xFFFFFFFFn);
        bits[2] = Number((val >> 64n) & 0xFFFFFFFFn);
        bits[3] = 0;
        visualizerInput.update(bits);
        calculate();
    }

    function calculate() {
        const shiftAmount = parseInt(shiftAmountInput.value || 0);
        const inputValue = input.value || 0;
        let resultBits = [0, 0, 0, 0];

        const val = (BigInt.asUintN(32, BigInt(bits[2])) << 64n) | 
                    (BigInt.asUintN(32, BigInt(bits[1])) << 32n) | 
                     BigInt.asUintN(32, BigInt(bits[0]));

        let newVal;
        let operator;
        if (currentDirection === 'left') {
            newVal = val << BigInt(shiftAmount);
            operator = '<<';
        } else {
            newVal = val >> BigInt(shiftAmount);
            operator = '>>';
        }

        codeOutput.textContent = `unsigned int result = ${inputValue} ${operator} ${shiftAmount};`;

        resultBits[0] = Number(newVal & 0xFFFFFFFFn);
        resultBits[1] = Number((newVal >> 32n) & 0xFFFFFFFFn);
        resultBits[2] = Number((newVal >> 64n) & 0xFFFFFFFFn);
        resultBits[3] = bits[3];

        resultVisualizer.update(resultBits);
        resultOutput.textContent = newVal.toString();
    }

    increaseShiftBtn.addEventListener('click', () => {
        shiftAmountInput.value = parseInt(shiftAmountInput.value) + 1;
        calculate();
    });

    decreaseShiftBtn.addEventListener('click', () => {
        shiftAmountInput.value = Math.max(0, parseInt(shiftAmountInput.value) - 1);
        calculate();
    });

    directionLeftBtn.addEventListener('click', () => {
        currentDirection = 'left';
        directionLeftBtn.classList.add('active');
        directionRightBtn.classList.remove('active');
        calculate();
    });

    directionRightBtn.addEventListener('click', () => {
        currentDirection = 'right';
        directionRightBtn.classList.add('active');
        directionLeftBtn.classList.remove('active');
        calculate();
    });

    input.addEventListener('input', updateInput);
    shiftAmountInput.addEventListener('input', calculate);

    updateInput();
}
