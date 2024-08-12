<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore();

const userInfo = ref({ ...userInfoStore.info })  //Destructuring userInfoStore
const rules = {
    nickname: [
        { required: true, message: 'Please enter user nickname', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: 'Nickname must be a non-empty string of 2-10 characters',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: 'Enter user E-mail', trigger: 'blur' },
        { type: 'email', message: 'E-mail format is incorrect', trigger: 'blur' }
    ]
}

// edit user info
import { userInfoUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
const updateUserInfo = async () => {
    //调用接口
    let result = await userInfoUpdateService(userInfo.value);
    ElMessage.success(result.msg ? result.msg : 'Successfully modified');

    //update userInfo in pinia
    userInfoStore.setInfo(userInfo.value)
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Basic Information</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="Username">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="Nickname" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="E-mail" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">Submit</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>