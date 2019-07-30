import Http from "@/lib/axios"
import {URL} from "./config";

const httpAxios = new Http(URL);
//北京大屏
export const login = (data) => {
    return httpAxios.axioseRquest({
        method: "get",
        url: '',
        params: data
    })
};
