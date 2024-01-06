// Import global styles
import '@/styles/globals.css'
import { createGlobalStyle } from 'styled-components'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import Header from '@/components/Header';

// Define global styles using styled-components
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    /* Add more global styles here */
  }
  .box {
    text-align: left;
    border: gray ridge 1px;
    border-radius: 10px;
    margin: 3px;
    width: 50rem;
    padding: 10px;
    display: flex;
    align-items: stretch;
  }
`;

// Set up Apollo Client configuration
const httpLink = createHttpLink({
  uri: 'http://localhost:3001/api/graphql/'
});
// Set up authentication context for Apollo Client
const authLink = setContext((_, { headers }) => {
  // Retrieve token from session storage
  const token = sessionStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? 'Bearer ${token}' : ''
    }
  }
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// Main App component with ApolloProvider wrapping
export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <Header />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
