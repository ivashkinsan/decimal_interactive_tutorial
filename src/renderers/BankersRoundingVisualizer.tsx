import React from 'react';
import styles from './BankersRoundingSimulator.module.css';

interface BankersRoundingVisualizerProps {
  inputValue: number;
  scale: number;
  resultValue: number;
}

export const BankersRoundingVisualizer: React.FC<BankersRoundingVisualizerProps> = ({ inputValue, scale, resultValue }) => {

  const factor = Math.pow(10, scale);
  const scaledValue = inputValue * factor;
  const fractionalPart = scaledValue % 1;

  const isBankersCase = Math.abs(fractionalPart) === 0.5;

  const renderVisualContent = () => {
    const lowerBound = Math.floor(scaledValue) / factor;
    const upperBound = Math.ceil(scaledValue) / factor;

    if (isBankersCase) {
      const integerPart = Math.trunc(scaledValue);
      const isEven = integerPart % 2 === 0;

      return (
        <div className={styles.bankersCase}>
          <h4>Обнаружен случай Банковского округления!</h4>
          <p>Дробная часть числа равна <b>0.5</b>, поэтому округляем до ближайшего <b>четного</b>.</p>
          <div className={styles.numberLineContainer}>
            <div className={styles.numberLine}>
                <div className={styles.numberLineLabel} style={{ left: '0%' }}>{lowerBound.toFixed(scale)}</div>
                <div className={styles.numberLineLabel} style={{ right: '0%' }}>{upperBound.toFixed(scale)}</div>
                <div className={styles.numberLineMarker} style={{ left: `50%` }}>
                    <span className={styles.markerLabel}>{inputValue.toFixed(scale + 1)}</span>
                </div>
            </div>
          </div>
          <div className={styles.options}>
            <div className={`${styles.option} ${isEven ? styles.chosen : ''}`}>
              <span>{lowerBound.toFixed(scale)}</span>
              {isEven && <span className={styles.label}>Четное, выбираем</span>}
            </div>
            <div className={`${styles.option} ${!isEven ? styles.chosen : ''}`}>
              <span>{upperBound.toFixed(scale)}</span>
              {!isEven && <span className={styles.label}>Четное, выбираем</span>}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.standardCase}>
          <h4>Стандартное округление</h4>
          <p>Число округляется до ближайшего соседа.</p>
          <div className={styles.numberLineContainer}>
            <div className={styles.numberLine}>
                <div className={styles.numberLineLabel} style={{ left: '0%' }}>{lowerBound.toFixed(scale)}</div>
                <div className={styles.numberLineLabel} style={{ right: '0%' }}>{upperBound.toFixed(scale)}</div>
                <div className={styles.numberLineMarker} style={{ left: `${Math.abs(fractionalPart) * 100}%` }}>
                    <span className={styles.markerLabel}>{inputValue.toFixed(scale + 1)}</span>
                </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.visualizerContainer}>
      {renderVisualContent()}
      <div className={styles.finalResult}>
        <span>Итоговый результат:</span>
        <code className={styles.resultValue}>{resultValue.toFixed(scale)}</code>
      </div>
    </div>
  );
};
