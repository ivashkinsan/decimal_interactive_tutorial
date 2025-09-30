import React from 'react';
import styles from './OtherFunctionsSimulator.module.css';
import { S21Decimal, s21DecimalToNumber } from '../utils/s21DecimalJs';

interface OtherFunctionsVisualizerProps {
  operationType: string;
  originalDecimal: S21Decimal | null;
  resultDecimal: S21Decimal | null;
}

const OtherFunctionsVisualizer: React.FC<OtherFunctionsVisualizerProps> = ({ operationType, originalDecimal, resultDecimal }) => {
  if (!originalDecimal || !resultDecimal) {
    return null;
  }

  const originalValue = s21DecimalToNumber(originalDecimal);
  const resultValue = s21DecimalToNumber(resultDecimal);

  const renderContent = () => {
    switch (operationType) {
      case 'truncate':
        return renderTruncate();
      case 'negate':
        return renderNegate();
      case 'floor':
        return renderFloor();
      case 'round':
        return renderRound();
      default:
        return null;
    }
  };

  const renderTruncate = () => (
    <div className={styles.visualizerSection}>
      <h4>Процесс: TRUNCATE</h4>
      <p>Функция <code>truncate</code> отбрасывает дробную часть числа.</p>
      <div className={styles.ioDisplay}>
        <div className={styles.ioBox}>
          <span>Исходное число:</span>
          <code className={styles.codeBlock}>{originalValue.toFixed(4)}</code>
        </div>
        <div className={styles.arrow}>→</div>
        <div className={styles.ioBox}>
          <span>Результат:</span>
          <code className={`${styles.codeBlock} ${styles.highlight}`}>{resultValue}</code>
        </div>
      </div>
      <p className={styles.explanation}>Любые цифры после запятой просто удаляются.</p>
    </div>
  );

  const renderNegate = () => (
    <div className={styles.visualizerSection}>
      <h4>Процесс: NEGATE</h4>
      <p>Функция <code>negate</code> меняет знак числа на противоположный.</p>
      <div className={styles.ioDisplay}>
        <div className={styles.ioBox}>
          <span>Исходное число:</span>
          <code className={styles.codeBlock}>{originalValue}</code>
        </div>
        <div className={styles.arrow}>→</div>
        <div className={styles.ioBox}>
          <span>Результат:</span>
          <code className={`${styles.codeBlock} ${styles.highlight}`}>{resultValue}</code>
        </div>
      </div>
      <p className={styles.explanation}>Это достигается инвертированием одного бита знака в представлении s21_decimal.</p>
    </div>
  );

  const renderFloor = () => (
    <div className={styles.visualizerSection}>
      <h4>Процесс: FLOOR</h4>
      <p>Функция <code>floor</code> округляет число до ближайшего меньшего целого.</p>
      <div className={styles.numberLineContainer}>
        <div className={styles.numberLine}>
          <div className={styles.numberLineLabel} style={{ left: '0%' }}>{Math.floor(originalValue) - 1}</div>
          <div className={styles.numberLineLabel} style={{ left: '50%' }}>{Math.floor(originalValue)}</div>
          <div className={styles.numberLineLabel} style={{ right: '0%' }}>{Math.floor(originalValue) + 1}</div>
          <div className={styles.numberLineMarker} style={{ left: `${(originalValue - Math.floor(originalValue)) * 50}%` }}>
            <span className={styles.markerLabel}>{originalValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className={styles.ioDisplay} style={{ marginTop: '20px' }}>
          <p>Число <span className={styles.highlight}>{originalValue.toFixed(2)}</span> округляется ВНИЗ до <span className={styles.highlight}>{resultValue}</span>.</p>
      </div>
      <p className={styles.infoText}>
        <b>Примечание:</b> Тип <code>s21_decimal</code> может хранить значения до ~7.9x10<sup>28</sup> с точностью до 28 знаков после запятой.
      </p>
    </div>
  );

    const renderRound = () => {
    const isBankers = Math.abs(originalValue % 1) === 0.5;
    return (
        <div className={styles.visualizerSection}>
            <h4>Процесс: ROUND</h4>
            <p>Округляет до ближайшего целого. Для .5 используется "Банковское округление" (до ближайшего четного).</p>
            <div className={styles.numberLineContainer}>
                 <div className={styles.numberLine}>
                    <div className={styles.numberLineLabel} style={{ left: '0%' }}>{Math.floor(originalValue)}</div>
                    <div className={styles.numberLineLabel} style={{ right: '0%' }}>{Math.ceil(originalValue)}</div>
                    <div className={styles.numberLineMarker} style={{ left: `${(originalValue - Math.floor(originalValue)) * 100}%` }}>
                        <span className={styles.markerLabel}>{originalValue.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <div className={styles.ioDisplay} style={{ marginTop: '20px' }}>
                <p>Число <span className={styles.highlight}>{originalValue.toFixed(2)}</span> округляется до <span className={styles.highlight}>{resultValue}</span>.</p>
                {isBankers && <p className={styles.explanation}><b>Банковское округление:</b> {originalValue} имеет .5 в дробной части, поэтому округляется до ближайшего <b>четного</b> целого.</p>}
            </div>
            <p className={styles.infoText}>
              <b>Примечание:</b> Тип <code>s21_decimal</code> может хранить значения до ~7.9x10<sup>28</sup> с точностью до 28 знаков после запятой.
            </p>
        </div>
    );
  }

  return <div className={styles.otherFunctionsVisualizer}>{renderContent()}</div>;
};

export { OtherFunctionsVisualizer };
