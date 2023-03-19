import styled, { createGlobalStyle } from 'styled-components';
import Canvas from './canvas/canvas';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;

  }
`;

const StyledApp = styled.div``;

export function App() {
  return (
    <StyledApp>
      <GlobalStyle />
      <Canvas />
    </StyledApp>
  );
}

export default App;
