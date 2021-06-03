import React from "react"

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
	)
}

export const getServerSideProps: GetServerSideProps = async (_context) => {
	const service = new UserCampaignService()

	let userCampaignList: UserCampaign[] = []

	await service.getAllCampaignsByUser("Luiz")
		.then(response => userCampaignList = response.data.userCampaigns)

	return {
		props: { userCampaignList }
	}
}

export default Consulta
