import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center p-4">
          <div className="bg-black/50 p-6 sm:p-8 rounded-lg border border-red-500/50 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            
            <h1 className="text-white font-bold text-xl mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-300 text-sm mb-6">
              The game encountered an unexpected error. Don't worry, your progress is saved!
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-lg hover:from-red-500 hover:to-red-400 transition-all duration-200 flex items-center gap-2 justify-center"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Game
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-red-400 cursor-pointer text-sm">Error Details (Dev Mode)</summary>
                <pre className="text-xs text-gray-400 mt-2 overflow-auto max-h-32 bg-black/30 p-2 rounded">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}