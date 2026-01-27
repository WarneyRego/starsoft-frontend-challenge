"use client";

import Image from "next/image";
import styled from "styled-components";
import { motion, Variants } from "framer-motion";
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
  variants?: Variants;
}

const PriceContainer = styled(FlexContainer).attrs({
  $direction: "column",
  $gap: "16px",
})``;

export default function ProductCard({ product, onAddToCart, onAddToCartWithoutOpening, variants }: ProductCardProps) {

  const formatPrice = (price: string) => {
    return parseFloat(price).toFixed(0);
  };

  return (
    <CardContainer
      $width="345px"
      $height="555px"
      style={{ cursor: 'default' }}
      variants={variants}
      whileHover={{  
        y: -10,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.3)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <ImageFrame
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
        </ImageFrame>
      </Link>

      <ContentContainer>
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Title $size="18px">{product.name}</Title>
        </Link>
        <Description $size="12px" $clamp={4}>
          {product.description}
        </Description>
      </ContentContainer>

      <PriceContainer>
        <PriceRow>
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
            $fullWidth
            onClick={() => onAddToCart(product)}
            whileHover={{ backgroundColor: "#FF9A3D", scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            COMPRAR
          </PrimaryButton>
        </FlexContainer>
      </PriceContainer>
    </CardContainer>
  );
}
