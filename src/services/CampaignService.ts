import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

type Campaign = {
    dateBegin: Date,
    dateEnd: Date,
    id: number,
    idVaccine: number,
    name: string,
    numberVaccines: number,
    status: string
}

type Campaigns = {
    userCampaigns: Campaign[]
}

type CampaignData = Omit<Campaign, "id">

class CampaignService extends ApiService {
    constructor(userProfile?: string) {
        super("/v1/vaccination", userProfile);
    }

    getAllCampaigns(): Promise<AxiosResponse<Campaigns>> {
        return this.get("/")
    }

    getAllCampaignsByUser(name: string): Promise<AxiosResponse<Campaigns>> {
        return this.get(`/${name}/campaigns`)
    }

    createCampaign(campaign: CampaignData): Promise<AxiosResponse<Campaign>> {
        return this.post("/", campaign)
    }

    updateCampaign(id: number, campaign: CampaignData): Promise<AxiosResponse<Campaign>> {
        return this.put(`/${id}`, campaign)
    }

    deleteCampaign(id: number) {
        return this.delete(`/${id}`)
    }
}

export default CampaignService
