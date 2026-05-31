import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * React Error Boundary — catches render/lifecycle errors in the component tree.
 * Shows a branded fallback UI matching the Planify design system.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-dvh flex items-center justify-center px-6"
          style={{
            background:
              'linear-gradient(180deg, #8178a8 0%, #c49ba2 35%, #ff8c42 70%, #ff6b1f 100%)',
          }}
        >
          <div
            className="max-w-sm w-full rounded-[32px] p-8 flex flex-col items-center gap-5 text-center"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.20)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 32px rgba(0,0,0,0.18)',
            }}
          >
            {/* Icon */}
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 44, color: '#ffb597' }}
              >
                error_outline
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-white"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.75rem',
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              ¡Ups! Algo salió mal
            </h1>

            {/* Description */}
            <p
              className="text-white/65"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                fontWeight: 300,
              }}
            >
              Ocurrió un error inesperado. Por favor, intentá recargar la página.
            </p>

            {/* Error detail (collapsed) */}
            {this.state.error && (
              <details
                className="w-full text-left rounded-xl p-3"
                style={{
                  background: 'rgba(0,0,0,0.15)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
              >
                <summary
                  className="cursor-pointer text-white/50"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.75rem',
                  }}
                >
                  Detalle técnico
                </summary>
                <pre
                  className="mt-2 text-white/40 overflow-auto max-h-32"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.6875rem',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Reload button */}
            <button
              onClick={this.handleReload}
              className="w-full py-4 rounded-full text-white font-bold flex items-center justify-center gap-2"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #ff8c42, #ff6b1f)',
                boxShadow: '0 4px 20px rgba(255,107,31,0.40)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20 }}
              >
                refresh
              </span>
              Recargar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
