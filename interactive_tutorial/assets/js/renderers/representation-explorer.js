import { FullDecimalVisualizer } from '../components/full-decimal-visualizer.js';

export async function renderRepresentationExplorer(container, data) {
    // Сначала отображаем текстовые описания
    const textHtml = `
        <h3>Простыми словами</h3><p>${data.simple}</p>
        <h3>Зачем это нужно?</h3><p>${data.why}</p>
        <h3>Техническое описание</h3><p>${data.description}</p>
        <hr>
    `;

    // Затем - интерактивный мастер
    const wizardHTML = `
        <div class="wizard-container">
            <div class="wizard-header">
                <h3 id="wizard-title"></h3>
            </div>
            <div class="wizard-body">
                <div class="wizard-prologue" id="wizard-prologue"></div>
                <div class="wizard-interactive-area" id="wizard-interactive-area"></div>
                <div class="wizard-epilogue" id="wizard-epilogue"></div>
            </div>
            <div class="wizard-nav">
                <button id="wizard-prev" disabled>Назад</button>
                <span id="wizard-step-indicator"></span>
                <button id="wizard-next">Далее</button>
            </div>
        </div>
    `;
    container.innerHTML = textHtml + wizardHTML;

    const titleEl = document.getElementById('wizard-title');
    const prologueEl = document.getElementById('wizard-prologue');
    const interactiveAreaEl = document.getElementById('wizard-interactive-area');
    const epilogueEl = document.getElementById('wizard-epilogue');
    const prevBtn = document.getElementById('wizard-prev');
    const nextBtn = document.getElementById('wizard-next');
    const stepIndicatorEl = document.getElementById('wizard-step-indicator');

    let currentStep = 0;
    let visualizer;

    // Данные для шагов теперь берем из `data.steps`
    const steps = data.steps || [];

    function renderStep(stepIndex) {
        if (!steps[stepIndex]) return;
        const stepData = steps[stepIndex];
        titleEl.textContent = stepData.title;
        prologueEl.innerHTML = stepData.prologue;
        epilogueEl.innerHTML = stepData.epilogue;
        interactiveAreaEl.innerHTML = ''; // Очищаем перед рендерингом
        stepIndicatorEl.textContent = `Шаг ${stepIndex + 1} / ${steps.length}`;

        prevBtn.disabled = stepIndex === 0;
        nextBtn.disabled = stepIndex === steps.length - 1;

        switch (stepIndex) {
            case 0: // Struct
                visualizer = new FullDecimalVisualizer(interactiveAreaEl);
                visualizer.update([0,0,0,0]);
                break;
            case 1: // Mantissa
                visualizer = new FullDecimalVisualizer(interactiveAreaEl);
                addMantissaInteraction();
                break;
            case 2: // bits[3] Explorer
                interactiveAreaEl.innerHTML = createBits3Explorer();
                addBits3Interaction();
                break;
            case 3: // Putting it all together
                visualizer = new FullDecimalVisualizer(interactiveAreaEl);
                showFinalExample();
                break;
        }
    }

    function addMantissaInteraction() {
        interactiveAreaEl.innerHTML = `<label>Введите число для мантиссы: <input type="number" id="mantissa-input" value="123456789"></label>`;
        const input = document.getElementById('mantissa-input');
        const update = () => {
            const val = BigInt(input.value || 0);
            const bits = [0,0,0,0];
            bits[0] = Number(val & 0xFFFFFFFFn);
            bits[1] = Number((val >> 32n) & 0xFFFFFFFFn);
            bits[2] = Number((val >> 64n) & 0xFFFFFFFFn);
            visualizer.update(bits);
        };
        input.addEventListener('input', update);
        update();
    }

    function createBits3Explorer() {
        return `
            <div class="bits3-explorer">
                <div class="controls">
                    <label class="switch"><input type="checkbox" id="sign-toggle"><span class="slider-round"></span></label>
                    <span>Знак (бит 31)</span>
                    <label>Масштаб (16-23): <input type="range" min="0" max="28" value="5" id="scale-slider"><span id="scale-value">5</span></label>
                </div>
                <div id="bits3-diagram-container"></div>
            </div>
        `;
    }

    function addBits3Interaction() {
        const signToggle = document.getElementById('sign-toggle');
        const scaleSlider = document.getElementById('scale-slider');
        const scaleValueSpan = document.getElementById('scale-value');
        const diagramContainer = document.getElementById('bits3-diagram-container');

        const update = () => {
            const isNegative = signToggle.checked;
            const scale = parseInt(scaleSlider.value);
            scaleValueSpan.textContent = scale;

            let bits3 = (isNegative ? 1 : 0) << 31 | scale << 16;
            let bitHtml = '';
            for (let i = 31; i >= 0; i--) {
                const bit = (bits3 >>> i) & 1;
                let group = (i === 31) ? 'sign' : (i >= 16 && i <= 23) ? 'scale' : 'unused';
                let bitOneClass = bit === 1 ? 'bit-one' : '';
                bitHtml += `<div class="bit ${group} ${bitOneClass}" title="Bit ${i}">${bit}</div>`;
            }
            diagramContainer.innerHTML = `<div class="bit-visualizer">${bitHtml}</div>`;
        };
        signToggle.addEventListener('input', update);
        scaleSlider.addEventListener('input', update);
        update();
    }

    function showFinalExample() {
        const bits = [];
        bits[0] = 12345; // Mantissa for 123.45
        bits[1] = 0;
        bits[2] = 0;
        bits[3] = (1 << 31) | (2 << 16); // sign=1, scale=2
        visualizer.update(bits);
    }

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            renderStep(currentStep);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep(currentStep);
        }
    });

    renderStep(0);
}