import PropTypes from 'prop-types';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { StoreProvider } from '../utils/Store';
import ThemeProvider from '../theme';
import ScrollToTop from '../components/scroll-to-top';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

App.propTypes = {
  Component: PropTypes.func,
  pageProps: PropTypes.object,
};

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading>
          <ThemeProvider>
            <ScrollToTop />
            {Component.auth ? (
              <Auth adminOnly={Component.auth.adminOnly}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )}
          </ThemeProvider>
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  );
}
function Auth({ children, adminOnly }) {
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (adminOnly && !session.user.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }

  return children;
}

Auth.propTypes = {
  children: PropTypes.object,
  adminOnly: PropTypes.bool,
};
