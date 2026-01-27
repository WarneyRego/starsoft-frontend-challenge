"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import Header from "./Header";
import SearchBar from "./SearchBar";
import dynamic from "next/dynamic";
import { theme } from "../../lib/theme/theme";
import { useAppDispatch } from "../../lib/redux/hooks";
import { addToCart, setCartOpen } from "../../lib/redux/slices/cartSlice";
import {
  PageContainer,
  FlexContainer,
  LoadingContainer as BaseLoadingContainer,
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
`;

const ControlsContainer = styled(FlexContainer).attrs({
  $justify: "flex-start",
  $align: "center",
  $gap: "20px",
})`
  margin-bottom: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const LoadingContainer = styled(BaseLoadingContainer)`
  min-height: 400px;
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
  grid-template-columns: repeat(auto-fill, 345px);
  gap: 24px;
  justify-content: center;
`;

const LoadMoreContainer = styled(FlexContainer).attrs({
  $direction: "column",
  $align: "center",
  $gap: "10px",
})`
  margin-top: 60px;
  padding-bottom: 40px;
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
`;

const FooterText = styled.p`
  color: ${theme.colors.white};
  font-size: 14px;
  font-family: ${theme.fonts.secondary};
  font-weight: 400;
  opacity: 0.5;
  letter-spacing: 0.05em;
`;


const ROWS_PER_PAGE = 10;

export default function DashboardProducts() {
  const dispatch = useAppDispatch();
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); // Busca ativa que filtra a lista principal
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("ASC");

  const handleSearch = useCallback(() => {
    setActiveSearch(searchQuery);
  }, [searchQuery]);

  const handleReset = useCallback(() => {
    setSearchQuery("");
    setActiveSearch("");
    setSortBy("name");
    setOrderBy("ASC");
  }, []);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
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

  // Flatten all products
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page) => page.products) || [];
  }, [data]);

  // Filter products for preview (enquanto digita)
  const previewFilteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return allProducts.filter((product) => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProducts, searchQuery]);

  // Filter products for main list (apenas quando buscar)
  const filteredProducts = useMemo(() => {
    if (!activeSearch) return allProducts;
    return allProducts.filter((product) => 
      product.name.toLowerCase().includes(activeSearch.toLowerCase())
    );
  }, [allProducts, activeSearch]);

  const previewProducts = useMemo(() => {
    if (!searchQuery) return [];
    return previewFilteredProducts.slice(0, 5);
  }, [previewFilteredProducts, searchQuery]);

  const showPreview = searchQuery.length > 0 && !activeSearch && previewProducts.length > 0;
  const showNoResultsPreview = searchQuery.length > 0 && !activeSearch && previewFilteredProducts.length === 0;

  useEffect(() => {
    if (status === "success" && filteredProducts.length > 0) {
      setDisplayedProducts(filteredProducts);
    } else if (status === "success" && !activeSearch && allProducts.length > 0) {
      setDisplayedProducts(allProducts);
    }
  }, [status, filteredProducts, activeSearch, allProducts]);

  const totalCount = data?.pages[0]?.count || 0;
  const progressPercentage = totalCount > 0 ? (filteredProducts.length / totalCount) * 100 : 0;
  const prevProgressPercentage = totalCount > 0 ? (displayedProducts.length / totalCount) * 100 : 0;
  const nextProgressPercentage = totalCount > 0 
    ? (Math.min(displayedProducts.length + ROWS_PER_PAGE, totalCount) / totalCount) * 100 
    : 0;

  const handleProgressAnimationComplete = () => {
    if (!isFetchingNextPage && filteredProducts.length > displayedProducts.length) {
      setDisplayedProducts(filteredProducts);
    }
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    dispatch(setCartOpen(true));
  };

  const handleAddToCartWithoutOpening = (product: Product) => {
    dispatch(addToCart(product));
  };

  const handleSortChange = (newSortBy: string, newOrderBy: string) => {
    setSortBy(newSortBy);
    setOrderBy(newOrderBy);
  };

  return (
    <PageContainer>
      <Header />
      
      <MainContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ControlsContainer>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearch={handleSearch}
            onReset={handleReset}
            previewProducts={previewProducts}
            previewFilteredCount={previewFilteredProducts.length}
            showPreview={showPreview}
            showNoResultsPreview={showNoResultsPreview}
            sortBy={sortBy}
            orderBy={orderBy}
            onSortChange={handleSortChange}
          />
        </ControlsContainer>

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
            {displayedProducts.length === 0 && activeSearch ? (
              <LoadingContainer>
                <LoadingText>Nenhum produto encontrado para "{activeSearch}"</LoadingText>
              </LoadingContainer>
            ) : (
              <ProductsGrid
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence mode="popLayout">
                  {displayedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      layout
                    >
                      <ProductCard 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        onAddToCartWithoutOpening={handleAddToCartWithoutOpening}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ProductsGrid>
            )}

            {!activeSearch && hasNextPage && (
              <LoadMoreContainer>
                <ProgressTrack>
                  <ProgressFill 
                    initial={{ width: `${prevProgressPercentage}%` }}
                    animate={{ 
                      width: isFetchingNextPage 
                        ? `${nextProgressPercentage}%` 
                        : `${progressPercentage}%` 
                    }}
                    transition={{ 
                      duration: isFetchingNextPage ? 0.8 : 0.3, 
                      ease: isFetchingNextPage ? "linear" : "easeOut" 
                    }}
                    onAnimationComplete={handleProgressAnimationComplete}
                  />
                </ProgressTrack>
                <LoadMoreButton
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  $disabled={isFetchingNextPage}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ButtonText>
                    {isFetchingNextPage ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Spinner src="/images/icons/spinner.svg" alt="Loading" width={20} height={20} />
                        <span>Carregando...</span>
                      </div>
                    ) : "Carregar mais"}
                  </ButtonText>
                </LoadMoreButton>
              </LoadMoreContainer>
            )}

            {!activeSearch && !hasNextPage && displayedProducts.length > 0 && (
              <LoadMoreContainer>
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
              </LoadMoreContainer>
            )}
          </>
        )}
      </MainContent>

      <CartOverlay />
      
      <Footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <FooterText>STARSOFT © TODOS OS DIREITOS RESERVADOS</FooterText>
      </Footer>
    </PageContainer>
  );
}
