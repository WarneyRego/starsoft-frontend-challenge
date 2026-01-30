"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import Header from "./Header";
import dynamic from "next/dynamic";
import { theme } from "../../lib/theme/theme";
import { useAppDispatch } from "../../lib/redux/hooks";
import { addToCart, setCartOpen } from "../../lib/redux/slices/cartSlice";
import {
  PageContainer,
  PrimaryButton,
  SecondaryButton,
  FeedbackText,
} from "../../lib/ui";

const CartOverlay = dynamic(() => import("./CartOverlay"), {
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

interface ProductsResponse {
  products: Product[];
  count: number;
}

const MainContent = styled(motion.main)`
  padding: 40px;
  max-width: 1500px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const LoadingContainer = styled(motion.div)`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const Spinner = styled(Image)`
  filter: invert(100%);
`;

const LoadingText = styled.div`
  color: ${theme.colors.white};
  text-align: center;
  font-size: 18px;
  font-family: ${theme.fonts.primary};
  opacity: 0.8;
`;

const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 345px);
  gap: 24px;
  justify-content: center;

  @media (max-width: 1500px) {
    grid-template-columns: repeat(3, 345px);
  }

  @media (max-width: 1120px) {
    grid-template-columns: repeat(2, 345px);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const LoadMoreContainer = styled(motion.div)`
  margin-top: 60px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ProgressTrack = styled.div`
  width: 280px;
  height: 8px;
  background-color: #333333;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 345px;
  }
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background-color: ${theme.colors.orange};
  border-radius: 4px;
`;

const LoadMoreButton = styled(motion.button)<{ $disabled: boolean }>`
  width: 280px;
  height: 56px;
  background-color: ${theme.colors.mediumGray};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.default};
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  font-family: ${theme.fonts.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  transition: background-color 0.2s ease;
  opacity: ${(props) => (props.$disabled ? 0.8 : 1)};

  &:hover:not(:disabled) {
    background-color: #444444;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 345px;
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
`;

const Footer = styled(motion.footer)`
  width: 100%;
  padding: 40px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 40px;

  @media (max-width: 768px) {
    padding: 30px 20px;
    text-align: center;
  }
`;

const FooterText = styled.p`
  color: ${theme.colors.white};
  font-size: 14px;
  font-family: ${theme.fonts.secondary};
  font-weight: 400;
  opacity: 0.5;
  letter-spacing: 0.05em;
`;

const CardContainer = styled(motion.div)`
  width: 345px;
  height: 555px;
  background-color: ${theme.colors.navyBlue};
  border-radius: ${theme.borderRadius.default};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: ${theme.shadows.card};
  cursor: pointer;
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    min-height: 500px;
    padding: 16px;
  }
`;

const SharedImageContainer = styled(motion.div)`
  width: 296px;
  height: 258px;
  border-radius: 8px;
  background-color: transparent;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  align-self: center;

  img {
    border-radius: inherit !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const SharedTitle = styled(motion.h3)`
  color: ${theme.colors.white};
  font-size: 18px;
  font-weight: 500;
  font-family: ${theme.fonts.primary};
  margin: 0;
`;

const SharedDescription = styled(motion.p)`
  color: ${theme.colors.lightGray};
  font-size: 12px;
  font-family: ${theme.fonts.secondary};
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SharedButtonWrapper = styled(motion.div)`
  width: 100%;
`;

const SharedPriceRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EthIconStyled = styled.div<{ $size?: string }>`
  width: ${(props) => props.$size || "24px"};
  height: ${(props) => props.$size || "24px"};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceTextStyled = styled.span<{ $size?: string }>`
  color: ${theme.colors.white};
  font-size: ${(props) => props.$size || "20px"};
  font-weight: 700;
  font-family: ${theme.fonts.primary};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: ${theme.colors.darkGray};
  z-index: 100;
`;

const DetailContainer = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 101;
  overflow-y: auto;
  padding-top: 100px;

  @media (max-width: 768px) {
    padding-top: 70px;
  }
`;

const DetailContent = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const BackButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${theme.colors.white};
  font-size: 16px;
  font-family: ${theme.fonts.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  margin-bottom: 32px;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
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

const DetailImageWrapper = styled(motion.div)`
  flex: 1;
  max-width: 500px;
  aspect-ratio: 1;
  border-radius: 8px;
  background-color: ${theme.colors.imageFrame};
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
    aspect-ratio: 4/3;
  }
`;

const DetailInfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 20px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 20px;
    padding-top: 0;
  }
`;

const DetailTitle = styled(motion.h1)`
  font-size: 42px;
  font-weight: 700;
  color: ${theme.colors.white};
  font-family: ${theme.fonts.primary};
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const DetailPriceRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DetailDescription = styled(motion.p)`
  font-size: 16px;
  line-height: 1.8;
  color: ${theme.colors.lightGray};
  font-family: ${theme.fonts.secondary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.6;
  }
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 320px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const ROWS_PER_PAGE = 10;

const springTransition = {
  type: "spring" as const,
  stiffness: 350,
  damping: 35,
  mass: 1,
};

export default function DashboardProducts() {
  const dispatch = useAppDispatch();
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const sortBy = "name";
  const orderBy = "ASC";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["products", sortBy, orderBy],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/products?page=${pageParam}&rows=${ROWS_PER_PAGE}&sortBy=${sortBy}&orderBy=${orderBy}`
      );
      if (!res.ok) throw new Error("Erro ao buscar produtos");
      return res.json() as Promise<ProductsResponse>;
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.length * ROWS_PER_PAGE;
      if (loadedCount < lastPage.count) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) || [];
  }, [data]);

  useEffect(() => {
    if (status === "success") {
      const isLoadMore = allProducts.length > displayedProducts.length && displayedProducts.length > 0;
      if (!isLoadMore) {
        setDisplayedProducts(allProducts);
      }
    }
  }, [status, allProducts, displayedProducts.length]);

  const totalCount = data?.pages[0]?.count || 0;
  const progressPercentage = totalCount > 0 ? (allProducts.length / totalCount) * 100 : 0;
  const prevProgressPercentage = totalCount > 0 ? (displayedProducts.length / totalCount) * 100 : 0;
  const nextProgressPercentage = totalCount > 0 
    ? (Math.min(displayedProducts.length + ROWS_PER_PAGE, totalCount) / totalCount) * 100 
    : 0;

  const handleProgressAnimationComplete = () => {
    if (!isFetchingNextPage && allProducts.length > displayedProducts.length) {
      setDisplayedProducts(allProducts);
    }
  };

  const handleCardClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    document.body.style.overflow = "hidden";
  }, []);

  const handleBack = useCallback(() => {
    setSelectedProduct(null);
    document.body.style.overflow = "";
  }, []);

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart(selectedProduct));
      dispatch(setCartOpen(true));
    }
  };

  const handleAddToCartWithoutOpening = () => {
    if (selectedProduct) {
      dispatch(addToCart(selectedProduct));
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleAddToCartFromCard = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    dispatch(setCartOpen(true));
  };

  const formatPrice = (price: string) => parseFloat(price).toFixed(0);

  return (
    <>
      <Head>
        <title>
          {selectedProduct 
            ? `${selectedProduct.name} - Starsoft Products`
            : "Starsoft Products - Galeria de NFTs"
          }
        </title>
        <meta name="description" content={selectedProduct?.description || "Explore nossa galeria de produtos NFT exclusivos."} />
      </Head>

      <PageContainer>
        <Header />
        
        <LayoutGroup>
          <MainContent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {status === "pending" ? (
              <LoadingContainer>
                <Spinner src="/images/icons/spinner.svg" alt="Loading" width={48} height={48} />
                <LoadingText>Carregando produtos...</LoadingText>
              </LoadingContainer>
            ) : status === "error" ? (
              <LoadingContainer>
                <LoadingText>Erro ao carregar produtos. Por favor, tente novamente.</LoadingText>
              </LoadingContainer>
            ) : (
              <>
                <ProductsGrid layout>
                  <AnimatePresence>
                    {displayedProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        layout
                      >
                        <CardContainer
                          onClick={() => handleCardClick(product)}
                          whileHover={{ y: -4, boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.25)" }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          <SharedImageContainer layoutId={`image-${product.id}`} transition={springTransition}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </SharedImageContainer>

                          <ContentContainer>
                            <SharedTitle layoutId={`title-${product.id}`} transition={springTransition}>
                              {product.name}
                            </SharedTitle>
                            <SharedDescription layoutId={`desc-${product.id}`} transition={springTransition}>
                              {product.description}
                            </SharedDescription>
                          </ContentContainer>

                          <PriceContainer>
                            <SharedPriceRow layoutId={`price-${product.id}`} transition={springTransition}>
                              <EthIconStyled $size="24px">
                                <Image src="/images/icons/eth.png" alt="ETH" fill style={{ objectFit: "contain" }} />
                              </EthIconStyled>
                              <PriceTextStyled $size="20px">{formatPrice(product.price)} ETH</PriceTextStyled>
                            </SharedPriceRow>

                            <SharedButtonWrapper layoutId={`button-${product.id}`} transition={springTransition}>
                              <PrimaryButton
                                $fullWidth
                                onClick={(e: React.MouseEvent) => handleAddToCartFromCard(e, product)}
                                whileHover={{ backgroundColor: "#FF9A3D", scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                COMPRAR
                              </PrimaryButton>
                            </SharedButtonWrapper>
                          </PriceContainer>
                        </CardContainer>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </ProductsGrid>

                {(hasNextPage || displayedProducts.length > 0) && (
                  <LoadMoreContainer>
                    <ProgressTrack>
                      <ProgressFill 
                        initial={{ width: `${prevProgressPercentage}%` }}
                        animate={{ 
                          width: !hasNextPage 
                            ? "100%" 
                            : isFetchingNextPage 
                              ? `${nextProgressPercentage}%` 
                              : `${progressPercentage}%` 
                        }}
                        transition={{ duration: isFetchingNextPage ? 0.8 : 0.3 }}
                        onAnimationComplete={handleProgressAnimationComplete}
                      />
                    </ProgressTrack>
                    
                    <LoadMoreButton
                      onClick={() => hasNextPage && fetchNextPage()}
                      disabled={isFetchingNextPage || !hasNextPage}
                      $disabled={isFetchingNextPage || !hasNextPage}
                      whileHover={hasNextPage ? { scale: 1.02 } : {}}
                      whileTap={hasNextPage ? { scale: 0.98 } : {}}
                    >
                      <ButtonText>
                        {!hasNextPage 
                          ? "Você já viu tudo" 
                          : isFetchingNextPage 
                            ? <><Spinner src="/images/icons/spinner.svg" alt="Loading" width={20} height={20} /> Carregando...</>
                            : "Carregar mais"
                        }
                      </ButtonText>
                    </LoadMoreButton>
                  </LoadMoreContainer>
                )}
              </>
            )}
          </MainContent>

          <AnimatePresence>
            {selectedProduct && (
              <>
                <Overlay
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleBack}
                />

                <DetailContainer
                  key="detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DetailContent>
                    <BackButton
                      onClick={handleBack}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      ← Voltar para a galeria
                    </BackButton>

                    <DetailsGrid>
                      <DetailImageWrapper
                        layoutId={`image-${selectedProduct.id}`}
                        transition={springTransition}
                      >
                        <Image
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          fill
                          style={{ objectFit: "contain", borderRadius: "8px" }}
                          priority
                        />
                      </DetailImageWrapper>

                      <DetailInfoContainer>
                        <DetailTitle
                          layoutId={`title-${selectedProduct.id}`}
                          transition={springTransition}
                        >
                          {selectedProduct.name}
                        </DetailTitle>

                        <DetailPriceRow
                          layoutId={`price-${selectedProduct.id}`}
                          transition={springTransition}
                        >
                          <EthIconStyled $size="32px">
                            <Image src="/images/icons/eth.png" alt="ETH" fill style={{ objectFit: "contain" }} />
                          </EthIconStyled>
                          <PriceTextStyled $size="32px">{formatPrice(selectedProduct.price)} ETH</PriceTextStyled>
                        </DetailPriceRow>

                        <DetailDescription
                          layoutId={`desc-${selectedProduct.id}`}
                          transition={springTransition}
                        >
                          {selectedProduct.description}
                        </DetailDescription>

                        <SharedButtonWrapper 
                          layoutId={`button-${selectedProduct.id}`} 
                          transition={springTransition}
                        >
                          <PrimaryButton
                            $size="large"
                            $fullWidth
                            onClick={handleAddToCart}
                            whileHover={{ scale: 1.02, backgroundColor: "#FF9A3D" }}
                            whileTap={{ scale: 0.98 }}
                          >
                            COMPRAR AGORA
                          </PrimaryButton>
                        </SharedButtonWrapper>

                        <ButtonsContainer
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
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
                                >
                                  ADICIONAR AO CARRINHO
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </SecondaryButton>
                        </ButtonsContainer>
                      </DetailInfoContainer>
                    </DetailsGrid>
                  </DetailContent>
                </DetailContainer>
              </>
            )}
          </AnimatePresence>
        </LayoutGroup>

        <CartOverlay />
        
        {!selectedProduct && (
          <Footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <FooterText>STARSOFT © TODOS OS DIREITOS RESERVADOS</FooterText>
          </Footer>
        )}
      </PageContainer>
    </>
  );
}
