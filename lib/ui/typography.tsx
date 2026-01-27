import styled from "styled-components";
import { theme } from "../theme/theme";

export const Heading = styled.h1<{ 
  $size?: string; 
  $weight?: number; 
  $color?: string 
}>`
  color: ${(props) => props.$color || theme.colors.white};
  font-size: ${(props) => props.$size || "18px"};
  font-weight: ${(props) => props.$weight || 600};
  margin: 0;
  font-family: ${theme.fonts.primary};
`;

export const Title = styled(Heading).attrs({ as: "h2" })``;

export const Subtitle = styled(Heading).attrs({ as: "h3" })``;

export const BodyText = styled.p<{ 
  $size?: string; 
  $color?: string; 
  $lineHeight?: string; 
  $clamp?: number 
}>`
  color: ${(props) => props.$color || theme.colors.lightGray};
  font-size: ${(props) => props.$size || "14px"};
  line-height: ${(props) => props.$lineHeight || "1.6"};
  margin: 0;
  font-family: ${theme.fonts.primary};
  ${(props) =>
    props.$clamp
      ? `
    display: -webkit-box;
    -webkit-line-clamp: ${props.$clamp};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: calc(${props.$lineHeight || "1.6em"} * ${props.$clamp});
  `
      : ""}
`;

export const Description = styled(BodyText)``;

export const FeedbackText = styled.span<{ $size?: string }>`
  font-size: ${(props) => props.$size || "12px"};
  font-weight: 700;
  font-family: ${theme.fonts.primary};
`;
