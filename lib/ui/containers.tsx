import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "../theme/theme";

export const PageContainer = styled.div`
  background-color: ${theme.colors.darkGray};
  min-height: 100vh;
  color: ${theme.colors.white};
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

export const FlexContainer = styled.div<{ 
  $direction?: "row" | "column"; 
  $gap?: string; 
  $align?: string; 
  $justify?: string 
}>`
  display: flex;
  flex-direction: ${(props) => props.$direction || "row"};
  gap: ${(props) => props.$gap || "0"};
  align-items: ${(props) => props.$align || "stretch"};
  justify-content: ${(props) => props.$justify || "flex-start"};
`;

export const LoadingContainer = styled.div`
  background-color: ${theme.colors.darkGray};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  gap: 20px;
`;
