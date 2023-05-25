import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:5000/api/",
    withCredentials: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async(config) => {
    // Handle token here ...
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }

        return response;
    },
    (error) => {
        // Handle errors
        return Promise.reject(error);
    }
);

export default axiosClient;