import '../styles/globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import { AppProvider } from '../contexts/AppContext';
import ErrorBoundary from '../components/shared/ErrorBoundary';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Component {...pageProps} />
              </div>
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;