/**http请求类**/
//没经过本人同意不许修改
import axios from 'axios'
// import {URL, TOKEN} from '@/api/config'
import {URL} from '@/api/config'

// import Cookies from "js-cookie"

class HttpAsynAxios {
    constructor() {
        // 请求队列
        this.queue = [];
        // axios内置的中断ajax的方法
        this.cancelToken = axios.CancelToken;
    }

    // 同一请求标识，用来判断当前请求，有没有在请求队列中。这里我采用url+method拼接的方式
    //注意：当request.use的时候config为url，但当response.use的时候，config的url会把baseURL和url拼接起来，所以要区别。
    urlSign = (config) => {
        return `${config.url}_${config.method}`
    };

    // 中断重复的请求，并从队列中移除
    removeQueue = (url11Sign) => {
        for (let i = 0, size = this.queue.length; i < size; i++) {
            const task = this.queue[i] || {}; //当task为undefined时候不报错。
            if (task.urlsign === url11Sign) {
                task.cancel();
                this.queue.splice(i, 1);
            }
        }
    };

    //请求拦截器
    httpInterceptor(instance) {
        //http request 请求拦截器，有token值则配置上token值
        // let token = Cookies.get(TOKEN);
        instance.interceptors.request.use(
            config => {
                this.removeQueue(this.urlSign(config)); // 中断之前的同名请求
                // 添加cancelToken
                config.cancelToken = new this.cancelToken((c) => {
                    this.queue.push({urlsign: this.urlSign(config), cancel: c});
                });
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
                // 在请求完成后，自动移出队列
                this.removeQueue(`${response.config.url.split(URL)[1]}_${response.config.method}`);
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
                    // 在请求完成后，自动移出队列
                    this.removeQueue(`${error.response.config.url.split(URL)[1]}_${error.response.config.method}`);
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
