import React from "react"
import { GetServerSideProps } from "next"
import { MdDelete, MdModeEdit } from "react-icons/md"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure
} from "@chakra-ui/react"

import VaccineService from "../../services/VaccineService"

type Vaccine = {
  ableToDelete: boolean,
  description: string,
  id: number,
  name: string,
}

type VacinaProps = {
  vaccines: Vaccine[]
}

function Vacina({ vaccines }: VacinaProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  return (
    <Flex w="100%" maxW="1160" mx="auto" direction="column">
      <Heading mt="12">Cadastrar Vacina</Heading>
      <Box mt={12}>
        <form>
          <FormControl id="nome" isRequired>
            <FormLabel>Nome da Vacina</FormLabel>
            <Input placeholder="Nome da vacina - Mês/Ano" type="text" />
          </FormControl>
          <FormControl id="dica" mt={4} isRequired>
            <FormLabel>Dica</FormLabel>
            <Input placeholder="Vacina contra ..." type="text" />
          </FormControl>
          <Button
            mt={4}
            isLoading={false}
            loadingText="Salvando"
            variant="outline"
          >
            Salvar
          </Button>
        </form>
      </Box>
      <Table mt={12}>
        {
          vaccines.length == 0 &&
          <TableCaption>
            Nenhuma vacina foi cadastrada
          </TableCaption>
        }
        <Thead>
          <Tr bg="lightgray">
            <Th>Nome da Vacina</Th>
            <Th>Dica</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            vaccines.map(vaccine => (
              <Tr key={vaccine.id}>
                <Td>{vaccine.name}</Td>
                <Td>{vaccine.description}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      variant="outline"
                      aria-label="Editar informações da vacina"
                      icon={<MdModeEdit />}
                    />
                    <IconButton
                      onClick={onOpen}
                      isDisabled={!vaccine.ableToDelete}
                      variant="outline"
                      aria-label="Excluir vacina"
                      icon={<MdDelete />}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Excluir ?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Tem certeza que gostaria de excluir a vacina ?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>Cancelar</Button>
            <Button ml={3} onClick={onClose}>Confirmar</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const USER_PROFILE = "10"

  const service = new VaccineService(USER_PROFILE)

  const { data } = await service.getAllVaccines()

  return {
    props: { vaccines: data }
  }
}

export default Vacina
