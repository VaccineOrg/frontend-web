import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="Academic project for managing corporate vaccine campaigns." />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
