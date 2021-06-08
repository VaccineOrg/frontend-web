import React from "react"

import Head from "next/head"
import { parseCookies } from "nookies"
import { MdChevronRight } from "react-icons/md"
import { GetServerSideProps } from "next"
import {
	Flex,
	Heading,
	IconButton,
	Table,
	TableCaption,
	Tbody,
	Td,
	Th,
	Thead,
	Tooltip,
	Tr
} from "@chakra-ui/react"

import { formatStatusToPortuguese } from "../utils/Format"

import UserCampaignService from "../services/UserCampaignService"

import { UserCampaign } from "../types/UserCampaign"

interface ConsultaProps {
	userCampaignList: UserCampaign[]
}

function Consulta({ userCampaignList }: ConsultaProps) {
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
				<Heading mt="12">Consultar Campanhas</Heading>
				<Table mt={12}>
					{
						userCampaignList.length == 0 &&
						<TableCaption>
							Você ainda não aderiu a uma campanha
						</TableCaption>
					}
					<Thead>
						<Tr bg="lightgray">
							<Th>Nome da Campanha</Th>
							<Th>Nome da Vacina</Th>
							<Th>Estado</Th>
							<Th></Th>
						</Tr>
					</Thead>
					<Tbody>
						{
							userCampaignList.map((campaign, index) => (
								<Tr key={index}>
									<Td>{campaign.campaignName}</Td>
									<Td>{campaign.vaccineName}</Td>
									<Td>{formatStatusToPortuguese(campaign.status)}</Td>
									<Td>
										<Tooltip
											label="Mais informações"
											aria-label="Clicando neste botão você verá as informações referentes a campanha que você se inscreveu"
										>
											<IconButton
												variant="outline"
												aria-label="Search database"
												icon={<MdChevronRight />}
											/>
										</Tooltip>
									</Td>
								</Tr>
							))
						}
					</Tbody>
				</Table>
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

	const [, id] = token.split(".")

	const service = new UserCampaignService(context)

	let userCampaignList: UserCampaign[] = []

	await service.getAllCampaignsByUserId(parseInt(id))
		.then(response => userCampaignList = response.data.userCampaigns)
		.catch(err => console.log("[Erro]: " + err))

	return {
		props: { userCampaignList }
	}
}

export default Consulta
