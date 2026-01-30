"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import styled from "styled-components";
import { Variants } from "framer-motion";
import { theme } from "../../lib/theme/theme";
import {
  CardContainer,
  ImageFrame,
  ContentContainer,
  Title,
  Description,
  FlexContainer,
  PriceRow,
  EthIcon,
  PriceText,
  PrimaryButton,
} from "../../lib/ui";
import { usePageTransition } from "../../lib/providers/PageTransitionContext";

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
  variants?: Variants;
}

const PriceContainer = styled(FlexContainer).attrs({
  $direction: "column",
  $gap: "16px",
})``;

const StyledCardContainer = styled(CardContainer)`
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    min-height: 500px;
    padding: 16px;
  }
`;

const StyledImageFrame = styled(ImageFrame)`
  background-color: transparent;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

export default function ProductCard({ product, onAddToCart, variants }: ProductCardProps) {
  const { startTransition } = usePageTransition();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(0);
  };

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    if (cardRef.current && imageRef.current && priceRef.current && buttonRef.current) {
      startTransition(
        product,
        cardRef.current,
        imageRef.current,
        priceRef.current,
        buttonRef.current
      );
    }
  }, [product, startTransition]);

  return (
    <StyledCardContainer
      ref={cardRef}
      $width="345px"
      $height="555px"
      style={{ cursor: 'pointer' }}
      variants={variants}
      onClick={handleCardClick}
      whileHover={{  
        y: -10,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <StyledImageFrame
        ref={imageRef}
        $width="296px"
        $height="258px"
        style={{ alignSelf: 'center' }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ 
            objectFit: "cover",
            borderRadius: theme.borderRadius.default
          }}
        />
      </StyledImageFrame>

      <ContentContainer>
        <Title $size="18px" $weight={500}>{product.name}</Title>
        <Description $size="12px" $clamp={4}>
          {product.description}
        </Description>
      </ContentContainer>

      <PriceContainer>
        <PriceRow ref={priceRef}>
          <EthIcon $size="24px">
            <Image 
              src="/images/icons/eth.png" 
              alt="Ethereum Icon" 
              fill
              style={{ objectFit: "contain" }}
            />
          </EthIcon>
          <PriceText $size="20px">{formatPrice(product.price)} ETH</PriceText>
        </PriceRow>
        
        <FlexContainer $direction="column" $gap="12px">
          <PrimaryButton 
            ref={buttonRef}
            $fullWidth
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            whileHover={{ backgroundColor: "#FF9A3D", scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            COMPRAR
          </PrimaryButton>
        </FlexContainer>
      </PriceContainer>
    </StyledCardContainer>
  );
}
