import React from "react"

import NextLink from "next/link"
import Icon from "@chakra-ui/icon"
import { Button } from "@chakra-ui/button"
import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Link,
  Spacer,
  Text
} from "@chakra-ui/layout"
import {
  MdPolymer,
  MdPowerSettingsNew
} from "react-icons/md"

function Header() {
  return (
    <Flex w="100%" maxW="1440" mx="auto" direction="column" bg="lightgray">
      <Flex direction="row" align="center" pt={4} px={4}>
        <Icon as={MdPolymer} w={12} h={12} />
        <Spacer />
        {
          false ?
            <Button leftIcon={<MdPowerSettingsNew />}>Deslogar da conta</Button> :
            <HStack spacing="6" bg="transparent" px={4}>
              <NextLink href="/registro">
                <Link style={{ textDecoration: "none" }}>Registrar-se</Link>
              </NextLink>
              <Text>|</Text>
              <NextLink href="/login">
                <Link style={{ textDecoration: "none" }}>Logar</Link>
              </NextLink>
            </HStack>
        }
      </Flex>
      <Grid pt={4} pl={4} templateColumns="repeat(2, 1fr)">
        <Flex w="100%">
          <NextLink href="/">
            <Heading size="lg">Vacinação</Heading>
          </NextLink>
          <Spacer />
          <HStack spacing="6" bg="white" pl={4}>
            <Text>Mostrar:</Text>
            <NextLink href="/consulta">
              <Link style={{ textDecoration: "none" }}>Consulta</Link>
            </NextLink>
            <NextLink href="/vacina">
              <Link style={{ textDecoration: "none" }}>Vacina</Link>
            </NextLink>
            <NextLink href="/campanha">
              <Link style={{ textDecoration: "none" }}>Campanha</Link>
            </NextLink>
          </HStack>
        </Flex>
        <Box w="100%" bg="white"></Box>
      </Grid>
    </Flex>
  )
}

export default Header
