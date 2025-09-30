import React, { useState, useEffect, useCallback } from 'react';
import styles from './ArithmeticSimulator.module.css'; // Reusing general arithmetic styles
import ArithmeticLogicVisualizer from '../components/ArithmeticLogicVisualizer/ArithmeticLogicVisualizer'; // New import
import { S21Decimal, createS21Decimal, s21DecimalToNumber, getS21DecimalSign, getS21DecimalScale, setS21DecimalSign, setS21DecimalScale, divMantissas } from '../utils/s21DecimalJs'; // Added more utility functions

interface ArithmeticStep {
  description: string;
  value1?: string; // Decimal string representation
  value2?: string; // Decimal string representation
  result?: string; // Decimal string representation
  highlight?: 'value1' | 'value2' | 'result' | 'scale1' | 'scale2' | 'sign1' | 'sign2';
}

const DivisionSimulator: React.FC = () => {
  const [value1, setValue1] = useState<string>('10.5');
  const [value2, setValue2] = useState<string>('2.3');
  const [numericalResult, setNumericalResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<ArithmeticStep[]>([]); // New state for steps

  const calculateDivision = useCallback((dec1: S21Decimal, dec2: S21Decimal) => {
    const currentSteps: ArithmeticStep[] = [];
    try {
      const d1 = { ...dec1 };
      const d2 = { ...dec2 };

      currentSteps.push({
        description: `Исходные числа: Число 1 = ${s21DecimalToNumber(d1)}, Число 2 = ${s21DecimalToNumber(d2)}`,
        value1: s21DecimalToNumber(d1).toString(),
        value2: s21DecimalToNumber(d2).toString(),
      });

      if (s21DecimalToNumber(d2) === 0) {
        throw new Error("Деление на ноль невозможно.");
      }
      currentSteps.push({ description: `Проверка деления на ноль: Делитель (${s21DecimalToNumber(d2)}) не равен нулю.` });

      const sign1 = getS21DecimalSign(d1);
      const sign2 = getS21DecimalSign(d2);
      const finalSign = (sign1 === sign2) ? 0 : 1;
      currentSteps.push({ description: `Определение знака результата: (${sign1 === 0 ? '+' : '-'}) / (${sign2 === 0 ? '+' : '-'}) = (${finalSign === 0 ? '+' : '-'})`, highlight: 'sign1' });

      const scale1 = getS21DecimalScale(d1);
      const scale2 = getS21DecimalScale(d2);
      let finalScale = scale1 - scale2;
      currentSteps.push({ description: `Вычитание масштабов: ${scale1} - ${scale2} = ${finalScale}.`, highlight: 'scale1' });

      currentSteps.push({ description: `Деление мантиссы Числа 1 на мантиссу Числа 2.` });
      const mantissaResult = divMantissas(d1, d2);
      currentSteps.push({ description: `Результат деления мантисс: ${s21DecimalToNumber(mantissaResult)}`, result: s21DecimalToNumber(mantissaResult).toString() });

      currentSteps.push({ description: `Округление результата до необходимой точности (упрощено).` });

      setS21DecimalSign(mantissaResult, finalSign);
      if (finalScale < 0) {
          // This logic is simplified. In reality, you would need to multiply the dividend
          // by 10 for each negative scale point before division.
          // For this visualization, we'll just note it and set scale to 0.
          currentSteps.push({ description: `Отрицательный итоговый масштаб (${finalScale}). Для корректного результата нужно было бы домножить делимое. Устанавливаем масштаб 0.`});
          finalScale = 0;
      }
      setS21DecimalScale(mantissaResult, finalScale);
      currentSteps.push({ description: `Установка финального знака (${finalSign === 0 ? '+' : '-'}) и масштаба (${finalScale}) для результата.`, result: s21DecimalToNumber(mantissaResult).toString(), highlight: 'result' });

      const finalResultDecimal = mantissaResult;
      setNumericalResult(s21DecimalToNumber(finalResultDecimal).toString());
      setSteps(currentSteps);

    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Произошла неизвестная ошибка во время деления.");
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
      calculateDivision(dec1, dec2);
    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Произошла неизвестная ошибка.");
        }
    }
  }, [value1, value2, calculateDivision]);

  useEffect(() => {
    updateAll();
  }, [updateAll]);

  return (
    <div className={styles.arithmeticSimulatorContainer}>
      <h3>Интерактивный пример: Деление (/)</h3>
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

export default DivisionSimulator;
