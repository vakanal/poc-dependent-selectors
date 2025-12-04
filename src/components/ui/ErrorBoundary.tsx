import { Component, type ReactNode } from "react";
import { Alert } from "react-bootstrap";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Alert variant="danger">
            <Alert.Heading>Ha ocurrido un error</Alert.Heading>
            <p>
              {this.state.error?.message || "Error inesperado en el formulario"}
            </p>
          </Alert>
        )
      );
    }

    return this.props.children;
  }
}