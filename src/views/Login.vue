<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
// Control the display of registration and login modules.  Registration is default-display
const isRegister = ref(false)  // false: login,  true: registration

//Define data model
const registerData = ref({
    username: '',
    password: '',
    rePassword: ''
})

// Password validation function (https://element-plus.org/en-US/component/form.html#custom-validation-rules)
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Please confirm password again'))
    } else if (value !== registerData.value.password) {
        callback(new Error('Please make sure the password entered twice is the same'))
    } else {
        callback()
    }

}


// Define form-validation rules (demo code: https://element-plus.org/en-US/component/form.html#validation )
const rules = {
    username: [
        { required: true, message: 'Enter your username', trigger: 'blur' },
        { min: 5, max: 16, message: 'Enter 5~16 characters', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Enter your password', trigger: 'blur' },
        { min: 5, max: 16, message: 'Enter 5~16 characters', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }  
    ]
}

// Call the background API to implement registration
import { userRegisterService, userLoginService } from '@/api/user.js'
const register = async () => {
    //registerData is a responsive-object. need to use .value to get the value
         let result = await userRegisterService(registerData.value);
        // if (result.code === 0) {
        //     alert(result.msg ? result.msg : 'Register Successful');
        // } else {
        //     alert('register failed')
        // }   
    // alert(result.msg ? result.msg : 'Register successful');
    ElMessage.success(result.msg ? result.msg : 'Register Successful')  // https://element-plus.org/en-US/component/message.html#types
}

//Bind data, reuse the data-model of the register-form
//Login function
import { useTokenStore } from '@/stores/token.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const tokenStore = useTokenStore();
const login = async () => {
    // call interface to log in 
    let result = await userLoginService(registerData.value);
        // if (result.code === 0) {
        //     alert(result.msg ? result.msg : 'Login Successful')
        // } else {
        //     alert('Login failed')
        // } 
    // alert(result.msg ? result.msg : 'Login successful')
    ElMessage.success(result.msg ? result.msg : 'Login Successful')

    // store token into pinia
    tokenStore.setToken(result.data)
    // route to the Home page
    router.push('/')

}

//define a function for clearing the data 
const clearRegisterData = () => {
    registerData.value = {
        username: '',
        password: '',
        rePassword: ''
    }
}

</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- Registration form -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>Register</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="Enter your username"
                        v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="Enter your password"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="Re-enter your password"
                        v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- Registration button -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        Register
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false; clearRegisterData()">
                        ← Back
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- Login form -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>Login</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="Enter your username"
                        v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="Enter your password"
                        v-model="registerData.password"></el-input>
                </el-form-item>
                <!-- <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>Remember me</el-checkbox>
                        <el-link type="primary" :underline="false">Forgot Password?</el-link>
                    </div>
                </el-form-item> -->
                <!-- Login button -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">Login</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true; clearRegisterData()">
                        Register →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* Styles */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/login_bg1.jpg') no-repeat center / cover; // 导入蓝色主背景图
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>