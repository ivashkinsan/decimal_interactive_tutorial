import React, { useState, useEffect } from 'react';
import styles from './RepresentationExplorer.module.css';
import { representationExplorerSteps, type StepData } from '../data/representation_explorer_steps';
import FullDecimalVisualizer from '../components/FullDecimalVisualizer/FullDecimalVisualizer';
import MantissaInput from '../components/MantissaInput/MantissaInput';
import Bits3Explorer from '../components/Bits3Explorer/Bits3Explorer';

const RepresentationExplorer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [s21DecimalBits, setS21DecimalBits] = useState<number[]>([0, 0, 0, 0]); // Initialize for the first step

  useEffect(() => {
    // Reset or set initial bits when step changes
    if (currentStepData.interactiveComponent === 'final-example') {
      // Example: 123.45 (sign=0, scale=2, mantissa=12345)
      const bits = [12345, 0, 0, (0 << 31) | (2 << 16)];
      setS21DecimalBits(bits);
    } else if (currentStepData.interactiveComponent === 'full-decimal-visualizer') {
      setS21DecimalBits([0, 0, 0, 0]);
    }
  }, [currentStep]);

  const currentStepData: StepData = representationExplorerSteps[currentStep];

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(representationExplorerSteps.length - 1, prev + 1));
  };

  const renderInteractiveComponent = () => {
    switch (currentStepData.interactiveComponent) {
      case 'full-decimal-visualizer':
        return <FullDecimalVisualizer s21DecimalBits={s21DecimalBits} />;
      case 'mantissa-input':
        return (
          <MantissaInput
            setS21DecimalBits={setS21DecimalBits}
            s21DecimalBits={s21DecimalBits}
          />
        );
      case 'bits3-explorer':
        return (
          <Bits3Explorer
            setS21DecimalBits={setS21DecimalBits}
            s21DecimalBits={s21DecimalBits}
          />
        );
      case 'final-example':
        return <FullDecimalVisualizer s21DecimalBits={s21DecimalBits} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.explorerContainer}>
      <div className={styles.wizardHeader}>
        <h3 id="wizard-title">{currentStepData.title}</h3>
      </div>
      <div className={styles.wizardBody}>
        <div className={styles.wizardPrologue}>{currentStepData.prologue}</div>
        <div className={styles.wizardInteractiveArea}>
          {renderInteractiveComponent()}
        </div>
        <div className={styles.wizardEpilogue}>{currentStepData.epilogue}</div>
      </div>
      <div className={styles.wizardNav}>
        <button onClick={handlePrev} disabled={currentStep === 0}>Назад</button>
        <span className={styles.stepIndicator}>Шаг {currentStep + 1} / {representationExplorerSteps.length}</span>
        <button onClick={handleNext} disabled={currentStep === representationExplorerSteps.length - 1}>Далее</button>
      </div>
    </div>
  );
};

export default RepresentationExplorer;
