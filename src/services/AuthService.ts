import { AxiosResponse } from "axios";

import ApiService from "./ApiService";

import { User, UserLogin } from "../types/User";

class AuthService extends ApiService {
    constructor(context?: any) {
        super("/v1/user", context);
    }

    loginUser(user: UserLogin): Promise<AxiosResponse<User>> {
        return this.post("/login", user)
    }
}

export default AuthService
