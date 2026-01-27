"use client";

import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "../../../lib/theme/theme";
import Header from "../../components/Header";
import dynamic from "next/dynamic";
import { useAppDispatch } from "../../../lib/redux/hooks";
import { addToCart, setCartOpen } from "../../../lib/redux/slices/cartSlice";
import { useQuery } from "@tanstack/react-query";
import {
  PageContainer,
  FlexContainer,
  ImageFrame,
  Heading,
  Description,
  PriceRow,
  EthIcon,
  PriceText,
  PrimaryButton,
  SecondaryButton,
  FeedbackText,
  LoadingContainer,
  StyledLink,
} from "../../../lib/ui";

const CartOverlay = dynamic(() => import("../../components/CartOverlay"), {
  ssr: false,
});

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt: string;
}

const Content = styled(motion.main)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  display: flex;
  gap: 60px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageContainer = styled(ImageFrame)`
  flex: 1;
  border-radius: ${theme.borderRadius.large};
  padding: 40px;
  min-height: 400px;
`;

const InfoContainer = styled(FlexContainer).attrs({
  $direction: "column",
  $gap: "32px",
})`
  flex: 1;
`;

const PriceTag = styled(PriceRow).attrs({
  $gap: "12px",
})`
  font-size: 32px;
  font-weight: 700;
`;

const Spinner = styled(Image)`
  filter: invert(100%);
`;

export default function ProductDetailsClient({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const [isAdded, setIsAdded] = useState(false);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      // Usamos a URL absoluta do servidor durante a renderização no lado do servidor
      const baseUrl = typeof window !== 'undefined' ? '' : `http://localhost:${process.env.PORT || 3000}`;
      const res = await fetch(`${baseUrl}/api/products/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao buscar produto");
      }
      return res.json();
    },
  });

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      dispatch(setCartOpen(true));
    }
  };

  const handleAddToCartWithoutOpening = () => {
    if (product) {
      dispatch(addToCart(product));
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner src="/images/icons/spinner.svg" alt="Loading" width={48} height={48} />
        <p>Carregando detalhes...</p>
      </LoadingContainer>
    );
  }

  if (error || !product) {
    return (
      <LoadingContainer>
        <h2>{error instanceof Error ? error.message : "Produto não encontrado"}</h2>
        <StyledLink href="/">← Voltar para a galeria</StyledLink>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <Header />
      
      <Content
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ImageContainer
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            style={{ objectFit: "contain" }}
            priority
          />
        </ImageContainer>

        <InfoContainer>
          <StyledLink href="/" style={{ marginBottom: '24px' }}>
            ← Voltar para a galeria
          </StyledLink>
          <Heading $size="48px" $weight={700}>{product.name}</Heading>
          <PriceTag>
            <EthIcon $size="32px">
              <Image src="/images/icons/eth.png" alt="ETH" fill style={{ objectFit: "contain" }} />
            </EthIcon>
            <PriceText $size="32px">{parseFloat(product.price).toFixed(0)} ETH</PriceText>
          </PriceTag>
          <Description $size="18px" $lineHeight="1.8">{product.description}</Description>
          
          <FlexContainer $direction="column" $gap="16px" style={{ maxWidth: '300px' }}>
            <PrimaryButton 
              $size="large"
              $fullWidth
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02, backgroundColor: "#FF9A3D" }}
              whileTap={{ scale: 0.98 }}
            >
              COMPRAR AGORA
            </PrimaryButton>

            <SecondaryButton 
              $size="large"
              $fullWidth
              onClick={handleAddToCartWithoutOpening}
              whileHover={{ backgroundColor: theme.colors.orange, color: theme.colors.white, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <FeedbackText
                    $size="16px"
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    ADICIONADO!
                  </FeedbackText>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    ADICIONAR AO CARRINHO
                  </motion.span>
                )}
              </AnimatePresence>
            </SecondaryButton>
          </FlexContainer>
        </InfoContainer>
      </Content>

      <CartOverlay />
    </PageContainer>
  );
}
