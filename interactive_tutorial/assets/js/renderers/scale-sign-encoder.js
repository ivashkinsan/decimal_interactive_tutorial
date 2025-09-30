export async function renderScaleSignEncoder(container) {
    const html = `
        <div class="scale-sign-encoder-container">
            <div class="controls">
                <label class="switch">
                    <input type="checkbox" id="sign-toggle">
                    <span class="slider-round"></span>
                </label>
                <span>Знак (бит 31)</span>
                <label>Масштаб (биты 16-23): <input type="range" min="0" max="28" value="0" id="scale-slider"><span id="scale-value">0</span></label>
            </div>
            <div id="bits3-visualizer"></div>
            <div class="result-display">Значение bits[3]: <span id="bits3-value">0</span></div>
            <div class="code-display">
                <pre><code id="code-output"></code></pre>
            </div>
        </div>
    `;
    container.innerHTML = html;

    const signToggle = document.getElementById('sign-toggle');
    const scaleSlider = document.getElementById('scale-slider');
    const scaleValueSpan = document.getElementById('scale-value');
    const bits3Visualizer = document.getElementById('bits3-visualizer');
    const bits3ValueSpan = document.getElementById('bits3-value');
    const codeOutput = document.getElementById('code-output');

    function update() {
        const isNegative = signToggle.checked;
        const scale = parseInt(scaleSlider.value);
        scaleValueSpan.textContent = scale;

        let bits3 = (isNegative ? 1 : 0) << 31 | scale << 16;
        bits3ValueSpan.textContent = bits3;

        let bitHtml = '';
        let binary = bits3.toString(2).padStart(32, '0');
        for (let i = 31; i >= 0; i--) {
            const bit = binary[31 - i];
            let group = '';
            if (i === 31) group = 'sign';
            else if (i >= 16 && i <= 23) group = 'scale';
            else group = 'unused';
            let bitOneClass = bit === '1' ? 'bit-one' : '';
            bitHtml += `<div class="bit ${group} ${bitOneClass}" title="Bit ${i}">${bit}</div>`;
        }
        bits3Visualizer.innerHTML = `<div class="bit-visualizer">${bitHtml}</div>`;

        const signCode = `s21_set_sign(&my_decimal, ${isNegative ? 1 : 0});`;
        const scaleCode = `s21_set_scale(&my_decimal, ${scale});`;
        codeOutput.textContent = `${signCode}\n${scaleCode}`;
    }

    signToggle.addEventListener('input', update);
    scaleSlider.addEventListener('input', update);
    update();
}
