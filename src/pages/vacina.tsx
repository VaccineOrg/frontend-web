import React, {useRef, useState} from "react"

import * as yup from "yup"
import Head from "next/head"
import {SubmitHandler, useForm} from "react-hook-form"
import {yupResolver} from '@hookform/resolvers/yup'
import {parseCookies} from "nookies"
import {GetServerSideProps} from "next"
import {MdDelete, MdModeEdit} from "react-icons/md"
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
  FormHelperText,
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
  Tooltip,
  Tr,
  useDisclosure
} from "@chakra-ui/react"

import {showErrorMessage, showSuccessMessage, ToastComponent} from "../components/Toast"

import VaccineService from "../services/VaccineService"

import {Vaccine, VaccineData} from "../types/Vaccine"

interface VacinaProps {
  vaccineList: Vaccine[],
}

function Vacina({vaccineList}: VacinaProps) {
  const {isOpen, onOpen, onClose} = useDisclosure()

  const cancelRef = useRef(null)

  const [savingVaccine, setSavingVaccine] = useState<boolean>(false)
  const [allVaccineList, setAllVaccineList] = useState<Vaccine[]>(vaccineList)
  const [vaccineSelectedToEdit, setVaccineSelectedToEdit] = useState<Vaccine | undefined>(undefined)
  const [vaccineSelectedToDelete, setVaccineSelectedToDelete] = useState<Vaccine | undefined>(undefined)

  const service = new VaccineService()

  const schema = yup.object().shape({
    description: yup.string(),
    name: yup.string()
      .required("Obrigatório inserir nome"),
  })

  const {
    formState: {errors},
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<VaccineData>({
    resolver: yupResolver(schema)
  })

  const handleRefresh = async () => {
    await service.getAllVaccines()
      .then(response => setAllVaccineList(response.data))
      .catch(err => showErrorMessage(err.response.data.description))
  }

  const handleEdit = (vaccine: Vaccine) => {
    setValue("name", vaccine.name)
    setValue("description", vaccine.description)

    setVaccineSelectedToEdit(vaccine)
  }

  const handleDelete = (vaccine: Vaccine) => {
    onOpen()

    setVaccineSelectedToDelete(vaccine)
  }

  const refuseDelete = () => {
    onClose()

    setVaccineSelectedToDelete(undefined)
  }

  const confirmDelete = async () => {
    onClose()

    if (vaccineSelectedToDelete) {
      await service.deleteVaccine(vaccineSelectedToDelete.id)
        .then(() => {
          onReset("delete")
          if (vaccineSelectedToDelete === vaccineSelectedToEdit) reset()
          showSuccessMessage("Vacina deletada com sucesso")
          handleRefresh()
        })
        .catch(err => showErrorMessage(err.response.data.description))
    }
  }

  const onReset = (mode: "edit" | "delete") => {
    if (mode === "delete") setVaccineSelectedToDelete(undefined)
    else {
      reset()
      setVaccineSelectedToEdit(undefined)
    }
  }

  const onSubmit: SubmitHandler<VaccineData> = async data => {
    setSavingVaccine(true)

    if (vaccineSelectedToEdit) {
      await service.updateVaccine(vaccineSelectedToEdit.id, data)
        .then(() => {
          onReset("edit")
          showSuccessMessage("Vacina editada com sucesso")
          handleRefresh()
        })
        .catch(err => showErrorMessage(err.response.data.description))
    } else {
      await service.createVaccine(data)
        .then(() => {
          reset()
          showSuccessMessage("Vacina criada com sucesso")
          handleRefresh()
        })
        .catch(err => showErrorMessage(err.response.data.description))
    }

    setSavingVaccine(false)
  }

  return (
    <>
      <Head>
        <title>Vaccine App - Vacinas</title>
      </Head>
      <Flex
        w="100%"
        maxW="1160"
        mx="auto"
        px="8"
        direction="column"
      >
        <Flex
          w="100%"
          maxW={[360, 360, 480]}
          mx="auto"
          direction="column"
        >
          <Heading mt="12">Cadastrar Vacina</Heading>
          <Box mt={12}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                isRequired
                id="name"
                isInvalid={!!errors && !!errors["name"]}
              >
                <FormLabel>Nome da Vacina</FormLabel>
                <Input
                  isReadOnly={vaccineSelectedToEdit && !vaccineSelectedToEdit?.ableToDelete}
                  placeholder="Nome da vacina - Mês/Ano"
                  {...register("name")}
                />
                {
                  vaccineSelectedToEdit && !vaccineSelectedToEdit?.ableToDelete &&
                    <FormHelperText>
                        Não pode alterar nome quando atrelada a uma campanha!
                    </FormHelperText>
                }
                <FormErrorMessage>
                  {errors.name?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                mt={4}
                id="description"
                isInvalid={!!errors && !!errors["description"]}
              >
                <FormLabel>Descrição da Vacina</FormLabel>
                <Input
                  placeholder="Vacina contra ..."
                  {...register("description")}
                />
                <FormErrorMessage>
                  {errors.name?.message}
                </FormErrorMessage>
              </FormControl>
              <Stack direction="row-reverse" spacing={4} mt={4}>
                <Tooltip
                  label={`${vaccineSelectedToEdit ? "Editar" : "Cadastrar"} vacina`}
                  aria-label={`Clicando neste botão você irá ${vaccineSelectedToEdit ? "editar" : "cadastrar"} a vacina`}
                >
                  <Button
                    type="submit"
                    isLoading={savingVaccine}
                    loadingText="Salvando"
                  >
                    {vaccineSelectedToEdit ? "Editar" : "Cadastrar"}
                  </Button>
                </Tooltip>
                <Tooltip
                  label={`${vaccineSelectedToEdit ? "Cancelar edição" : "Limpar campos"}`}
                  aria-label={`Clicando neste botão você irá ${vaccineSelectedToEdit ? "cancelar a edição" : "limpar os campos"} do formulário de vacinas`}
                >
                  <Button
                    type="reset"
                    onClick={() => onReset("edit")}
                  >
                    {vaccineSelectedToEdit ? "Cancelar" : "Limpar"}
                  </Button>
                </Tooltip>
              </Stack>
            </form>
          </Box>
        </Flex>
        <Flex overflowX="scroll">
          <Table mt={12}>
            {
              allVaccineList.length == 0 &&
                <TableCaption>
                    Nenhuma vacina foi cadastrada
                </TableCaption>
            }
            <Thead>
              <Tr bg="lightgray">
                <Th>Nome da Vacina</Th>
                <Th>Descrição da Vacina</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                allVaccineList.map(vaccine => (
                  <Tr key={vaccine.id}>
                    <Td>{vaccine.name}</Td>
                    <Td>{vaccine.description}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip
                          label="Editar informações da vacina"
                          aria-label="Clicando neste botão você poderá editar as informações referentes a vacina cadastrada"
                        >
                          <IconButton
                            icon={<MdModeEdit/>}
                            onClick={() => handleEdit(vaccine)}
                            aria-label="Clicando neste botão você poderá editar as informações referentes a vacina cadastrada"
                          />
                        </Tooltip>
                        <Tooltip
                          label="Excluir vacina"
                          aria-label="Clicando neste botão você poderá excluir a vacina cadastrada"
                        >
                          <IconButton
                            icon={<MdDelete/>}
                            isDisabled={!vaccine.ableToDelete}
                            onClick={() => handleDelete(vaccine)}
                            aria-label="Clicando neste botão você poderá excluir a vacina cadastrada"
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))
              }
            </Tbody>
          </Table>
        </Flex>
        <AlertDialog
          isCentered
          isOpen={isOpen}
          onClose={onClose}
          motionPreset="slideInBottom"
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay/>
          <AlertDialogContent>
            <AlertDialogHeader>
              Excluir ?
            </AlertDialogHeader>
            <AlertDialogCloseButton/>
            <AlertDialogBody>
              Tem certeza que gostaria de excluir a vacina ?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={refuseDelete}>Cancelar</Button>
              <Button ml={3} onClick={confirmDelete}>Confirmar</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <ToastComponent/>
      </Flex>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {'nextauth.token': token} = parseCookies(context)

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  const [userProfile,] = token.split(".")

  if (userProfile !== "10") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      }
    }
  }

  const service = new VaccineService(context)

  let vaccineList: Vaccine[] = []

  await service.getAllVaccines()
    .then(response => vaccineList = response.data)
    .catch(err => console.log("[Erro]: " + err))

  return {
    props: {vaccineList}
  }
}

export default Vacina
