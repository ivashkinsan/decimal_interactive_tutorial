export async function renderFileExplainer(container, data) {
    const code = data.code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    let html = `
        <h3>Описание</h3>
        <p>${data.description}</p>
        <h3>Код из файла <code>${data.title}</code></h3>
        <pre><code>${code}</code></pre>
    `;

    // Placeholder for future specific interactive examples
    if (data.interactive) {
        html += `
            <h3>Интерактивный пример</h3>
            <div class="interactive-example">
                <p><i>Интерактивный пример для этого файла еще не создан.</i></p>
            </div>
        `;
    }

    container.innerHTML = html;
}
