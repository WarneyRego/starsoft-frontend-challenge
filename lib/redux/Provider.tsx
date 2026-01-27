'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function CombinedProvider({ children }: { children: React.ReactNode }) {
  // Garantimos que o QueryClient seja instanciado apenas uma vez no cliente
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Dados expiram em 1 minuto
      },
    },
  }));

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
