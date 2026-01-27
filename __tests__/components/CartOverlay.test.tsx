import React from 'react'
import { render, screen, fireEvent } from '../../lib/test-utils'
import CartOverlay from '../../app/components/CartOverlay'
import { addToCart, setCartOpen } from '../../lib/redux/slices/cartSlice'

const mockProduct = {
  id: 1,
  name: 'NFT Teste',
  description: 'Descrição do NFT teste',
  image: '/test.jpg',
  price: '10',
  createdAt: '2023-01-01',
}

describe('CartOverlay', () => {
  it('deve exibir mensagem de carrinho vazio', () => {
    render(<CartOverlay />, {
      preloadedState: {
        cart: { items: [], isOpen: true }
      }
    })
    
    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument()
  })

  it('deve exibir itens adicionados ao carrinho', () => {
    render(<CartOverlay />, {
      preloadedState: {
        cart: { 
          items: [{ ...mockProduct, quantity: 1 }], 
          isOpen: true 
        }
      }
    })
    
    expect(screen.getByText('NFT Teste')).toBeInTheDocument()
    expect(screen.getAllByText(/10 ETH/)).toHaveLength(2) // Preço do item e total
  })

  it('deve permitir fechar o carrinho clicando no botão de volta', () => {
    const { store } = render(<CartOverlay />, {
      preloadedState: {
        cart: { items: [], isOpen: true }
      }
    })
    
    const backButton = screen.getByAltText('Voltar')
    fireEvent.click(backButton)
    
    expect(store.getState().cart.isOpen).toBe(false)
  })
})
