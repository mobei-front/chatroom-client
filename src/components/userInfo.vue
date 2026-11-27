<template>
    <!--  用户信息  -->
    <div class="PersonalCenter">
        <!-- 用户头像  -->
        <div class="user_avatar">
            <el-avatar :size="80" :src="avatar_url"
                @mouseover="user_center = true"
            />
            <!-- <el-image :src="avatar_url" width="100%" height="100%" ref="tab_url" /> -->
            <!-- <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 80 80"
                @mouseover="user_center = true">
            </svg> -->
        </div>
        <!-- 用户中心展示 -->
        <TransitionGroup name="mobei">
            <template v-if="user_center" @mouseleave="user_center = false">
                <div class="user_center">
                    <div @click.stop="view_information = !view_information">查看信息</div>
                    <div @click.stop="setWindow = !setWindow">设置</div>
                    <div @click.stop="leave_room()">离开房间</div>
                    <div @click="logout()">退出登录</div>
                    <div @click="deactivate_account()">注销账号</div>
                    <div>客服中心</div>
                </div>
            </template>
        </TransitionGroup>
    </div>
    <template v-if="setWindow">
        <setting></setting>
    </template>
    <!-- 查看用户信息窗口 -->
    <div class="view_information" v-if="view_information" @click.stop>
        <div class="title_information">账号信息</div>
        <div class="account_information">
            <div>账号：{{ user || username }}</div>
            <div class="avatar">
                头像：
                <input type="file" ref="avatar" title="点击更改头像" @change="upload_avatar()">
                <el-avatar :size="50" :src="avatar_url"></el-avatar>
            </div>
            <!-- <div class="changePwd">
                <div>修改密码：</div>
                <div>
                    <input type="password" placeholder="请输入新密码：" @keydown.enter="confirm_submit()" v-model="new_pwd">
                    <input class="submit" value="提交" @click="confirm_submit()" />
                </div>
            </div> -->
            <div>注册日期：{{ (getTime || register_date) }}</div>
        </div>
    </div>
</template>

<script setup lang="js">
import { ref } from "vue";
import setting from "../view/settings.vue";


const user_center = ref(false)
const setWindow = ref(false)
const view_information = ref(false)
const avatar_url = ref("https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png")

</script>

<style scoped>
/* 用户个人中心样式 */
.PersonalCenter {
    width: 30%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
}

/* 用户头像 */
.user_avatar {
    display: none;
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* .user_avatar i {
    font-size: 5rem;
} */

/* 用户中心功能展示 */
.user_center {
    min-width: content-box;
    max-width: 50%;
    font-size: 30px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translateX(50%);
    z-index: 100;
}

.user_center div {
    width: 100%;
    display: flex;
    justify-content: center;
    border: 1px solid black;
}

.user_center div:hover {
    color: coral;
    background-color: yellowgreen;
}

.user_center div:visited {
    color: coral;
    background-color: greenyellow;
}

/* 用户中心显示过渡效果 */
.mobei-enter-active {
    animation: bounce-in 2s;
}

.mobei-leave-active {
    animation: bounce-in 2s reverse;
}

/* 查看用户信息窗口样式 */
.view_information {
    position: absolute;
    width: 40%;
    height: 40%;
    transform: translateX(70%) translateY(20%);
    display: flex;
    flex-direction: column;
    background: white;
    z-index: 1;
}

.title_information {
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    background-color: green;
}

.account_information {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 95%;
    justify-content: center;
}

.account_information div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    border-bottom: 1px solid black;
    text-indent: 1em;
}

.avatar {
    display: flex;
    position: relative;
}

.avatar > input {
    position: absolute;
    color: white;
    opacity: 0;
}

.changePwd {
    display: flex;
    justify-content: space-between;
}

.changePwd div:nth-child(1) {
    min-width: min-content;
    max-width: max-content;
    height: 100%;
}

.changePwd input {
    border-bottom: none;
    border-top: none;
    border-left: 1px solid black;
    border-right: 1px solid black;
}
</style>