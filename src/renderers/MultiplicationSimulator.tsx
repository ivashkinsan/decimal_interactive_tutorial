import React, { useState, useEffect, useCallback } from 'react';
import styles from './ArithmeticSimulator.module.css'; // Reusing general arithmetic styles
import ArithmeticLogicVisualizer from '../components/ArithmeticLogicVisualizer/ArithmeticLogicVisualizer'; // New import
import { S21Decimal, createS21Decimal, s21DecimalToNumber, getS21DecimalSign, getS21DecimalScale, setS21DecimalSign, setS21DecimalScale, mulMantissas } from '../utils/s21DecimalJs'; // Added more utility functions

interface ArithmeticStep {
  description: string;
  value1?: string; // Decimal string representation
  value2?: string; // Decimal string representation
  result?: string; // Decimal string representation
  highlight?: 'value1' | 'value2' | 'result' | 'scale1' | 'scale2' | 'sign1' | 'sign2';
}

const MultiplicationSimulator: React.FC = () => {
  const [value1, setValue1] = useState<string>('10.5');
  const [value2, setValue2] = useState<string>('2.3');
  const [numericalResult, setNumericalResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<ArithmeticStep[]>([]); // New state for steps

  const calculateMultiplication = useCallback((dec1: S21Decimal, dec2: S21Decimal) => {
    const currentSteps: ArithmeticStep[] = [];
    try {
      const d1 = { ...dec1 };
      const d2 = { ...dec2 };

      currentSteps.push({
        description: `Исходные числа: Число 1 = ${s21DecimalToNumber(d1)}, Число 2 = ${s21DecimalToNumber(d2)}`,
        value1: s21DecimalToNumber(d1).toString(),
        value2: s21DecimalToNumber(d2).toString(),
      });

      const sign1 = getS21DecimalSign(d1);
      const sign2 = getS21DecimalSign(d2);
      const finalSign = (sign1 === sign2) ? 0 : 1;
      currentSteps.push({ description: `Определение знака результата: (${sign1 === 0 ? '+' : '-'}) * (${sign2 === 0 ? '+' : '-'}) = (${finalSign === 0 ? '+' : '-'})`, highlight: 'sign1' });

      const scale1 = getS21DecimalScale(d1);
      const scale2 = getS21DecimalScale(d2);
      const finalScale = scale1 + scale2;
      currentSteps.push({ description: `Сложение масштабов: ${scale1} + ${scale2} = ${finalScale}.`, highlight: 'scale1' });

      currentSteps.push({ description: `Умножение мантисс Числа 1 и Числа 2.` });
      const mantissaResult = mulMantissas(d1, d2);
      currentSteps.push({ description: `Результат умножения мантисс: ${s21DecimalToNumber(mantissaResult)}`, result: s21DecimalToNumber(mantissaResult).toString() });

      setS21DecimalSign(mantissaResult, finalSign);
      setS21DecimalScale(mantissaResult, finalScale);
      currentSteps.push({ description: `Установка финального знака (${finalSign === 0 ? '+' : '-'}) и масштаба (${finalScale}) для результата.`, result: s21DecimalToNumber(mantissaResult).toString(), highlight: 'result' });

      const finalResultDecimal = mantissaResult;
      setNumericalResult(s21DecimalToNumber(finalResultDecimal).toString());
      setSteps(currentSteps);

    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Произошла неизвестная ошибка во время умножения.");
        }
      setNumericalResult("Ошибка");
      setSteps(currentSteps);
    }
  }, []);

  const updateAll = useCallback(() => {
    setError(null);
    setSteps([]);
    try {
      const dec1 = createS21Decimal(value1);
      const dec2 = createS21Decimal(value2);
      calculateMultiplication(dec1, dec2);
    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Произошла неизвестная ошибка.");
        }
    }
  }, [value1, value2, calculateMultiplication]);

  useEffect(() => {
    updateAll();
  }, [updateAll]);

  return (
    <div className={styles.arithmeticSimulatorContainer}>
      <h3>Интерактивный пример: Умножение (*)</h3>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.inputSection}>
        <div className={styles.decimalInputGroup}>
          <label>Число 1:</label>
          <input
            type="text"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            className={styles.inputField}
            placeholder="Значение 1"
          />
        </div>
        <div className={styles.decimalInputGroup}>
          <label>Число 2:</label>
          <input
            type="text"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
            className={styles.inputField}
            placeholder="Значение 2"
          />
        </div>
      </div>

      <div className={styles.resultSection}>
        <div className={styles.decimalInputGroup}>
          <label>Результат:</label>
          <p className={styles.numericalResult}>{numericalResult}</p>
        </div>
      </div>
      <ArithmeticLogicVisualizer steps={steps} />
    </div>
  );
};

export default MultiplicationSimulator;
