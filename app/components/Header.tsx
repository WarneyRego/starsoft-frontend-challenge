"use client";

import Image from "next/image";
import styled from "styled-components";
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
`;

const CartButton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
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
      <div>
        <Image
          src="/images/icons/logo.svg"
          alt="Starsoft Logo"
          width={150}
          height={40}
          priority
        />
      </div>
      <CartButton onClick={() => dispatch(setCartOpen(true))}>
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
