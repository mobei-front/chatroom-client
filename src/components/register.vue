<template>
    <el-main>
        <el-form>
            <el-form-item class="input">
                <el-input v-model="account" placeholder="请输入邮箱" size="large" />
            </el-form-item>
            <el-form-item class="captcha">
                <el-input v-model="captcha" type="text" placeholder="请输入验证码" size="large" />
                <el-button type="primary" @click="sendCatcha()">{{ captchaTip }}</el-button>
            </el-form-item>
            <el-form-item class="button">
                <el-checkbox v-model="agreement" size="large">
                    注册即同意
                    <el-link href="./public/user_agreement">
                        <b><i>用户协议</i></b>
                    </el-link>
                </el-checkbox>
                <el-button type="primary" @click="register()">注册</el-button>
            </el-form-item>
            <el-label class="manner">
                <el-text size="large">手机号注册</el-text>
            </el-label>
        </el-form>
    </el-main>
</template>

<script setup>

import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { request } from '../API/request';


const captcha = ref('');
const account = ref('');
const agreement = ref(false);
const captchaTip = ref('获取验证码');

/**
 * 发送验证码
 */
const sendCatcha = () => {
    // 获取验证码逻辑
    if (!account.value) {
        ElMessage.warning('请输入邮箱!');
        ipcRenderer.invoke('dialog', '请输入邮箱')
        return;
    }
    // 发送验证码请求
    request.post('/captcha/', {
        mail: account.value,
    }).then((res) => {
        let msg = '';
        let TimeRemainderVal = 59
        if (res.data.code === 200) {
            ElMessage.success("发送成功,请注意查收！");
            const timer = setInterval(() => {
                if (TimeRemainderVal > 0) {
                    captchaTip.value = TimeRemainderVal-- + 'S'
                } else {
                    captchaTip.value = '重新获取验证码'
                    clearInterval(timer)
                }
            }, 1000)
            return;
        }
        if (res.data.code === 400) {
            msg = '用户已存在'
        }
        else {
            account.value = ''
            msg = '邮箱地址错误'
        }
        ElMessage.warning(msg)
    }).catch((err) => {
        console.log("发送验证码错误：" + err)
        ElMessage.error("发送失败，请稍后再试");
    })
}


/**
 * 验证输入
 * @returns {boolean} 校验结果
 */
const verification = () => {
    
    // 无输入校验
    if (!account.value) {
        ElMessage.warning('请输入邮箱');
        return false;
    }
    if (!captcha.value) {
        ElMessage.warning('请输入验证码');
        return false;
    }
    if (!agreement.value) {
        ElMessage.warning('请同意用户协议');
        return false;
    }

    // 输错校验
    if (account.value.includes('@') === false) {
        ElMessage.warning('请输入正确的邮箱');
        return false;
    }
    return true;
}


function debounce(func, delay, immediate = false) {
  let timeoutId = null;
  let immediateCalled = false;

  return function(...args) {
    const context = this;
    const later = () => {
      timeoutId = null;
      if (!immediate || immediateCalled) {
        func.apply(context, args);
        immediateCalled = false;
      }
    };

    clearTimeout(timeoutId);
    
    if (immediate && !immediateCalled) {
      immediateCalled = true;
      func.apply(context, args);
    }
    
    timeoutId = setTimeout(later, delay);
  };
}


/**
 * 注册账号
 */
const register = () => {

    // 验证
    if (verification() === false) return;

    // 发送请求
    request.post('/register/', {
        mail: account.value,
        captcha: captcha.value
    }).then((res) => {
        if (res.data.code === 200) {
            ElMessage.success('注册成功');
            window.$router.push('/Home');
            // 清空输入框
            account.value = '';
            captcha.value = '';
        } else if (res.data.code === 400) {
            ElMessage.error('用户已存在');
        } else if (res.data.code === 404) {
            ElMessage.error('验证码错误');
        }
    }).catch((err) => {
        console.error("注册账号失败：" + err);
        ElMessage.error('注册失败，请稍后再试');
    });
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

/* 验证码样式 */
.el-main>.el-form .captcha {
    height: 100%;
}

.el-main>.el-form .captcha .el-input {
    width: 70%;
}

.el-main>.el-form .captcha .el-button {
    width: 30%;
    height: 50%;
    font-size: large;
}

.el-main>.el-form .button .el-button {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
    background-color: #409eff;
    color: white;
    flex-direction: column;
}

.el-main>.el-form .manner {
    width: 50%;
    cursor: pointer;
}
</style>