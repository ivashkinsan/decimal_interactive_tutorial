export async function renderAdditionSimulator(container) {
    const html = `
    <h3>Симулятор сложения в столбик</h3>
    <div class="interactive-example">
        <div class="add-controls">
            <input type="text" id="add-val1" value="952">
            <span>+</span>
            <input type="text" id="add-val2" value="87">
        </div>
        <button id="run-add">Анимировать сложение</button>
        <hr>
        <div class="add-visualization" id="add-visualization">
            <!-- Сюда будет генерироваться табло -->
        </div>
        <div id="result"></div>
    </div>`;
    container.innerHTML = html;

    const val1Input = document.getElementById('add-val1');
    const val2Input = document.getElementById('add-val2');
    const vizContainer = document.getElementById('add-visualization');
    const resultDiv = document.getElementById('result');
    const runBtn = document.getElementById('run-add');

    let animationInterval = null;

    const setupBoard = () => {
        if (animationInterval) clearInterval(animationInterval);
        runBtn.disabled = false;
        resultDiv.innerHTML = '';

        const val1 = val1Input.value.trim();
        const val2 = val2Input.value.trim();
        const len = Math.max(val1.length, val2.length) + 1; // +1 для возможного переноса

        const pad1 = val1.padStart(len, ' ');
        const pad2 = val2.padStart(len, ' ');

        let boardHtml = 
            `<div class="add-row carry-row">${ '<div class="digit-box carry"></div>'.repeat(len) }</div>` +
            `<div class="add-row">${ pad1.split('').map(d => `<div class="digit-box">${d}</div>`).join('') }</div>` +
            `<div class="add-row op-row"><div class="op-box">+</div></div>` +
            `<div class="add-row">${ pad2.split('').map(d => `<div class="digit-box">${d}</div>`).join('') }</div>` +
            `<div class="add-row line-row"><hr></div>` +
            `<div class="add-row result-row">${ '<div class="digit-box result"></div>'.repeat(len) }</div>`;
        
        vizContainer.innerHTML = boardHtml;
    };

    runBtn.addEventListener('click', () => {
        if (animationInterval) clearInterval(animationInterval);
        runBtn.disabled = true;
        
        let val1 = val1Input.value.trim();
        let val2 = val2Input.value.trim();

        if (!/^[0-9]+$/.test(val1) || !/^[0-9]+$/.test(val2)) {
            resultDiv.innerHTML = "Ошибка: введите только целые положительные числа.";
            runBtn.disabled = false;
            return;
        }

        const len = Math.max(val1.length, val2.length) + 1;
        val1 = val1.padStart(len, '0');
        val2 = val2.padStart(len, '0');
        setupBoard();

        const carryBoxes = vizContainer.querySelectorAll('.carry-row .digit-box');
        const val1Boxes = vizContainer.querySelectorAll('.add-row:nth-child(2) .digit-box');
        const val2Boxes = vizContainer.querySelectorAll('.add-row:nth-child(4) .digit-box');
        const resultBoxes = vizContainer.querySelectorAll('.result-row .digit-box');
        
        let currentDigit = len - 1;
        let carry = 0;

        animationInterval = setInterval(() => {
            // Снимаем подсветку с предыдущего шага
            if (currentDigit < len - 1) {
                val1Boxes[currentDigit + 1].classList.remove('active');
                val2Boxes[currentDigit + 1].classList.remove('active');
                resultBoxes[currentDigit + 1].classList.remove('active');
                if (carryBoxes[currentDigit]) carryBoxes[currentDigit].classList.remove('active');
            }

            if (currentDigit < 0) {
                clearInterval(animationInterval);
                resultDiv.innerHTML = "Готово!";
                runBtn.disabled = false;
                return;
            }

            // Подсвечиваем текущие цифры
            val1Boxes[currentDigit].classList.add('active');
            val2Boxes[currentDigit].classList.add('active');

            const d1 = parseInt(val1[currentDigit]) || 0;
            const d2 = parseInt(val2[currentDigit]) || 0;
            const sum = d1 + d2 + carry;
            const resultDigit = sum % 10;
            const newCarry = Math.floor(sum / 10);

            resultDiv.innerHTML = `Шаг ${len - currentDigit}: Складываем ${d1} + ${d2} + (перенос ${carry}) = ${sum}`;
            
            resultBoxes[currentDigit].textContent = resultDigit;
            resultBoxes[currentDigit].classList.add('active');

            if (newCarry > 0) {
                const carryEl = carryBoxes[currentDigit - 1];
                if(carryEl) {
                    carryEl.textContent = newCarry;
                    carryEl.classList.add('active');
                }
            }
            
            carry = newCarry;
            currentDigit--;

        }, 2000);
    });

    val1Input.addEventListener('input', setupBoard);
    val2Input.addEventListener('input', setupBoard);
    setupBoard();
}