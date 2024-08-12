<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'

import { userInfoService } from '@/api/user.js'
import useUserInfoStore from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
// Call the function to get user details
const getUserInfo = async () => {
    // call API
    let result = await userInfoService();
    // store data into pinia
    userInfoStore.setInfo(result.data);
}

getUserInfo();  // 构建后勿忘调用函数

//call the function when an item is clicked
import { useRouter } from 'vue-router'
const router = useRouter();

import { ElMessage, ElMessageBox } from 'element-plus'
const handleCommand = (command) => {
    // check command
    if (command === 'logout') {
        // log out
        ElMessageBox.confirm( // https://element-plus.org/en-US/component/message-box.html#confirm
            'Are you sure you want to log out??',
            'Warning',
            {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        )
            .then(async () => {
                // log out
                tokenStore.removeToken()  // clear token in the pinia
                userInfoStore.removeInfo()  // clear user's info

                // jump to login-page
                router.push('/login')
                ElMessage({
                    type: 'success',
                    message: 'successfully log out',
                })
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: 'Log out canceled',
                })
            })
    } else {
        // route
        router.push('/user/' + command)
    }
}
</script>

<template>
    <!-- containers in element-plus -->
    <el-container class="layout-container">
        <!-- left menu -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <!-- menu label of element-plus  -->
            <el-menu active-text-color="#ffd04b" background-color="#8e6eba" text-color="#fff" router>
                <el-menu-item index="/article/category">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>Article Category</span>
                </el-menu-item>
                <el-menu-item index="/article/manage">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>Article Management</span>
                </el-menu-item>
                <el-sub-menu>
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>User Profile</span>
                    </template>
                    <el-menu-item index="/user/info">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>Basic Information</span>
                    </el-menu-item>
                    <el-menu-item index="/user/avatar">
                        <el-icon>
                            <Crop />
                        </el-icon>
                        <span>Change Avatar</span>
                    </el-menu-item>

                    <el-menu-item index="/user/resetPassword">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>Reset Password</span>
                    </el-menu-item>

                </el-sub-menu>
            </el-menu>
        </el-aside>

        <!-- right main area -->
        <el-container>
            <!-- header area -->
            <el-header>
                <div>USER: <strong>{{ userInfoStore.info.nickname }}</strong></div>
                <!-- dropdwon menu -->
                <!-- command: Triggered when an item is clicked 条目被点击后会触发,在事件函数上可以声明一个参数,接收条目对应的指令 -->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" />
                        <!--头像判断-->
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">Basic Information</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">Change Avatar</el-dropdown-item>
                            <el-dropdown-item command="resetPassword" :icon="EditPen">Reset Password</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">Log Out</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- middle area : display content according to which module is clicked in left menu-->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- bottom area -->
            <el-footer>Event Recorder ©2024 Ziyi Zhang</el-footer>
        </el-container>
    </el-container>
</template>
 

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #8e6eba;

        &__logo {
            height: 120px;
            background: url('@/assets/logo0.jpg') no-repeat center / 200px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>