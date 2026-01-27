import React from 'react'
import { render, screen } from '../../lib/test-utils'
import Header from '../../app/components/Header'

// Mockamos o seletor do Redux para simular itens no carrinho
jest.mock('../../lib/redux/hooks', () => ({
  ...jest.requireActual('../../lib/redux/hooks'),
  useAppSelector: jest.fn((selector) => {
    // Simula um estado com 3 itens totais (2 de um tipo, 1 de outro)
    return [{ quantity: 2 }, { quantity: 1 }]
  })
}))

describe('Header', () => {
  it('deve exibir a quantidade correta de itens no carrinho', () => {
    render(<Header />)
    
    // 2 + 1 = 3
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('deve renderizar o logo', () => {
    render(<Header />)
    expect(screen.getByAltText('Starsoft Logo')).toBeInTheDocument()
  })
})
