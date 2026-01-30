import React from 'react'
import { render, screen, waitFor } from '../../lib/test-utils'
import DashboardProducts from '../../app/components/DashboardProducts'

// Mockamos o fetch global
global.fetch = jest.fn()

const mockProductsResponse = {
  products: [
    {
      id: 1,
      name: 'NFT Teste 1',
      description: 'Desc 1',
      image: '/test1.jpg',
      price: '10',
      createdAt: '2023-01-01',
    },
    {
      id: 2,
      name: 'NFT Teste 2',
      description: 'Desc 2',
      image: '/test2.jpg',
      price: '20',
      createdAt: '2023-01-01',
    },
  ],
  count: 2,
}

describe('DashboardProducts', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProductsResponse,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('deve exibir o estado de carregamento inicialmente', () => {
    // Como estamos usando prefetch no servidor na vida real, aqui no teste 
    // o useInfiniteQuery começará em estado de loading se não houver cache.
    render(<DashboardProducts />)
    expect(screen.getByText(/Carregando produtos/i)).toBeInTheDocument()
  })

  it('deve renderizar a lista de produtos após o carregamento', async () => {
    render(<DashboardProducts />)
    
    await waitFor(() => {
      expect(screen.getByText('NFT Teste 1')).toBeInTheDocument()
      expect(screen.getByText('NFT Teste 2')).toBeInTheDocument()
    })
  })
})
