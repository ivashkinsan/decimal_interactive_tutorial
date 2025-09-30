import React, { useState, useEffect, useCallback } from 'react';
import styles from './ArithmeticSimulator.module.css'; // Reusing general arithmetic styles
import ArithmeticLogicVisualizer from '../components/ArithmeticLogicVisualizer/ArithmeticLogicVisualizer'; // New import
import { S21Decimal, createS21Decimal, s21DecimalToNumber, getS21DecimalSign, getS21DecimalScale, setS21DecimalSign, setS21DecimalScale, normalizeS21Decimals, addMantissas, subMantissas } from '../utils/s21DecimalJs'; // Added more utility functions

interface ArithmeticStep {
  description: string;
  value1?: string; // Decimal string representation
  value2?: string; // Decimal string representation
  result?: string; // Decimal string representation
  highlight?: 'value1' | 'value2' | 'result' | 'scale1' | 'scale2' | 'sign1' | 'sign2';
}

const AdditionSimulator: React.FC = () => {
  const [value1, setValue1] = useState<string>('10.5');
  const [value2, setValue2] = useState<string>('2.3');
  const [numericalResult, setNumericalResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<ArithmeticStep[]>([]); // New state for steps

  const calculateAddition = useCallback((dec1: S21Decimal, dec2: S21Decimal) => {
    const currentSteps: ArithmeticStep[] = [];
    try {
      let d1 = { ...dec1 };
      let d2 = { ...dec2 };

      currentSteps.push({
        description: `Исходные числа: Число 1 = ${s21DecimalToNumber(d1)}, Число 2 = ${s21DecimalToNumber(d2)}`,
        value1: s21DecimalToNumber(d1).toString(),
        value2: s21DecimalToNumber(d2).toString(),
      });

      const sign1 = getS21DecimalSign(d1);
      const sign2 = getS21DecimalSign(d2);
      currentSteps.push({
        description: `Определение знаков: Знак Числа 1 = ${sign1 === 0 ? '+' : '-'}, Знак Числа 2 = ${sign2 === 0 ? '+' : '-'}`,
        highlight: 'sign1',
      });

      let finalSign = sign1;
      let operationType = 'ADD';

      if (sign1 !== sign2) {
        currentSteps.push({ description: `Знаки разные. Операция сложения превращается в вычитание.` });
        setS21DecimalSign(d2, sign1);
        operationType = 'SUB';
      } else {
        currentSteps.push({ description: `Знаки одинаковые. Будет выполнено сложение мантисс. Знак результата: ${finalSign === 0 ? '+' : '-'}` });
      }

      currentSteps.push({ description: `Нормализация масштабов для Числа 1 (${getS21DecimalScale(d1)}) и Числа 2 (${getS21DecimalScale(d2)}).`, highlight: 'scale1' });
      const normalized = normalizeS21Decimals(d1, d2);
      d1 = normalized.decimal1;
      d2 = normalized.decimal2;
      currentSteps.push({ description: `Числа после нормализации: Число 1 = ${s21DecimalToNumber(d1)}, Число 2 = ${s21DecimalToNumber(d2)}. Общий масштаб: ${getS21DecimalScale(d1)}`, value1: s21DecimalToNumber(d1).toString(), value2: s21DecimalToNumber(d2).toString(), highlight: 'scale1' });

      let mantissaResult: S21Decimal;
      if (operationType === 'ADD') {
        currentSteps.push({ description: `Сложение мантисс Числа 1 и Числа 2.` });
        mantissaResult = addMantissas(d1, d2);
      } else {
        currentSteps.push({ description: `Вычитание мантиссы Числа 2 из Числа 1.` });
        mantissaResult = subMantissas(d1, d2);
        if (getS21DecimalSign(mantissaResult) !== 0) { // if result of sub is negative
            finalSign = finalSign === 0 ? 1 : 0; // flip final sign
            setS21DecimalSign(mantissaResult, 0); // make mantissa positive for further ops
        }
      }
      currentSteps.push({ description: `Результат операции с мантиссами: ${s21DecimalToNumber(mantissaResult)}`, result: s21DecimalToNumber(mantissaResult).toString() });

      setS21DecimalSign(mantissaResult, finalSign);
      setS21DecimalScale(mantissaResult, getS21DecimalScale(d1));
      currentSteps.push({ description: `Установка финального знака (${finalSign === 0 ? '+' : '-'}) и масштаба (${getS21DecimalScale(mantissaResult)}) для результата.`, result: s21DecimalToNumber(mantissaResult).toString(), highlight: 'result' });

      const finalResultDecimal = mantissaResult;
      setNumericalResult(s21DecimalToNumber(finalResultDecimal).toString());
      setSteps(currentSteps);

    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Произошла неизвестная ошибка во время сложения.");
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
      calculateAddition(dec1, dec2);
    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Произошла неизвестная ошибка.");
        }
    }
  }, [value1, value2, calculateAddition]);

  useEffect(() => {
    updateAll();
  }, [updateAll]);

  return (
    <div className={styles.arithmeticSimulatorContainer}>
      <h3>Интерактивный пример: Сложение (+)</h3>
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

export default AdditionSimulator;
