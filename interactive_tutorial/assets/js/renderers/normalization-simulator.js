export async function renderNormalizationSimulator(container) {
    const html = `
    <h3>Симулятор нормализации</h3>
    <div class="interactive-example">
        <div class="norm-controls">
            <div>
                <label>Мантисса A: <input type="number" id="norm-mantissa-a" value="123"></label>
                <label>Scale A: <input type="number" id="norm-scale-a" min="0" max="28" value="2"></label>
            </div>
            <div>
                <label>Мантисса B: <input type="number" id="norm-mantissa-b" value="45"></label>
                <label>Scale B: <input type="number" id="norm-scale-b" min="0" max="28" value="4"></label>
            </div>
        </div>
        <button id="run-norm">Нормализовать</button>
        <hr>
        <div class="norm-visualization">
            <div class="norm-card" id="card-a">
                <h4>Число A</h4>
                <div class="norm-value" id="value-a">1.23</div>
                <div class="norm-mantissa-display">Мантисса: <span id="mantissa-a-val">123</span></div>
                <div class="norm-scale-bar-container">
                    <div class="norm-scale-bar" id="scale-bar-a"></div>
                </div>
            </div>
            <div class="norm-card" id="card-b">
                <h4>Число B</h4>
                <div class="norm-value" id="value-b">0.0045</div>
                <div class="norm-mantissa-display">Мантисса: <span id="mantissa-b-val">45</span></div>
                <div class="norm-scale-bar-container">
                    <div class="norm-scale-bar" id="scale-bar-b"></div>
                </div>
            </div>
        </div>
        <div id="result"></div>
    </div>`;
    container.innerHTML = html;

    const mantissaAInput = document.getElementById('norm-mantissa-a');
    const scaleAInput = document.getElementById('norm-scale-a');
    const mantissaBInput = document.getElementById('norm-mantissa-b');
    const scaleBInput = document.getElementById('norm-scale-b');
    const resultDiv = document.getElementById('result');

    const cardA = document.getElementById('card-a');
    const cardB = document.getElementById('card-b');
    const valueA = document.getElementById('value-a');
    const valueB = document.getElementById('value-b');
    const mantissaADisplay = document.getElementById('mantissa-a-val');
    const mantissaBDisplay = document.getElementById('mantissa-b-val');
    const scaleBarA = document.getElementById('scale-bar-a');
    const scaleBarB = document.getElementById('scale-bar-b');

    const drawScaleBar = (el, scale) => {
        el.innerHTML = '';
        for (let i = 0; i < scale; i++) {
            const bar = document.createElement('div');
            bar.className = 'scale-tick';
            el.appendChild(bar);
        }
    };

    const updateInitialState = () => {
        const mantissaA = mantissaAInput.value;
        const scaleA = parseInt(scaleAInput.value);
        const mantissaB = mantissaBInput.value;
        const scaleB = parseInt(scaleBInput.value);

        valueA.textContent = (Number(mantissaA) / (10 ** scaleA)).toFixed(scaleA);
        mantissaADisplay.textContent = mantissaA;
        drawScaleBar(scaleBarA, scaleA);

        valueB.textContent = (Number(mantissaB) / (10 ** scaleB)).toFixed(scaleB);
        mantissaBDisplay.textContent = mantissaB;
        drawScaleBar(scaleBarB, scaleB);
        
        cardA.classList.remove('highlight', 'normalized');
        cardB.classList.remove('highlight', 'normalized');
        resultDiv.innerHTML = '';
    };

    mantissaAInput.addEventListener('input', updateInitialState);
    scaleAInput.addEventListener('input', updateInitialState);
    mantissaBInput.addEventListener('input', updateInitialState);
    scaleBInput.addEventListener('input', updateInitialState);

    document.getElementById('run-norm').addEventListener('click', () => {
        updateInitialState();
        let mantissaA = BigInt(mantissaAInput.value);
        let scaleA = parseInt(scaleAInput.value);
        let mantissaB = BigInt(mantissaBInput.value);
        let scaleB = parseInt(scaleBInput.value);

        resultDiv.innerHTML = 'Анализ...';

        setTimeout(() => {
            if (scaleA === scaleB) {
                resultDiv.innerHTML = 'Числа уже нормализованы!';
                cardA.classList.add('normalized');
                cardB.classList.add('normalized');
                return;
            }

            if (scaleA < scaleB) {
                cardA.classList.add('highlight');
                const diff = scaleB - scaleA;
                resultDiv.innerHTML = `Scale A (${scaleA}) < Scale B (${scaleB}). Увеличиваем Scale A на ${diff}.`;
                setTimeout(() => {
                    const multiplier = BigInt(10 ** diff);
                    resultDiv.innerHTML += `<br>Умножаем мантиссу A на 10<sup>${diff}</sup> (x${multiplier})...`;
                    mantissaADisplay.textContent = mantissaA * multiplier;
                    drawScaleBar(scaleBarA, scaleB);
                    setTimeout(() => {
                        resultDiv.innerHTML += `<br>Готово! Оба числа нормализованы.`;
                        cardA.classList.remove('highlight');
                        cardA.classList.add('normalized');
                        cardB.classList.add('normalized');
                    }, 1000);
                }, 1500);
            } else { // scaleB < scaleA
                cardB.classList.add('highlight');
                const diff = scaleA - scaleB;
                resultDiv.innerHTML = `Scale B (${scaleB}) < Scale A (${scaleA}). Увеличиваем Scale B на ${diff}.`;
                setTimeout(() => {
                    const multiplier = BigInt(10 ** diff);
                    resultDiv.innerHTML += `<br>Умножаем мантиссу B на 10<sup>${diff}</sup> (x${multiplier})...`;
                    mantissaBDisplay.textContent = mantissaB * multiplier;
                    drawScaleBar(scaleBarB, scaleA);
                    setTimeout(() => {
                        resultDiv.innerHTML += `<br>Готово! Оба числа нормализованы.`;
                        cardB.classList.remove('highlight');
                        cardA.classList.add('normalized');
                        cardB.classList.add('normalized');
                    }, 1000);
                }, 1500);
            }
        }, 1000);
    });

    updateInitialState();
}