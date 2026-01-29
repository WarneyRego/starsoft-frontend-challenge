import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import cartReducer from './redux/slices/cartSlice'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from './theme/theme'
import { ThemeProvider } from 'styled-components'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any
  store?: any
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const actualStore = store || configureStore({
    reducer: combineReducers({ cart: cartReducer }),
    preloadedState,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={actualStore}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    )
  }

  return { store: actualStore, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

export * from '@testing-library/react'
export { customRender as render }
