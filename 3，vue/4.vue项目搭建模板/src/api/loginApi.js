import httpAxios from "@/lib/axios"

//登录
export const getLoginApi = () => {
    return httpAxios.axioseRquest({
        method: "get",
        url: ''
    })
};