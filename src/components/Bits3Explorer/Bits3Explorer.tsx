import React from 'react';
import FullDecimalVisualizer from '../FullDecimalVisualizer/FullDecimalVisualizer';

interface Bits3ExplorerProps {
  setS21DecimalBits: (bits: number[]) => void;
  s21DecimalBits: number[];
}

const Bits3Explorer: React.FC<Bits3ExplorerProps> = ({ s21DecimalBits }) => {
  return (
    <div>
      <FullDecimalVisualizer s21DecimalBits={s21DecimalBits} />
    </div>
  );
};

export default Bits3Explorer;
