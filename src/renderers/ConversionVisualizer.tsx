import React from 'react';
import styles from './ConversionSimulator.module.css';
import { S21Decimal, s21DecimalToNumber, getS21DecimalScale, getS21DecimalSign } from '../utils/s21DecimalJs';

interface ConversionVisualizerProps {
  inputValue: string;
  conversionType: string;
  s21Decimal: S21Decimal | null;
}

// Helper to get the 32-bit binary representation of a float
const floatToBits = (num: number): string => {
  const buffer = new ArrayBuffer(4);
  const floatView = new Float32Array(buffer);
  const intView = new Int32Array(buffer);
  floatView[0] = num;
  const bits = intView[0];
  let bitString = bits.toString(2);
  // Pad with leading zeros to make it 32 bits
  while (bitString.length < 32) {
    bitString = "0" + bitString;
  }
  // Add spaces for readability (1 sign, 8 exponent, 23 mantissa)
  return `${bitString.substring(0, 1)} ${bitString.substring(1, 9)} ${bitString.substring(9)}`;
};

// Helper to get the 32-bit binary representation of an integer
const intToBits = (num: number): string => {
  const bits = num | 0; // Ensure it's a 32-bit integer
  let bitString = bits.toString(2);
  if (bits < 0) {
      // For negative numbers, toString(2) doesn't produce the two's complement, so we get it from a 32-bit array.
      const buffer = new ArrayBuffer(4);
      const intView = new Int32Array(buffer);
      intView[0] = num;
      bitString = intView[0].toString(2);
  } else {
      // Pad with leading zeros
      while (bitString.length < 32) {
        bitString = "0" + bitString;
      }
  }
  return bitString.replace(/(.{8})/g, '$1 ').trim(); // Add spaces every 8 bits
};


const getMantissaAsBigInt = (decimal: S21Decimal): bigint => {
    return BigInt(decimal.bits[0]) | (BigInt(decimal.bits[1]) << 32n) | (BigInt(decimal.bits[2]) << 64n);
}

const ConversionVisualizer: React.FC<ConversionVisualizerProps> = ({ inputValue, conversionType, s21Decimal }) => {
  if (!s21Decimal) {
    return null;
  }

  const renderContent = () => {
    switch (conversionType) {
      case 'float_to_decimal':
        return renderFloatToDecimal();
      case 'int_to_decimal':
        return renderIntToDecimal();
      case 'decimal_to_int':
        return renderDecimalToInt();
      case 'decimal_to_float':
        return renderDecimalToFloat();
      default:
        return <p>Выберите тип преобразования.</p>;
    }
  };

  const renderFloatToDecimal = () => {
    const num = parseFloat(inputValue);
    if (isNaN(num)) return <p>Неверное число.</p>;

    const sign = num < 0 ? '-' : '+';
    const numStr = Math.abs(num).toString();
    const decimalPointIndex = numStr.indexOf('.');
    const scale = decimalPointIndex === -1 ? 0 : numStr.length - 1 - decimalPointIndex;
    const mantissa = getMantissaAsBigInt(s21Decimal as S21Decimal);

    return (
      <div className={styles.visualizerSection}>
        <h4>Процесс: Float → s21_decimal</h4>
        <ol>
          <li>
            <strong>Исходное число (float):</strong>
            <code className={styles.codeBlock}>{inputValue}</code>
            <p>Побитовое представление (IEEE 754):</p>
            <code className={`${styles.codeBlock} ${styles.bitString}`}>{floatToBits(num)}</code>
          </li>
          <li>
            <strong>Определение знака:</strong>
            <p>Знак числа: <span className={styles.highlight}>{sign}</span></p>
          </li>
          <li>
            <strong>Определение масштаба (scale):</strong>
            <p>Чтобы избавиться от дробной части, мысленно умножаем число на 10, пока оно не станет целым. Количество умножений - это и есть масштаб.</p>
            <p><code>{Math.abs(num)} * 10^{scale} = {mantissa.toString()}</code></p>
            <p>Масштаб (scale): <span className={styles.highlight}>{scale}</span></p>
          </li>
          <li>
            <strong>Получение мантиссы:</strong>
            <p>Целочисленная часть после масштабирования.</p>
            <p>Мантисса: <span className={styles.highlight}>{mantissa.toString()}</span></p>
          </li>
          <li>
            <strong>Результат (s21_decimal):</strong>
            <p>Собираем все вместе в структуру s21_decimal.</p>
            <div className={styles.codeBlock}>
              <p>Знак: {getS21DecimalSign(s21Decimal as S21Decimal)} ({sign})</p>
              <p>Масштаб: {getS21DecimalScale(s21Decimal as S21Decimal)}</p>
              <p>Мантисса: {mantissa.toString()}</p>
            </div>
          </li>
        </ol>
      </div>
    );
  };

  const renderIntToDecimal = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num)) return <p>Неверное число.</p>;

    const mantissa = getMantissaAsBigInt(s21Decimal as S21Decimal);
    return (
        <div className={styles.visualizerSection}>
            <h4>Процесс: Int → s21_decimal</h4>
            <ol>
                <li>
                  <strong>Исходное число (int):</strong>
                  <code className={styles.codeBlock}>{inputValue}</code>
                  <p>Побитовое представление (32-bit integer):</p>
                  <code className={`${styles.codeBlock} ${styles.bitString}`}>{intToBits(num)}</code>
                </li>
                <li><strong>Определение знака:</strong> <span className={styles.highlight}>{getS21DecimalSign(s21Decimal as S21Decimal) ? '-' : '+'}</span></li>
                <li><strong>Определение масштаба (scale):</strong> <p>Поскольку число целое, дробной части нет. Масштаб равен <span className={styles.highlight}>0</span>.</p></li>
                <li><strong>Получение мантиссы:</strong> <p>Мантисса равна самому числу: <span className={styles.highlight}>{mantissa.toString()}</span></p></li>
                <li><strong>Результат (s21_decimal):</strong>
                    <div className={styles.codeBlock}>
                        <p>Знак: {getS21DecimalSign(s21Decimal as S21Decimal)}</p>
                        <p>Масштаб: {getS21DecimalScale(s21Decimal as S21Decimal)}</p>
                        <p>Мантисса: {mantissa.toString()}</p>
                    </div>
                </li>
            </ol>
        </div>
    );
  };

  const renderDecimalToInt = () => {
    const scale = getS21DecimalScale(s21Decimal as S21Decimal);
    const mantissa = getMantissaAsBigInt(s21Decimal as S21Decimal);
    const result = Math.trunc(s21DecimalToNumber(s21Decimal as S21Decimal));

    return (
      <div className={styles.visualizerSection}>
        <h4>Процесс: s21_decimal → Int</h4>
        <ol>
          <li>
            <strong>Исходный s21_decimal:</strong>
            <div className={styles.codeBlock}>
                <p>Знак: {getS21DecimalSign(s21Decimal as S21Decimal)}</p>
                <p>Масштаб: {scale}</p>
                <p>Мантисса: {mantissa.toString()}</p>
            </div>
          </li>
          <li>
            <strong>Восстановление числа:</strong>
            <p>Делим мантиссу на 10 в степени масштаба.</p>
            <p><code>{mantissa.toString()} / 10^{scale} = {s21DecimalToNumber(s21Decimal as S21Decimal)}</code></p>
          </li>
          <li>
            <strong>Отбрасывание дробной части (Truncate):</strong>
            <p>Убираем все, что стоит после запятой.</p>
            <p><code>trunc({s21DecimalToNumber(s21Decimal as S21Decimal)}) = {result}</code></p>
          </li>
          <li>
            <strong>Результат (int):</strong>
            <p className={styles.highlight}>{result}</p>
            <p>Побитовое представление (32-bit integer):</p>
            <code className={`${styles.codeBlock} ${styles.bitString}`}>{intToBits(result)}</code>
          </li>
        </ol>
      </div>
    );
  };

  const renderDecimalToFloat = () => {
    const scale = getS21DecimalScale(s21Decimal as S21Decimal);
    const mantissa = getMantissaAsBigInt(s21Decimal as S21Decimal);
    const result = s21DecimalToNumber(s21Decimal as S21Decimal);

    return (
      <div className={styles.visualizerSection}>
        <h4>Процесс: s21_decimal → Float</h4>
        <ol>
          <li>
            <strong>Исходный s21_decimal:</strong>
            <div className={styles.codeBlock}>
                <p>Знак: {getS21DecimalSign(s21Decimal as S21Decimal) ? '-' : '+'}</p>
                <p>Масштаб: {scale}</p>
                <p>Мантисса: {mantissa.toString()}</p>
            </div>
          </li>
          <li>
            <strong>Восстановление числа:</strong>
            <p>Делим мантиссу на 10 в степени масштаба и применяем знак.</p>
            <p><code>({getS21DecimalSign(s21Decimal as S21Decimal) ? '-' : ''}{mantissa.toString()}) / 10^{scale}</code></p>
          </li>
          <li>
            <strong>Результат (float):</strong>
            <p className={styles.highlight}>{result}</p>
            <p>Побитовое представление (IEEE 754):</p>
            <code className={`${styles.codeBlock} ${styles.bitString}`}>{floatToBits(result)}</code>
          </li>
        </ol>
      </div>
    );
  };

  return <div className={styles.conversionVisualizer}>{renderContent()}</div>;
};

export default ConversionVisualizer;
