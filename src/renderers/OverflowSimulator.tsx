import React, { useState, useEffect } from 'react';
import { createS21Decimal, S21Decimal, getS21DecimalSign } from '../utils/s21DecimalJs';

// Using inline styles for simplicity in this self-contained component
const styles = {
  // ... (previous styles are kept, only new/modified are shown)
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#2d323a',
    borderRadius: '8px',
    color: 'white',
    fontFamily: '"Roboto Mono", monospace',
    width: '100%',
    maxWidth: '800px',
    margin: 'auto',
  },
  controls: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #61dafb',
    backgroundColor: '#282c34',
    color: 'white',
    width: '200px',
  },
  visualization: {
    width: '100%',
    marginTop: '20px',
  },
  barContainer: {
    position: 'relative' as 'relative',
    height: '50px',
    backgroundColor: '#444',
    borderRadius: '5px',
    overflow: 'hidden',
    border: '1px solid #61dafb',
  },
  mantissaBar: {
    position: 'absolute' as 'absolute',
    height: '100%',
    backgroundColor: '#61dafb',
    transition: 'width 0.5s ease-in-out',
  },
  overflowBar: {
    position: 'absolute' as 'absolute',
    height: '100%',
    backgroundColor: '#ff6b6b',
    left: '100%',
    transition: 'width 0.5s ease-in-out',
  },
  maxLine: {
    position: 'absolute' as 'absolute',
    left: '100%',
    top: 0,
    bottom: 0,
    borderLeft: '2px dashed #ff6b6b',
  },
  labels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    fontSize: '0.9em',
  },
  result: {
    marginTop: '20px',
    fontSize: '1.5em',
    fontWeight: 'bold' as 'bold',
  },
  success: { color: '#98c379' },
  overflow: { color: '#ff6b6b' },
  bitContainer: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#282c34',
    borderRadius: '5px',
    width: '100%',
    textAlign: 'left' as 'left',
  },
  bitString: {
    fontFamily: 'monospace',
    fontSize: '0.9em',
    wordBreak: 'break-all' as 'break-all',
    lineHeight: '1.6',
  },
  overflowBit: {
    color: '#ff6b6b',
    fontWeight: 'bold' as 'bold',
  },
  oneBit: {
    color: '#98c379',
  },
  bitLabel: {
    color: '#61dafb',
    marginRight: '10px',
  }
};

const MAX_MANTISSA = (1n << 96n) - 1n;

const getMantissaAsBigInt = (decimal: S21Decimal): BigInt => {
    return BigInt(decimal.bits[0]) | (BigInt(decimal.bits[1]) << 32n) | (BigInt(decimal.bits[2]) << 64n);
}

const BitString: React.FC<{ value: number, label: string }> = ({ value, label }) => {
  let bitStr = (value >>> 0).toString(2).padStart(32, '0');
  const parts = bitStr.match(/.{1,8}/g) || [];
  return (
    <div style={styles.bitString}>
      <span style={styles.bitLabel}>{label}:</span>
      {parts.map((part, i) => (
        <span key={i} style={{ marginRight: '8px' }}>
          {part.split('').map((bit, j) => (
            bit === '1' ? <span key={j} style={styles.oneBit}>1</span> : '0'
          ))}
        </span>
      ))}
    </div>
  );
};

const OverflowSimulator: React.FC = () => {
  const [num1, setNum1] = useState('5e28');
  const [num2, setNum2] = useState('5e28');
  const [dec1, setDec1] = useState<S21Decimal | null>(null);
  const [dec2, setDec2] = useState<S21Decimal | null>(null);
  const [totalMantissa, setTotalMantissa] = useState(BigInt(0));

  useEffect(() => {
    try {
      const d1 = createS21Decimal(num1);
      const d2 = createS21Decimal(num2);
      setDec1(d1);
      setDec2(d2);
      const m1 = getMantissaAsBigInt(d1);
      const m2 = getMantissaAsBigInt(d2);
      
      const sign1 = getS21DecimalSign(d1);
      const sign2 = getS21DecimalSign(d2);

      if (sign1 === sign2) {
        setTotalMantissa(BigInt(m1) + BigInt(m2));
      } else {
        setTotalMantissa(m1 > m2 ? m1 - m2 : m2 - m1);
      }

    } catch (e) {
      setDec1(null);
      setDec2(null);
      setTotalMantissa(BigInt(0));
    }
  }, [num1, num2]);

  const hasOverflow = totalMantissa > MAX_MANTISSA;
  const displayPercentage = hasOverflow ? 100 : Number((totalMantissa * 100n) / MAX_MANTISSA);
  const overflowPercentage = hasOverflow ? Math.min(((Number(totalMantissa - MAX_MANTISSA) * 100) / Number(MAX_MANTISSA)), 100) : 0;

  return (
    <div style={styles.container}>
      <h3>Интерактивный пример: Переполнение мантиссы</h3>
      <p>Введите два числа (можно с минусом), чтобы увидеть, как их мантиссы складываются или вычитаются.</p>
      <div style={styles.controls}>
        <input type="text" value={num1} onChange={e => setNum1(e.target.value)} style={styles.input} />
        <span>+</span>
        <input type="text" value={num2} onChange={e => setNum2(e.target.value)} style={styles.input} />
      </div>

      <div style={styles.visualization}>
        <div style={styles.barContainer}>
          <div style={{...styles.mantissaBar, width: `${displayPercentage}%`}}></div>
          {hasOverflow && <div style={{...styles.overflowBar, width: `${overflowPercentage}%`}}></div>}
          <div style={styles.maxLine}></div>
        </div>
        <div style={styles.labels}><span>0</span><span>MAX (2⁹⁶ - 1)</span></div>
      </div>

      <div style={{...styles.result, ...(hasOverflow ? styles.overflow : styles.success)}}>
        {hasOverflow ? 'ПЕРЕПОЛНЕНИЕ!' : 'OK'}
      </div>

      <div style={styles.bitContainer}>
        <h4>Побитовое представление s21_decimal</h4>
        {dec1 && (
          <div>
            <b>Число 1 (Знак: {getS21DecimalSign(dec1)}):</b>
            <BitString value={dec1.bits[2]} label="bits[2]" />
            <BitString value={dec1.bits[1]} label="bits[1]" />
            <BitString value={dec1.bits[0]} label="bits[0]" />
            <BitString value={dec1.bits[3]} label="bits[3]" />
          </div>
        )}
        <hr />
        {dec2 && (
          <div>
            <b>Число 2 (Знак: {getS21DecimalSign(dec2)}):</b>
            <BitString value={dec2.bits[2]} label="bits[2]" />
            <BitString value={dec2.bits[1]} label="bits[1]" />
            <BitString value={dec2.bits[0]} label="bits[0]" />
            <BitString value={dec2.bits[3]} label="bits[3]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default OverflowSimulator;
