//create an instance of the request

// import axios:  npm install axios
import axios from 'axios';

import { ElMessage } from 'element-plus'
//Define a variable to record the common prefix,  baseURL
//const baseURL = 'http://localhost:8080';
const baseURL = '/api';   // add identifier to the backend accessing-path
const instance = axios.create({ baseURL })  // 点击“register”按钮后，就发送至5173前端服务

import { useTokenStore } from '@/stores/token.js'
// Add request interceptor 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        //callback before request 请求前的回调
        // add token
        const tokenStore = useTokenStore();
        //check whether token exsits 若有token则赋值给请求头的Authorization
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token
        }
        return config;
    },
    (err) => { // 请求错误的回调
        Promise.reject(err)
    }
)


/* import { useRouter } from 'vue-router'
const router = useRouter(); */
import router from '@/router'

// Add response interceptor 响应拦截器
instance.interceptors.response.use(
    result => {
        // Check business status code
        if (result.data.code === 0) {
            return result.data;
        }

        // Operation failed
        // alert(result.data.msg ? result.data.msg : 'Service exception');
        ElMessage.error(result.data.msg ? result.data.msg : 'Service exception');
        // Convert asynchronous operation status to failure
        return Promise.reject(result.data);
    },
    err => {
        // Check response status code, 401 indicates not logged in, prompt to login and route to the login page
        if (err.response.status === 401) {
            ElMessage.error('Please log in first');
            router.push('/login');
        } else {
            ElMessage.error('Service exception');
        }

        return Promise.reject(err); // Convert asynchronous status to failure status
    }
)

export default instance;