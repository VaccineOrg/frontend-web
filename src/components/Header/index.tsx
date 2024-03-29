import React, { useContext } from "react"

import NextLink from "next/link"
import Icon from "@chakra-ui/icon"
import { Button } from "@chakra-ui/button"
import { MdPolymer, MdPowerSettingsNew } from "react-icons/md"
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

import { AuthContext } from "../../contexts/AuthContext"

function Header() {
  const { isAdmin, isAuthenticated, signOut } = useContext(AuthContext)

  return (
    <Flex w="100%" maxW="1160" mx="auto" direction="column" bg="lightgray">
      <Flex direction="row" align="center" py={4} px={4}>
        <Icon as={MdPolymer} w={12} h={12} />
        <Spacer />
        {
          isAuthenticated ?
            <Button leftIcon={<MdPowerSettingsNew />} onClick={signOut}>Deslogar da conta</Button> :
            <HStack spacing="6" px={4}>
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
      {
        isAuthenticated &&
        <Grid templateColumns="repeat(2, 1fr)">
          <Flex w="100%" px="4">
            <NextLink href="/">
              <Heading size="lg">Vacinação</Heading>
            </NextLink>
          </Flex>
          <Box w="100%" h="100%" bg="white" px="4" alignSelf="center">
            <HStack h="100%" spacing="6" bg="white">
              {
                isAdmin ?
                    <>
                      <NextLink href="/vacina">
                        <Link style={{ textDecoration: "none" }}>Vacina</Link>
                      </NextLink>
                      <NextLink href="/campanha">
                        <Link style={{ textDecoration: "none" }}>Campanha</Link>
                      </NextLink>
                    </> :
                    <>
                      <NextLink href="/consulta">
                        <Link style={{ textDecoration: "none" }}>Consulta</Link>
                      </NextLink>
                      <NextLink href="/adesao">
                        <Link style={{ textDecoration: "none" }}>Adesão</Link>
                      </NextLink>
                    </>
              }
            </HStack>
          </Box>
        </Grid>
      }
    </Flex>
  )
}

export default Header
