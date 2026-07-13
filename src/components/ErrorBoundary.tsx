import { Component, type ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Keeps one failed interactive section from blanking the page. The fallback
 * names the section and offers a retry.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error): void {
    console.error(`Section failed: ${this.props.label}`, error)
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="error-box" role="alert">
          <p>
            <strong>{this.props.label}</strong> hit a rendering problem and has been paused
            so the rest of the page keeps working.
          </p>
          <button type="button" className="btn btn--small" onClick={() => this.setState({ error: null })}>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
