import axios from "axios";

const httpClient = axios.create({
    baseURL: "http://localhost:8081"
})

class ApiService {
    apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    get(url: string) {
        return httpClient.get(`${this.apiUrl}${url}`);
    }

    post(url: string, object: any) {        
        return httpClient.post(`${this.apiUrl}${url}`, object);
    }
    
    put(url: string, object: any) {
        return httpClient.put(`${this.apiUrl}${url}`, object);
    }
    
    delete(url: string) {
        return httpClient.delete(`${this.apiUrl}${url}`);
    }
}

export default ApiService
