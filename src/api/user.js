//Import request.js request-tool
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
    return request.post('/user/register', params);  // request method is POST in server-side
}


// functions for invoking the login-API
// Request parameter format: x-www-form-urlencoded
export const userLoginService = (loginData) => {
    const params = new URLSearchParams();
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/user/login', params)  // request method is POST in server-side
}

// get users' infomation
export const userInfoService = () => {
    return request.get('/user/userInfo')
}

//modify user info
export const userInfoUpdateService = (userInfoData) => {
    return request.put('/user/update', userInfoData)
}

//change avatar
export const userAvatarUpdateService = (avatarUrl) => {
    const params = new URLSearchParams();
    params.append('avatarUrl', avatarUrl)
    return request.patch('/user/updateAvatar', params)
}

// reset password
export const userPasswordUpdateService = (passwordData) => {
    const payload = {
        old_pwd: passwordData.oldPassword,
        new_pwd: passwordData.newPassword,
        re_pwd: passwordData.retypePassword
    };
    return request.patch('/user/updatePwd', payload);
}