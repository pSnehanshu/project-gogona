import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { extendTheme } from '@chakra-ui/react';
import App from './App';
import reportWebVitals from './reportWebVitals';

import '@fontsource/ubuntu';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root') as HTMLElement);

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)',
};
const theme = extendTheme({
  fonts: {
    heading: 'Ubuntu, sans-serif',
    body: 'Ubuntu, sans-serif',
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles,
              },
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label':
              {
                ...activeLabelStyles,
              },
            label: {
              top: '2px',
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              color: 'gray',
              pointerEvents: 'none',
              mx: 3,
              p: 0,
              px: 2,
              my: 2,
              transformOrigin: 'left top',
              lineHeight: 1,
              borderRadius: 2,
            },
          },
        },
      },
    },
  },
});

// Redirect to www subdomain
if (!window.location.host.startsWith('www.')) {
  const wwwUrl = `${window.location.protocol}//www.${window.location.host}${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.href = wwwUrl;
} else {
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
}
