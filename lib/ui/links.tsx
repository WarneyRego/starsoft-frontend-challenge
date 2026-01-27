import styled from "styled-components";
import Link from "next/link";
import { theme } from "../theme/theme";

export const StyledLink = styled(Link)<{ 
  $color?: string; 
  $hoverColor?: string 
}>`
  color: ${(props) => props.$color || theme.colors.lightGray};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${theme.fonts.primary};
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.$hoverColor || theme.colors.white};
  }
`;
