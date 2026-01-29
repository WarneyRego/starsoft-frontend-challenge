"use client";

import { useState } from "react";
import Head from "next/head";
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
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const DetailsGrid = styled.div`
  display: flex;
  gap: 60px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

const BackLinkContainer = styled.div`
  width: 100%;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const ImageContainer = styled(ImageFrame)`
  flex: 1;
  border-radius: ${theme.borderRadius.large};
  padding: 40px;
  min-height: 400px;
  background-color: ${theme.colors.imageFrame};

  @media (max-width: 768px) {
    min-height: 280px;
    padding: 20px;
    width: 100%;
    border-radius: ${theme.borderRadius.default};
  }
`;

const InfoContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 20px;
  }
`;

const StyledHeading = styled(Heading)`
  @media (max-width: 768px) {
    font-size: 28px !important;
    line-height: 1.2;
  }
`;

const StyledDescription = styled(Description)`
  @media (max-width: 768px) {
    font-size: 16px !important;
    line-height: 1.6;
    opacity: 0.8;
  }
`;

const PriceTag = styled(PriceRow).attrs({
  $gap: "12px",
})`
  font-size: 32px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const ButtonsContainer = styled(FlexContainer)`
  max-width: 300px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    
    /* Hide the duplicate buttons in the main content area on mobile 
       if we want to only use the sticky ones, but it's better to keep 
       them and add the sticky one for convenience */
  }
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

  // Prepara URL da imagem para meta tags
  const getImageUrl = (image: string) => {
    if (image.startsWith('http')) return image;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${image}`;
    }
    return image;
  };

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
      <div style={{ 
        backgroundColor: theme.colors.darkGray,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.white,
        gap: '20px'
      }}>
        <Spinner src="/images/icons/spinner.svg" alt="Loading" width={48} height={48} />
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ 
        backgroundColor: theme.colors.darkGray,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.white,
        gap: '20px'
      }}>
        <h2>{error instanceof Error ? error.message : "Produto não encontrado"}</h2>
        <StyledLink href="/">← Voltar para a galeria</StyledLink>
      </div>
    );
  }

  return (
    <>
      {product && (
        <Head>
          <title>{`${product.name} - Starsoft Products`}</title>
          <meta name="description" content={product.description} />
          <meta property="og:title" content={`${product.name} - Starsoft Products`} />
          <meta property="og:description" content={product.description} />
          <meta property="og:image" content={getImageUrl(product.image)} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${product.name} - Starsoft Products`} />
          <meta name="twitter:description" content={product.description} />
          <meta name="twitter:image" content={getImageUrl(product.image)} />
        </Head>
      )}
      <PageContainer>
        <Header />
      
      <Content
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1],
          staggerChildren: 0.1
        }}
      >
        <BackLinkContainer>
          <StyledLink href="/">
            ← Voltar para a galeria
          </StyledLink>
        </BackLinkContainer>

        <DetailsGrid>
          <ImageContainer
            variants={{
              initial: { opacity: 0, scale: 0.9, x: -20 },
              animate: { opacity: 1, scale: 1, x: 0 }
            }}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              style={{ 
                objectFit: "contain",
                width: '100%',
                height: 'auto'
              }}
              priority
            />
          </ImageContainer>

          <InfoContainer
            variants={{
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 }
            }}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StyledHeading $size="48px" $weight={700}>{product.name}</StyledHeading>
            <PriceTag>
              <EthIcon $size="32px">
                <Image src="/images/icons/eth.png" alt="ETH" fill style={{ objectFit: "contain" }} />
              </EthIcon>
              <PriceText $size="32px">{parseFloat(product.price).toFixed(0)} ETH</PriceText>
            </PriceTag>
            <StyledDescription $size="18px" $lineHeight="1.8">{product.description}</StyledDescription>
            
            <ButtonsContainer $direction="column" $gap="16px">
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
            </ButtonsContainer>
          </InfoContainer>
        </DetailsGrid>
      </Content>

      <CartOverlay />
    </PageContainer>
    </>
  );
}
