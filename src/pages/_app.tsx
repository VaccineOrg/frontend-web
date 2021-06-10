import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import { AuthProvider } from '../contexts/AuthContext'

import Header from '../components/Header'

import theme from '../styles/theme'

import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';

import "../styles/global.css"

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChakraProvider resetCSS theme={theme}>
        <Header />
        <Component {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  )
}

export default App
