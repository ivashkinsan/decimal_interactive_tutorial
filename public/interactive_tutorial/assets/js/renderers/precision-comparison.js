import { FullDecimalVisualizer } from '../components/full-decimal-visualizer.js';

// Helper function to get the IEEE 754 binary representation of a number
function toFloat32Bits(n) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setFloat32(0, n, false);
    let bits = view.getUint32(0).toString(2).padStart(32, '0');
    // Format for readability: sign | exponent | mantissa
    return `${bits.slice(0, 1)} | ${bits.slice(1, 9)} | ${bits.slice(9)}`;
}

export async function renderPrecisionComparison(container) {
    const html = `
        <div class="precision-comparison-container">
            <div class="decimal-input-group">
                <label>Введите число (например, 0.1 или 0.2):</label>
                <input type="text" id="precision-input" value="0.1">
            </div>

            <div class="type-display">
                <h3>s21_decimal</h3>
                <p>Точное десятичное представление без ошибок округления.</p>
                <div id="decimal-visualizer"></div>
                <div class="code-display">
                    <pre><code id="decimal-code"></code></pre>
                </div>
            </div>

            <div class="type-display">
                <h3>float (32-bit)</h3>
                <p>Стандартный тип с плавающей запятой. Может приводить к ошибкам точности.</p>
                <div class="bit-visualizer" id="float-visualizer"></div>
                 <div class="code-display">
                    <pre><code id="float-code"></code></pre>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;

    const input = document.getElementById('precision-input');
    const decimalVisualizerContainer = document.getElementById('decimal-visualizer');
    const floatVisualizerContainer = document.getElementById('float-visualizer');
    const decimalCode = document.getElementById('decimal-code');
    const floatCode = document.getElementById('float-code');

    const decimalVisualizer = new FullDecimalVisualizer(decimalVisualizerContainer, 'dec-');

    function update() {
        const numStr = input.value || "0";
        const num = parseFloat(numStr);

        // --- Update s21_decimal --- 
        try {
            let [integerPart, fractionalPart] = numStr.split('.');
            fractionalPart = fractionalPart || '';
            const scale = fractionalPart.length;

            if (scale > 28) {
                throw new Error("Масштаб не может быть больше 28");
            }

            const mantissaStr = (integerPart || '0') + fractionalPart;
            const mantissa = BigInt(mantissaStr);

            const isNegative = num < 0;

            let bits = [0, 0, 0, 0];
            bits[0] = Number(mantissa & 0xFFFFFFFFn);
            bits[1] = Number((mantissa >> 32n) & 0xFFFFFFFFn);
            bits[2] = Number((mantissa >> 64n) & 0xFFFFFFFFn);
            bits[3] = (scale << 16) | ((isNegative ? 1 : 0) << 31);

            decimalVisualizer.update(bits);
            decimalCode.textContent = `s21_decimal my_decimal;\ns21_from_float_to_decimal(${numStr}f, &my_decimal);`;

        } catch (e) {
            decimalVisualizer.update([0, 0, 0, 0]);
            decimalCode.textContent = e.message;
        }

        // --- Update float --- 
        const floatBits = toFloat32Bits(num);
        floatVisualizerContainer.textContent = floatBits;
        floatCode.textContent = `float my_float = ${numStr}f;\n// Фактическое значение: ${num.toPrecision(20)}`;
    }

    input.addEventListener('input', update);
    update();
}