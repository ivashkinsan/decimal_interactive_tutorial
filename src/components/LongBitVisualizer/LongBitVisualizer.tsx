import React from 'react';
import styles from './LongBitVisualizer.module.css';

interface LongBitVisualizerProps {
  s21DecimalBits: number[]; // The bits of the current number (value1, value2, or result)
  allBits1?: number[]; // All bits of value1
  allBits2?: number[]; // All bits of value2
  allResultBits?: number[]; // All bits of the result
  operation?: string; // The current bitwise operation
  target?: 'value1' | 'value2' | 'result'; // To identify which visualizer this is
}

const LongBitVisualizer: React.FC<LongBitVisualizerProps> = ({ s21DecimalBits, allBits1, allBits2, allResultBits, operation, target }) => {
  const renderMantissaBits = () => {
    const allMantissaBits: React.ReactNode[] = [];

    // Iterate from bits[2] down to bits[0] to get the correct order (most significant to least significant)
    for (let i = 2; i >= 0; i--) {
      const bits = s21DecimalBits[i];
      const binary = (bits >>> 0).toString(2).padStart(32, '0');

      // Group by 8 bits
      const chunks = binary.match(/.{1,8}/g) || [];
      chunks.forEach((chunk, chunkIndex) => {
        chunk.split('').forEach((bit, bitIndex) => {
          let highlightClass = '';
          // const globalBitIndex = (2 - i) * 32 + (31 - (chunkIndex * 8 + bitIndex)); // Calculate global bit index from LSB

          if (operation && allBits1 && allBits2 && allResultBits) {
            const bit1 = ((allBits1[i] >>> (31 - (chunkIndex * 8 + bitIndex))) & 1);
            const bit2 = ((allBits2[i] >>> (31 - (chunkIndex * 8 + bitIndex))) & 1);
            const resultBit = ((allResultBits[i] >>> (31 - (chunkIndex * 8 + bitIndex))) & 1);

            if (target === 'result') {
              if (resultBit === 1) {
                switch (operation) {
                  case 'AND':
                    if (bit1 === 1 && bit2 === 1) highlightClass = styles.bitHighlightAndResult;
                    break;
                  case 'OR':
                    if (bit1 === 1 || bit2 === 1) highlightClass = styles.bitHighlightOrResult;
                    break;
                  case 'XOR':
                    if (bit1 !== bit2) highlightClass = styles.bitHighlightXorResult;
                    break;
                  case 'NOT1':
                  case 'NOT2':
                    if (resultBit === 1) highlightClass = styles.bitHighlightNotResult;
                    break;
                }
              }
            } else if (target === 'value1') {
              switch (operation) {
                case 'AND':
                  if (bit1 === 1 && bit2 === 1) highlightClass = styles.bitHighlightAndInputActive;
                  else if (bit1 === 1 && bit2 === 0) highlightClass = styles.bitHighlightAndInputInactive;
                  else if (bit1 === 0 && bit2 === 1) highlightClass = styles.bitHighlightAndInputInactive;
                  else if (bit1 === 0 && bit2 === 0) highlightClass = styles.bitHighlightAndInputInactive;
                  break;
                case 'OR':
                  if (bit1 === 1 || bit2 === 1) highlightClass = styles.bitHighlightOrInputActive;
                  else if (bit1 === 0 && bit2 === 0) highlightClass = styles.bitHighlightOrInputInactive;
                  break;
                case 'XOR':
                  if (bit1 !== bit2) highlightClass = styles.bitHighlightXorInputActive;
                  else if (bit1 === bit2) highlightClass = styles.bitHighlightXorInputInactive;
                  break;
                case 'NOT1':
                  if (bit1 === 1) highlightClass = styles.bitHighlightNotInputActive;
                  else if (bit1 === 0) highlightClass = styles.bitHighlightNotInputInactive;
                  break;
              }
            } else if (target === 'value2') {
              switch (operation) {
                case 'AND':
                  if (bit1 === 1 && bit2 === 1) highlightClass = styles.bitHighlightAndInputActive;
                  else if (bit1 === 1 && bit2 === 0) highlightClass = styles.bitHighlightAndInputInactive;
                  else if (bit1 === 0 && bit2 === 1) highlightClass = styles.bitHighlightAndInputInactive;
                  else if (bit1 === 0 && bit2 === 0) highlightClass = styles.bitHighlightAndInputInactive;
                  break;
                case 'OR':
                  if (bit1 === 1 || bit2 === 1) highlightClass = styles.bitHighlightOrInputActive;
                  else if (bit1 === 0 && bit2 === 0) highlightClass = styles.bitHighlightOrInputInactive;
                  break;
                case 'XOR':
                  if (bit1 !== bit2) highlightClass = styles.bitHighlightXorInputActive;
                  else if (bit1 === bit2) highlightClass = styles.bitHighlightXorInputInactive;
                  break;
                case 'NOT2':
                  if (bit2 === 1) highlightClass = styles.bitHighlightNotInputActive;
                  else if (bit2 === 0) highlightClass = styles.bitHighlightNotInputInactive;
                  break;
              }
            }
          } else if (bit === '1') {
            highlightClass = styles.bitOne;
          }

          allMantissaBits.push(
            <span
              key={`bit-${i}-${chunkIndex}-${bitIndex}`}
              className={`${styles.bit} ${highlightClass}`}
            >
              {bit}
            </span>
          );
        });
        if (chunkIndex < chunks.length - 1) {
          allMantissaBits.push(<span key={`space-${i}-${chunkIndex}`} className={styles.bitSpace}></span>);
        }
      });
      if (i > 0) {
        allMantissaBits.push(<span key={`word-space-${i}`} className={styles.wordSpace}></span>);
      }
    }
    return allMantissaBits;
  };

  return (
    <div className={styles.longBitVisualizerContainer}>
      {renderMantissaBits()}
    </div>
  );
};

export default LongBitVisualizer;
