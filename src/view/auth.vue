<template>
    <!-- <el-container class="home">
        <el-container class="auth" stretch>
            <el-header>
                <el-tabs type="card">
                    <el-tab-pane label="登录" name="login"></el-tab-pane>
                    <el-tab-pane label="注册" name="register"></el-tab-pane>
                </el-tabs>
            </el-header>
            <el-main mode="horizontal" class="menu">
                <component :is="component"></component>
            </el-main>
        </el-container>
    </el-container> -->
    <div class="home" v-if="!auth_status">
        <div class="auth" @click.stop>
            <nav>
                <div :class="{ 'active': isClick }" @click="isClick = true; component = login">登录
                </div>
                <div :class="{ 'active': !isClick }" @click="isClick = false; component = register">注册
                </div>
            </nav>
            <el-main>
                <component :is="component"></component>
            </el-main>
            <!-- <component :is="isRegister"></component> -->
            <!-- <LR @CloseOrOn="click" v-if="ClickStatus" ButtonText="登录">
                <template v-slot:login>
                    <label for="user_agreement" class="agreement">
                        <input type="checkbox" name="check"
                               id="user_agreement" :checked="checked"
                               @click="checked=!checked">
                        请仔细阅读
                        <a href="../public/user_agreement">用户协议</a>
                    </label>
                </template>
<template v-slot:manner>
                    <div class="manner">
                        <p><a href="">忘记密码?</a></p>
                        <p><a href="">手机号登录</a></p>
                    </div>
                    <div class="other_methods"><a href="">其他方式登录</a></div>
                </template>
</LR>
<LR @GetDate="registerTime" ButtonText="注册" v-else>
    <template v-slot:login>
                    <label for="user_agreement" class="agreement">
                        <input type="checkbox" name="check" id="user_agreement" :checked="checked" @click="check = !check">
                            请仔细阅读
                        <a href="./public/user_agreement">用户协议</a>
                    </label>
                </template>
    <template v-slot:manner>
                <div class="manner">
                    <p><a href="">忘记密码?</a></p>
                    <p><a href="">手机号登录</a></p>
                </div>
                <div class="other_methods"><a href="">其他方式登录</a></div>
                </template>
</LR> -->
</div>
</div>
</template>

<script setup>
import { ref } from 'vue'
// import LR from '../components/LR.vue'
import login from '../components/login.vue'
import register from '../components/register.vue'

// 状态定义
const refresh_token = ref('')
const date = ref(new Date())
const isClick = ref(true)
const registerOrLogin = ref(true)
const checked = ref(false)
const check = ref(false)
const auth_status = ref(false)
const component = ref(login)

// 方法定义
const click = (username) => {
    localStorage.setItem('username', username)
}

const registerTime = (date) => {
    isClick.value = true
    localStorage.setItem('date', date)
}

</script>

<style scoped>
/* 登录或注册页面的样式 */
.home {
    display: flex;
    width: 100%;
    height: 100%;
    background: url("public/img/壁纸.gif") no-repeat 0;
    background-size: 100%;
}
.el-main {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.auth {
    position: relative;
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 60%;
    height: 60%;
    background: wheat;
    opacity: 0.5;
    font-size: 1.2em;
}

/* 导航栏选择样式 */
nav {
    color: gray;
    display: flex;
    width: 100%;
    height: 20%;
    align-items: center;
    justify-content: space-around;
    font-size: 2.5em;
}

/* 点击后点样式 */
nav .active {
    /* border-bottom: 0.2em solid blue; */
    font-weight: bold;
    color: black;
    cursor: pointer;
}

/* 设置导航栏访问时的颜色 */
nav div:hover,
.verify div:hover {
    color: black;
    cursor: pointer;
}



/* 设置窗口样式 */
.set {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 3;
    background: yellowgreen;
}

/*其他方式登录*/
.manner {
    display: flex;
    transform: translateY(-1.2em);
    /*align-items: center;*/
    justify-content: space-between;
}

.manner a {
    color: white;
    font-weight: bold;
}

/*其他登录方式*/
.other_methods {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
