"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "../../lib/theme/theme";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { setCartOpen } from "../../lib/redux/slices/cartSlice";

interface HeaderProps {
  $isHidden?: boolean;
}

interface HeaderContainerProps extends HeaderProps {
  $isFixed: boolean;
  $isVisible: boolean;
}

const HeaderContainer = styled(motion.header)<HeaderContainerProps>`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.21);
  background-color: ${theme.colors.darkGray};
  position: ${(props) => (props.$isFixed ? "fixed" : "relative")};
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  box-shadow: ${(props) =>
    props.$isFixed ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "none"};

  @media (max-width: 768px) {
    height: 70px;
    padding: 0 20px;
  }
`;

const LogoWrapper = styled(motion.div)`
  @media (max-width: 768px) {
    width: 120px;
    display: flex;
    align-items: center;
  }
`;

const CartButton = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const CartCount = styled.span`
  color: ${theme.colors.white};
  font-size: 18px;
  font-weight: 400;
  font-family: ${theme.fonts.primary};
`;

export default function Header({ $isHidden = false }: { $isHidden?: boolean }) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasItems = cartCount > 0;
  
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!hasItems || $isHidden) {
      setIsVisible(!$isHidden);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      if (currentScrollY < lastScrollY.current) {
        // Scrolling up - show header
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down and past threshold - hide header
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    // Use passive listener for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasItems, $isHidden]);

  return (
    <HeaderContainer
      $isFixed={hasItems}
      $isVisible={isVisible}
      $isHidden={$isHidden}
      initial={{ y: $isHidden ? -100 : 0 }}
      animate={{ 
        y: (hasItems && !isVisible) || $isHidden ? -100 : 0,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        duration: 0.3
      }}
      style={{
        position: hasItems ? "fixed" : "relative",
      }}
    >
      <LogoWrapper
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/images/icons/logo.svg"
          alt="Starsoft Logo"
          width={150}
          height={40}
          priority
          style={{ width: '100%', height: 'auto' }}
        />
      </LogoWrapper>
      <CartButton 
        onClick={() => dispatch(setCartOpen(true))}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/images/icons/shopcart.svg"
          alt="Shopping Cart"
          width={24}
          height={24}
        />
        <CartCount>{cartCount}</CartCount>
      </CartButton>
    </HeaderContainer>
  );
}
