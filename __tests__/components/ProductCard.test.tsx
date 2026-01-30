import React from 'react'
import { render, screen, fireEvent } from '../../lib/test-utils'
import ProductCard from '../../app/components/ProductCard'

const mockProduct = {
  id: 1,
  name: 'NFT Teste',
  description: 'Descrição do NFT teste',
  image: '/test.jpg',
  price: '1.5',
  createdAt: '2023-01-01',
}

describe('ProductCard', () => {
  const mockOnAddToCart = jest.fn()
  const mockOnCardClick = jest.fn()

  it('deve renderizar as informações do produto corretamente', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart}
        onCardClick={mockOnCardClick}
      />
    )

    expect(screen.getByText('NFT Teste')).toBeInTheDocument()
    expect(screen.getByText('Descrição do NFT teste')).toBeInTheDocument()
    expect(screen.getByText(/2 ETH/)).toBeInTheDocument()
  })

  it('deve chamar onAddToCart quando o botão COMPRAR for clicado', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart}
        onCardClick={mockOnCardClick}
      />
    )

    const buyButton = screen.getByText('COMPRAR')
    fireEvent.click(buyButton)

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct)
  })

  it('deve chamar onCardClick quando o card for clicado', () => {
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart}
        onCardClick={mockOnCardClick}
      />
    )

    const card = screen.getByText('NFT Teste').closest('div[class]')
    if (card) {
      fireEvent.click(card)
      expect(mockOnCardClick).toHaveBeenCalledWith(mockProduct)
    }
  })
})
