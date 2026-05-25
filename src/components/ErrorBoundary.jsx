import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    if (window.dtrum) {
      window.dtrum.reportError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-10 text-center text-red-500">Ops, algo deu errado. Nossa equipe já foi notificada.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;