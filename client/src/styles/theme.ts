import type { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: {
      main: '#417DFF',
      hover: '#1572B8',
      light: '#E8F4FC',
    },
    neutral: {
      black: '#181818',
      white: '#FFFFFF',
      gray600: '#777777',
      border: '#E0E0E0',
      background: '#F8F9FA',
    },
    status: {
      success: '#44BBA1',
      error: '#E15651',
    },
  },
  typography: {
    fontFamily: "'Noto Sans CJK KR', sans-serif",
    headings: {
      h1: { size: '32px', weight: 700, lineHeight: '47px' },
      h2: { size: '24px', weight: 700, lineHeight: '36px' },
      h3: { size: '20px', weight: 700, lineHeight: '30px' },
      h4: { size: '16px', weight: 700, lineHeight: '24px' },
      h5: { size: '12px', weight: 700, lineHeight: '18px' },
    },
    body: {
      c3: { size: '20px', weight: 400, lineHeight: '30px' },
      c4: { size: '16px', weight: 400, lineHeight: '24px' },
      c4l: { size: '16px', weight: 300, lineHeight: '24px' },
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '20px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '20px',
  },
};
