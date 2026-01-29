import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "../theme/theme";

export const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const OverlayContainer = styled(motion.div)<{ $maxWidth?: string }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: ${(props) => props.$maxWidth || "480px"};
  height: 100vh;
  background-color: ${theme.colors.navyBlue};
  box-shadow: ${theme.shadows.overlay};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 40px 30px;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 20px 15px;
  }
`;
