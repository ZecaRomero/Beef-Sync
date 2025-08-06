import { AppProvider } from '../contexts/AppContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ToastProvider } from '../contexts/ToastContext';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <Component {...pageProps} />
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
