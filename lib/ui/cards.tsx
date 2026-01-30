import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "../theme/theme";

export const CardContainer = styled(motion.div)<{ 
  $width?: string; 
  $height?: string; 
  $padding?: string 
}>`
  width: ${(props) => props.$width || "auto"};
  height: ${(props) => props.$height || "auto"};
  background-color: ${theme.colors.navyBlue};
  border-radius: ${theme.borderRadius.default};
  padding: ${(props) => props.$padding || "24px"};
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: ${theme.shadows.card};
  position: relative;
`;

export const ImageFrame = styled(motion.div)<{ 
  $width?: string; 
  $height?: string; 
  $bgColor?: string 
}>`
  width: ${(props) => props.$width || "100%"};
  height: ${(props) => props.$height || "auto"};
  background-color: ${(props) => props.$bgColor || theme.colors.imageFrame};
  border-radius: ${theme.borderRadius.default};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    border-radius: inherit !important;
  }
`;
