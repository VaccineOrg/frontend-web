import React from "react"
import { GetServerSideProps } from "next"
import { MdChevronRight } from "react-icons/md"
import {
	Flex,
	Heading,
	IconButton,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr
} from "@chakra-ui/react"

import CampaignService from "../services/CampaignService"

type Campaigns = {
	userId: number,
	campaignId: number,
	vaccineId: number,
	status: string,
	campaignName: string,
	vaccineName: string
}

type ConsultaProps = {
	campaigns: Campaigns[]
}

function Consulta({ campaigns }: ConsultaProps) {
	return (
		<Flex w="100%" maxW="1160" mx="auto" direction="column">
			<Heading mt="12">Consultar Campanhas</Heading>
			<Table variant="striped" mt={12}>
				<Thead>
					<Tr>
						<Th>Nome da Campanha</Th>
						<Th>Nome da Vacina</Th>
						<Th>Status</Th>
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody>
					{
						campaigns.map((campaign, index) => (
							<Tr key={index}>
								<Td>{campaign.campaignName}</Td>
								<Td>{campaign.vaccineName}</Td>
								<Td>{campaign.status}</Td>
								<Td>
									<IconButton variant="outline" aria-label="Search database" icon={<MdChevronRight />} />
								</Td>
							</Tr>
						))
					}
				</Tbody>
			</Table>
		</Flex>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const service = new CampaignService()

	const { data } = await service.getAllCampaignsByUser("Luiz")

	return {
		props: { campaigns: data.userCampaigns }
	}
}

export default Consulta
