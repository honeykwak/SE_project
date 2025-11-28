import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.headings.h4.weight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  /* Size Styles */
  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return css`
          height: 32px;
          padding: 0 ${theme.spacing.sm};
          font-size: 14px;
        `;
      case 'lg':
        return css`
          height: 48px;
          padding: 0 ${theme.spacing.xl};
          font-size: 16px;
        `;
      default: // md
        return css`
          height: 40px;
          padding: 0 ${theme.spacing.md};
          font-size: 16px;
        `;
    }
  }}

  /* Variant Styles */
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.neutral.gray600};
          color: ${theme.colors.neutral.white};
          &:hover {
            opacity: 0.9;
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border: 1px solid ${theme.colors.primary.main};
          color: ${theme.colors.primary.main};
          &:hover {
            background-color: ${theme.colors.primary.light};
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary.main};
          color: ${theme.colors.neutral.white};
          &:hover {
            background-color: ${theme.colors.primary.hover};
          }
        `;
    }
  }}

  /* Full Width */
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;

