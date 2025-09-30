import React, { useState, useEffect, useCallback } from 'react';
import styles from './ConversionSimulator.module.css';
import ConversionVisualizer from './ConversionVisualizer'; // Новый импорт
import { S21Decimal, createS21Decimal, s21FromIntToDecimal, s21FromFloatToDecimal } from '../utils/s21DecimalJs';

export const ConversionSimulator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('123.45');
  const [conversionType, setConversionType] = useState<string>('float_to_decimal');
  const [s21Decimal, setS21Decimal] = useState<S21Decimal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    setS21Decimal(null);

    try {
      let decimal: S21Decimal | null = null;

      switch (conversionType) {
        case 'float_to_decimal':
          decimal = s21FromFloatToDecimal(inputValue);
          break;
        case 'int_to_decimal':
          decimal = s21FromIntToDecimal(inputValue);
          break;
        case 'decimal_to_int':
        case 'decimal_to_float':
          decimal = createS21Decimal(inputValue);
          break;
        default:
          setError("Неверный тип преобразования.");
          return;
      }
      setS21Decimal(decimal);

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Произошла неизвестная ошибка во время преобразования.");
      }
      setS21Decimal(null);
    }
  }, [inputValue, conversionType]);

  useEffect(() => {
    handleConvert();
  }, [handleConvert]);

  return (
    <div className={styles.conversionSimulatorContainer}>
      <h3>Интерактивный пример: Преобразование</h3>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.controlsContainer}>
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

        <div className={styles.conversionTypeGroup}>
          <label htmlFor="conversion-type">Тип преобразования:</label>
          <select
            id="conversion-type"
            value={conversionType}
            onChange={(e) => setConversionType(e.target.value)}
            className={styles.selectField}
          >
            <option value="float_to_decimal">Float → Decimal</option>
            <option value="int_to_decimal">Int → Decimal</option>
            <option value="decimal_to_int">Decimal → Int</option>
            <option value="decimal_to_float">Decimal → Float</option>
          </select>
        </div>
      </div>

      <ConversionVisualizer 
        inputValue={inputValue}
        conversionType={conversionType}
        s21Decimal={s21Decimal}
      />

    </div>
  );
};
