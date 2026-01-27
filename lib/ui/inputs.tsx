import styled from "styled-components";
import { theme } from "../theme/theme";

export const Input = styled.input<{ $fullWidth?: boolean }>`
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  height: 48px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.default};
  padding: 0 16px;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.primary};
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${theme.colors.orange};
    background-color: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;
