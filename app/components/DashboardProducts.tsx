"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import Header from "./Header";
import dynamic from "next/dynamic";
import { theme } from "../../lib/theme/theme";
import { useAppDispatch } from "../../lib/redux/hooks";
import { addToCart, setCartOpen } from "../../lib/redux/slices/cartSlice";

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

const PageContainer = styled.div`
  background-color: ${theme.colors.darkGray};
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding: 40px;
`;

const LoadingText = styled.div`
  color: ${theme.colors.white};
  text-align: center;
  font-size: 20px;
  font-family: ${theme.fonts.primary};
`;

const ProductsGrid = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, 345px);
  gap: 24px;
  justify-content: center;
`;

const LoadMoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  padding-bottom: 40px;
  gap: 10px;
`;

const ProgressTrack = styled.div`
  width: 280px;
  height: 8px;
  background-color: #333333;
  border-radius: 8px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background-color: ${theme.colors.orange};
  border-radius: 4px;
`;

const LoadMoreButton = styled.button<{ $disabled: boolean }>`
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
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$disabled ? 0.8 : 1)};

  &:hover:not(:disabled) {
    background-color: #444444;
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
`;

export default function DashboardProducts() {
  const dispatch = useAppDispatch();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?page=1&rows=${rowsPerPage}&sortBy=name&orderBy=ASC`
        );
        const data = await res.json();
        setProducts(data.products);
        setTotalCount(data.count);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const loadMoreProducts = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    const startTime = Date.now();
    
    try {
      const nextPage = currentPage + 1;
      const res = await fetch(
        `/api/products?page=${nextPage}&rows=${rowsPerPage}&sortBy=name&orderBy=ASC`
      );
      const data = await res.json();
      
      if (data.products && data.products.length > 0) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 800 - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }

        setProducts((prev) => [...prev, ...data.products]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Erro ao carregar mais produtos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    dispatch(setCartOpen(true));
  };

  const handleAddToCartWithoutOpening = (product: Product) => {
    dispatch(addToCart(product));
  };

  const hasMoreProducts = products.length < totalCount;
  const progressPercentage = totalCount > 0 ? (products.length / totalCount) * 100 : 0;
  const nextProgressPercentage = totalCount > 0 ? ((products.length + rowsPerPage) / totalCount) * 100 : 0;

  return (
    <PageContainer>
      <Header />
      
      <MainContent>
        {loading ? (
          <LoadingText>Carregando...</LoadingText>
        ) : (
          <>
            <ProductsGrid>
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                  onAddToCartWithoutOpening={handleAddToCartWithoutOpening}
                />
              ))}
            </ProductsGrid>

            {products.length > 0 && (
              <LoadMoreContainer>
                {hasMoreProducts ? (
                  <>
                    <ProgressTrack>
                      <ProgressFill 
                        initial={{ width: `${progressPercentage}%` }}
                        animate={{ 
                          width: loadingMore 
                            ? `${nextProgressPercentage}%` 
                            : `${progressPercentage}%` 
                        }}
                        transition={{ 
                          duration: loadingMore ? 0.8 : 0.3, 
                          ease: loadingMore ? "linear" : "easeOut" 
                        }}
                      />
                    </ProgressTrack>
                    <LoadMoreButton
                      onClick={loadMoreProducts}
                      disabled={loadingMore}
                      $disabled={loadingMore}
                    >
                      <ButtonText>
                        {loadingMore ? "Carregando..." : "Carregar mais"}
                      </ButtonText>
                    </LoadMoreButton>
                  </>
                ) : (
                  <>
                    <ProgressTrack>
                      <ProgressFill 
                        initial={{ width: "100%" }}
                        animate={{ width: "100%" }}
                      />
                    </ProgressTrack>
                    <LoadMoreButton
                      disabled
                      $disabled={true}
                    >
                      <ButtonText>Você já viu tudo</ButtonText>
                    </LoadMoreButton>
                  </>
                )}
              </LoadMoreContainer>
            )}
          </>
        )}
      </MainContent>

      <CartOverlay />
    </PageContainer>
  );
}
