import { contentData, fileCodeData } from './content.js';
import { renderComparison } from './renderers/comparison.js';
import { renderRepresentationExplorer } from './renderers/representation-explorer.js';
import { renderNormalizationSimulator } from './renderers/normalization-simulator.js';
import { renderAdditionSimulator } from './renderers/addition-simulator.js';
import { renderFileExplainer } from './renderers/file-explainer.js';
import { renderBitwiseOperations } from './renderers/bitwise-operations.js';
import { renderBitShifting } from './renderers/bit-shifting.js';
import { renderScaleSignEncoder } from './renderers/scale-sign-encoder.js';
import { renderPrecisionComparison } from './renderers/precision-comparison.js';

document.addEventListener('DOMContentLoaded', () => {
    const functionNav = document.getElementById('function-nav').querySelector('ul');
    const contentTitle = document.getElementById('content-title');
    const contentBody = document.getElementById('content-body');

    // --- Инициализация --- //
    Object.keys(contentData).forEach(key => {
        const data = contentData[key];
        const li = document.createElement('li');
        if (data.type === 'separator') {
            li.classList.add('separator');
            li.textContent = data.title;
        } else {
            const a = document.createElement('a');
            a.href = `#${key}`;
            a.textContent = data.title;
            a.dataset.key = key;
            li.appendChild(a);
        }
        functionNav.appendChild(li);
    });

    functionNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const key = e.target.dataset.key;
            displayContent(key);
            document.querySelectorAll('#function-nav a').forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    // --- Рендеринг контента --- //
    async function displayContent(key) {
        const data = contentData[key];
        if (!data) return;

        contentTitle.textContent = data.title;
        contentBody.innerHTML = ''; // Очищаем перед отрисовкой

        // Если это пошаговый гид, он сам управляет своим содержимым
        if (data.interactive === 'representation_explorer') {
            await renderRepresentationExplorer(contentBody, data);
            return; // Завершаем, так как рендерер сделал всю работу
        }

        // Стандартная логика для всех остальных страниц
        let html = '';
        if(data.simple) {
            html += `<h3>Простыми словами</h3><p>${data.simple}</p>`;
        }
        if(data.why) {
            html += `<h3>Зачем это нужно?</h3><p>${data.why}</p>`;
        }
        if(data.description) {
            html += `<h3>Техническое описание</h3><p>${data.description}</p>`;
        }
        if (data.prototype) {
            html += `<h4>Прототип функции</h4><pre><code>${data.prototype}</code></pre>`;
        }
        if (data.details) {
            html += `<h4>Подробности реализации</h4><p>${data.details}</p>`;
        }
        // NEW: Check for code in fileCodeData
        if (data.interactive === 'file-explainer' && fileCodeData[data.title]) {
            const code = fileCodeData[data.title].replace(/</g, '&lt;').replace(/>/g, '&gt;');
            html += `<h3>Код из файла <code>${data.title}</code></h3><pre><code>${code}</code></pre>`;
        }
        contentBody.innerHTML = html;

        // Контейнер для простых интерактивных примеров
        const interactiveContainer = document.createElement('div');
        contentBody.appendChild(interactiveContainer);

        switch (data.interactive) {
            case 'comparison':
                await renderComparison(data, interactiveContainer);
                break;
            case 'normalization_simulator':
                await renderNormalizationSimulator(interactiveContainer);
                break;
            case 'addition_simulator':
                await renderAdditionSimulator(interactiveContainer);
                break;
            case 'bitwise_operations':
                await renderBitwiseOperations(interactiveContainer);
                break;
            case 'bit_shifting':
                await renderBitShifting(interactiveContainer);
                break;
            case 'scale_sign_encoder':
                await renderScaleSignEncoder(interactiveContainer);
                break;
            case 'precision_comparison':
                await renderPrecisionComparison(interactiveContainer);
                break;
            case 'file-explainer':
                await renderFileExplainer(interactiveContainer, data);
                break;
        }
    }

    // Показать приветственное сообщение при первой загрузке
    function showWelcomeMessage() {
        contentTitle.textContent = 'Добро пожаловать!';
        contentBody.innerHTML = '<p>Это интерактивное руководство создано, чтобы помочь вам разобраться в проекте s21_decimal.</p><p>Выберите тему из меню слева, чтобы начать.</p>';
    }

    showWelcomeMessage();
});
