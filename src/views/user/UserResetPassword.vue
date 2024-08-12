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

// change user password
import { userPasswordUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
const updateUserPassword = async () => {
    try {
        const result = await userPasswordUpdateService(userPwd.value);

        ElMessage.success(result.msg ? result.msg : 'Successfully Edit');

        // clear input
        userPwd.value.oldPassword = '';
        userPwd.value.newPassword = '';
        userPwd.value.retypePassword = '';

    } catch (error) {
        ElMessage.error(error.message || 'Failed to update password');
        console.error(error);
    }
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
                <el-form :model="userPwd" :rules="rules" label-width="150px" size="large">
                    <el-form-item label="Old Password" prop="oldPassword">
                        <el-input v-model="userPwd.oldPassword" type="password"
                            placeholder="Enter your old password"></el-input>
                    </el-form-item>
                    <el-form-item label="New Password" prop="newPassword">
                        <el-input v-model="userPwd.newPassword" type="password"
                            placeholder="Enter your new password"></el-input>
                    </el-form-item>
                    <el-form-item label="Retype Password" prop="retypePassword">
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