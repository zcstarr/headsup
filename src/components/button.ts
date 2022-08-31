import styled from 'styled-components';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

import { ThemeProp } from './types';

const Button = styled.div`
  border: none;
  cursor: pointer;
`;

export const CommonButton = styled(Button)`
  font-size: 1.3rem;
  font-family: eurostile, sans-serif;
  font-weight: 800;
  font-style: normal;
  width: 220px;
  height: 100px;
  border-radius: 16px;
  border-style: solid;
  :hover {
    opacity: 0.6;
  }
  border-radius: 16px;
  border-style: solid;
  border-color: ${({ theme }: ThemeProp) => theme.colors.black};
  color: ${({ theme }: ThemeProp) => theme.colors.black};
  border-width: 4px;

  ${({ theme }: ThemeProp) => theme.base.mediaQueries.sm} {
    border-width: 5px;
  }
`;
export const CommonRoundedButton = styled(Button)`
  color: ${({ theme }: ThemeProp) => theme.colors.black};
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-color: ${({ theme }: ThemeProp) => theme.colors.blue};
  font-size: 1.3rem;
  width: 220px;
  height: 75px;
  border-radius: 10px;
  border-style: solid;
  border-width: 2px;
  align-items: center;
  align-text: center;
  ${({ theme }: ThemeProp) => theme.base.mediaQueries.sm} {
    border-width: 5px;
  }
`;

export const CommonSquareButton = styled.button`
  color: ${({ theme }: ThemeProp) => theme.colors.black};
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-color: ${({ theme }: ThemeProp) => theme.colors.primary};
  font-size: 1.3rem;
  padding: 20px;
  width: 150px;
  border-style: solid;
  border-width: 1px;
  align-items: center;
  align-text: center;

`;
export const CommonExtraRoundButton = styled(CommonRoundedButton)`
  border-radius: 40px;
  border-color: ${({ theme }: ThemeProp) => theme.colors.primary};
  :hover {
    opacity: 0.6;
  }
  border-width: 4px;
  color: ${({ theme }: ThemeProp) => theme.colors.black};
  ${({ theme }: ThemeProp) => theme.base.mediaQueries.sm} {
    border-width: 5px;
  }
`;

export default CommonButton;
