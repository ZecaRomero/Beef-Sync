import '../styles/globals.css';
import '../styles/components.css';
import { AppProvider } from '../contexts/AppContext';
import ErrorBoundary from '../components/common/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Component {...pageProps} />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default MyApp;