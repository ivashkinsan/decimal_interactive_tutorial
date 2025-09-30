import React, { useState, useEffect } from 'react';
import styles from './BankersRoundingSimulator.module.css';
import { BankersRoundingVisualizer } from './BankersRoundingVisualizer';
import { createS21Decimal, s21DecimalToNumber, s21Round } from '../utils/s21DecimalJs';

export const BankersRoundingSimulator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('2.5');
  const [scale, setScale] = useState<number>(0);
  const [roundedResult, setRoundedResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleRound();
  }, [inputValue, scale]);

  const handleRound = () => {
    setError(null);

    try {
      const decimal = createS21Decimal(inputValue);
      const resultDecimal = s21Round(decimal, scale);
      setRoundedResult(s21DecimalToNumber(resultDecimal));

    } catch (e: any) {
      setError(e.message || "Произошла ошибка во время округления.");
      setRoundedResult(null);
    }
  };

  return (
    <div className={styles.bankersRoundingSimulatorContainer}>
      <h3>Интерактивный пример: Банковское округление</h3>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.controlsContainer}>
        <div className={styles.inputGroup}>
          <label htmlFor="input-value">Значение:</label>
          <input
            type="number"
            step="any"
            id="input-value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.inputField}
            placeholder="Введите число"
          />
        </div>

        <div className={styles.scaleGroup}>
          <label htmlFor="scale-slider">Знаков после запятой:</label>
          <input
            type="range"
            min="0"
            max="10"
            value={scale}
            onChange={(e) => setScale(parseInt(e.target.value))}
            className={styles.scaleSlider}
          />
          <span className={styles.scaleValue}>{scale}</span>
        </div>
      </div>

      {roundedResult !== null && (
        <BankersRoundingVisualizer 
          inputValue={parseFloat(inputValue)}
          scale={scale}
          resultValue={roundedResult}
        />
      )}
    </div>
  );
};
