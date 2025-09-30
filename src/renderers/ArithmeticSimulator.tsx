import React, { useState } from 'react';
import styles from './ArithmeticSimulator.module.css';
import AdditionSimulator from './AdditionSimulator';
import SubtractionSimulator from './SubtractionSimulator';
import MultiplicationSimulator from './MultiplicationSimulator';
import DivisionSimulator from './DivisionSimulator';

const ArithmeticSimulator: React.FC = () => {
  const [selectedOperation, setSelectedOperation] = useState<string>('ADD');

  const renderSimulator = () => {
    switch (selectedOperation) {
      case 'ADD':
        return <AdditionSimulator />;
      case 'SUB':
        return <SubtractionSimulator />;
      case 'MUL':
        return <MultiplicationSimulator />;
      case 'DIV':
        return <DivisionSimulator />;
      default:
        return <p>Выберите арифметическую операцию.</p>;
    }
  };

  return (
    <div className={styles.arithmeticSimulatorContainer}>
      <div className={styles.operationsSelector}>
        <button
          className={`${styles.operationButton} ${selectedOperation === 'ADD' ? styles.active : ''}`}
          onClick={() => setSelectedOperation('ADD')}
        >Сложение (+)</button>
        <button
          className={`${styles.operationButton} ${selectedOperation === 'SUB' ? styles.active : ''}`}
          onClick={() => setSelectedOperation('SUB')}
        >Вычитание (-)</button>
        <button
          className={`${styles.operationButton} ${selectedOperation === 'MUL' ? styles.active : ''}`}
          onClick={() => setSelectedOperation('MUL')}
        >Умножение (*)</button>
        <button
          className={`${styles.operationButton} ${selectedOperation === 'DIV' ? styles.active : ''}`}
          onClick={() => setSelectedOperation('DIV')}
        >Деление (/)</button>
      </div>
      <div className={styles.currentSimulator}>
        {renderSimulator()}
      </div>
    </div>
  );
};

export default ArithmeticSimulator;
