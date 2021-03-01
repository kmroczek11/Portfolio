import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context';
import { createBrowserHistory } from 'history';
import { Router, Route, } from 'react-router-dom';

declare global {
  interface Window {
    appHistory: any;
  }
}

const customHistory = createBrowserHistory({
  // basename: config.urlBasename || ""
});

ReactDOM.render(
  <React.StrictMode>
    <Router history={customHistory}>
      <Route
        component={({ history }) => {
          window.appHistory = history;
          return (
            <AppProvider>
              <App />
            </AppProvider>
          )
        }}
      />
    </Router>,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
