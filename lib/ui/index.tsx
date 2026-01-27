// Barrel export - re-exporta todos os componentes de UI de um único lugar
export * from "./containers";
export * from "./cards";
export * from "./buttons";
export * from "./price";
export * from "./links";
export * from "./inputs";
export * from "./overlay";

// Re-export typography components
export { Heading, Title, Subtitle, BodyText, Description } from "./typography";

// Re-export FeedbackText como motion component quando necessário
import { motion } from "framer-motion";
import styled from "styled-components";
import { theme } from "../theme/theme";

export const FeedbackText = styled(motion.span)<{ $size?: string }>`
  font-size: ${(props) => props.$size || "12px"};
  font-weight: 700;
  font-family: ${theme.fonts.primary};
`;
