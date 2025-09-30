import React, { useState, useEffect } from 'react';
import styles from './MantissaInput.module.css';
import FullDecimalVisualizer from '../FullDecimalVisualizer/FullDecimalVisualizer';
import { createS21Decimal } from '../../utils/s21DecimalJs';

interface MantissaInputProps {
  setS21DecimalBits: (bits: number[]) => void;
  s21DecimalBits: number[];
  // wasmLoaded больше не нужен
}

const MantissaInput: React.FC<MantissaInputProps> = ({ setS21DecimalBits, s21DecimalBits }) => {
  const [inputValue, setInputValue] = useState<string>('123456789');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleConvert();
  }, [inputValue]);

  const handleConvert = () => {
    setError(null);

    try {
      const decimal = createS21Decimal(inputValue);
      setS21DecimalBits(decimal.bits);
    } catch (err: any) {
      setError(err.message || "Произошла ошибка во время преобразования.");
      setS21DecimalBits([0, 0, 0, 0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={styles.mantissaInputContainer}>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.inputGroup}>
        <label htmlFor="mantissa-input">Введите число для мантиссы:</label>
        <input
          type="number"
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
