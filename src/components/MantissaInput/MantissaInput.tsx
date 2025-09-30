import React, { useState, useEffect, useCallback } from 'react';
import styles from './MantissaInput.module.css';
import FullDecimalVisualizer from '../FullDecimalVisualizer/FullDecimalVisualizer';
import { createS21Decimal } from '../../utils/s21DecimalJs';

interface MantissaInputProps {
  setS21DecimalBits: (bits: number[]) => void;
  s21DecimalBits: number[];
}

const MantissaInput: React.FC<MantissaInputProps> = ({ setS21DecimalBits, s21DecimalBits }) => {
  const [inputValue, setInputValue] = useState<string>('123456789');
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    try {
      const decimal = createS21Decimal(inputValue);
      setS21DecimalBits(decimal.bits);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Произошла неизвестная ошибка во время преобразования.");
      }
      setS21DecimalBits([0, 0, 0, 0]);
    }
  }, [inputValue, setS21DecimalBits]);

  useEffect(() => {
    handleConvert();
  }, [handleConvert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={styles.mantissaInputContainer}>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.inputGroup}>
        <label htmlFor="mantissa-input">Введите число для мантиссы:</label>
        <input
          type="text" // Use text for more flexible input
          id="mantissa-input"
          value={inputValue}
          onChange={handleChange}
          className={styles.inputField}
        />
      </div>
      <FullDecimalVisualizer s21DecimalBits={s21DecimalBits} />
    </div>
  );
};

export default MantissaInput;
