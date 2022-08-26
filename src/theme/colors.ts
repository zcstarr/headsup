export interface BaseColors {
  black: string;
  blue: string;
  gray: string;
  primary: string;
  secondary: string;
  tertiary: string;
  success: string;
  hover: string;
  successSecondary: string;
  failure: string;
  info: string;
}

export interface Colors extends BaseColors {
  text: string;
  secondaryText: string;
  button: string;
  background: string;
}

const colors = {
  primary: '#DA1DD8',
  black: '#393939',
  blue: '#00BFFF',
  gray: '#f2f2f2',
  secondary: '#BD38F4',
  tertiary: '#C1FF5E',
  success: '#3DFCFC',
  hover: '#d019cf',
  successSecondary: '#569d9d',
  failure: '#F4FF4D',
  info: '#78FFFF',
};

export const lightColors: Colors = {
  ...colors,
  text: '#333333',
  secondaryText: 'white',
  background: 'white',
  button: '#C1FF5E',
};
