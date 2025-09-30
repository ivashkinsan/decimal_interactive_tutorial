import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContentPage from './components/ContentPage/ContentPage';
import Layout from './components/Layout/Layout';
import { allContentData } from './data';
import './App.css';

function App() {
  const generateLinkPath = (key: string) => {
    // This logic needs to match the routing in Sidebar.tsx
    if (key === 's21-decimal-c-plan') return '/c-plan';
    if (key.startsWith('introduction')) return '/concepts/introduction';
    if (key.startsWith('representation')) return '/concepts/representation';
    if (key.startsWith('file_structure')) return '/files/structure';
    if (key.startsWith('comparison_operators')) return '/comparison/operators';
    if (key.startsWith('bitwise_operations')) return '/bitwise/operations';
    if (key.startsWith('arithmetic_operations')) return '/arithmetic-operations';
    if (key.startsWith('conversion_functions')) return '/conversion/functions';
    if (key.startsWith('other_functions')) return '/other/functions';
    if (key.startsWith('bankers_rounding')) return '/rounding/bankers';
    if (key.startsWith('overflow_handling')) return '/overflow/handling';
    // Add more mappings as needed
    return `/${key}`;
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<h1>Добро пожаловать в интерактивное руководство по s21_decimal!</h1>} />
          {Object.entries(allContentData).map(([key, data]) => {
            if ('type' in data && data.type === 'separator') return null; // Separators don't have routes
            const path = generateLinkPath(key);
            return (
              <Route
                key={key}
                path={path}
                element={<ContentPage contentItem={data} />} // wasmLoaded is always true now
              />
            );
          })}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
