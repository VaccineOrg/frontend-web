import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

import { Campaign } from "../types/Campaign"

class CampaignService extends ApiService {
    constructor(userProfile?: string) {
        super("/v1/campaigns", userProfile);
    }

    getAllCampaigns(): Promise<AxiosResponse<Campaign[]>> {
        return this.get("/")
    }

    createCampaign(campaign: Omit<Campaign, "id">): Promise<AxiosResponse<Campaign>> {
        return this.post("/", campaign)
    }

    updateCampaign(id: number, campaign: Omit<Campaign, "id">): Promise<AxiosResponse<Campaign>> {
        return this.put(`/${id}`, campaign)
    }

    updateCampaignStatus(id: number): Promise<AxiosResponse<Campaign>> {
        return this.get(`/status/${id}`)
    }

    deleteCampaign(id: number) {
        return this.delete(`/${id}`)
    }
}

export default CampaignService
