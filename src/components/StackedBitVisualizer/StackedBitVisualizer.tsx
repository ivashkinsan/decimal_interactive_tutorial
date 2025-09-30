import React from 'react';
import styles from './StackedBitVisualizer.module.css';

interface StackedBitVisualizerProps {
  bits1: number[];
  bits2?: number[]; // Made optional
  resultBits?: number[]; // Optional for bitwise operations
  operation: string; // Can be bitwise operation or comparison type
}

const StackedBitVisualizer: React.FC<StackedBitVisualizerProps> = ({ bits1, bits2, resultBits, operation }) => {

  const renderBitRow = (targetBits: number[], target: 'input1' | 'input2' | 'result') => {
    const allMantissaBits: React.ReactNode[] = [];

    for (let i = 2; i >= 0; i--) {
      const bits = targetBits[i];
      const binary = (bits >>> 0).toString(2).padStart(32, '0');

      const chunks = binary.match(/.{1,8}/g) || [];
      chunks.forEach((chunk, chunkIndex) => {
        chunk.split('').forEach((bit, bitIndex) => {
          let highlightClass = '';
          const currentBit1 = ((bits1[i] >>> (31 - (chunkIndex * 8 + bitIndex))) & 1);
          const currentBit2 = bits2 ? ((bits2[i] >>> (31 - (chunkIndex * 8 + bitIndex))) & 1) : undefined; // currentBit2 is optional

          // Determine if it's a comparison operation
          const isComparison = operation.startsWith('is_');

          if (isComparison) {
            // Logic for comparison operations
            if (target === 'input1' || target === 'input2') {
              // Highlight bits that are different or contribute to the comparison
              if (currentBit2 !== undefined && currentBit1 !== currentBit2) {
                highlightClass = styles.bitHighlightComparisonDifference;
              } else if (currentBit2 !== undefined) {
                highlightClass = styles.bitHighlightComparisonSame;
              }
            }
          } else {
            // Existing logic for bitwise operations
            if (resultBits && target === 'result') {
              const currentResultBit = ((resultBits[i] >>> (31 - (chunkIndex * 8 + bitIndex))) & 1);
              if (currentResultBit === 1) {
                switch (operation) {
                  case 'AND': highlightClass = styles.bitHighlightAndResult; break;
                  case 'OR': highlightClass = styles.bitHighlightOrResult; break;
                  case 'XOR': highlightClass = styles.bitHighlightXorResult; break;
                  case 'NOT1':
                  case 'NOT2': highlightClass = styles.bitHighlightNotResult; break;
                }
              }
            } else if (resultBits) { // For input bits in bitwise operations
              if (target === 'input1') {
                switch (operation) {
                  case 'AND': highlightClass = (currentBit1 === 1 && currentBit2 === 1) ? styles.bitHighlightAndInputActive : styles.bitHighlightAndInputInactive; break;
                  case 'OR': highlightClass = (currentBit1 === 1 || currentBit2 === 1) ? styles.bitHighlightOrInputActive : styles.bitHighlightOrInputInactive; break;
                  case 'XOR': highlightClass = (currentBit1 !== currentBit2) ? styles.bitHighlightXorInputActive : styles.bitHighlightXorInputInactive; break;
                  case 'NOT1': highlightClass = (currentBit1 === 1) ? styles.bitHighlightNotInputActive : styles.bitHighlightNotInputInactive; break;
                }
              } else if (target === 'input2') {
                switch (operation) {
                  case 'AND': highlightClass = (currentBit1 === 1 && currentBit2 === 1) ? styles.bitHighlightAndInputActive : styles.bitHighlightAndInputInactive; break;
                  case 'OR': highlightClass = (currentBit1 === 1 || currentBit2 === 1) ? styles.bitHighlightOrInputActive : styles.bitHighlightOrInputInactive; break;
                  case 'XOR': highlightClass = (currentBit1 !== currentBit2) ? styles.bitHighlightXorInputActive : styles.bitHighlightXorInputInactive; break;
                  case 'NOT2': highlightClass = (currentBit2 === 1) ? styles.bitHighlightNotInputActive : styles.bitHighlightNotInputInactive; break;
                }
              }
            }
          }
          // Apply default bitOne highlighting if no specific operation-based highlighting is applied
          if (!highlightClass && bit === '1') {
            highlightClass = styles.bitOne;
          }

          allMantissaBits.push(
            <span
              key={`bit-${target}-${i}-${chunkIndex}-${bitIndex}`}
              className={`${styles.bit} ${highlightClass}`}
            >
              {bit}
            </span>
          );
        });
        if (chunkIndex < chunks.length - 1) {
          allMantissaBits.push(<span key={`space-${target}-${i}-${chunkIndex}`} className={styles.bitSpace}></span>);
        }
      });
      if (i > 0) {
        allMantissaBits.push(<span key={`word-space-${target}-${i}`} className={styles.wordSpace}></span>);
      }
    }
    return allMantissaBits;
  };

  return (
    <div className={styles.stackedBitVisualizerContainer}>
      <div className={styles.bitRow}>
        <span className={styles.rowLabel}>V1:</span>
        {renderBitRow(bits1, 'input1')}
      </div>
      {bits2 && (
        <div className={styles.bitRow}>
          <span className={styles.rowLabel}>V2:</span>
          {renderBitRow(bits2, 'input2')}
        </div>
      )}
      {resultBits && (
        <div className={styles.bitRow}>
          <span className={styles.rowLabel}>Res:</span>
          {renderBitRow(resultBits, 'result')}
        </div>
      )}
    </div>
  );
};

export default StackedBitVisualizer;
