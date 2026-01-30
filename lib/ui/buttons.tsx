import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "../theme/theme";

interface ButtonProps {
  $variant?: "primary" | "secondary" | "outline";
  $size?: "small" | "medium" | "large";
  $fullWidth?: boolean;
}

const getButtonHeight = (size?: string) => {
  switch (size) {
    case "small":
      return "40px";
    case "large":
      return "64px";
    default:
      return "48px";
  }
};

const getButtonFontSize = (size?: string) => {
  switch (size) {
    case "small":
      return "12px";
    case "large":
      return "18px";
    default:
      return "14px";
  }
};

const getButtonStyles = (variant?: string) => {
  switch (variant) {
    case "secondary":
      return `
        background-color: transparent;
        color: ${theme.colors.orange};
        border: 2px solid ${theme.colors.orange};
      `;
    case "outline":
      return `
        background-color: transparent;
        color: ${theme.colors.white};
        border: 1px solid rgba(255, 255, 255, 0.1);
      `;
    default:
      return `
        background-color: ${theme.colors.orange};
        color: ${theme.colors.white};
        border: none;
      `;
  }
};

export const Button = styled(motion.button)<ButtonProps>`
  width: ${(props) => (props.$fullWidth ? "100%" : "auto")};
  height: ${(props) => getButtonHeight(props.$size)};
  ${(props) => getButtonStyles(props.$variant)};
  border-radius: ${theme.borderRadius.default};
  font-size: ${(props) => getButtonFontSize(props.$size)};
  font-weight: ${(props) => {
    if (props.$variant === "primary") return 600;
    if (props.$variant === "secondary") return 600;
    return 700;
  }};
  cursor: pointer;
  font-family: ${theme.fonts.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  ${(props) => (props.$variant === "primary" ? "letter-spacing: 0.1em;" : "")}
`;

export const PrimaryButton = styled(Button).attrs({ $variant: "primary" })``;

export const SecondaryButton = styled(Button).attrs({ $variant: "secondary" })``;

export const IconButton = styled(motion.button)<{ 
  $size?: string; 
  $bgColor?: string; 
  $round?: boolean 
}>`
  width: ${(props) => props.$size || "48px"};
  height: ${(props) => props.$size || "48px"};
  background-color: ${(props) => props.$bgColor || theme.colors.buttonGray};
  border: none;
  border-radius: ${(props) => (props.$round ? "50%" : theme.borderRadius.default)};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
`;
