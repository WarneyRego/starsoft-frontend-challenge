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
import {
  Backdrop,
  OverlayContainer,
  FlexContainer,
  IconButton,
  Title,
  Subtitle,
  Description,
  PriceRow,
  EthIcon,
  PriceText,
  PrimaryButton,
  ImageFrame,
} from "../../lib/ui";

const HeaderContainer = styled(FlexContainer).attrs({
  $gap: "24px",
  $align: "center",
})`
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
    gap: 16px;
  }
`;

const HeaderTitle = styled(Title).attrs({
  $size: "24px",
})`
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ItemsList = styled(motion.div)`
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 10px;

  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

const ItemCard = styled(motion.div)`
  background-color: ${theme.colors.imageFrame};
  border-radius: ${theme.borderRadius.large};
  padding: 16px;
  display: flex;
  gap: 16px;
  position: relative;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 12px;
  }
`;

const ItemImageContainer = styled(ImageFrame).attrs({
  $width: "100px",
  $height: "100px",
  $bgColor: theme.colors.navyBlue,
})`
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }
`;

const ItemDetails = styled(FlexContainer).attrs({
  $direction: "column",
  $gap: "4px",
})`
  flex: 1;
  min-width: 0;
`;

const ItemName = styled(Subtitle).attrs({
  $size: "16px",
})`
  @media (max-width: 768px) {
    font-size: 14px;
    padding-right: 24px; /* Space for remove button */
  }
`;

const ItemDescription = styled(Description).attrs({
  $size: "12px",
})`
  max-width: 180px;

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 11px;
    -webkit-line-clamp: 1;
  }
`;

const ItemPriceRow = styled(PriceRow)`
  margin-top: 4px;
`;

const ItemPrice = styled(PriceText).attrs({
  $size: "16px",
  $weight: 600,
})``;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.navyBlue};
  border-radius: ${theme.borderRadius.default};
  width: fit-content;
  margin-top: 8px;
  padding: 4px 8px;
  gap: 16px;

  @media (max-width: 768px) {
    margin-top: 4px;
    padding: 2px 6px;
    gap: 12px;
  }
`;

const QuantityButton = styled(motion.button)`
  color: ${theme.colors.white};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const QuantityText = styled.span`
  color: ${theme.colors.white};
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const RemoveButton = styled(motion.button)`
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

  @media (max-width: 768px) {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
  }
`;

const FooterContainer = styled.div`
  margin-top: 40px;
  @media (max-width: 768px) {
    margin-top: 20px;
  }
`;

const TotalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

const TotalLabel = styled.span`
  color: ${theme.colors.white};
  font-size: 24px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const TotalPriceContainer = styled(PriceRow).attrs({
  $gap: "12px",
})`
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const TotalPrice = styled(PriceText).attrs({
  $size: "28px",
})`
  @media (max-width: 768px) {
    font-size: 22px;
  }
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
            $maxWidth="480px"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <HeaderContainer>
              <IconButton 
                $size="48px"
                $bgColor={theme.colors.buttonGray}
                $round
                onClick={handleClose}
                whileHover={{ scale: 1.1, backgroundColor: "#444" }}
                whileTap={{ scale: 0.9 }}
              >
                <Image src="/images/icons/arrow.svg" alt="Voltar" width={24} height={24} />
              </IconButton>
              <HeaderTitle>Mochila de Compras</HeaderTitle>
            </HeaderContainer>

            <ItemsList layout>
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      textAlign: 'center', 
                      marginTop: '40px',
                      color: theme.colors.lightGray,
                      fontFamily: theme.fonts.primary
                    }}
                  >
                    Seu carrinho está vazio
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <ItemCard 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
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
                        <ItemPriceRow>
                          <EthIcon $size="20px">
                            <Image 
                              src="/images/icons/eth.png" 
                              alt="Ethereum Icon" 
                              fill
                              style={{ objectFit: "contain" }}
                            />
                          </EthIcon>
                          <ItemPrice>{parseFloat(item.price).toFixed(0)} ETH</ItemPrice>
                        </ItemPriceRow>

                        <QuantityContainer>
                          <QuantityButton 
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            -
                          </QuantityButton>
                          <QuantityText>{item.quantity}</QuantityText>
                          <QuantityButton 
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                          >
                            +
                          </QuantityButton>
                        </QuantityContainer>
                      </ItemDetails>

                      <RemoveButton 
                        onClick={() => handleRemove(item.id)}
                        whileHover={{ scale: 1.1, backgroundColor: "#FF9A3D" }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Image src="/images/icons/trash.svg" alt="Remover" width={18} height={18} />
                      </RemoveButton>
                    </ItemCard>
                  ))
                )}
              </AnimatePresence>
            </ItemsList>

            <FooterContainer>
              <TotalContainer>
                <TotalLabel>TOTAL</TotalLabel>
                <TotalPriceContainer>
                  <EthIcon $size="32px">
                    <Image 
                      src="/images/icons/eth.png" 
                      alt="Ethereum Icon" 
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </EthIcon>
                  <TotalPrice>{total.toFixed(0)} ETH</TotalPrice>
                </TotalPriceContainer>
              </TotalContainer>

              <PrimaryButton
                $size="large"
                $fullWidth
                whileHover={{ backgroundColor: "#FF9A3D", scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                FINALIZAR COMPRA
              </PrimaryButton>
            </FooterContainer>
          </OverlayContainer>
        </>
      )}
    </AnimatePresence>
  );
}
