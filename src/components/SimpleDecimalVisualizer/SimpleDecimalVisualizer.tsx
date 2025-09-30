import React from 'react';
import styles from './SimpleDecimalVisualizer.module.css';

interface SimpleDecimalVisualizerProps {
  s21DecimalBits: number[];
}

const SimpleDecimalVisualizer: React.FC<SimpleDecimalVisualizerProps> = ({ s21DecimalBits }) => {
  const renderBitRow = (bits: number, label: string, isControl: boolean) => {
    const binary = (bits >>> 0).toString(2).padStart(32, '0');
    let content;

    if (isControl) {
      const sign = binary.substring(0, 1);
      const unused1 = binary.substring(1, 8);
      const scale = binary.substring(8, 16);
      const unused2 = binary.substring(16, 32);
      content = (
        <>
          <span className={`${styles.bitGroup} ${styles.signBit}`}>{sign}</span>
          <span className={`${styles.bitGroup} ${styles.unusedBit}`}>{unused1}</span>
          <span className={`${styles.bitGroup} ${styles.scaleBit}`}>{scale}</span>
          <span className={`${styles.bitGroup} ${styles.unusedBit}`}>{unused2}</span>
        </>
      );
    } else {
      const chunks = binary.match(/.{1,8}/g) || [];
      content = chunks.map((chunk, i) => (
        <span key={i} className={styles.bitChunk}>
          {chunk.split('').map((bit, j) => (
            <span key={j} className={bit === '1' ? styles.bitOne : ''}>{bit}</span>
          ))}
        </span>
      ));
    }

    return (
      <div className={styles.bitRow}>
        <span className={styles.bitLabel}>{label}:</span>
        <span className={styles.bitValue}>{content}</span>
      </div>
    );
  };

  return (
    <div className={styles.visualizerContainer}>
      <div className={styles.headerRow}>
        <span className={styles.bitLabel}></span>
        <div className={styles.headerGroups}>
          <div className={`${styles.headerGroup} ${styles.signBit}`}>Sign</div>
          <div className={`${styles.headerGroup} ${styles.unusedBit}`}>Unused</div>
          <div className={`${styles.headerGroup} ${styles.scaleBit}`}>Scale</div>
          <div className={`${styles.headerGroup} ${styles.unusedBit}`}>Unused</div>
        </div>
      </div>
      {renderBitRow(s21DecimalBits[3], 'bits[3]', true)}
      {renderBitRow(s21DecimalBits[2], 'bits[2]', false)}
      {renderBitRow(s21DecimalBits[1], 'bits[1]', false)}
      {renderBitRow(s21DecimalBits[0], 'bits[0]', false)}
    </div>
  );
};

export default SimpleDecimalVisualizer;