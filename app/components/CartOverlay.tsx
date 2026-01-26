"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styled from "styled-components";
import { theme } from "../../lib/theme/theme";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { 
  removeFromCart, 
  updateQuantity, 
  setCartOpen 
} from "../../lib/redux/slices/cartSlice";

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const OverlayContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background-color: ${theme.colors.navyBlue};
  box-shadow: ${theme.shadows.overlay};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 40px 30px;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 60px;
`;

const BackButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${theme.colors.buttonGray};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const HeaderTitle = styled.h2`
  color: ${theme.colors.white};
  font-size: 24px;
  font-weight: 600;
  font-family: ${theme.fonts.primary};
`;

const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 10px;
`;

const ItemCard = styled.div`
  background-color: ${theme.colors.imageFrame};
  border-radius: ${theme.borderRadius.large};
  padding: 16px;
  display: flex;
  gap: 16px;
  position: relative;
`;

const ItemImageContainer = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${theme.colors.navyBlue};
  border-radius: ${theme.borderRadius.default};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemName = styled.h3`
  color: ${theme.colors.white};
  font-size: 16px;
  margin: 0;
`;

const ItemDescription = styled.p`
  color: ${theme.colors.lightGray};
  font-size: 12px;
  margin: 0;
  max-width: 180px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const SmallEthIcon = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemPrice = styled.span`
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: 600;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.navyBlue};
  border-radius: ${theme.borderRadius.default};
  width: fit-content;
  margin-top: 8px;
  padding: 4px 8px;
  gap: 16px;
`;

const QuantityButton = styled.button`
  color: ${theme.colors.white};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

const QuantityText = styled.span`
  color: ${theme.colors.white};
`;

const RemoveButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${theme.colors.orange};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  align-self: flex-end;
`;

const FooterContainer = styled.div`
  margin-top: 40px;
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const TotalLabel = styled.span`
  color: ${theme.colors.white};
  font-size: 24px;
  font-weight: 700;
`;

const TotalPriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LargeEthIcon = styled.div`
  width: 32px;
  height: 32px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TotalPrice = styled.span`
  color: ${theme.colors.white};
  font-size: 28px;
  font-weight: 700;
`;

const CheckoutButton = styled.button`
  width: 100%;
  height: 64px;
  background-color: ${theme.colors.orange};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.large};
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  font-family: ${theme.fonts.primary};
`;

export default function CartOverlay() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const isOpen = useAppSelector((state) => state.cart.isOpen);

  const total = items.reduce(
    (acc, item) => acc + parseFloat(item.price) * item.quantity,
    0
  );

  const handleClose = () => dispatch(setCartOpen(false));
  const handleRemove = (id: number) => dispatch(removeFromCart(id));
  const handleUpdateQuantity = (id: number, delta: number) => 
    dispatch(updateQuantity({ id, delta }));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <OverlayContainer
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <HeaderContainer>
              <BackButton onClick={handleClose}>
                <Image src="/images/icons/arrow.svg" alt="Voltar" width={24} height={24} />
              </BackButton>
              <HeaderTitle>Mochila de Compras</HeaderTitle>
            </HeaderContainer>

            <ItemsList>
              {items.map((item) => (
                <ItemCard key={item.id}>
                  <ItemImageContainer>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ objectFit: "contain" }}
                    />
                  </ItemImageContainer>

                  <ItemDetails>
                    <ItemName>{item.name}</ItemName>
                    <ItemDescription>
                      {item.description.length > 50
                        ? item.description.substring(0, 50) + "..."
                        : item.description}
                    </ItemDescription>
                    <PriceRow>
                      <SmallEthIcon>
                        <Image 
                          src="/images/icons/eth.png" 
                          alt="Ethereum Icon" 
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </SmallEthIcon>
                      <ItemPrice>{parseFloat(item.price).toFixed(0)} ETH</ItemPrice>
                    </PriceRow>

                    <QuantityContainer>
                      <QuantityButton onClick={() => handleUpdateQuantity(item.id, -1)}>
                        -
                      </QuantityButton>
                      <QuantityText>{item.quantity}</QuantityText>
                      <QuantityButton onClick={() => handleUpdateQuantity(item.id, 1)}>
                        +
                      </QuantityButton>
                    </QuantityContainer>
                  </ItemDetails>

                  <RemoveButton onClick={() => handleRemove(item.id)}>
                    <Image src="/images/icons/trash.svg" alt="Remover" width={18} height={18} />
                  </RemoveButton>
                </ItemCard>
              ))}
            </ItemsList>

            <FooterContainer>
              <TotalContainer>
                <TotalLabel>TOTAL</TotalLabel>
                <TotalPriceContainer>
                  <LargeEthIcon>
                    <Image 
                      src="/images/icons/eth.png" 
                      alt="Ethereum Icon" 
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </LargeEthIcon>
                  <TotalPrice>{total.toFixed(0)} ETH</TotalPrice>
                </TotalPriceContainer>
              </TotalContainer>

              <CheckoutButton>FINALIZAR COMPRA</CheckoutButton>
            </FooterContainer>
          </OverlayContainer>
        </>
      )}
    </AnimatePresence>
  );
}
