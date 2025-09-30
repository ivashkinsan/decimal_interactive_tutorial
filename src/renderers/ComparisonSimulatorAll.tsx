import React from 'react';
import ComparisonSimulator from './ComparisonSimulator';
import { comparisonContent } from '../data/comparison_content';

const ComparisonSimulatorAll: React.FC = () => {
  const operatorDetails = comparisonContent.comparison_operators.operatorDetails;

  return (
    <div>
      {operatorDetails.map((operator) => (
        <div key={operator.type}>
          <h4>s21_{operator.type}</h4>
          {operator.longDescriptionHtml && (
            <div dangerouslySetInnerHTML={{ __html: operator.longDescriptionHtml }} />
          )}
          <ComparisonSimulator comparisonType={operator.type} />
        </div>
      ))}
    </div>
  );
};

export default ComparisonSimulatorAll;