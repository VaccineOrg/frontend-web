import axios, { AxiosInstance } from "axios";
import { parseCookies } from "nookies";

const httpClient = axios.create({
  baseURL: "http://localhost:8081/"
})

class ApiService {
  private apiUrl: string
  private httpClient: AxiosInstance

  constructor(apiUrl: string, context?: any) {
    this.apiUrl = apiUrl;
    this.httpClient = httpClient

    const { "nextauth.token": token } = parseCookies(context)

    if (token) {
      this.httpClient.defaults.headers.common["user-profile"] = token.split(".")[0]
    }
  }

  get(url: string) {
    return this.httpClient.get(`${this.apiUrl}${url}`);
  }

  post(url: string, object: object) {
    return this.httpClient.post(`${this.apiUrl}${url}`, object);
  }

  put(url: string, object: object) {
    return this.httpClient.put(`${this.apiUrl}${url}`, object);
  }

  delete(url: string) {
    return this.httpClient.delete(`${this.apiUrl}${url}`);
  }
}

export default ApiService
