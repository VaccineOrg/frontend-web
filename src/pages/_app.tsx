import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import Header from '../components/Header'

import theme from '../styles/theme'

import 'react-toastify/dist/ReactToastify.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Header />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
