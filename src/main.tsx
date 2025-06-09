import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store';
import { SettingsProvider } from './contexts/SettingsContext';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <SettingsProvider>
        <App />
        <Toaster position="top-right" />
      </SettingsProvider>
    </Provider>
  </StrictMode>
);
