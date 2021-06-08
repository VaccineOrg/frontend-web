import React, { useRef, useState } from "react"

import * as yup from "yup"
import Select from "react-select"
import DatePicker, { registerLocale } from "react-datepicker";
import Head from "next/head"
import { ptBR } from "date-fns/locale";
import { yupResolver } from '@hookform/resolvers/yup'
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { MdArrowForward, MdDelete, MdModeEdit } from "react-icons/md"
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
  forwardRef,
  Heading,
  HStack,
  IconButton,
  Input,
  InputProps,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select as ChakraSelect,
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

import { showErrorMessage, showSuccessMessage, ToastComponent } from "../components/Toast"

import { formatToLocaleDateString, formatDateToString, formatStatusToPortuguese, formatStringToDate } from "../utils/Format";

import CampaignService from "../services/CampaignService"
import VaccineService from "../services/VaccineService"

import { Campaign, CampaignData } from "../types/Campaign"
import { Vaccine } from "../types/Vaccine"

interface CampanhaProps {
  campaignList: Campaign[],
  vaccineList: Vaccine[],
}

registerLocale("ptBR", ptBR);

function Campanha({ campaignList, vaccineList }: CampanhaProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const cancelRef = useRef(null)

  const [savingCampaign, setSavingCampaign] = useState<boolean>(false)
  const [allVaccineList,] = useState<Vaccine[]>(vaccineList)
  const [allCampaignList, setAllCampaignList] = useState<Campaign[]>(campaignList)
  const [campaignSelectedToEdit, setCampaignSelectedToEdit] = useState<Campaign | undefined>(undefined)
  const [campaignSelectedToDelete, setCampaignSelectedToDelete] = useState<Campaign | undefined>(undefined)

  const service = new CampaignService()

  const schema = yup.object().shape({
    dateBegin: yup.date()
      .typeError("Data inválida")
      .required("Obrigatório definir data de início"),
    dateEnd: yup.date()
      .typeError("Data inválida")
      .required("Obrigatório definir data de fim"),
    name: yup.string()
      .required("Obrigatório inserir nome"),
    vaccineList: yup.array()
      .min(1)
      .required(),
    numberVaccines: yup.number()
      .typeError("Quantidade inválida")
      .min(1, "Obrigatório ao menos uma vacina")
      .required("Obrigatório inserir total de vacinas"),
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<CampaignData>({
    defaultValues: {
      status: "SIGN_UP",
      numberVaccines: 0
    },
    resolver: yupResolver(schema)
  })

  const options = allVaccineList.map(vaccine => {
    return { value: vaccine.id, label: vaccine.name }
  })

  const handleRefresh = async () => {
    await service.getAllCampaigns()
      .then(response => setAllCampaignList(response.data))
      .catch(err => showErrorMessage(err.response.data.description))
  }

  const handleVaccineList = (selectedOptions: any) => {
    const vaccineListData: Vaccine[] = []

    selectedOptions.forEach(
      (option: { value: number, label: string }) => {
        vaccineListData.push(
          allVaccineList.filter(vaccine => vaccine.id === option.value)[0]
        )
      }
    )

    setValue("vaccineList", vaccineListData)
  }

  const handleStatus = async (campaign: Campaign) => {
    await service.updateCampaignStatus(campaign.id)
      .then(() => {
        onReset("edit")
        handleRefresh()
        showSuccessMessage("Estado da campanha editado com sucesso")
      })
      .catch(err => showErrorMessage(err.response.data.description))
  }

  const handleEdit = (campaign: Campaign) => {
    setValue("name", campaign.name)
    setValue("dateBegin", formatStringToDate(campaign.dateBegin))
    setValue("dateEnd", formatStringToDate(campaign.dateEnd))
    setValue("status", campaign.status)
    setValue("vaccineList", campaign.vaccineList)
    setValue("numberVaccines", campaign.numberVaccines)

    setCampaignSelectedToEdit(campaign)
  }

  const handleDelete = (campaign: Campaign) => {
    onOpen()

    setCampaignSelectedToDelete(campaign)
  }

  const refuseDelete = () => {
    onClose()

    setCampaignSelectedToDelete(undefined)
  }

  const confirmDelete = async () => {
    onClose()

    if (campaignSelectedToDelete) {
      await service.deleteCampaign(campaignSelectedToDelete.id)
        .then(() => {
          onReset("delete")
          if (campaignSelectedToDelete === campaignSelectedToEdit) reset()
          showSuccessMessage("Campanha deletada com sucesso")
          handleRefresh()
        })
        .catch(err => showErrorMessage(err.response.data.description))
    }
  }

  const onReset = (mode: "edit" | "delete") => {
    if (mode === "delete") setCampaignSelectedToDelete(undefined)
    else {
      reset()
      setCampaignSelectedToEdit(undefined)
    }
  }

  const onSubmit: SubmitHandler<CampaignData> = async data => {
    setSavingCampaign(true)

    const campaign: Omit<Campaign, "id"> = {
      ...data,
      dateBegin: formatDateToString(data.dateBegin),
      dateEnd: formatDateToString(data.dateEnd)
    }

    if (campaignSelectedToEdit) {
      await service.updateCampaign(campaignSelectedToEdit.id, campaign)
        .then(() => {
          onReset("edit")
          handleRefresh()
          showSuccessMessage("Campanha editada com sucesso")
        })
        .catch(err => showErrorMessage(err.response.data.description))
    }
    else {
      await service.createCampaign(campaign)
        .then(() => {
          reset()
          handleRefresh()
          showSuccessMessage("Campanha criada com sucesso")
        })
        .catch(err => showErrorMessage(err.response.data.description))
    }

    setSavingCampaign(false)
  }

  const DatePickerInput = forwardRef<InputProps, "input">(
    (props, ref) => (
      <Input
        {...props}
        ref={ref}
        isReadOnly={true}
        onChange={() => { }}
      />
    )
  )

  return (
    <>
      <Head>
        <title>Vaccine App - Campanhas</title>
      </Head>
      <Flex
        w="100%"
        maxW="1160"
        mx="auto"
        direction="column"
      >
        <Heading mt="12">Cadastrar Campanha</Heading>
        <Box mt={12}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl
              isRequired
              id="name"
              isInvalid={!!errors && !!errors["name"]}
            >
              <FormLabel>Nome da Campanha</FormLabel>
              <Input
                placeholder="Nome da campanha"
                {...register("name")}
              />
              <FormErrorMessage>
                {errors.name?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              mt={4}
              isRequired
              id="dateBegin"
              isInvalid={!!errors && !!errors["dateBegin"]}
            >
              <FormLabel>Data de Início da Campanha</FormLabel>
              <Controller
                name="dateBegin"
                control={control}
                defaultValue={null}
                render={({
                  field: { name, value, onChange, ref }
                }) => (
                  <DatePicker
                    name={name}
                    selected={value}
                    onChange={date => onChange(date)}
                    ref={ref}
                    locale="ptBR"
                    dateFormat="dd/MM/yyyy"
                    wrapperClassName="datePicker"
                    placeholderText="Data de Início da Campanha"
                    customInput={<DatePickerInput />}
                  />
                )}
              />
              <FormErrorMessage>
                {errors.dateBegin?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              mt={4}
              isRequired
              id="dateEnd"
              isInvalid={!!errors && !!errors["dateEnd"]}
            >
              <FormLabel>Data de Fim da Campanha</FormLabel>
              <Controller
                name="dateEnd"
                control={control}
                defaultValue={null}
                render={({
                  field: { name, value, onChange, ref }
                }) => (
                  <DatePicker
                    name={name}
                    selected={value}
                    onChange={date => onChange(date)}
                    ref={ref}
                    locale="ptBR"
                    dateFormat="dd/MM/yyyy"
                    wrapperClassName="datePicker"
                    placeholderText="Data de Fim da Campanha"
                    customInput={<DatePickerInput />}
                  />
                )}
              />
              <FormErrorMessage>
                {errors.dateEnd?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              mt={4}
              isRequired
              id="status"
            >
              <FormLabel>Estado da Campanha</FormLabel>
              <ChakraSelect
                isDisabled
                value={watch("status")}
              >
                <option value="SIGN_UP">Cadastrada</option>
                <option value="ACCESSION">Em adesão</option>
                <option value="IN_PROGRESS">Em andamento</option>
                <option value="CLOSED">Finalizada</option>
              </ChakraSelect>
            </FormControl>
            <FormControl
              mt={4}
              isRequired
              id="vaccineList"
              isInvalid={!!errors && !!errors["vaccineList"]}
            >
              <FormLabel>Lista de Vacinas</FormLabel>
              <Select
                isMulti
                options={options}
                value={options.filter(option => {
                  return watch("vaccineList")?.filter(
                    vaccine => { return option.value === vaccine.id }
                  ).length > 0
                })}
                onChange={handleVaccineList}
                instanceId={"select"}
                placeholder={"Selecione as vacinas para a campanha"}
                noOptionsMessage={() => "Sem opções"}
              />
              <FormErrorMessage>
                {errors.vaccineList && "Obrigatório ao menos uma vacina"}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              mt={4}
              isRequired
              id="numberVaccines"
              isInvalid={!!errors && !!errors["numberVaccines"]}
            >
              <FormLabel>Número de Vacinas</FormLabel>
              <Controller
                name="numberVaccines"
                control={control}
                render={({ field }) => (
                  <NumberInput {...field} defaultValue={0} min={0}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
              <FormErrorMessage>
                {errors.numberVaccines?.message}
              </FormErrorMessage>
            </FormControl>
            <Stack
              direction="row-reverse"
              spacing={4}
              mt={4}
            >
              <Tooltip
                label={`${campaignSelectedToEdit ? "Editar" : "Cadastrar"} campanha`}
                aria-label={`Clicando neste botão você irá ${campaignSelectedToEdit ? "editar" : "cadastrar"} a campanha`}
              >
                <Button
                  type="submit"
                  isLoading={savingCampaign}
                  loadingText="Salvando"
                >
                  {campaignSelectedToEdit ? "Editar" : "Cadastrar"}
                </Button>
              </Tooltip>
              <Tooltip
                label={`${campaignSelectedToEdit ? "Cancelar edição" : "Limpar campos"}`}
                aria-label={`Clicando neste botão você irá ${campaignSelectedToEdit ? "cancelar a edição" : "limpar os campos"} do formulário de campanhas`}
              >
                <Button
                  type="reset"
                  onClick={() => onReset("edit")}
                >
                  {campaignSelectedToEdit ? "Cancelar" : "Limpar"}
                </Button>
              </Tooltip>
            </Stack>
          </form>
        </Box>
        <Table mt={12}>
          {
            allCampaignList.length == 0 &&
            <TableCaption>Nenhuma campanha foi cadastrada</TableCaption>
          }
          <Thead>
            <Tr bg="lightgray">
              <Th>Nome da Campanha</Th>
              <Th>Data</Th>
              <Th>Vacina</Th>
              <Th>Estado</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              allCampaignList.map(campaign => (
                <Tr key={campaign.id}>
                  <Td>{campaign.name}</Td>
                  <Td>
                    {`${formatToLocaleDateString(campaign.dateBegin)} - ${formatToLocaleDateString(campaign.dateEnd)}`}
                  </Td>
                  <Td>{campaign.vaccineList?.map(vaccine => vaccine.name).join(" | ")}</Td>
                  <Td>{formatStatusToPortuguese(campaign.status)}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip
                        label="Próximo estado"
                        aria-label="Clicando neste botão você poderá dar sequência no estado em que a campanha se encontra"
                      >
                        <IconButton
                          isDisabled={campaign.status === "CLOSED"}
                          aria-label="Editar informações da campanha"
                          icon={<MdArrowForward />}
                          onClick={() => handleStatus(campaign)}
                        />
                      </Tooltip>
                      <Tooltip
                        label="Editar informações da campanha"
                        aria-label="Clicando neste botão você poderá editar as informações referentes a campanha cadastrada"
                      >
                        <IconButton
                          isDisabled={campaign.status !== "SIGN_UP"}
                          aria-label="Editar informações da campanha"
                          icon={<MdModeEdit />}
                          onClick={() => handleEdit(campaign)}
                        />
                      </Tooltip>
                      <Tooltip
                        label="Excluir campanha"
                        aria-label="Clicando neste botão você poderá excluir a campanha cadastrada"
                      >
                        <IconButton
                          isDisabled={campaign.status !== "SIGN_UP"}
                          aria-label="Excluir campanha"
                          icon={<MdDelete />}
                          onClick={() => handleDelete(campaign)}
                        />
                      </Tooltip>
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
              Tem certeza que gostaria de excluir a campanha ?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={refuseDelete}
              >
                Cancelar
              </Button>
              <Button
                ml={3}
                onClick={confirmDelete}
              >
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <ToastComponent />
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

  if (userProfile !== "10") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      }
    }
  }

  const vaccineService = new VaccineService(context)

  let vaccineList: Vaccine[] = []

  await vaccineService.getAllVaccines()
    .then(response => vaccineList = response.data)
    .catch(err => console.log("[Erro]: " + err))

  const campaignService = new CampaignService(context)

  let campaignList: Campaign[] = []

  await campaignService.getAllCampaigns()
    .then(response => campaignList = response.data)
    .catch(err => console.log("[Erro]: " + err))

  return {
    props: { campaignList, vaccineList }
  }
}

export default Campanha
