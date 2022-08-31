import { createGlobalStyle } from 'styled-components';
import Pattern from '../images/pattern.png'

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'lato', 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  html {
    height: 100%;
  }
  #root {
    height: 100%;
  }
  body {
    height: 100%;
    color: #333333;
    background: white;

  }
`;

// background: white;
export default GlobalStyle;
