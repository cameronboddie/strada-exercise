import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import App from './App.tsx';
import AppTheme from './shared-theme/AppTheme.tsx';
import { store } from './app/store.ts';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppTheme themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme>
          <App />
        </CssBaseline>
      </AppTheme>
    </Provider>
  </StrictMode>,
);
