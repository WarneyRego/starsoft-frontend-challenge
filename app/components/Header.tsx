"use client";

import Image from "next/image";
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme } from "../../lib/theme/theme";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { setCartOpen } from "../../lib/redux/slices/cartSlice";

const HeaderContainer = styled.header`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.21);
  background-color: transparent;

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

export default function Header() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <HeaderContainer>
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
