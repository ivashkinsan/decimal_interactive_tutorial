import React from 'react';
import ContentRenderer from '../ContentRenderer';
import ArithmeticSimulator from '../../renderers/ArithmeticSimulator';
import RepresentationExplorer from '../../renderers/RepresentationExplorer';
import FileExplainer from '../../renderers/FileExplainer';
import ComparisonSimulator from '../../renderers/ComparisonSimulator';
import ComparisonSimulatorAll from '../../renderers/ComparisonSimulatorAll';
import BitwiseOperationsSimulator from '../../renderers/BitwiseOperationsSimulator';
import { ConversionSimulator } from '../../renderers/ConversionSimulator';
import { BankersRoundingSimulator } from '../../renderers/BankersRoundingSimulator';
import OverflowSimulator from '../../renderers/OverflowSimulator'; // New import
import { OtherFunctionsSimulator } from '../../renderers/OtherFunctionsSimulator';

// Define a type for your content items
interface ContentItem {
  id?: string; // Make id optional
  title: string;
  description?: string;
  template?: string;
  interactive?: string; // Name of the interactive component
  simple?: string;
  why?: string;
  type?: string; // Add type for separators
}

// Map interactive component names to their actual components
const interactiveComponents: { [key: string]: React.ComponentType<any> } = {
  arithmetic_simulator: ArithmeticSimulator,
  representation_explorer: RepresentationExplorer,
  file_explainer: FileExplainer,
  comparison_simulator: ComparisonSimulator,
  comparison_simulator_all: ComparisonSimulatorAll,
  bitwise_operations_simulator: BitwiseOperationsSimulator,
  conversion_simulator: ConversionSimulator,
  bankers_rounding_simulator: BankersRoundingSimulator,
  overflow_simulator: OverflowSimulator, // Updated from overflow_visualizer
  other_functions_simulator: OtherFunctionsSimulator,
  // Add other interactive components here as they are migrated
};

interface ContentPageProps {
  contentItem: ContentItem;
}

const ContentPage: React.FC<ContentPageProps> = ({ contentItem }) => {
  const InteractiveComponent = contentItem.interactive ? interactiveComponents[contentItem.interactive] : null;

  return (
    <div>
      {contentItem.template && <ContentRenderer htmlString={contentItem.template} />}
      {InteractiveComponent && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h2>Интерактивный раздел</h2>
          <InteractiveComponent
            wasmLoaded={true} // wasmLoaded is always true now
            {...(contentItem.interactive === 'comparison_simulator' && { comparisonType: contentItem.id })}
          />
        </div>
      )}
    </div>
  );
};

export default ContentPage;
