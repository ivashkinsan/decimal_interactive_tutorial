import React, { useState, useEffect } from 'react';
import styles from './ComparisonSimulator.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { createS21Decimal } from '../utils/s21DecimalJs';
import StackedBitVisualizer from '../components/StackedBitVisualizer/StackedBitVisualizer'; // Changed import

interface ComparisonSimulatorProps {
  comparisonType: string; // e.g., 'is_less', 'is_equal'
}

const ComparisonSimulator: React.FC<ComparisonSimulatorProps> = ({ comparisonType }) => {
  const [value1, setValue1] = useState<string>('10.5');
  const [value2, setValue2] = useState<string>('5.5');
  const [bits1, setBits1] = useState<number[]>([0, 0, 0, 0]);
  const [bits2, setBits2] = useState<number[]>([0, 0, 0, 0]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const dec1 = createS21Decimal(value1);
      setBits1(dec1.bits);
      const dec2 = createS21Decimal(value2);
      setBits2(dec2.bits);
      handleCompare();
    } catch (e) {
      // ignore
    }
  }, [value1, value2, comparisonType]);

  const getComparisonFunction = () => {
    switch (comparisonType) {
      case 'is_less':
        return (a: number, b: number) => a < b;
      case 'is_equal':
        return (a: number, b: number) => a === b;
      case 'is_greater_or_equal':
        return (a: number, b: number) => a >= b;
      case 'is_greater':
        return (a: number, b: number) => a > b;
      case 'is_less_or_equal':
        return (a: number, b: number) => a <= b;
      case 'is_not_equal':
        return (a: number, b: number) => a !== b;
      default:
        return null;
    }
  };

  const handleCompare = () => {
    setError(null);
    setResult(null);

    const compareFunc = getComparisonFunction();
    if (!compareFunc) {
      setError("Invalid comparison type.");
      return;
    }

    try {
      const num1 = parseFloat(value1);
      const num2 = parseFloat(value2);

      if (isNaN(num1) || isNaN(num2)) {
        setError("Введите корректные числа.");
        return;
      }

      const comparisonResult = compareFunc(num1, num2);
      setResult(comparisonResult ? 'TRUE' : 'FALSE');
    } catch (e: any) {
      setError(e.message || "Произошла ошибка во время сравнения.");
    }
  };

  const getOperatorSymbol = () => {
    switch (comparisonType) {
      case 'is_less': return '< ';
      case 'is_equal': return '==';
      case 'is_greater_or_equal': return '>=';
      case 'is_greater': return '>';
      case 'is_less_or_equal': return '<=';
      case 'is_not_equal': return '!=';
      default: return '?';
    }
  };

  const getCodeExample = () => {
    return `
int s21_${comparisonType}(s21_decimal value_1, s21_decimal value_2) {
  // 1. Обработка знаков
  // 2. Нормализация
  // 3. Сравнение мантисс
  // 4. Обработка нуля
  return value_1 ${getOperatorSymbol()} value_2;
}
    `;
  };

  return (
    <div className={styles.comparisonSimulatorContainer}>
      <h3>Интерактивный пример: {getOperatorSymbol()}</h3>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.inputGroup}>
        <input
          type="number"
          step="any"
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          className={styles.inputField}
          placeholder="Значение 1"
        />
        <span className={styles.operator}>{getOperatorSymbol()}</span>
        <input
          type="number"
          step="any"
          value={value2}
          onChange={(e) => setValue2(e.target.value)}
          className={styles.inputField}
          placeholder="Значение 2"
        />
      </div>
      {result !== null && (
        <div className={styles.resultDisplay}>
          Результат: <span className={result === 'TRUE' ? styles.trueResult : styles.falseResult}>{result}</span>
        </div>
      )}
      <div className={styles.bitwiseOperationsContainer}>
        {/* Using StackedBitVisualizer for comparison */}
        <StackedBitVisualizer bits1={bits1} bits2={bits2} operation={comparisonType} />
      </div>
      <div className={styles.codeExampleContainer}>
        <SyntaxHighlighter language="c" style={darcula}>
          {getCodeExample()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default ComparisonSimulator;
