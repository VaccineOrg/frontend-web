import React from "react"

import Head from "next/head"
import { parseCookies } from "nookies"
import { GetServerSideProps } from "next"
import {
	Flex,
	Heading,
	Table,
	TableCaption,
	Tbody,
	Td,
	Th,
	Thead,
	Tr
} from "@chakra-ui/react"

import { formatStatusToPortuguese } from "../utils/Format"

import { ToastComponent } from "../components/Toast"

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
						</Tr>
					</Thead>
					<Tbody>
						{
							userCampaignList.map((campaign, index) => (
								<Tr key={index}>
									<Td>{campaign.campaignName}</Td>
									<Td>{campaign.vaccineName}</Td>
									<Td>{formatStatusToPortuguese(campaign.status)}</Td>
								</Tr>
							))
						}
					</Tbody>
				</Table>
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

	const [userProfile, id] = token.split(".")

	if (userProfile !== "20") {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			}
		}
	}

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
