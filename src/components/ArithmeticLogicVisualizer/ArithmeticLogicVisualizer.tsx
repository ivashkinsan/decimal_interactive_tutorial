import React from 'react';
import styles from './ArithmeticLogicVisualizer.module.css';

interface ArithmeticStep {
  description: string;
  value1?: string; // Decimal string representation
  value2?: string; // Decimal string representation
  result?: string; // Decimal string representation
  highlight?: 'value1' | 'value2' | 'result' | 'scale1' | 'scale2' | 'sign1' | 'sign2';
  // Add more fields as needed to describe the step visually
}

interface ArithmeticLogicVisualizerProps {
  steps: ArithmeticStep[];
}

const ArithmeticLogicVisualizer: React.FC<ArithmeticLogicVisualizerProps> = ({ steps }) => {
  return (
    <div className={styles.arithmeticLogicVisualizerContainer}>
      <h4>Пошаговая логика:</h4>
      {steps.map((step, index) => (
        <div key={index} className={styles.stepItem}>
          <p className={styles.stepDescription}>{step.description}</p>
          {step.value1 !== undefined && (
            <p className={`${styles.stepValue} ${step.highlight === 'value1' ? styles.highlighted : ''}`}>
              Число 1: {step.value1}
            </p>
          )}
          {step.value2 !== undefined && (
            <p className={`${styles.stepValue} ${step.highlight === 'value2' ? styles.highlighted : ''}`}>
              Число 2: {step.value2}
            </p>
          )}
          {step.result !== undefined && (
            <p className={`${styles.stepValue} ${step.highlight === 'result' ? styles.highlighted : ''}`}>
              Результат: {step.result}
            </p>
          )}
          {/* Add more conditional rendering for other highlight types */}
        </div>
      ))}
    </div>
  );
};

export default ArithmeticLogicVisualizer;
