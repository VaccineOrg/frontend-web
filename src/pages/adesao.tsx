import { useState } from "react"

import Head from "next/head"
import { Tooltip } from "@chakra-ui/tooltip"
import { useRouter } from "next/router"
import { IconButton } from "@chakra-ui/button"
import { parseCookies } from "nookies"
import { GetServerSideProps } from "next"
import { Flex, Heading, HStack } from "@chakra-ui/layout"
import { MdArrowBack, MdArrowForward } from "react-icons/md"
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table"

import { formatToLocaleDateString } from "../utils/Format"

import { showErrorMessage, ToastComponent } from "../components/Toast"

import CampaignService from "../services/CampaignService"
import UserVaccineCampaignService from "../services/UserVaccineCampaignService"

import { Campaign } from "../types/Campaign"

interface AdesaoProps {
  campaignList: Campaign[],
}

function Adesao({ campaignList }: AdesaoProps) {
  const router = useRouter()

  const [allCampaignList,] = useState<Campaign[]>(campaignList)
  const [campaignSelected, setCampaignSelected] = useState<Campaign | undefined>(undefined)

  const service = new UserVaccineCampaignService()

  const handleAccession = async (idVaccine: number) => {
    const { 'nextauth.token': token } = parseCookies()

    if (campaignSelected && token) {
      let [, id] = token.split(".")

      await service.campaignAccession(campaignSelected.id, { idUser: parseInt(id), idVaccine })
        .then(() => router.push('/consulta'))
        .catch(err => { console.log(err); showErrorMessage(err.response.data.description) })
    }
  }

  return (
    <>
      <Head>
        <title>Vaccine App - Adesão a Campanha</title>
      </Head>
      <Flex
        w="100%"
        maxW="1160"
        mx="auto"
        direction="column"
      >
        {
          campaignSelected ?
            <>
              <HStack mt="12" spacing={6}>
                <Tooltip
                  label="Trocar campanha"
                  aria-label="Clicando neste botão você poderá trocar a campanha"
                >
                  <IconButton
                    aria-label="Trocar campanha"
                    icon={<MdArrowBack />}
                    onClick={() => setCampaignSelected(undefined)}
                  />
                </Tooltip>
                <Heading>Selecionar Vacina</Heading>
              </HStack>
              <Table mt={12}>
                {
                  campaignSelected.vaccineList.length == 0 &&
                  <TableCaption>
                    Nenhuma vacina para aderir
                  </TableCaption>
                }
                <Thead>
                  <Tr bg="lightgray">
                    <Th>Nome da Vacina</Th>
                    <Th>Descrição da Vacina</Th>
                    <Th>Aderir</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    campaignSelected.vaccineList.map(vaccine => (
                      <Tr key={vaccine.id}>
                        <Td>{vaccine.name}</Td>
                        <Td>{vaccine.description}</Td>
                        <Td>
                          <Tooltip
                            label="Selecionar vacina"
                            aria-label="Clicando neste botão você poderá selecionar a vacina para aderir a campanha"
                          >
                            <IconButton
                              aria-label="Selecionar vacina"
                              icon={<MdArrowForward />}
                              onClick={() => handleAccession(vaccine.id)}
                            />
                          </Tooltip>
                        </Td>
                      </Tr>
                    ))
                  }
                </Tbody>
              </Table>
            </>
            :
            <>
              <Heading mt="12">Adesão a Campanha</Heading>
              <Table mt={12}>
                {
                  allCampaignList.length == 0 &&
                  <TableCaption>Nenhuma campanha para aderir</TableCaption>
                }
                <Thead>
                  <Tr bg="lightgray">
                    <Th>Nome da Campanha</Th>
                    <Th>Data</Th>
                    <Th>Vacina</Th>
                    <Th>Aderir</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {
                    allCampaignList
                      .filter(campaign => campaign.status === "ACCESSION")
                      .map(campaign => (
                        <Tr key={campaign.id}>
                          <Td>{campaign.name}</Td>
                          <Td>
                            {`${formatToLocaleDateString(campaign.dateBegin)} - ${formatToLocaleDateString(campaign.dateEnd)}`}
                          </Td>
                          <Td>{campaign.vaccineList?.map(vaccine => vaccine.name).join(" | ")}</Td>
                          <Td>
                            <Tooltip
                              label="Aderir a campanha"
                              aria-label="Clicando neste botão você poderá aderir a campanha"
                            >
                              <IconButton
                                aria-label="Aderir a campanha"
                                icon={<MdArrowForward />}
                                onClick={() => setCampaignSelected(campaign)}
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      ))
                  }
                </Tbody>
              </Table>
            </>
        }
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

  if (userProfile !== "20") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      }
    }
  }

  const campaignService = new CampaignService(context)

  let campaignList: Campaign[] = []

  await campaignService.getAllCampaigns()
    .then(response => campaignList = response.data)
    .catch(err => console.log("[Erro]: " + err))

  return {
    props: { campaignList }
  }
}

export default Adesao
