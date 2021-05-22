import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

type Vaccine = {
    description: string,
    name: string,
}

type VaccineModel = {
    ableToDelete: boolean,
    description: string,
    id: number,
    name: string,
}

type Vaccines = {
    vaccines: VaccineModel[]
}

class VaccineService extends ApiService {
    constructor(userProfile?: string) {
        super("/v1/vaccine", userProfile);
    }

    getAllVaccines(): Promise<AxiosResponse<Vaccines>> {
        return this.get("/")
    }

    createVaccine(vaccine: Vaccine): Promise<AxiosResponse<VaccineModel>> {
        return this.post("/", vaccine)
    }

    updateVaccine(id: number, vaccine: Vaccine): Promise<AxiosResponse<VaccineModel>> {
        return this.put(`/${id}`, vaccine)
    }

    deleteVaccine(id: number) {
        return this.delete(`/${id}`)
    }
}

export default VaccineService
