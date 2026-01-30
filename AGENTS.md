# AGENTS.md

## Commands
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm test` - Run all tests
- `npm test -- path/to/file.test.tsx` - Run a single test file
- `npm run test:watch` - Run tests in watch mode

## Architecture
- **Next.js 16** app with App Router (`app/` directory)
- **State**: Redux Toolkit (`lib/redux/`) + React Query for server state
- **Styling**: styled-components with theme (`lib/theme/theme.ts`)
- **API**: Internal routes in `app/api/`, external API via `lib/services/`
- **Tests**: Jest + React Testing Library in `__tests__/`
- **Providers**: `lib/providers/` (StyledComponentsRegistry, PageTransitionContext)

## Code Style
- Use `"use client"` directive for client components
- Import order: React → Next.js → external libs → local modules
- Styled-components: use `styled()` with theme tokens, transient props `$name`
- Redux: use typed hooks from `lib/redux/hooks.ts` (`useAppDispatch`, `useAppSelector`)
- TypeScript: explicit interfaces for props and API responses
- Animations: use framer-motion with `motion.` components
