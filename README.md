## Starsoft Frontend Challenge

Aplicação web em **Next.js (App Router)** que lista produtos (NFTs), permite abrir um **detalhe em overlay** e adicionar itens ao **carrinho** (Redux), com paginação incremental via **React Query**.

### Stack

- **Next.js** (`app/`) + **React**
- **@tanstack/react-query** (hidratação/prefetch e paginação incremental)
- **Redux Toolkit** (estado do carrinho)
- **styled-components** (estilização) + **framer-motion** (animações/transições)
- **Jest + Testing Library** (testes)

### Pré-requisitos

- **Node.js 20+** (recomendado) e **npm**

### Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

### Scripts úteis

```bash
npm run build
npm run start
npm run lint
npm test
npm run test:watch
```

### Rodando com Docker

#### Desenvolvimento (com hot reload)

```bash
docker compose up --build
```

#### Produção (via compose)

```bash
docker compose build
docker compose run --rm next-app npm run build
docker compose up
```

### Endpoints (API interna)

Os endpoints abaixo são rotas do próprio Next.js e funcionam como um “BFF” para a UI:

- **GET `/api/products`**
  - Query params: `page`, `rows`, `sortBy`, `orderBy`

### Fonte de dados

- A listagem vem da **API externa** `https://api-challenge.starsoft.games/api/v1`.
- Observação: a API externa não possui endpoint por ID; por isso, o `GET /api/products/:id` busca uma lista e **filtra pelo id**.

### Estrutura do projeto (resumo)

- `app/`: rotas, layout e componentes da UI (App Router)
  - `app/api/products/*`: rotas HTTP internas
  - `app/components/*`: `DashboardProducts`, `Header`, `ProductCard`, `CartOverlay` etc.
- `lib/services/`: integração com API externa (`products.ts`)
- `lib/redux/`: store, hooks e slice do carrinho
- `__tests__/`: testes de componentes e do slice do Redux

### Testes

- Os testes ficam em `__tests__/` e rodam com:

```bash
npm test
```

### Notas de implementação

- **Imagens remotas**: permitido `softstar.s3.amazonaws.com` (ver `next.config.ts`).
- **Cache**: a busca na API externa usa `revalidate: 3600` (1 hora).
- **Alias**: imports com `@/` mapeiam para a raiz do projeto (ver `jest.config.ts`/tsconfig).
