"use client";

import { useState, useEffect, useRef } from "react";
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
import { usePageTransition } from "../../../lib/providers/PageTransitionContext";
import {
  PageContainer,
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

const BackLinkContainer = styled(motion.div)`
  width: 100%;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const ImageContainer = styled(motion.div)`
  flex: 1;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.imageFrame};
  border-radius: ${theme.borderRadius.large};
  padding: 20px;

  @media (max-width: 768px) {
    min-height: 280px;
    width: 100%;
  }
`;

const InfoContainer = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 20px;
  }
`;

const ProductTitle = styled(motion.h1)`
  font-size: 48px;
  font-weight: 700;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.primary};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ProductDescription = styled(motion.p)`
  font-size: 18px;
  line-height: 1.8;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.secondary};
  margin: 0;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 16px;
    line-height: 1.6;
  }
`;

const PriceTag = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 300px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const Spinner = styled(Image)`
  filter: invert(100%);
`;

export default function ProductDetailsClient({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const { transitionState, setPhase } = usePageTransition();
  const { phase } = transitionState;
  const initialPhaseRef = useRef(phase);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isFromTransition = initialPhaseRef.current === "entering";
    
    if (isFromTransition) {
      const timer = setTimeout(() => {
        setIsReady(true);
        setPhase("complete");
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [setPhase]);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const baseUrl = typeof window !== 'undefined' ? '' : `http://localhost:${process.env.PORT || 3000}`;
      const res = await fetch(`${baseUrl}/api/products/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao buscar produto");
      }
      return res.json();
    },
  });

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

  const displayProduct = product || transitionState.product;

  if (isLoading && !displayProduct) {
    return (
      <PageContainer>
        <Header />
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.white,
          gap: '20px',
          minHeight: '60vh'
        }}>
          <Spinner src="/images/icons/spinner.svg" alt="Loading" width={48} height={48} />
          <p>Carregando detalhes...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !displayProduct) {
    return (
      <PageContainer>
        <Header />
        <div style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.colors.white,
          gap: '20px',
          minHeight: '60vh'
        }}>
          <h2>{error instanceof Error ? error.message : "Produto não encontrado"}</h2>
          <StyledLink href="/">← Voltar para a galeria</StyledLink>
        </div>
      </PageContainer>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <Head>
        <title>{`${displayProduct.name} - Starsoft Products`}</title>
        <meta name="description" content={displayProduct.description} />
        <meta property="og:title" content={`${displayProduct.name} - Starsoft Products`} />
        <meta property="og:description" content={displayProduct.description} />
        <meta property="og:image" content={getImageUrl(displayProduct.image)} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${displayProduct.name} - Starsoft Products`} />
        <meta name="twitter:description" content={displayProduct.description} />
        <meta name="twitter:image" content={getImageUrl(displayProduct.image)} />
      </Head>

      <PageContainer>
        <Header />
        
        <Content
          variants={containerVariants}
          initial="hidden"
          animate={isReady ? "visible" : "hidden"}
        >
          <BackLinkContainer variants={itemVariants}>
            <StyledLink href="/">
              ← Voltar para a galeria
            </StyledLink>
          </BackLinkContainer>

          <DetailsGrid>
            <ImageContainer variants={imageVariants}>
              <Image
                src={displayProduct.image}
                alt={displayProduct.name}
                width={500}
                height={500}
                style={{ 
                  objectFit: "contain",
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px'
                }}
                priority
              />
            </ImageContainer>

            <InfoContainer
              variants={containerVariants}
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
            >
              <ProductTitle variants={itemVariants}>
                {displayProduct.name}
              </ProductTitle>

              <PriceTag variants={itemVariants}>
                <EthIcon $size="32px">
                  <Image src="/images/icons/eth.png" alt="ETH" fill style={{ objectFit: "contain" }} />
                </EthIcon>
                <PriceText $size="32px">{parseFloat(displayProduct.price).toFixed(0)} ETH</PriceText>
              </PriceTag>

              <ProductDescription variants={itemVariants}>
                {displayProduct.description}
              </ProductDescription>
              
              <ButtonsContainer variants={itemVariants}>
                <SecondaryButton 
                  $size="large"
                  $fullWidth
                  onClick={handleAddToCart}
                  style={{ 
                    backgroundColor: "#4A4A4A",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 600
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: "#5A5A5A" }}
                  whileTap={{ scale: 0.98 }}
                >
                  COMPRAR
                </SecondaryButton>

                <PrimaryButton 
                  $size="large"
                  $fullWidth
                  onClick={handleAddToCartWithoutOpening}
                  animate={isAdded ? { backgroundColor: "#22C55E" } : {}}
                  transition={{ duration: 0.3 }}
                  whileHover={!isAdded ? { scale: 1.02, backgroundColor: "#FF9A3D" } : {}}
                  whileTap={!isAdded ? { scale: 0.98 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        ADICIONADO AO CARRINHO
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ADICIONAR AO CARRINHO
                      </motion.span>
                    )}
                  </AnimatePresence>
                </PrimaryButton>
              </ButtonsContainer>
            </InfoContainer>
          </DetailsGrid>
        </Content>

        <CartOverlay />
      </PageContainer>
    </>
  );
}
