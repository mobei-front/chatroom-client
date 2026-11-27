<template>
    <el-main>
        <el-form>
            <!-- aaa -->
            <el-form-item class="input">
                <el-input v-model="account" type="text" placeholder="请输入昵称/手机号/邮箱"></el-input>
            </el-form-item>
            <el-form-item class="password">
                <el-input v-model="password" :type="check==='bi-eye'?'password':'text'" placeholder="请输入密码"></el-input>
                <i :class="check" @click="check_pwd()"></i>
            </el-form-item>
            <el-form-item class="button">
                <el-checkbox :checked="agreement" size="large">请阅读 <i><b>用户协议</b></i> </el-checkbox>
                <el-button type="primary" @click="login()">登录</el-button>
            </el-form-item>
            <el-label class="manner">
                <el-text size="large">忘记密码?</el-text>
                <el-text size="large">其他方式登录</el-text>
            </el-label>
        </el-form>
    </el-main>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { request, ws } from "../API/request";
import { useRouter } from "vue-router";


const check = ref('bi-eye')
const account = ref('');
const password = ref('');
const agreement = ref(false);
const router = useRouter();

/**
 * 校验账号和密码
 */
const checkAccountAndPassword = () => {
    // if (account.value.length < 2 || account.value.length > 5) {
    //     ElMessage.error('账号长度仅在2-5个字符之间');
    //     return false;
    // }
    if (password.value.length < 2) {
        ElMessage.error('密码长度不能小于6位');
        return false;
    }
    return true;
}

/**
 * 登录账号
 */
const login = () => {
    
    // 验证输入
    if (!checkAccountAndPassword()) { return; }

    // 发送登录请求
    request.post('/login/', {
        username: account.value.trim(),
        password: password.value.trim(),
    }).then(res => { 
        if (res.data.code === 200) { 
            ws.connect()
            router.push('/Home')
            window.localStorage.setItem('token', res.data.access_token)
            window.localStorage.setItem('login_status', res.data.code == 200)
            return
        }
        ElMessage.error(res.data.msg)
    })

}

/**
 * 密码可见
 */
const check_pwd = () => {
    if (check.value !== 'bi-eye-slash') {
        check.value = 'bi-eye-slash'
        form_type.value = 'text'
    } else {
        check.value = 'bi-eye'
        form_type.value = 'password'
    }
}

</script>

<style scoped>
.el-main {
    width: 100%;
    height: 100% !important;
}

.el-main>.el-form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.el-main>.el-form>.el-form-item {
    width: 50%;
    height: 100%;
}

.el-main>.el-form .el-input {
    height: 50%;
    font-size: 1.5rem;
}

/* 密码样式 */
.el-main>.el-form .password {
    position: relative;
}

.el-main>.el-form .password i {
    position: absolute;
    right: 10%;
    top: 50%;
    font-size: 1.25em;
    transform: translateY(-50%);
}

.el-main>.el-form .el-button {
    width: 100%;
    height: 50%;
    font-size: 1.5rem;
    background-color: #409eff;
    color: white;
}

.el-main>.el-form .manner {
    width: 50%;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
}
</style>