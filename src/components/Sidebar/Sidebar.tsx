import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { allContentData } from '../../data';

const Sidebar: React.FC = () => {
  const generateLinkPath = (key: string) => {
    // This logic needs to match the routing in App.tsx
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
    <aside className={styles.sidebar}>
      <nav>
        <ul>
          <li><NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : ''}>Главная</NavLink></li>
          {Object.entries(allContentData).map(([key, data]) => {
            if ('type' in data && data.type === 'separator') {
              return <li key={key} className={styles.separator}>{data.title}</li>;
            } else {
              const path = generateLinkPath(key);
              return (
                <li key={key}>
                  <NavLink
                    to={path}
                    className={({ isActive }) => isActive ? styles.activeLink : ''}
                  >
                    {data.title}
                  </NavLink>
                </li>
              );
            }
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
