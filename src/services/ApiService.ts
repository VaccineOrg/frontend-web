import axios from "axios";
import { parseCookies } from "nookies";

const { "nextauth.token": token } = parseCookies()

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/",
  headers: {
    common: {
      "user-profile": token?.split(".")[0] || ""
    }
  }
})

class ApiService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  get(url: string) {
    return httpClient.get(`${this.apiUrl}${url}`);
  }

  post(url: string, object: object) {
    return httpClient.post(`${this.apiUrl}${url}`, object);
  }

  put(url: string, object: object) {
    return httpClient.put(`${this.apiUrl}${url}`, object);
  }

  delete(url: string) {
    return httpClient.delete(`${this.apiUrl}${url}`);
  }

  setUserProfileHeader(userProfile: string) {
    httpClient.defaults.headers.common["user-profile"] = userProfile;
  }
}

export default ApiService
