export const theme = {
  colors: {
    orange: "#FF8310",
    darkGray: "#232323",
    navyBlue: "#191A20",
    mediumGray: "#393939",
    lightGray: "#CCCCCC",
    white: "#FFFFFF",
    imageFrame: "#22232C",
    buttonGray: "#373737",
    ethBlue: "#5D6AE1",
  },
  fonts: {
    primary: "'Poppins', sans-serif",
  },
  borderRadius: {
    default: "8px",
    large: "12px",
  },
  shadows: {
    card: "0px 1px 2px 0px rgba(0, 0, 0, 0.10)",
    overlay: "-10px 0px 30px rgba(0, 0, 0, 0.5)",
  },
};

export type Theme = typeof theme;
