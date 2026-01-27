"use client";

import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "../../lib/theme/theme";
import {
  Input,
  PrimaryButton,
  Button,
  ImageFrame,
  Title,
  Description,
  PriceRow,
  EthIcon,
  PriceText,
} from "../../lib/ui";

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt: string;
}

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onReset: () => void;
  previewProducts?: Product[];
  previewFilteredCount?: number;
  showPreview?: boolean;
  showNoResultsPreview?: boolean;
  sortBy: string;
  orderBy: string;
  onSortChange: (sortBy: string, orderBy: string) => void;
}

const SearchBarWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 100%;
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.default};
  padding: 4px;
  gap: 6px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: ${theme.colors.orange};
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const SearchIcon = styled.div`
  padding: 0 12px;
  display: flex;
  align-items: center;
  pointer-events: none;
  opacity: 0.5;
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 0 8px;
`;

const SearchInput = styled(Input)`
  flex: 1;
  border: none;
  background: transparent;
  padding: 0 12px;
  height: 40px;
  
  &:focus {
    border: none;
    background: transparent;
  }
`;

const FilterContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 16px;
`;

const ResetButton = styled(motion.button)`
  height: 40px;
  width: 40px;
  padding: 0;
  border: none;
  border-radius: ${theme.borderRadius.default};
  background: transparent;
  color: ${theme.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const FilterButton = styled(motion.button)`
  height: 40px;
  padding: 0 16px;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.default};
  background: transparent;
  color: ${theme.colors.white};
  cursor: pointer;
  font-family: ${theme.fonts.primary};
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchButton = styled(PrimaryButton)`
  height: 40px;
  width: 40px;
  padding: 0;
  border-radius: ${theme.borderRadius.default};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
`;

const FilterDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 200px;
  background-color: #252525;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  z-index: 100;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const FilterOption = styled(motion.button)<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  background: ${(props) => (props.$active ? "rgba(254, 114, 76, 0.1)" : "transparent")};
  border: none;
  border-radius: 8px;
  color: ${(props) => (props.$active ? theme.colors.orange : theme.colors.white)};
  font-family: ${theme.fonts.primary};
  font-size: 14px;
  cursor: pointer;
`;

const SearchPreviewContainer = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background-color: ${theme.colors.navyBlue};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${theme.borderRadius.default};
  box-shadow: ${theme.shadows.card};
  z-index: 100;
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
`;

const PreviewProductCard = styled(motion.div)`
  display: flex;
  gap: 16px;
  padding: 12px;
  border-radius: ${theme.borderRadius.default};
  cursor: pointer;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PreviewImageContainer = styled(ImageFrame)`
  width: 80px;
  height: 80px;
  flex-shrink: 0;
`;

const PreviewProductInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const PreviewProductName = styled(Title)`
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PreviewProductDescription = styled(Description)`
  font-size: 11px;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PreviewProductPrice = styled(PriceText)`
  font-size: 16px;
  margin-top: auto;
`;

const PreviewEmpty = styled.div`
  padding: 24px;
  text-align: center;
  color: ${theme.colors.lightGray};
  font-size: 14px;
  font-family: ${theme.fonts.primary};
`;

export default function SearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onReset,
  previewProducts = [],
  previewFilteredCount = 0,
  showPreview = false,
  showNoResultsPreview = false,
  sortBy,
  orderBy,
  onSortChange,
}: SearchBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleSortChange = (newSortBy: string, newOrderBy: string) => {
    onSortChange(newSortBy, newOrderBy);
    setIsFilterOpen(false);
  };

  return (
    <SearchBarWrapper>
      <SearchInputContainer>
        <SearchIcon>
          <Image src="/images/icons/search.svg" alt="Search" width={20} height={20} />
        </SearchIcon>
        <Separator />
        <SearchInput 
          type="text" 
          placeholder="Buscar produtos..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <FilterContainer>
          <AnimatePresence>
            {(searchQuery || sortBy !== "name" || orderBy !== "ASC") && (
              <ResetButton
                onClick={onReset}
                whileHover={{ scale: 1.1, opacity: 1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </ResetButton>
            )}
          </AnimatePresence>
          <FilterButton 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Image src="/images/icons/filter.svg" alt="Filter" width={20} height={20} />
            Filtrar
          </FilterButton>

          <AnimatePresence>
            {isFilterOpen && (
              <FilterDropdown
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <FilterOption 
                  $active={sortBy === "name"} 
                  onClick={() => handleSortChange("name", "ASC")}
                  whileHover={{ 
                    backgroundColor: sortBy === "name" ? "rgba(254, 114, 76, 0.15)" : "rgba(255, 255, 255, 0.05)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Padrão (Nome)
                </FilterOption>
                <FilterOption 
                  $active={sortBy === "price" && orderBy === "ASC"} 
                  onClick={() => handleSortChange("price", "ASC")}
                  whileHover={{ 
                    backgroundColor: (sortBy === "price" && orderBy === "ASC") ? "rgba(254, 114, 76, 0.15)" : "rgba(255, 255, 255, 0.05)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Menor valor
                </FilterOption>
                <FilterOption 
                  $active={sortBy === "price" && orderBy === "DESC"} 
                  onClick={() => handleSortChange("price", "DESC")}
                  whileHover={{ 
                    backgroundColor: (sortBy === "price" && orderBy === "DESC") ? "rgba(254, 114, 76, 0.15)" : "rgba(255, 255, 255, 0.05)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Maior valor
                </FilterOption>
              </FilterDropdown>
            )}
          </AnimatePresence>
        </FilterContainer>
        <SearchButton
          onClick={onSearch}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image src="/images/icons/search.svg" alt="Search" width={20} height={20} />
        </SearchButton>
      </SearchInputContainer>
      
      <AnimatePresence>
        {(showPreview || showNoResultsPreview) && (
          <SearchPreviewContainer
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {showPreview ? (
              <>
                  {previewProducts.map((product) => (
                    <PreviewProductCard
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        window.location.href = `/product/${product.id}`;
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        backgroundColor: "rgba(255, 255, 255, 0.05)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                    <PreviewImageContainer>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{
                          objectFit: "cover",
                          borderRadius: theme.borderRadius.default,
                        }}
                      />
                    </PreviewImageContainer>
                    <PreviewProductInfo>
                      <PreviewProductName>{product.name}</PreviewProductName>
                      <PreviewProductDescription $size="11px" $clamp={2}>
                        {product.description}
                      </PreviewProductDescription>
                      <PriceRow $gap="6px">
                        <EthIcon $size="16px">
                          <Image
                            src="/images/icons/eth.png"
                            alt="Ethereum Icon"
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </EthIcon>
                        <PreviewProductPrice $size="16px">
                          {parseFloat(product.price).toFixed(0)} ETH
                        </PreviewProductPrice>
                      </PriceRow>
                    </PreviewProductInfo>
                  </PreviewProductCard>
                ))}
                {previewFilteredCount > previewProducts.length && (
                  <PreviewEmpty>
                    + {previewFilteredCount - previewProducts.length} outros produtos encontrados
                  </PreviewEmpty>
                )}
              </>
            ) : (
              <PreviewEmpty>
                Nenhum produto encontrado para "{searchQuery}"
              </PreviewEmpty>
            )}
          </SearchPreviewContainer>
        )}
      </AnimatePresence>
    </SearchBarWrapper>
  );
}
