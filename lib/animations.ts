import { Variants } from "framer-motion";

// Easing functions - typed as tuples for Framer Motion
export const smoothEasing: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
export const bounceEasing: [number, number, number, number] = [0.68, -0.55, 0.265, 1.55];
export const snapEasing: [number, number, number, number] = [0.87, 0, 0.13, 1];

export const overlayVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { 
    opacity: 1,
    backdropFilter: "blur(12px)",
    transition: { 
      duration: 0.4, 
      ease: smoothEasing 
    }
  },
  exit: { 
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: { 
      duration: 0.3, 
      ease: smoothEasing 
    }
  }
};

export const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { 
      type: "spring", 
      damping: 30, 
      stiffness: 300,
      mass: 0.8
    }
  },
  exit: { 
    x: "100%",
    transition: { 
      type: "spring", 
      damping: 30, 
      stiffness: 300 
    }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 200 
    }
  }
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: smoothEasing 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { 
      duration: 0.3,
      ease: smoothEasing 
    }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      damping: 20, 
      stiffness: 300 
    }
  }
};

export const itemSlideIn: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 300 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  }
};

// Transições para shared elements (layoutId)
export const sharedElementTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export const sharedElementTransitionFast = {
  type: "spring" as const,
  stiffness: 400,
  damping: 35,
  mass: 0.6,
};

// Variantes para cards
export const cardHover = {
  y: -10,
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)",
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20
  }
};

export const cardTap = {
  scale: 0.98
};
