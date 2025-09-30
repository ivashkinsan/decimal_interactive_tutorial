import { FullDecimalVisualizer } from '../components/full-decimal-visualizer.js';

export async function renderBitwiseOperations(container) {
    const html = `
        <div class="bitwise-operations-container">
            <div class="decimal-input-group">
                <label>Число 1:</label>
                <input type="number" id="bitwise-input-1" value="123">
                <div id="decimal-visualizer-1"></div>
            </div>
            <div class="decimal-input-group">
                <label>Число 2:</label>
                <input type="number" id="bitwise-input-2" value="456">
                <div id="decimal-visualizer-2"></div>
            </div>
            <div class="operations">
                <button id="bitwise-and">AND</button>
                <button id="bitwise-or">OR</button>
                <button id="bitwise-xor">XOR</button>
                <button id="bitwise-not-1">NOT 1</button>
                <button id="bitwise-not-2">NOT 2</button>
            </div>
            <div class="code-display">
                <pre><code id="code-output"></code></pre>
            </div>
            <div class="decimal-input-group">
                <label>Результат:</label>
                <p><code id="bitwise-result-output"></code></p>
                <div id="decimal-visualizer-result"></div>
            </div>
        </div>
    `;
    container.innerHTML = html;

    const input1 = document.getElementById('bitwise-input-1');
    const input2 = document.getElementById('bitwise-input-2');
    const resultOutput = document.getElementById('bitwise-result-output');
    const codeOutput = document.getElementById('code-output');
    
    const visualizer1 = new FullDecimalVisualizer(document.getElementById('decimal-visualizer-1'), 'vis1-');
    const visualizer2 = new FullDecimalVisualizer(document.getElementById('decimal-visualizer-2'), 'vis2-');
    const resultVisualizer = new FullDecimalVisualizer(document.getElementById('decimal-visualizer-result'), 'res-');

    let bits1 = [0, 0, 0, 0];
    let bits2 = [0, 0, 0, 0];
    let currentOperation = 'AND';

    function updateInputs() {
        const val1 = BigInt(input1.value || 0);
        bits1[0] = Number(val1 & 0xFFFFFFFFn);
        bits1[1] = Number((val1 >> 32n) & 0xFFFFFFFFn);
        bits1[2] = Number((val1 >> 64n) & 0xFFFFFFFFn);
        bits1[3] = 0;
        visualizer1.update(bits1);

        const val2 = BigInt(input2.value || 0);
        bits2[0] = Number(val2 & 0xFFFFFFFFn);
        bits2[1] = Number((val2 >> 32n) & 0xFFFFFFFFn);
        bits2[2] = Number((val2 >> 64n) & 0xFFFFFFFFn);
        bits2[3] = 0;
        visualizer2.update(bits2);
        
        calculate(currentOperation);
    }

    function calculate(operation) {
        let resultBits = [0, 0, 0, 0];
        let operator = '';
        const val1 = input1.value || 0;
        const val2 = input2.value || 0;

        for (let i = 0; i < 3; i++) { // Only operate on the first 3 ints (96 bits)
            switch (operation) {
                case 'AND':
                    operator = '&';
                    resultBits[i] = bits1[i] & bits2[i];
                    break;
                case 'OR':
                    operator = '|';
                    resultBits[i] = bits1[i] | bits2[i];
                    break;
                case 'XOR':
                    operator = '^';
                    resultBits[i] = bits1[i] ^ bits2[i];
                    break;
                case 'NOT1':
                    operator = '~';
                    resultBits[i] = ~bits1[i];
                    break;
                case 'NOT2':
                    operator = '~';
                    resultBits[i] = ~bits2[i];
                    break;
            }
        }
        resultVisualizer.update(resultBits);

        if (operation === 'NOT1') {
            codeOutput.textContent = `unsigned int result = ${operator}${val1};`;
        } else if (operation === 'NOT2') {
            codeOutput.textContent = `unsigned int result = ${operator}${val2};`;
        } else {
            codeOutput.textContent = `unsigned int result = ${val1} ${operator} ${val2};`;
        }

        // Calculate the numerical result and update the input field
        let resultValue = BigInt(0);
        const high = BigInt.asUintN(32, BigInt(resultBits[2]));
        const mid = BigInt.asUintN(32, BigInt(resultBits[1]));
        const low = BigInt.asUintN(32, BigInt(resultBits[0]));

        resultValue = (high << 64n) | (mid << 32n) | low;

        if (operation === 'NOT1' || operation === 'NOT2') {
            const isNegative = (resultBits[2] & 0x80000000) !== 0;
            if (isNegative) {
                const mask = (1n << 96n) - 1n;
                const positiveValue = resultValue & mask;
                resultValue = positiveValue - (1n << 96n);
            }
        }

        resultOutput.textContent = resultValue.toString();
    }

    const operationButtons = document.querySelectorAll('.operations button');

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            operationButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentOperation = button.id.replace('bitwise-', '').toUpperCase();
            if (currentOperation.includes('-')) {
                currentOperation = currentOperation.replace('-', '');
            }
            calculate(currentOperation);
        });
    });

    input1.addEventListener('input', updateInputs);
    input2.addEventListener('input', updateInputs);

    document.getElementById('bitwise-and').classList.add('active');

    updateInputs();
}
