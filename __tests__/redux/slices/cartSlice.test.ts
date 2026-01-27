import cartReducer, { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  setCartOpen 
} from '../../../lib/redux/slices/cartSlice'

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  image: '/test.jpg',
  price: '10',
  createdAt: '2023-01-01',
}

describe('cartSlice', () => {
  const initialState = {
    items: [],
    isOpen: false,
  }

  it('deve retornar o estado inicial', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('deve adicionar um item ao carrinho', () => {
    const nextState = cartReducer(initialState, addToCart(mockProduct))
    expect(nextState.items).toHaveLength(1)
    expect(nextState.items[0]).toEqual({ ...mockProduct, quantity: 1 })
  })

  it('deve incrementar a quantidade se o item já estiver no carrinho', () => {
    const stateWithItem = {
      items: [{ ...mockProduct, quantity: 1 }],
      isOpen: false,
    }
    const nextState = cartReducer(stateWithItem, addToCart(mockProduct))
    expect(nextState.items).toHaveLength(1)
    expect(nextState.items[0].quantity).toBe(2)
  })

  it('deve remover um item do carrinho', () => {
    const stateWithItem = {
      items: [{ ...mockProduct, quantity: 1 }],
      isOpen: false,
    }
    const nextState = cartReducer(stateWithItem, removeFromCart(1))
    expect(nextState.items).toHaveLength(0)
  })

  it('deve atualizar a quantidade de um item', () => {
    const stateWithItem = {
      items: [{ ...mockProduct, quantity: 2 }],
      isOpen: false,
    }
    const nextState = cartReducer(stateWithItem, updateQuantity({ id: 1, delta: 1 }))
    expect(nextState.items[0].quantity).toBe(3)
    
    const nextState2 = cartReducer(nextState, updateQuantity({ id: 1, delta: -1 }))
    expect(nextState2.items[0].quantity).toBe(2)
  })

  it('não deve permitir quantidade menor que 1 ao atualizar', () => {
    const stateWithItem = {
      items: [{ ...mockProduct, quantity: 1 }],
      isOpen: false,
    }
    const nextState = cartReducer(stateWithItem, updateQuantity({ id: 1, delta: -1 }))
    expect(nextState.items[0].quantity).toBe(1)
  })

  it('deve limpar o carrinho', () => {
    const stateWithItems = {
      items: [{ ...mockProduct, quantity: 5 }],
      isOpen: false,
    }
    const nextState = cartReducer(stateWithItems, clearCart())
    expect(nextState.items).toHaveLength(0)
  })

  it('deve abrir/fechar o carrinho', () => {
    const nextState = cartReducer(initialState, setCartOpen(true))
    expect(nextState.isOpen).toBe(true)
    const finalState = cartReducer(nextState, setCartOpen(false))
    expect(finalState.isOpen).toBe(false)
  })
})
