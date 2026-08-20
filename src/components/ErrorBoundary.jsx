import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              This page hit an unexpected error. It has been logged, and the rest of the site is unaffected.
            </p>
            <button
              onClick={this.handleReload}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Back to home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
