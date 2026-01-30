import React from 'react'
import { render, screen } from '../../lib/test-utils'
import Header from '../../app/components/Header'

Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
})

global.requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(callback, 0)

const mockState = {
  cart: {
    items: [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 }
    ]
  }
}

jest.mock('../../lib/redux/hooks', () => ({
  ...jest.requireActual('../../lib/redux/hooks'),
  useAppSelector: jest.fn((selector) => {
    return selector(mockState)
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
