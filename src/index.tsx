import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './main/App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context';
import './internationalization/i18n';

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </AppProvider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
