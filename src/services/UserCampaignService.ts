import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

import { UserCampaignList } from "../types/UserCampaign";

class UserCampaignService extends ApiService {
    constructor() {
        super("/v1/vaccination");
    }

    getAllCampaignsByUserId(id: number): Promise<AxiosResponse<UserCampaignList>> {
        return this.get(`/${id}/campaigns`)
    }
}

export default UserCampaignService
