"use client";

import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "../../lib/theme/theme";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToCartWithoutOpening: (product: Product) => void;
}

const CardContainer = styled.div`
  width: 345px;
  height: 555px;
  background-color: ${theme.colors.navyBlue};
  border-radius: ${theme.borderRadius.default};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: ${theme.shadows.card};
  position: relative;
`;

const ImageFrame = styled.div`
  width: 296px;
  height: 258px;
  background-color: ${theme.colors.imageFrame};
  border-radius: ${theme.borderRadius.default};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const ProductTitle = styled.h2`
  color: ${theme.colors.white};
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  font-family: ${theme.fonts.primary};
`;

const ProductDescription = styled.p`
  color: ${theme.colors.lightGray};
  font-size: 12px;
  margin: 0;
  line-height: 1.6;
  font-family: ${theme.fonts.primary};
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EthIcon = styled.div`
  width: 24px;
  height: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceText = styled.p`
  color: ${theme.colors.white};
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  font-family: ${theme.fonts.primary};
`;

const BuyButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${theme.colors.orange};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.default};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: ${theme.fonts.primary};
  letter-spacing: 0.1em;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FF9A3D;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 134, 45, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: transparent;
  color: ${theme.colors.orange};
  border: 2px solid ${theme.colors.orange};
  border-radius: ${theme.borderRadius.default};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: ${theme.fonts.primary};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: ${theme.colors.orange};
    color: ${theme.colors.white};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 134, 45, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FeedbackText = styled(motion.span)`
  font-size: 12px;
  font-weight: 700;
`;

export default function ProductCard({ product, onAddToCart, onAddToCartWithoutOpening }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(0);
  };

  const handleAddToCart = () => {
    onAddToCartWithoutOpening(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <CardContainer>
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <ImageFrame>
          <Image
            src={product.image}
            alt={product.name}
            width={200}
            height={200}
            style={{ objectFit: "contain" }}
          />
        </ImageFrame>
      </Link>

      <ContentContainer>
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <ProductTitle>{product.name}</ProductTitle>
        </Link>
        <ProductDescription>
          Redesigned from scratch and completely revised.
        </ProductDescription>
      </ContentContainer>

      <PriceContainer>
        <PriceRow>
          <EthIcon>
            <Image 
              src="/images/icons/eth.png" 
              alt="Ethereum Icon" 
              fill
              style={{ objectFit: "contain" }}
            />
          </EthIcon>
          <PriceText>{formatPrice(product.price)} ETH</PriceText>
        </PriceRow>
        <BuyButton onClick={() => onAddToCart(product)}>
          COMPRAR
        </BuyButton>

      </PriceContainer>
    </CardContainer>
  );
}
