import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/"
})

class ApiService {
  private apiUrl: string;

  constructor(apiUrl: string, userProfile: string = "") {
    this.apiUrl = apiUrl;

    httpClient.defaults.headers.common['user-profile'] = userProfile;
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
}

export default ApiService
