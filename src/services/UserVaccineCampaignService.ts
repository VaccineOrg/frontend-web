import ApiService from "./ApiService";

import { Accession } from "../types/UserVaccineCampaign";

class UserVaccineCampaignService extends ApiService {
    constructor(context?: any) {
        super("/v1/userVaccineCampaign", context);
    }

    campaignAccession(id: number, accession: Accession) {
        return this.post(`/accession/${id}`, accession)
    }
}

export default UserVaccineCampaignService
