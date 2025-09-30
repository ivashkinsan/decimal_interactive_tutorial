export class FullDecimalVisualizer {
    constructor(container, prefix = '') {
        this.container = container;
        this.prefix = prefix;
        this.bits = [0, 0, 0, 0];
        this.render();
    }

    render() {
        let html = `<div class="full-decimal-visualizer" id="${this.prefix}full-decimal-visualizer">`;
        for (let i = 3; i >= 0; i--) {
            html += `
                <div class="decimal-part">
                    <div class="decimal-label">bits[${i}]</div>
                    <div id="${this.prefix}bits${i}-visualizer" class="bit-visualizer"></div>
                </div>
            `;
        }
        html += '</div>';
        this.container.innerHTML = html;
    }

    update(bits) {
        this.bits = bits;
        for (let i = 0; i < 4; i++) {
            let binary = (this.bits[i] || 0).toString(2).padStart(32, '0');
            let bitHtml = '';
            for (let j = 31; j >= 0; j--) {
                const bit = binary[31 - j];
                let group = '';
                if (i === 3) {
                    if (j === 31) group = 'sign';
                    else if (j >= 16 && j <= 23) group = 'scale';
                    else group = 'unused';
                } else {
                    group = 'mantissa';
                }
                let bitOneClass = bit === '1' ? 'bit-one' : '';
                bitHtml += `<div class="bit ${group} ${bitOneClass}" title="Bit ${j}">${bit}</div>`;
            }
            document.getElementById(`${this.prefix}bits${i}-visualizer`).innerHTML = bitHtml;
        }
    }
}