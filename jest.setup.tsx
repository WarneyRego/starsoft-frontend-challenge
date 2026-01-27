import '@testing-library/jest-dom'
import 'jest-styled-components'
import React from 'react'

const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('An update to ForwardRef(LoadableComponent) inside a test was not wrapped in act')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

const filterProps = (props: any) => {
  const {
    whileHover,
    whileTap,
    initial,
    animate,
    exit,
    transition,
    layout,
    priority,
    fill,
    ...rest
  } = props
  return rest
}

// Mock de framer-motion
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  motion: {
    div: ({ children, ...props }: any) => <div {...filterProps(props)}>{children}</div>,
    main: ({ children, ...props }: any) => <main {...filterProps(props)}>{children}</main>,
    button: ({ children, ...props }: any) => <button {...filterProps(props)}>{children}</button>,
    header: ({ children, ...props }: any) => <header {...filterProps(props)}>{children}</header>,
    footer: ({ children, ...props }: any) => <footer {...filterProps(props)}>{children}</footer>,
    span: ({ children, ...props }: any) => <span {...filterProps(props)}>{children}</span>,
    p: ({ children, ...props }: any) => <p {...filterProps(props)}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...filterProps(props)}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...filterProps(props)}>{children}</h2>,
    h3: ({ children, ...props }: any) => <h3 {...filterProps(props)}>{children}</h3>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock de next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-unused-vars
    const { priority, fill, ...rest } = props
    return <img {...rest} alt={props.alt} />
  },
}))

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock de next/dynamic para evitar avisos de act() com LoadableComponent
// Em testes, retornamos o componente diretamente sem lazy loading assíncrono
jest.mock('next/dynamic', () => {
  const { act } = require('@testing-library/react')
  return (importFunc: () => Promise<any>, options?: any) => {
    // Retorna o componente diretamente, envolvendo atualizações em act() automaticamente
    const DynamicComponent = React.forwardRef((props: any, ref: any) => {
      const [Component, setComponent] = React.useState<React.ComponentType<any> | null>(null)
      const [isLoading, setIsLoading] = React.useState(true)
      
      React.useEffect(() => {
        let cancelled = false
        // Envolve a atualização de estado em act() para evitar avisos
        importFunc().then((module) => {
          if (!cancelled) {
            act(() => {
              setComponent(() => module.default || module)
              setIsLoading(false)
            })
          }
        })
        return () => {
          cancelled = true
        }
      }, [])
      
      if (isLoading || !Component) {
        return options?.loading ? React.createElement(options.loading) : null
      }
      
      return React.createElement(Component, { ...props, ref })
    })
    
    DynamicComponent.displayName = 'DynamicComponent'
    return DynamicComponent
  }
})
