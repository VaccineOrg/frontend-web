import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

import { User, UserData } from "../types/User";

class UserService extends ApiService {
    constructor() {
        super("/v1/user");
    }

    getUser(id: number): Promise<AxiosResponse<User>> {
        return this.get(`/${id}`)
    }

    createUser(user: UserData): Promise<AxiosResponse<User>> {
        return this.post("/register", user)
    }

    updateUser(id: number, user: UserData): Promise<AxiosResponse<User>> {
        return this.put(`/${id}`, user)
    }

    deleteUser(id: number) {
        return this.delete(`/${id}`)
    }
}

export default UserService
