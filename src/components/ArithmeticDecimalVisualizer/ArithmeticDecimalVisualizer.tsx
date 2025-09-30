import React from 'react';
import FullDecimalVisualizer from '../FullDecimalVisualizer/FullDecimalVisualizer';
import styles from './ArithmeticDecimalVisualizer.module.css';

interface ArithmeticDecimalVisualizerProps {
  s21DecimalBits: number[];
  label: string;
  // Add more props here as needed for step-by-step visualization
}

const ArithmeticDecimalVisualizer: React.FC<ArithmeticDecimalVisualizerProps> = ({
  s21DecimalBits,
  label,
}) => {
  return (
    <div className={styles.arithmeticDecimalVisualizerContainer}>
      <div className={styles.label}>{label}</div>
      <FullDecimalVisualizer s21DecimalBits={s21DecimalBits} />
      {/* Add more visualization elements here for arithmetic steps */}
    </div>
  );
};

export default ArithmeticDecimalVisualizer;
