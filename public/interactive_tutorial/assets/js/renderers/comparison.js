export async function renderComparison(data, container) {
    const operator = data.title.replace('s21_', '').replace('_', ' ');
    const html = `
        <h3>Интерактивный пример</h3>
        <div class="interactive-example">
            <div class="inputs">
                <input type="text" id="val1" placeholder="value_1">
                <span>${operator}</span>
                <input type="text" id="val2" placeholder="value_2">
            </div>
            <button id="run-interactive">Выполнить</button>
            <div id="result"></div>
        </div>`;
    container.innerHTML = html;

    document.getElementById('run-interactive').addEventListener('click', () => {
        const val1 = parseFloat(document.getElementById('val1').value);
        const val2 = parseFloat(document.getElementById('val2').value);
        const resultDiv = document.getElementById('result');
        if (isNaN(val1) || isNaN(val2)) {
            resultDiv.textContent = 'Ошибка: введите корректные числа.';
            return;
        }
        const result = data.interactionLogic(val1, val2);
        resultDiv.textContent = `Результат: ${result ? 'TRUE' : 'FALSE'}`;
    });
}