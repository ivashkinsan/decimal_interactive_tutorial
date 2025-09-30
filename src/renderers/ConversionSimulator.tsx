import React, { useState, useEffect } from 'react';
import styles from './ConversionSimulator.module.css';
import ConversionVisualizer from './ConversionVisualizer'; // Новый импорт
import { S21Decimal, createS21Decimal, s21FromIntToDecimal, s21FromFloatToDecimal } from '../utils/s21DecimalJs';

export const ConversionSimulator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('123.45');
  const [conversionType, setConversionType] = useState<string>('float_to_decimal');
  const [s21Decimal, setS21Decimal] = useState<S21Decimal | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Запускаем преобразование при первом рендере
  useEffect(() => {
    handleConvert();
  }, []);

  const handleConvert = () => {
    setError(null);
    setS21Decimal(null);

    try {
      let decimal: S21Decimal | null = null;

      // В зависимости от типа преобразования, мы либо создаем decimal из строки,
      // либо создаем его для последующего преобразования в другой тип.
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

    } catch (e: any) {
      setError(e.message || "Произошла ошибка во время преобразования.");
      setS21Decimal(null);
    }
  };

  // Выполняем преобразование при изменении инпута или типа
  useEffect(() => {
    handleConvert();
  }, [inputValue, conversionType]);

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

      {/* Новый визуализатор, который показывает логику */} 
      <ConversionVisualizer 
        inputValue={inputValue}
        conversionType={conversionType}
        s21Decimal={s21Decimal}
      />

    </div>
  );
};
