import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Game crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-red-900 text-white p-8">
          <h2 className="text-4xl font-bold mb-4">Dieses Spiel ist abgestürzt!</h2>
          <p className="text-xl mb-8 opacity-80">Der Agent hat hier noch Bugs eingebaut. Bitte wähle ein anderes Spiel.</p>
          <pre className="bg-black/50 p-4 rounded text-sm text-red-200 max-w-2xl overflow-auto mb-8">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={this.props.onExit}
            className="px-8 py-4 bg-white text-red-900 font-bold rounded-full text-xl hover:scale-105 transition-transform"
          >
            Zurück zum Hub
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
