"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt: string;
}

interface ElementRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type AnimationPhase = "idle" | "exiting" | "animating" | "entering" | "complete";

interface TransitionState {
  isTransitioning: boolean;
  phase: AnimationPhase;
  product: Product | null;
  sourceRects: {
    card: ElementRect | null;
    image: ElementRect | null;
    price: ElementRect | null;
    button: ElementRect | null;
  };
}

interface PageTransitionContextType {
  transitionState: TransitionState;
  startTransition: (
    product: Product,
    cardRef: HTMLElement,
    imageRef: HTMLElement,
    priceRef: HTMLElement,
    buttonRef: HTMLElement
  ) => void;
  endTransition: () => void;
  setPhase: (phase: AnimationPhase) => void;
}

const initialState: TransitionState = {
  isTransitioning: false,
  phase: "idle",
  product: null,
  sourceRects: {
    card: null,
    image: null,
    price: null,
    button: null,
  },
};

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [transitionState, setTransitionState] = useState<TransitionState>(initialState);

  const startTransition = useCallback(
    (
      product: Product,
      cardRef: HTMLElement,
      imageRef: HTMLElement,
      priceRef: HTMLElement,
      buttonRef: HTMLElement
    ) => {
      const cardRect = cardRef.getBoundingClientRect();
      const imageRect = imageRef.getBoundingClientRect();
      const priceRect = priceRef.getBoundingClientRect();
      const buttonRect = buttonRef.getBoundingClientRect();

      setTransitionState({
        isTransitioning: true,
        phase: "exiting",
        product,
        sourceRects: {
          card: {
            top: cardRect.top,
            left: cardRect.left,
            width: cardRect.width,
            height: cardRect.height,
          },
          image: {
            top: imageRect.top,
            left: imageRect.left,
            width: imageRect.width,
            height: imageRect.height,
          },
          price: {
            top: priceRect.top,
            left: priceRect.left,
            width: priceRect.width,
            height: priceRect.height,
          },
          button: {
            top: buttonRect.top,
            left: buttonRect.left,
            width: buttonRect.width,
            height: buttonRect.height,
          },
        },
      });
    },
    []
  );

  const setPhase = useCallback((phase: AnimationPhase) => {
    setTransitionState((prev) => ({ ...prev, phase }));
  }, []);

  const endTransition = useCallback(() => {
    setTransitionState(initialState);
  }, []);

  return (
    <PageTransitionContext.Provider
      value={{ transitionState, startTransition, endTransition, setPhase }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (context === undefined) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return context;
}
