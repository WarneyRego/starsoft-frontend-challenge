"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import CartOverlay from "./components/CartOverlay";
import { theme } from "../lib/theme/theme";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt: string;
}

interface CartItem extends Product {
  quantity: number;
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
  justify-content: center;
  margin-top: 60px;
  padding-bottom: 40px;
`;

const LoadMoreButton = styled.button<{ $progress: number; $disabled: boolean }>`
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$disabled ? 0.8 : 1)};

  &:hover:not(:disabled) {
    background-color: #444444;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: ${(props) => (props.$disabled ? "100%" : `${props.$progress}%`)};
    height: 2px;
    background-color: ${theme.colors.orange};
    border-radius: ${theme.borderRadius.default} 0 0 0;
    transition: width 0.3s ease;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${theme.colors.orange};
    border-radius: 0 0 ${theme.borderRadius.default} ${theme.borderRadius.default};
  }
`;

const ButtonText = styled.span`
  position: relative;
  z-index: 1;
`;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
          `https://api-challenge.starsoft.games/api/v1/products?page=1&rows=${rowsPerPage}&sortBy=name&orderBy=ASC`
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
    try {
      const nextPage = currentPage + 1;
      const res = await fetch(
        `https://api-challenge.starsoft.games/api/v1/products?page=${nextPage}&rows=${rowsPerPage}&sortBy=name&orderBy=ASC`
      );
      const data = await res.json();
      
      if (data.products && data.products.length > 0) {
        setProducts((prev) => [...prev, ...data.products]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Erro ao carregar mais produtos:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMoreProducts = products.length < totalCount;
  const progressPercentage = totalCount > 0 ? (products.length / totalCount) * 100 : 0;

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const addToCartWithoutOpening = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  return (
    <PageContainer>
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
      />
      
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
                  onAddToCart={addToCart}
                  onAddToCartWithoutOpening={addToCartWithoutOpening}
                />
              ))}
            </ProductsGrid>

            {!loading && products.length > 0 && (
              <LoadMoreContainer>
                {hasMoreProducts ? (
                  <LoadMoreButton
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    $progress={progressPercentage}
                    $disabled={loadingMore}
                  >
                    <ButtonText>
                      {loadingMore ? "Carregando..." : "Carregar mais"}
                    </ButtonText>
                  </LoadMoreButton>
                ) : (
                  <LoadMoreButton
                    disabled
                    $progress={100}
                    $disabled={true}
                  >
                    <ButtonText>Você já viu tudo</ButtonText>
                  </LoadMoreButton>
                )}
              </LoadMoreContainer>
            )}
          </>
        )}
      </MainContent>

      <CartOverlay 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </PageContainer>
  );
}
