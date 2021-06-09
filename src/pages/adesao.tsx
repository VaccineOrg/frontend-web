import Head from "next/head"
import { parseCookies } from "nookies"
import { GetServerSideProps } from "next"
import { Flex, Heading } from "@chakra-ui/layout"

function Adesao() {
  return (
    <>
      <Head>
        <title>Vaccine App - Consulta de Campanhas aderidas</title>
      </Head>
      <Flex
        w="100%"
        maxW="1160"
        mx="auto"
        direction="column"
      >
        <Heading mt="12">Adesão a Campanhas</Heading>
      </Flex>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { 'nextauth.token': token } = parseCookies(context)

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  const [userProfile,] = token.split(".")

  if (userProfile !== "20") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

export default Adesao
