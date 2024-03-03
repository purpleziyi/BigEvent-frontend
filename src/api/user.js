//Import request.js request tool
import request from '@/utils/request.js'

// functions for calling the registration interface
// Request parameter format: x-www-form-urlencoded
export const userRegisterService = (registerData) => {
    // passed with the help of UrlSearchParams
    // Convert register-data to the form of URL query parameters
    const params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key]); // add the attribute key and value to the params-object.
    }
    return request.post('/user/register', params);
}


// functions for calling the login interface
// Request parameter format: x-www-form-urlencoded
export const userLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/user/login', params)
}

// get users' infomation
export const userInfoService = () => {
    return request.get('/user/userInfo')
}

//modify user info
export const userInfoUpdateService = (userInfoData) => {
    return request.put('/user/update', userInfoData)
}

//modify avatar
export const userAvatarUpdateService = (avatarUrl) => {
    const params = new URLSearchParams();
    params.append('avatarUrl', avatarUrl)
    return request.patch('/user/updateAvatar', params)
}