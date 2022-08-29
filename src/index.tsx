import React from 'react';
import {createRoot} from 'react-dom/client';
//import { ThemeProvider } from 'styled-components'
// eslint-disable-next-line import/no-extraneous-dependencies
import './styles/index.css'
import App from './App';
import Store from './Store';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme';
// import reportWebVitals from './reportWebVitals';
// import { lightTheme } from './theme'
 import { CssBaseline } from "./styles"
 import GlobalStyle from './styles/global';

/*
TODO rm and toggle on config for developmen
inspect({
  url: "https://statecharts.io/inspect",
  iframe: false
});
*/


let rootElement = document.getElementById('root');
if (rootElement === null) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
  <ThemeProvider theme={lightTheme}>
    <CssBaseline />
    <GlobalStyle />
    <Store>
      <App />
    </Store>
</ThemeProvider>
   </React.StrictMode>,
);




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
