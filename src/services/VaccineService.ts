import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

import { Vaccine, VaccineData } from "../types/Vaccine"

class VaccineService extends ApiService {
    constructor(context?: any) {
        super("/v1/vaccine", context);
    }

    getAllVaccines(): Promise<AxiosResponse<Vaccine[]>> {
        return this.get("/")
    }

    createVaccine(vaccine: VaccineData): Promise<AxiosResponse<Vaccine>> {
        return this.post("/", vaccine)
    }

    updateVaccine(id: number, vaccine: VaccineData): Promise<AxiosResponse<Vaccine>> {
        return this.put(`/${id}`, vaccine)
    }

    deleteVaccine(id: number) {
        return this.delete(`/${id}`)
    }
}

export default VaccineService
