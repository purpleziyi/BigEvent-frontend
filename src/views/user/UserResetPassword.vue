<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'   // import pinia
const userInfoStore = useUserInfoStore();


const userPwd = ref({
    oldPassword: '',
    newPassword: '',
    retypePassword: ''
})

const rules = {
    oldPassword: [
        // { required: true, message: 'Please enter old password', trigger: 'blur' },
        { pattern: /^\S{5,16}$/, message: 'Password must be a non-empty string of 5-16 characters', trigger: 'blur' }
    ],
    newPassword: [
        // { required: true, message: 'Please enter new password', trigger: 'blur' },
        { pattern: /^\S{5,16}$/, message: 'Password must be a non-empty string of 5-16 characters', trigger: 'blur' }
    ],
    retypePassword: [
        // { required: true, message: 'Please retype new password', trigger: 'blur' },
        { pattern: /^\S{5,16}$/, message: 'Password must be a non-empty string of 5-16 characters', trigger: 'blur' }
    ]
}

const checkRetypePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Please confirm password again'))
    } else if (value !== userPwd.newPassword) {
        callback(new Error('Please make sure the password entered twice is the same'))
    } else {
        callback()
    }
}

// modify user password
import { userPasswordUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
const updateUserPassword = async () => {

    let result = await userPasswordUpdateService({
        oldPwd: userPwd.oldPassword,
        newPwd: userPwd.newPassword,
        rePwd: userPwd.retypePassword
    })

    ElMessage.success(result.msg ? result.msg : 'Successfully modified');

    //update userInfo in pinia
    userInfoStore.setInfo(userPwd.value)
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Reset Password</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="Old" prop="oldPassword">
                        <el-input v-model="userPwd.oldPassword" type="password"
                            placeholder="Enter your old password"></el-input>
                    </el-form-item>
                    <el-form-item label="New" prop="newPassword">
                        <el-input v-model="userPwd.password" type="password"
                            placeholder="Enter your new password"></el-input>
                    </el-form-item>
                    <el-form-item label="Retype" prop="retypePassword">
                        <el-input v-model="userPwd.retypePassword" type="password"
                            placeholder="Re-enter your new password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserPassword">Submit</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>