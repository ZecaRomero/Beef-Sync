import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
          <Card className="max-w-lg w-full border-2 border-red-200 dark:border-red-600">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🚨</div>
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Ops! Algo deu errado
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Ocorreu um erro inesperado no sistema. Nossa equipe foi notificada.
                </p>
                
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 text-left">
                    <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">
                      Detalhes do Erro (Desenvolvimento):
                    </h3>
                    <pre className="text-xs text-red-700 dark:text-red-400 overflow-auto">
                      {this.state.error && this.state.error.toString()}
                      <br />
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
                
                <div className="flex space-x-3 justify-center">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    🔄 Recarregar Página
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                  >
                    🏠 Ir para Início
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;