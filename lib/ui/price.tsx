import styled from "styled-components";
import { theme } from "../theme/theme";

export const PriceRow = styled.div<{ 
  $gap?: string; 
  $align?: string 
}>`
  display: flex;
  align-items: ${(props) => props.$align || "center"};
  gap: ${(props) => props.$gap || "8px"};
`;

export const EthIcon = styled.div<{ $size?: string }>`
  width: ${(props) => props.$size || "24px"};
  height: ${(props) => props.$size || "24px"};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PriceText = styled.span<{ 
  $size?: string; 
  $weight?: number 
}>`
  color: ${theme.colors.white};
  font-size: ${(props) => props.$size || "20px"};
  font-weight: ${(props) => props.$weight || 700};
  font-family: ${theme.fonts.primary};
`;
