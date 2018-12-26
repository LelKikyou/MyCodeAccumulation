/**
 * http请求类
 * 基础axios
 * **/
//没经过本人同意不许修改
import axios from 'axios'
// import {URL, TOKEN} from '@/api/config'
import {URL} from '@/api/config'

// import Cookies from "js-cookie"

class HttpAsynAxios {
    constructor() {

    }

    //请求拦截器
    httpInterceptor(instance) {
        //http request 请求拦截器，有token值则配置上token值
        // let token = Cookies.get(TOKEN);
        instance.interceptors.request.use(
            config => {
                // if (!!token) {  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加
                //     config.headers.Authorization =token;
                // }
                return config;
            },
            err => {
                console.log(err)
                return Promise.reject(err);
            });
        // http response 拦截器
        instance.interceptors.response.use(
            response => {
                //如果返回401则跳转到登录页
                // if(response.status===401){
                //     //清楚cookie
                //     Cookies.remove(TOKEN);
                //     window.location.href = '/login';
                // }
                return response.data;
            },
            error => {
                if (error.response) {
                    // 响应错误之后的操作
                    // switch (error.response.status) {
                    //     case 401:
                    // }
                }
                return Promise.reject(error.response)   // 返回接口返回的错误信息
            });
    }

    //创建实例
    createInstance() {
        return axios.create({
            baseURL: URL,
            // timeout:2000 //请求超时时间设置 default is `0` (no timeout)
        })
    }

    //axios请求方法
    /**
     {data: data,     //get方法的时候为params：data
     method: "post",
     url: '/auth/loginIn'，
     headers:{
            'Content-Type':'application/json',
     },
     responseType: 'blob',
     }
     **/
    axioseRquest(opt) {
        let instance = this.createInstance();
        this.httpInterceptor(instance);
        return instance(opt)
    }

}

const httpAsynAxios = new HttpAsynAxios();
export default httpAsynAxios;
