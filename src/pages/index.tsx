import Head from "next/head"
import { Box, Flex, Heading } from "@chakra-ui/layout"

function Home() {
  return (
    <>
      <Head>
        <title>Vaccine App - Página inicial</title>
      </Head>
      <Flex
        w="100%"
        maxW="1160"
        mx="auto"
        direction="column"
      >
        <Heading mt="12">Página principal</Heading>
        <Box mt={12}>
        </Box>
      </Flex>
    </>
  )
}

export default Home
