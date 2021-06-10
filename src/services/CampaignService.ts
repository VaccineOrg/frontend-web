import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

import { Campaign } from "../types/Campaign"

class CampaignService extends ApiService {
    constructor(context?: any) {
        super("/v1/campaigns", context);
    }

    getAllCampaigns(): Promise<AxiosResponse<Campaign[]>> {
        return this.get("/")
    }

    getCampaignById(id: number): Promise<AxiosResponse<Campaign>> {
        return this.get(`/${id}`)
    }

    createCampaign(campaign: Omit<Campaign, "id" | "adhered">): Promise<AxiosResponse<Campaign>> {
        return this.post("/", campaign)
    }

    updateCampaign(id: number, campaign: Omit<Campaign, "id" | "adhered">): Promise<AxiosResponse<Campaign>> {
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
