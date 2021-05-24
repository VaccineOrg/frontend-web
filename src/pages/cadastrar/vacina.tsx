import React, { useRef, useState } from "react"

import * as yup from "yup"
import { useForm } from "react-hook-form"
import { useRouter } from "next/dist/client/router"
import { yupResolver } from '@hookform/resolvers/yup'
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
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure
} from "@chakra-ui/react"

import {
  showErrorMessage,
  showSuccessMessage,
  ToastComponent
} from "../../components/Toast"

import VaccineService from "../../services/VaccineService"

type Vaccine = {
  ableToDelete: boolean,
  description: string,
  id: number,
  name: string,
}

interface VacinaProps {
  vaccines: Vaccine[],
}

type VaccineData = Omit<Vaccine, "id" | "ableToDelete">

function Vacina({ vaccines }: VacinaProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)
  const router = useRouter()

  const [vaccineId, setVaccineId] = useState<number | null>(null)

  const schema = yup.object().shape({
    description: yup.string(),
    name: yup.string().required("Nome da vacina é obrigatório"),
  })

  const service = new VaccineService("10")

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    reset
  } = useForm<VaccineData>({
    resolver: yupResolver(schema)
  })

  const handleGetAll = async () => {
    router.replace(router.asPath)
  }

  const handleEdit = (vaccine: Vaccine) => {
    setValue("name", vaccine.name)
    setValue("description", vaccine.description)

    setVaccineId(vaccine.id)
  }

  const onReset = () => {
    reset()

    setVaccineId(null)
  }

  const onSubmit = (data: VaccineData) => {
    if (vaccineId) {
      service.updateVaccine(vaccineId, data)
        .then(() => {
          onReset()
          handleGetAll()
          showSuccessMessage("Vacina editada com sucesso")
        })
        .catch(err => showErrorMessage(err.message))
    }
    else {
      service.createVaccine(data)
        .then(() => {
          onReset()
          handleGetAll()
          showSuccessMessage("Vacina criada com sucesso")
        })
        .catch(err => showErrorMessage(err.message))
    }
  }

  const handleDelete = (vaccine: Vaccine) => {
    onOpen()

    setVaccineId(vaccine.id)
  }

  const refuseDelete = () => {
    onClose()

    setVaccineId(null)
  }

  const confirmDelete = () => {
    onClose()

    if (vaccineId) {
      service.deleteVaccine(vaccineId)
        .then(() => {
          handleGetAll()
          showSuccessMessage("Vacina deletada com sucesso")
        })
        .catch(err => showErrorMessage(err.message))
    }
  }

  return (
    <Flex w="100%" maxW="1160" mx="auto" direction="column">
      <Heading mt="12">Cadastrar Vacina</Heading>
      <Box mt={12}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl id="name" isInvalid={!!errors && !!errors["name"]}>
            <FormLabel>Nome da Vacina</FormLabel>
            <Input
              placeholder="Nome da vacina - Mês/Ano"
              {...register("name")}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl
            mt={4}
            id="description"
            isInvalid={!!errors && !!errors["description"]}
          >
            <FormLabel>Dica</FormLabel>
            <Input
              placeholder="Vacina contra ..."
              {...register("description")}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <Stack direction="row-reverse" spacing={4} mt={4}>
            <Button
              type="submit"
              isLoading={false}
              loadingText="Salvando"
            >
              Salvar
            </Button>
            <Button
              type="reset"
              onClick={onReset}
            >
              Limpar
            </Button>
          </Stack>
        </form>
      </Box>
      <Table mt={12}>
        {
          vaccines.length == 0 &&
          <TableCaption>Nenhuma vacina foi cadastrada</TableCaption>
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
                      icon={<MdModeEdit />}
                      isDisabled={!vaccine.ableToDelete}
                      onClick={() => handleEdit(vaccine)}
                      aria-label="Editar informações da vacina"
                    />
                    <IconButton
                      icon={<MdDelete />}
                      isDisabled={!vaccine.ableToDelete}
                      onClick={() => handleDelete(vaccine)}
                      aria-label="Excluir vacina"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))
          }
        </Tbody>
      </Table>
      <AlertDialog
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>
            Excluir ?
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Tem certeza que gostaria de excluir a vacina ?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={refuseDelete}>Cancelar</Button>
            <Button ml={3} onClick={confirmDelete}>Confirmar</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ToastComponent />
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const service = new VaccineService("10")

  const { data } = await service.getAllVaccines()

  return { props: { vaccines: data } }
}

export default Vacina
