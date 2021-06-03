import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

import { UserCampaignList } from "../types/UserCampaign";

class UserCampaignService extends ApiService {
    constructor() {
        super("/v1/vaccination");
    }

    getAllCampaignsByUser(name: string): Promise<AxiosResponse<UserCampaignList>> {
        return this.get(`/${name}/campaigns`)
    }
}

export default UserCampaignService
