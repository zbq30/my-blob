import axios from "axios";

const requsetInstance = axios.create({
    baseURL: '/'
})

requsetInstance.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
)

requsetInstance.interceptors.response.use(
    response => {
        if(response?.status === 200) {
            return response?.data
        }else {
            return {
                code: -1,
                msg: '未知错误',
                data: null,
            }
        }
    },
    (error) => Promise.reject(error)
)
 export default requsetInstance