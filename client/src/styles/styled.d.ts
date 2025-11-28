import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        main: string;
        hover: string;
        light: string;
      };
      neutral: {
        black: string;
        white: string;
        gray600: string;
        border: string;
        background: string;
      };
      status: {
        success: string;
        error: string;
      };
    };
    typography: {
      fontFamily: string;
      headings: {
        h1: { size: string; weight: number; lineHeight: string };
        h2: { size: string; weight: number; lineHeight: string };
        h3: { size: string; weight: number; lineHeight: string };
        h4: { size: string; weight: number; lineHeight: string };
        h5: { size: string; weight: number; lineHeight: string };
      };
      body: {
        c3: { size: string; weight: number; lineHeight: string };
        c4: { size: string; weight: number; lineHeight: string };
        c4l: { size: string; weight: number; lineHeight: string };
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  }
}
