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
        maxW={[360, 360, 480]}
        mx="auto"
        px="8"
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
