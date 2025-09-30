import React, { useState, useEffect } from 'react';
import styles from './FullDecimalVisualizer.module.css';

interface FullDecimalVisualizerProps {
  s21DecimalBits: number[];
}

const FullDecimalVisualizer: React.FC<FullDecimalVisualizerProps> = ({ s21DecimalBits: initialBits }) => {
  const [s21DecimalBits, setS21DecimalBits] = useState(initialBits);
  const [sign, setSign] = useState(0);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const newBits3 = (sign << 31) | (scale << 16);
    const newBits = [...initialBits];
    newBits[3] = newBits3;
    setS21DecimalBits(newBits);
  }, [sign, scale, initialBits]);

  const renderBitBlock = (bits: number, index: number, label: string, isMantissa: boolean = true) => {
    const bitElements: React.ReactNode[] = [];
    for (let i = 31; i >= 0; i--) {
      const bit = (bits >>> i) & 1;
      let bitClass = '';
      let groupLabel = '';

      if (isMantissa) {
        if (i % 8 === 7) groupLabel = 'byte-start';
      } else if (index === 3) {
        if (i === 31) {
          bitClass = styles.signBit;
          groupLabel = 'sign-group';
        } else if (i >= 16 && i <= 23) {
          bitClass = styles.scaleBit;
          if (i === 23) groupLabel = 'scale-group-start';
        } else {
          bitClass = styles.unusedBit;
        }
      }

      bitElements.push(
        <span
          key={`${index}-${i}`}
          className={`${styles.bit} ${bit === 1 ? styles.bitOne : ''} ${bitClass} ${styles[groupLabel]}`}
          title={`bits[${index}] Bit ${i}: ${bit}`}
        >
          {bit}
        </span>
      );
    }

    if (index === 3) {
      return (
        <div key={index} className={styles.bitBlock}>
          <div className={styles.bitLabel}>{label}</div>
          <div className={styles.controlsContainer}>
            <div className={styles.controlGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={sign === 1}
                  onChange={(e) => setSign(e.target.checked ? 1 : 0)}
                />
                Знак
              </label>
            </div>
            <div className={styles.controlGroup}>
              <label>Масштаб: {scale}</label>
              <input
                type="range"
                min="0"
                max="28"
                value={scale}
                onChange={(e) => setScale(parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className={styles.bitRowVisual}>{bitElements}</div>
        </div>
      );
    }

    return (
      <div key={index} className={styles.bitBlock}>
        <div className={styles.bitLabel}>{label}</div>
        <div className={styles.bitRowVisual}>{bitElements}</div>
      </div>
    );
  };

  const formattedNumber = () => {
    const signStr = sign === 1 ? '-' : '';
    const integerPart = '0';
    const fractionalPart = '0'.repeat(scale);
    return `${signStr}${integerPart}${scale > 0 ? '.' : ''}${fractionalPart}`;
  };

  return (
    <div className={styles.visualizerContainer}>
      <h3>s21_decimal Structure</h3>
      <div className={styles.mantissaSection}>
        <h4>Мантисса (96 бит)</h4>
        {renderBitBlock(s21DecimalBits[0], 0, 'bits[0]')}
        {renderBitBlock(s21DecimalBits[1], 1, 'bits[1]')}
        {renderBitBlock(s21DecimalBits[2], 2, 'bits[2]')}
      </div>
      <div className={styles.controlSection}>
        <h4>Управляющие биты (bits[3])</h4>
        {renderBitBlock(s21DecimalBits[3], 3, 'bits[3]', false)}
        <div className={styles.formattedNumber}>
          Пример числа: {formattedNumber()}
        </div>
      </div>
      <div className={styles.explanation}>
        <p><strong>bits[0], bits[1], bits[2]:</strong> 96-битная мантисса (младшие к старшим).</p>
        <p><strong>bits[3]:</strong> Содержит знак (бит 31) и масштаб (биты 16-23).</p>
        <ul>
          <li><strong>Знак:</strong> 31-й бит (самый старший) в <code>bits[3]</code> — это знаковый бит. Значение <strong>0</strong> в этом бите означает положительное число, а значение <strong>1</strong> — отрицательное. Знак "-" в выводе является лишь визуальным представлением того, что знаковый бит установлен в 1.</li>
          <li><strong>Минимальное значение:</strong> ≈ -7.9 x 10<sup>28</sup></li>
          <li><strong>Максимальное значение:</strong> ≈ +7.9 x 10<sup>28</sup></li>
          <li><strong>Масштаб (scale):</strong> от 0 до 28, определяет количество знаков после запятой.</li>
        </ul>
      </div>
    </div>
  );
};

export default FullDecimalVisualizer;