import React, { useState, useEffect, useCallback } from 'react';
import styles from './OtherFunctionsSimulator.module.css';
import { OtherFunctionsVisualizer } from './OtherFunctionsVisualizer';
import { S21Decimal, createS21Decimal, s21Truncate, s21Negate, s21Floor, s21Round } from '../utils/s21DecimalJs';

export const OtherFunctionsSimulator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('123.45');
  const [operationType, setOperationType] = useState<string>('truncate');
  const [originalDecimal, setOriginalDecimal] = useState<S21Decimal | null>(null);
  const [resultDecimal, setResultDecimal] = useState<S21Decimal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOperation = useCallback(() => {
    setError(null);
    setOriginalDecimal(null);
    setResultDecimal(null);

    try {
      const decimal = createS21Decimal(inputValue);
      setOriginalDecimal(decimal);
      let resDecimal: S21Decimal | null = null;

      switch (operationType) {
        case 'truncate':
          resDecimal = s21Truncate(decimal);
          break;
        case 'negate':
          resDecimal = s21Negate(decimal);
          break;
        case 'floor':
          resDecimal = s21Floor(decimal);
          break;
        case 'round':
          resDecimal = s21Round(decimal, 0); // Round to 0 decimal places
          break;
        default:
          setError("Неверный тип операции.");
          return;
      }

      setResultDecimal(resDecimal);

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Произошла неизвестная ошибка во время операции.");
      }
    }
  }, [inputValue, operationType]);

  useEffect(() => {
    handleOperation();
  }, [handleOperation]);

  return (
    <div className={styles.otherFunctionsSimulatorContainer}>
      <h3>Интерактивный пример: Прочие функции</h3>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.inputGroup}>
        <label htmlFor="input-value">Значение:</label>
        <input
          type="text"
          id="input-value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.inputField}
          placeholder="Введите число"
        />
      </div>

      <div className={styles.operations}>
        <button
          className={`${styles.operationButton} ${operationType === 'truncate' ? styles.active : ''}`}
          onClick={() => setOperationType('truncate')}
        >TRUNCATE</button>
        <button
          className={`${styles.operationButton} ${operationType === 'negate' ? styles.active : ''}`}
          onClick={() => setOperationType('negate')}
        >NEGATE</button>
        <button
          className={`${styles.operationButton} ${operationType === 'floor' ? styles.active : ''}`}
          onClick={() => setOperationType('floor')}
        >FLOOR</button>
        <button
          className={`${styles.operationButton} ${operationType === 'round' ? styles.active : ''}`}
          onClick={() => setOperationType('round')}
        >ROUND</button>
      </div>

      <OtherFunctionsVisualizer 
        operationType={operationType}
        originalDecimal={originalDecimal}
        resultDecimal={resultDecimal}
      />
    </div>
  );
};
