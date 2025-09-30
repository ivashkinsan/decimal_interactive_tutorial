import React, { useState, useEffect, useCallback } from 'react';
import styles from './ComparisonSimulator.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { createS21Decimal, s21_is_less, s21_is_equal, s21_is_greater_or_equal, s21_is_greater, s21_is_less_or_equal, s21_is_not_equal } from '../utils/s21DecimalJs';
import StackedBitVisualizer from '../components/StackedBitVisualizer/StackedBitVisualizer';

interface ComparisonSimulatorProps {
  comparisonType: 'is_less' | 'is_equal' | 'is_greater_or_equal' | 'is_greater' | 'is_less_or_equal' | 'is_not_equal';
}

const ComparisonSimulator: React.FC<ComparisonSimulatorProps> = ({ comparisonType }) => {
  const [value1, setValue1] = useState<string>('10.5');
  const [value2, setValue2] = useState<string>('5.5');
  const [bits1, setBits1] = useState<number[]>([0, 0, 0, 0]);
  const [bits2, setBits2] = useState<number[]>([0, 0, 0, 0]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getComparisonFunction = useCallback(() => {
    switch (comparisonType) {
      case 'is_less': return s21_is_less;
      case 'is_equal': return s21_is_equal;
      case 'is_greater_or_equal': return s21_is_greater_or_equal;
      case 'is_greater': return s21_is_greater;
      case 'is_less_or_equal': return s21_is_less_or_equal;
      case 'is_not_equal': return s21_is_not_equal;
      default: return null;
    }
  }, [comparisonType]);

  const handleCompare = useCallback(() => {
    setError(null);
    setResult(null);

    try {
      const dec1 = createS21Decimal(value1);
      const dec2 = createS21Decimal(value2);
      setBits1(dec1.bits);
      setBits2(dec2.bits);

      const compareFunc = getComparisonFunction();
      if (!compareFunc) {
        setError("Invalid comparison type.");
        return;
      }

      const comparisonResult = compareFunc(dec1, dec2);
      setResult(comparisonResult ? 'TRUE' : 'FALSE');

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Произошла неизвестная ошибка во время сравнения.");
      }
      setBits1([0, 0, 0, 0]);
      setBits2([0, 0, 0, 0]);
    }
  }, [value1, value2, getComparisonFunction]);

  useEffect(() => {
    handleCompare();
  }, [handleCompare]);

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
  return s21_comparison_result;
}
    `;
  };

  return (
    <div className={styles.comparisonSimulatorContainer}>
      <h3>Интерактивный пример: {getOperatorSymbol()}</h3>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.inputGroup}>
        <input
          type="text" // Changed to text to allow for more flexible input
          value={value1}
          onChange={(e) => setValue1(e.target.value)}
          className={styles.inputField}
          placeholder="Значение 1"
        />
        <span className={styles.operator}>{getOperatorSymbol()}</span>
        <input
          type="text" // Changed to text to allow for more flexible input
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
