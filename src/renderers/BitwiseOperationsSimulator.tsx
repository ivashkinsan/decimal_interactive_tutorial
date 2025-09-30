import React, { useState, useEffect, useCallback } from 'react';
import styles from './BitwiseOperationsSimulator.module.css';
import StackedBitVisualizer from '../components/StackedBitVisualizer/StackedBitVisualizer';

const BitwiseOperationsSimulator: React.FC = () => {
  const [value1, setValue1] = useState<string>('123');
  const [value2, setValue2] = useState<string>('456');
  const [currentOperation, setCurrentOperation] = useState<string>('AND');
  const [bits1, setBits1] = useState<number[]>([0, 0, 0, 0]);
  const [bits2, setBits2] = useState<number[]>([0, 0, 0, 0]);
  const [resultBits, setResultBits] = useState<number[]>([0, 0, 0, 0]);
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [numericalResult, setNumericalResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [bitwiseLogicOutput, setBitwiseLogicOutput] = useState<string>('');
  const [isSingleOperandOperation, setIsSingleOperandOperation] = useState<boolean>(false);

  const calculateBitwise = useCallback((b1: number[], b2: number[], operation: string) => {
    const newResultBits = [0, 0, 0, 0];
    let operatorSymbol = '';
    let tempNumericalResult = BigInt(0);
    let logicOutput = '<h4>Пример логики:</h4>';

    const singleOperand = (operation === 'NOT1' || operation === 'NOT2');
    setIsSingleOperandOperation(singleOperand);

    for (let i = 0; i < 3; i++) {
      switch (operation) {
        case 'AND': operatorSymbol = '&'; newResultBits[i] = b1[i] & b2[i]; break;
        case 'OR': operatorSymbol = '|'; newResultBits[i] = b1[i] | b2[i]; break;
        case 'XOR': operatorSymbol = '^'; newResultBits[i] = b1[i] ^ b2[i]; break;
        case 'NOT1': operatorSymbol = '~'; newResultBits[i] = ~b1[i]; break;
        case 'NOT2': operatorSymbol = '~'; newResultBits[i] = ~b2[i]; break;
      }
    }
    setResultBits(newResultBits);

    if (singleOperand) {
      logicOutput += `<p>${operatorSymbol}1 = ${~1 & 1}</p>`;
      logicOutput += `<p>${operatorSymbol}0 = ${~0 & 1}</p>`;
    } else {
      const opFunc = 
        operatorSymbol === '&' ? (a: number, b: number) => a & b :
        operatorSymbol === '|' ? (a: number, b: number) => a | b :
        operatorSymbol === '^' ? (a: number, b: number) => a ^ b :
        null;

      if (opFunc) {
        logicOutput += `<p>1 ${operatorSymbol} 1 = ${opFunc(1, 1)}</p>`;
        logicOutput += `<p>1 ${operatorSymbol} 0 = ${opFunc(1, 0)}</p>`;
        logicOutput += `<p>0 ${operatorSymbol} 1 = ${opFunc(0, 1)}</p>`;
        logicOutput += `<p>0 ${operatorSymbol} 0 = ${opFunc(0, 0)}</p>`;
      }
    }
    setBitwiseLogicOutput(logicOutput);

    if (operation === 'NOT1') {
      setCodeOutput(`unsigned int result = ${operatorSymbol}${value1};`);
    } else if (operation === 'NOT2') {
      setCodeOutput(`unsigned int result = ${operatorSymbol}${value2};`);
    } else {
      setCodeOutput(`unsigned int result = ${value1} ${operatorSymbol} ${value2};`);
    }

    const high = BigInt.asUintN(32, BigInt(newResultBits[2]));
    const mid = BigInt.asUintN(32, BigInt(newResultBits[1]));
    const low = BigInt.asUintN(32, BigInt(newResultBits[0]));
    tempNumericalResult = (high << 64n) | (mid << 32n) | low;

    if (singleOperand) {
        const isNegative = (newResultBits[2] & 0x80000000) !== 0;
        if (isNegative) {
            const mask = (1n << 96n) - 1n;
            const positiveValue = tempNumericalResult & mask;
            if (positiveValue > ((1n << 95n) - 1n)) {
                tempNumericalResult = positiveValue - (1n << 96n);
            }
        }
    }

    setNumericalResult(tempNumericalResult.toString());
  }, [value1, value2]);

  const updateAll = useCallback(() => {
    setError(null);
    try {
      const val1BigInt = BigInt(value1 || 0);
      const b1 = [
        Number(val1BigInt & 0xFFFFFFFFn),
        Number((val1BigInt >> 32n) & 0xFFFFFFFFn),
        Number((val1BigInt >> 64n) & 0xFFFFFFFFn),
        0
      ];
      setBits1(b1);

      const val2BigInt = BigInt(value2 || 0);
      const b2 = [
        Number(val2BigInt & 0xFFFFFFFFn),
        Number((val2BigInt >> 32n) & 0xFFFFFFFFn),
        Number((val2BigInt >> 64n) & 0xFFFFFFFFn),
        0
      ];
      setBits2(b2);

      calculateBitwise(b1, b2, currentOperation);
    } catch (e: unknown) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError("Произошла неизвестная ошибка.");
        }
    }
  }, [value1, value2, currentOperation, calculateBitwise]);

  useEffect(() => {
    updateAll();
  }, [updateAll]);

  return (
    <div className={styles.bitwiseOperationsContainer}>
      {error && <p className={styles.errorText}>Ошибка: {error}</p>}
      <div className={styles.controlsRow}>
        <div className={styles.inputGroup}>
          <label>Число 1:</label>
          <input
            type="text"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
            className={styles.inputField}
          />
        </div>
        <div className={styles.operations}>
          <button className={`${styles.operationButton} ${currentOperation === 'AND' ? styles.active : ''}`} onClick={() => setCurrentOperation('AND')}>AND</button>
          <button className={`${styles.operationButton} ${currentOperation === 'OR' ? styles.active : ''}`} onClick={() => setCurrentOperation('OR')}>OR</button>
          <button className={`${styles.operationButton} ${currentOperation === 'XOR' ? styles.active : ''}`} onClick={() => setCurrentOperation('XOR')}>XOR</button>
          <button className={`${styles.operationButton} ${currentOperation === 'NOT1' ? styles.active : ''}`} onClick={() => setCurrentOperation('NOT1')}>NOT 1</button>
          <button className={`${styles.operationButton} ${currentOperation === 'NOT2' ? styles.active : ''}`} onClick={() => setCurrentOperation('NOT2')}>NOT 2</button>
        </div>
        {!isSingleOperandOperation && (
          <div className={styles.inputGroup}>
            <label>Число 2:</label>
            <input
              type="text"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              className={styles.inputField}
              disabled={isSingleOperandOperation}
            />
          </div>
        )}
      </div>

      <div className={styles.codeDisplay}>
        <pre><code className={styles.codeOutput}>{codeOutput}</code></pre>
      </div>

      <div className={styles.resultSection}>
        <div className={styles.decimalInputGroup}>
          <label>Результат:</label>
          <p className={styles.numericalResult}>{numericalResult}</p>
        </div>
        {bitwiseLogicOutput && (
          <div className={styles.bitwiseLogicOutput}>
            <h4>Побитовая логика:</h4>
            <pre dangerouslySetInnerHTML={{ __html: bitwiseLogicOutput }}></pre>
          </div>
        )}
      </div>
      {isSingleOperandOperation ? (
        <StackedBitVisualizer
          bits1={currentOperation === 'NOT1' ? bits1 : bits2}
          bits2={undefined}
          resultBits={resultBits}
          operation={currentOperation}
        />
      ) : (
        <StackedBitVisualizer bits1={bits1} bits2={bits2} resultBits={resultBits} operation={currentOperation} />
      )}
    </div>
  );
};

export default BitwiseOperationsSimulator;
