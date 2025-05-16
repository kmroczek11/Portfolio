import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './main/App';
import { AppProvider } from './context';
import './internationalization/i18n'

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);  // Note the non-null assertion (!) if using TypeScript

root.render(
  <React.StrictMode>
    <AppProvider>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </AppProvider>
  </React.StrictMode>
);