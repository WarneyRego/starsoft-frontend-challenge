"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "../../../lib/theme/theme";
import Header from "../../components/Header";
import dynamic from "next/dynamic";
import { useAppDispatch } from "../../../lib/redux/hooks";
import { addToCart, setCartOpen } from "../../../lib/redux/slices/cartSlice";

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

const PageContainer = styled.div`
  background-color: ${theme.colors.darkGray};
  min-height: 100vh;
  color: ${theme.colors.white};
`;

const Content = styled.main`
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

const ImageContainer = styled.div`
  flex: 1;
  background-color: ${theme.colors.navyBlue};
  border-radius: ${theme.borderRadius.large};
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.card};
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const BackLink = styled(Link)`
  color: ${theme.colors.lightGray};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-family: ${theme.fonts.primary};

  &:hover {
    color: ${theme.colors.white};
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin: 0;
  font-family: ${theme.fonts.primary};
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: ${theme.colors.lightGray};
  font-family: ${theme.fonts.primary};
`;

const PriceTag = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
`;

const BuyButton = styled.button`
  width: 100%;
  max-width: 300px;
  height: 64px;
  background-color: ${theme.colors.orange};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.borderRadius.large};
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  font-family: ${theme.fonts.primary};
  transition: all 0.2s ease;

  &:hover {
    background-color: #FF9A3D;
    transform: translateY(-2px);
  }
`;

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    dispatch(setCartOpen(true));
  };

  if (loading) return <PageContainer>Carregando...</PageContainer>;
  if (!product) return <PageContainer>Produto não encontrado.</PageContainer>;

  return (
    <PageContainer>
      <Header />
      
      <Content>
        <ImageContainer>
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
          <BackLink href="/">
            ← Voltar para a galeria
          </BackLink>
          <Title>{product.name}</Title>
          <PriceTag>
            <Image src="/images/icons/eth.png" alt="ETH" width={32} height={32} />
            {parseFloat(product.price).toFixed(0)} ETH
          </PriceTag>
          <Description>{product.description}</Description>
          <BuyButton onClick={() => handleAddToCart(product)}>
            COMPRAR AGORA
          </BuyButton>
        </InfoContainer>
      </Content>

      <CartOverlay />
    </PageContainer>
  );
}
