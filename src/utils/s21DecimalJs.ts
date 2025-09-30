export interface S21Decimal {
  bits: number[]; // [bits0, bits1, bits2, bits3]
}

// Helper to get sign from bits[3]
const getSign = (bits3: number): number => (bits3 >>> 31) & 1;

// Helper to set sign in bits[3]
const setSign = (bits3: number, sign: number): number => {
  if (sign === 1) {
    return bits3 | (1 << 31);
  } else {
    return bits3 & ~(1 << 31);
  }
};

// Helper to get scale from bits[3]
const getScale = (bits3: number): number => (bits3 >>> 16) & 0xFF;

// Helper to set scale in bits[3]
const setScale = (bits3: number, scale: number): number => {
  // Clear existing scale bits (16-23) and then set new scale
  return (bits3 & ~(0xFF << 16)) | ((scale & 0xFF) << 16);
};

// Converts a JavaScript number or string to a simulated S21Decimal.
// This is a simplified implementation and does not handle full s21_decimal precision or range.
export const createS21Decimal = (value: number | string): S21Decimal => {
  let num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    throw new Error("Invalid number input for S21Decimal.");
  }

  const decimal: S21Decimal = { bits: [0, 0, 0, 0] };

  if (num === 0) {
    return decimal; // All bits are 0 for zero
  }

  let sign = 0;
  if (num < 0) {
    sign = 1;
    num = -num;
  }

  let scale = 0;
  // Adjust scale to make it an integer, up to max 28 decimal places
  if (num !== Math.floor(num)) {
    const numStr = num.toString();
    const decimalPointIndex = numStr.indexOf('.');
    if (decimalPointIndex !== -1) {
      scale = numStr.length - 1 - decimalPointIndex;
      if (scale > 28) {
        // Truncate or round if scale is too large
        num = parseFloat(num.toFixed(28));
        scale = 28;
      }
    }
  }

  // Convert to BigInt to handle large integers for mantissa
  const mantissa = BigInt(Math.round(num * Math.pow(10, scale)));

  // Populate bits[0], bits[1], bits[2]
  decimal.bits[0] = Number(mantissa & 0xFFFFFFFFn);
  decimal.bits[1] = Number((mantissa >> 32n) & 0xFFFFFFFFn);
  decimal.bits[2] = Number((mantissa >> 64n) & 0xFFFFFFFFn);

  // Populate bits[3] with sign and scale
  decimal.bits[3] = setSign(0, sign); // Start with 0, then set sign
  decimal.bits[3] = setScale(decimal.bits[3], scale);

  return decimal;
};

// Converts a simulated S21Decimal back to a JavaScript number.
export const s21DecimalToNumber = (decimal: S21Decimal): number => {
  if (!decimal || !decimal.bits || decimal.bits.length !== 4) {
    return NaN;
  }

  const sign = getSign(decimal.bits[3]);
  const scale = getScale(decimal.bits[3]);

  // Reconstruct mantissa from bits[0], bits[1], bits[2]
  const mantissa = BigInt(decimal.bits[0]) |
                 (BigInt(decimal.bits[1]) << 32n) |
                 (BigInt(decimal.bits[2]) << 64n);

  let num = parseFloat(mantissa.toString());

  // Apply scale
  num /= Math.pow(10, scale);

  // Apply sign
  if (sign === 1) {
    num = -num;
  }

  return num;
};

// --- Low-level operations for simulators ---

export const getS21DecimalSign = (decimal: S21Decimal): number => getSign(decimal.bits[3]);
export const getS21DecimalScale = (decimal: S21Decimal): number => getScale(decimal.bits[3]);

export const setS21DecimalSign = (decimal: S21Decimal, sign: number): void => {
  decimal.bits[3] = setSign(decimal.bits[3], sign);
};

export const setS21DecimalScale = (decimal: S21Decimal, scale: number): void => {
  decimal.bits[3] = setScale(decimal.bits[3], scale);
};

const getMantissaAsBigInt = (decimal: S21Decimal): bigint => {
    return BigInt(decimal.bits[0]) | (BigInt(decimal.bits[1]) << 32n) | (BigInt(decimal.bits[2]) << 64n);
}

const setMantissaFromBigInt = (decimal: S21Decimal, mantissa: bigint): void => {
    decimal.bits[0] = Number(mantissa & 0xFFFFFFFFn);
    decimal.bits[1] = Number((mantissa >> 32n) & 0xFFFFFFFFn);
    decimal.bits[2] = Number((mantissa >> 64n) & 0xFFFFFFFFn);
    if ((mantissa >> 96n) > 0n) {
        throw new Error("Mantissa overflow.");
    }
}

const multiplyMantissaBy10 = (decimal: S21Decimal): S21Decimal => {
    const newDecimal = { bits: [...decimal.bits] };
    const mantissa = getMantissaAsBigInt(newDecimal);
    setMantissaFromBigInt(newDecimal, mantissa * 10n);
    return newDecimal;
}

export const normalizeS21Decimals = (dec1: S21Decimal, dec2: S21Decimal): { decimal1: S21Decimal, decimal2: S21Decimal } => {
    let d1 = { bits: [...dec1.bits] };
    let d2 = { bits: [...dec2.bits] };

    let scale1 = getS21DecimalScale(d1);
    let scale2 = getS21DecimalScale(d2);

    // This can cause overflow if the scale difference is large.
    // A proper implementation would check for this.
    while (scale1 < scale2) {
        d1 = multiplyMantissaBy10(d1);
        scale1++;
    }

    while (scale2 < scale1) {
        d2 = multiplyMantissaBy10(d2);
        scale2++;
    }

    setS21DecimalScale(d1, scale1);
    setS21DecimalScale(d2, scale2);

    return { decimal1: d1, decimal2: d2 };
};

export const addMantissas = (dec1: S21Decimal, dec2: S21Decimal): S21Decimal => {
    const mantissa1 = getMantissaAsBigInt(dec1);
    const mantissa2 = getMantissaAsBigInt(dec2);
    const resultMantissa = mantissa1 + mantissa2;
    const resultDecimal: S21Decimal = { bits: [0, 0, 0, 0] };
    setMantissaFromBigInt(resultDecimal, resultMantissa);
    return resultDecimal;
};

export const subMantissas = (dec1: S21Decimal, dec2: S21Decimal): S21Decimal => {
    const mantissa1 = getMantissaAsBigInt(dec1);
    const mantissa2 = getMantissaAsBigInt(dec2);
    const resultMantissa = mantissa1 - mantissa2; // This can be negative
    const resultDecimal: S21Decimal = { bits: [0, 0, 0, 0] };
    // The logic in AdditionSimulator is likely flawed and doesn't handle negative mantissa results.
    // We store the absolute value. The calling code is responsible for determining the sign.
    setMantissaFromBigInt(resultDecimal, resultMantissa > 0n ? resultMantissa : -resultMantissa);
    return resultDecimal;
};

export const mulMantissas = (dec1: S21Decimal, dec2: S21Decimal): S21Decimal => {
    const mantissa1 = getMantissaAsBigInt(dec1);
    const mantissa2 = getMantissaAsBigInt(dec2);
    const resultMantissa = mantissa1 * mantissa2;
    const resultDecimal: S21Decimal = { bits: [0, 0, 0, 0] };
    setMantissaFromBigInt(resultDecimal, resultMantissa);
    return resultDecimal;
};

export const divMantissas = (dec1: S21Decimal, dec2: S21Decimal): S21Decimal => {
    const mantissa1 = getMantissaAsBigInt(dec1);
    const mantissa2 = getMantissaAsBigInt(dec2);
    if (mantissa2 === 0n) {
        throw new Error("Division by zero in mantissa.");
    }
    // Note: This is integer division. The full s21_div logic is much more complex,
    // involving scaling up the dividend to get a fractional part.
    const resultMantissa = mantissa1 / mantissa2;
    const resultDecimal: S21Decimal = { bits: [0, 0, 0, 0] };
    setMantissaFromBigInt(resultDecimal, resultMantissa);
    return resultDecimal;
};

// --- Arithmetic Operations (Simplified JS implementations) ---



export const s21Add = (dec1: S21Decimal, dec2: S21Decimal): S21Decimal => {
  // Simplified JS addition
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  const result = num1 + num2;
  return createS21Decimal(result);
};

export const s21Sub = (dec1: S21Decimal, dec2: S21Decimal): S21Decimal => {
  // Simplified JS subtraction
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  const result = num1 - num2;
  return createS21Decimal(result);
};

export const s21Mul = (dec1: S21Decimal, dec2: S21Decimal): S21Decimal => {
  // Simplified JS multiplication
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  const result = num1 * num2;
  return createS21Decimal(result);
};

export const s21Div = (dec1: S21Decimal, dec2: S21Decimal): S21Decimal => {
  // Simplified JS division
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  if (num2 === 0) {
    throw new Error("Division by zero");
  }
  const result = num1 / num2;
  return createS21Decimal(result);
};

// --- Comparison Operations (Simplified JS implementations) ---
export const s21IsLess = (dec1: S21Decimal, dec2: S21Decimal): boolean => {
  // 1. Обработка знаков
  // 2. Нормализация
  // 3. Сравнение мантисс
  // 4. Обработка нуля
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  return num1 < num2;
};

export const s21IsEqual = (dec1: S21Decimal, dec2: S21Decimal): boolean => {
  // 1. Обработка знаков
  // 2. Нормализация
  // 3. Сравнение мантисс
  // 4. Обработка нуля
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  return num1 === num2;
};

export const s21IsGreater = (dec1: S21Decimal, dec2: S21Decimal): boolean => {
  // 1. Обработка знаков
  // 2. Нормализация
  // 3. Сравнение мантисс
  // 4. Обработка нуля
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  return num1 > num2;
};

export const s21IsLessOrEqual = (dec1: S21Decimal, dec2: S21Decimal): boolean => {
  // 1. Обработка знаков
  // 2. Нормализация
  // 3. Сравнение мантисс
  // 4. Обработка нуля
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  return num1 <= num2;
};

export const s21IsGreaterOrEqual = (dec1: S21Decimal, dec2: S21Decimal): boolean => {
  // 1. Обработка знаков
  // 2. Нормализация
  // 3. Сравнение мантисс
  // 4. Обработка нуля
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  return num1 >= num2;
};

export const s21IsNotEqual = (dec1: S21Decimal, dec2: S21Decimal): boolean => {
  // 1. Обработка знаков
  // 2. Нормализация
  // 3. Сравнение мантисс
  // 4. Обработка нуля
  const num1 = s21DecimalToNumber(dec1);
  const num2 = s21DecimalToNumber(dec2);
  return num1 !== num2;
};

// --- Conversion Operations (Simplified JS implementations) ---
export const s21FromIntToDecimal = (value: number | string): S21Decimal => {
  return createS21Decimal(value);
};

export const s21FromFloatToDecimal = (value: number | string): S21Decimal => {
  return createS21Decimal(value);
};

export const s21DecimalToInt = (dec: S21Decimal): number => {
  return Math.trunc(s21DecimalToNumber(dec));
};

export const s21DecimalToFloat = (dec: S21Decimal): number => {
  return s21DecimalToNumber(dec);
};

// --- Utility Operations (Simplified JS implementations) ---
export const s21Round = (dec: S21Decimal, scale: number): S21Decimal => {
  const num = s21DecimalToNumber(dec);
  const factor = Math.pow(10, scale);
  let rounded = Math.round(num * factor) / factor;

  // Bankers rounding rule for .5: round to nearest even integer
  const fractionalPartScaled = num * factor - Math.floor(num * factor);
  if (Math.abs(fractionalPartScaled - 0.5) < Number.EPSILON) { // Check if it's exactly .5
    const integerPartScaled = Math.floor(num * factor);
    if (integerPartScaled % 2 !== 0) { // If the integer part before rounding is odd
      rounded = (Math.floor(num * factor) + 1) / factor; // Round up to make it even
    } else {
      rounded = Math.floor(num * factor) / factor; // Keep as is (already even)
    }
  }
  return createS21Decimal(rounded);
};

export const s21Truncate = (dec: S21Decimal): S21Decimal => {
  const num = s21DecimalToNumber(dec);
  return createS21Decimal(Math.trunc(num));
};

export const s21Negate = (dec: S21Decimal): S21Decimal => {
  const num = s21DecimalToNumber(dec);
  return createS21Decimal(-num);
};

export const s21Floor = (dec: S21Decimal): S21Decimal => {
  const num = s21DecimalToNumber(dec);
  return createS21Decimal(Math.floor(num));
};
