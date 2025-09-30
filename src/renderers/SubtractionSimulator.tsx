import React, { useState, useEffect } from 'react';
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

const SubtractionSimulator: React.FC = () => {
  const [value1, setValue1] = useState<string>('10.5');
  const [value2, setValue2] = useState<string>('2.3');
  const [numericalResult, setNumericalResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<ArithmeticStep[]>([]); // New state for steps

  useEffect(() => {
    updateAll();
  }, [value1, value2]);

  const updateAll = () => {
    setError(null);
    setSteps([]); // Clear steps on new calculation

    try {
      const dec1 = createS21Decimal(value1);
      const dec2 = createS21Decimal(value2);
      calculateSubtraction(dec1, dec2);
    } catch (e: any) {
      setError(e.message || "Произошла ошибка.");
    }
  };

  const calculateSubtraction = (dec1: S21Decimal, dec2: S21Decimal) => {
    const currentSteps: ArithmeticStep[] = [];
    try {
      let d1 = { ...dec1 };
      let d2 = { ...dec2 };

      currentSteps.push({
        description: `Исходные числа: Число 1 = ${s21DecimalToNumber(d1)}, Число 2 = ${s21DecimalToNumber(d2)}`,
        value1: s21DecimalToNumber(d1).toString(),
        value2: s21DecimalToNumber(d2).toString(),
      });

      // 1. Обработка знаков (A - B = A + (-B))
      const originalSign2 = getS21DecimalSign(d2);
      setS21DecimalSign(d2, originalSign2 === 0 ? 1 : 0); // Invert sign of d2
      currentSteps.push({
        description: `Вычитание Числа 2 из Числа 1 эквивалентно сложению Числа 1 с инвертированным знаком Числа 2. Знак Числа 2 инвертирован.`,
        value2: s21DecimalToNumber(d2).toString(),
        highlight: 'sign2',
      });

      // Now proceed as addition
      const sign1 = getS21DecimalSign(d1);
      const sign2 = getS21DecimalSign(d2);
      let finalSign = sign1;
      let operationType = 'ADD'; // Internal operation type is now ADD

      if (sign1 !== sign2) {
        currentSteps.push({
          description: `После инверсии знаки разные. Операция сложения превращается в вычитание мантисс.`,
        });
        operationType = 'SUB';
      } else {
        currentSteps.push({
          description: `После инверсии знаки одинаковые. Будет выполнено сложение мантисс. Знак результата: ${finalSign === 0 ? '+' : '-'}`,
        });
      }

      // 2. Нормализация
      currentSteps.push({
        description: `Нормализация масштабов для Числа 1 (${getS21DecimalScale(d1)}) и Числа 2 (${getS21DecimalScale(d2)}).`,
        highlight: 'scale1',
      });
      const normalized = normalizeS21Decimals(d1, d2);
      d1 = normalized.decimal1;
      d2 = normalized.decimal2;
      currentSteps.push({
        description: `Числа после нормализации: Число 1 = ${s21DecimalToNumber(d1)}, Число 2 = ${s21DecimalToNumber(d2)}. Общий масштаб: ${getS21DecimalScale(d1)}`,
        value1: s21DecimalToNumber(d1).toString(),
        value2: s21DecimalToNumber(d2).toString(),
        highlight: 'scale1',
      });

      // 3. Сложение/Вычитание мантисс
      let mantissaResult: S21Decimal;
      if (operationType === 'ADD') {
        currentSteps.push({
          description: `Сложение мантисс Числа 1 и Числа 2.`,
        });
        mantissaResult = addMantissas(d1, d2);
      } else { // operationType === 'SUB' (after sign inversion, this is effectively subtraction of mantissas)
        currentSteps.push({
          description: `Вычитание мантиссы Числа 2 из Числа 1.`,
        });
        mantissaResult = subMantissas(d1, d2);
      }
      currentSteps.push({
        description: `Результат операции с мантиссами: ${s21DecimalToNumber(mantissaResult)}`,
        result: s21DecimalToNumber(mantissaResult).toString(),
      });

      // 4. Установка знака и масштаба результата
      setS21DecimalSign(mantissaResult, finalSign);
      setS21DecimalScale(mantissaResult, getS21DecimalScale(d1)); // Use common scale
      currentSteps.push({
        description: `Установка финального знака (${finalSign === 0 ? '+' : '-'}) и масштаба (${getS21DecimalScale(mantissaResult)}) для результата.`,
        result: s21DecimalToNumber(mantissaResult).toString(),
        highlight: 'result',
      });

      const finalResultDecimal = mantissaResult;
      setNumericalResult(s21DecimalToNumber(finalResultDecimal).toString());
      setSteps(currentSteps);

    } catch (e: any) {
      setError(e.message || "Произошла ошибка во время вычитания.");
      setNumericalResult("Ошибка");
      setSteps(currentSteps); // Still show steps up to the error
    }
  };

  return (
    <div className={styles.arithmeticSimulatorContainer}>
      <h3>Интерактивный пример: Вычитание (-)</h3>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.inputSection}>
        <div className={styles.decimalInputGroup}>
          <label>Число 1:</label>
          <input
            type="number"
            step="any"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            className={styles.inputField}
            placeholder="Значение 1"
          />
        </div>
        <div className={styles.decimalInputGroup}>
          <label>Число 2:</label>
          <input
            type="number"
            step="any"
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

export default SubtractionSimulator;
