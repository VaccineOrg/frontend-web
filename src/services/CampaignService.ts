import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

type Campaign = {
	userId: number,
	campaignId: number,
	vaccineId: number,
	status: string,
	campaignName: string,
	vaccineName: string
}

type Campaigns = {
    userCampaigns: Campaign[]
}

class CampaignService extends ApiService {
    constructor(userProfile?: string) {
        super("/v1/vaccination", userProfile);
    }

    getAllCampaignsByUser(name: string): Promise<AxiosResponse<Campaigns>> {
        return this.get(`/${name}/campaigns`)
    }
}

export default CampaignService
