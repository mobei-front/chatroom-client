<template>
    <!--  聊天室页面  -->
    <div class="chatroom" @click="view_information=false;rightClick=false">
        <!-- 大部分功能的集成地  -->
        <header>
            <div class="title">{{ $route.query.name }}</div>
            <!--  用户信息  -->
            <div class="PersonalCenter" @mouseleave="user_center=false">
                <!-- 用户头像  -->
                <div class="user_avatar">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="80" height="80" fill="currentColor"
                         viewBox="0 0 80 80" @mouseover="user_center = true">
                        <image
                            :xlink:href="img_url"
                            width="100%" height="100%" ref="tab_url">
                        </image>
                    </svg>
                </div>
                <!-- 用户中心展示 -->
                <TransitionGroup name="mobei">
                    <template v-if="user_center">
                        <div class="user_center" @mouseover="user_center=true">
                            <div @click.stop="view_information=!view_information">查看信息</div>
                            <div @click.stop="setWindow = !setWindow">设置</div>
							<div @click.stop="leave_room()">离开房间</div>
                            <div @click="out()">退出登录</div>
                            <div @click="logout()">注销账号</div>
                            <div>客服中心</div>
                        </div>
                    </template>
                </TransitionGroup>
            </div>
        </header>

        <!--   消息显示处   -->
        <section class="chat-container" @scroll="AutomaticSwipeUp = $event.target.scrollTop" ref="AutomaticSwipeUp">
            <div class="chat-message" v-for="(data, index) in msg" :key="data.id">
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="5%" height="100%" fill="currentColor"
                     viewBox="0 0 45 45" ref="switch_avatars"
                     :class="{'right':data.sender === (user || username)}"
                     :style="{
                        marginLeft:data.sender !== (user || username)?'10px':'0'
                     }">
                    <image :xlink:href="img_url" width="100%" height="100%"
                           alt="加载失败"/>
                </svg>
                <div v-if="data.sender === (user || username)"
                     class="right-chat" @contextmenu.prevent="right_click($event, data.id, index, data.time)">
                    <div class="horn"></div>
                    <div class="username font">{{ data.sender }}</div>
                    <div class="message-content">{{ data.content }}</div>
                </div>
                <div v-else class="left-chat"
                     @contextmenu.prevent="right_click($event, data.id, index, data.time)">
                    <div class="horn" style="left: -5px;background: #f0f0f0;"></div>
                    <div class="username font">{{ data.sender }}</div>
                    <div class="message-content">{{ data.content }}</div>
                </div>
            </div>
            <div class="right_click" v-if="rightClick" :style="{left,top,zIndex:2}">
                <template v-if="isRevocable">
                    <div @click="delete_message()">删除</div>
                    <div @click="revoked()">撤回</div>
                </template>
                <template v-else>
                    <div @click="delete_message()">删除</div>
                </template>
            </div>
        </section>

        <!-- 查看用户信息窗口 -->
        <div class="view_information" v-if="view_information" @click.stop>
            <div class="title_information">账号信息</div>
            <div class="account_information">
                <div>账号：{{ user || username }}</div>
                <div class="avatar">
                    头像：
                    <input type="file" ref="avatar" title="点击更改头像"
                           @change="upload_avatar()">
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="50" height="50" fill="currentColor"
                         viewBox="0 0 50 50" ref="switch_avatars">
                        <image :xlink:href="img_url" width="100%" height="100%"
                               alt="加载失败"/>
                    </svg>
                </div>
                <div class="changePwd">
                    <div>修改密码：</div>
                    <div>
                        <input type="password" placeholder="请输入新密码："
                               @keydown.enter="confirm_submit()" v-model="new_pwd">
                        <input class="submit" value="提交" @click="confirm_submit()"/>
                    </div>
                </div>
                <div>注册日期：{{ (getTime || register_date) }}</div>
            </div>
        </div>

    <!--  发送消息框  -->
    <footer class="chatBox">
        <input type="text" name="chatContent" v-model="message" placeholder="在此处输入"
               @keydown.enter="send()" maxlength="50">
        <button class="button_font" @click="send()">发送</button>
    </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import settings from "../view/settings.vue"

const router = useRouter()

// 状态定义
const AutomaticSwipeUp = ref(0)
const rightClick = ref(false)
const message = ref('')
const isRevocable = ref(true)
const msg = ref([])
const wz = ref('')
const img_url = ref('/node_modules/bootstrap-icons/icons/person-circle.svg')
const left = ref('')
const top = ref('')

const register_date = ref(localStorage.getItem('date'))
const getTime = ref('')
const username = ref(localStorage.getItem('username'))
const user = ref('')
const new_pwd = ref('')
const view_information = ref(false)
const room_name = ref('')

// DOM refs
const avatar = ref(null)
const AutomaticSwipeUpRef = ref(null)

// 方法定义
const leave_room = () => {
    window.$socket.emit('leave', {
        room_name: route.query.name
    })
    router.push("/Home")
}

const send = () => {
    if (!message.value) return
    window.$socket.emit('chat', {
        data: message.value,
        user: user.value || username.value,
    })
    message.value = ''
}

const right_click = (eve, id, index, time) => {
    id.value = id
    let msg_send_time = new Date(time)
    let current_Date = new Date()
    let res = current_Date.getMinutes() === msg_send_time.getMinutes() + 2
    let res1 = current_Date.getSeconds() === msg_send_time.getSeconds()
    if (res && res1) isRevocable.value = false
    index.value = index
    left.value = eve.clientX + 'px'
    top.value = eve.clientY + 'px'
    rightClick.value = true
}

const delete_message = () => {
    msg.value.splice(index.value, 1)
}

const revoked = () => {
    window.$socket.emit('revoked', {
        id: id.value,
    })
    delete_message()
}

const confirm_submit = () => {
    let re = /[\-0-9a-z,~@$%^&*+{}\\';/.<>·`!#￥（）()]{5,}/
    let pwd = new_pwd.value
    new_pwd.value = ''
    if (pwd === '' || !re.test(pwd)) return
    
    axios.post('http://localhost:5000/update_pwd/', {
        user: (user.value || username.value),
        password: pwd
    }).then(res => {
        if (res.data.msg === 'fail') return alert('密码修改失败')
        alert('密码修改成功')
    }).catch(err => {
        console.log(err)
    })
}

const out = () => {
    localStorage.clear()
    window.ipcRenderer.invoke(
        'Cookie', {objective: 'del', data: document.cookie}
    ).then(()=>{
        router.push('/auth')
        window.$socket.disconnect()
    })
}

const logout = () => {
    axios.post('http://localhost:5000/delete_user/', {
        user: user.value || username.value
    }).then((res) => {
        alert(res.data.msg)
    }).catch((err) => {
        console.log(err)
    })
    out()
}

const upload_avatar = () => {
    let file = avatar.value.files[0]
    if (!file.type.startsWith('image/')) return alert('请选择图片文件')
    const formData = new FormData()
    formData.append('file', file)
    axios.post('http://localhost:5000/upload_avatar/',
        formData, {
            responseType: 'blob'
        }).then(res => {
        if (res.data.msg === 'fail') {
            alert('设置失败')
        } else {
            alert('设置成功')
            const blob = new Blob([res.data], {type: "image/*"})
            img_url.value = URL.createObjectURL(blob)
        }
    }).catch(err => {
        console.log(err)
    })
}

// 生命周期钩子
onMounted(() => {
    window.$socket.on('chat', (data) => {
        if (data === '发送失败') return
        msg.value.push(data)
    })
    
    window.$socket.on('revoked', (data) => {
        const index = msg.value.findIndex((msg) => msg.id === data.id)
        if (index !== -1) {
            msg.value.splice(index, 1)
        }
    })
})
</script>

<style scoped>

/* 聊天室布局 */
.chatroom {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: red;
}

/* 头部样式 */
header {
    height: 15%;
    /* 使用粘性定位 */
    position: sticky;
    left: 0;
    top: 0;
    z-index: 1;
    /* 使用弹性盒 */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    background-color: blue
}

/* 用户个人中心样式 */
.PersonalCenter {
    width: 30%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
}

/* 用户头像 */
.user_avatar {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.user_avatar i {
    font-size: 5rem;
}

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

/* 自定义动画效果 */
@keyframes bounce-in {
    0% {
        opacity: 0;
    }
    10% {
        opacity: 0.1;
    }
    20% {
        opacity: 0.2;
    }
    30% {
        opacity: 0.3;
    }
    40% {
        opacity: 0.4;
    }
    50% {
        opacity: 0.5;
    }
    60% {
        opacity: 0.6;
    }
    70% {
        opacity: 0.7;
    }
    80% {
        opacity: 0.8;
    }
    90% {
        opacity: 0.9;
    }
    100% {
        opacity: 1;
    }
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

.submit {
    width: 40% !important;
    background: coral;
    text-align: center;
}

/* 聊天显示框样式 */
.chatroom .chat-container {
    /*position: relative;*/
    display: flex;
    /*min-height: calc(100% - 25%);*/
    max-height: calc(100% - 25%);
    flex-direction: column;
    overflow-y: scroll;
}

/* 隐藏滚动条 */
.chat-container::-webkit-scrollbar {
    display: none;
}

.chat-message {
    position: relative;
    display: flex;
    margin-top: 1.5em;
    /*justify-content: space-between;*/
}

.left-chat {
    position: relative;
    width: 35%;
    max-width: 35%;
    background-color: #f0f0f0;
    padding: 10px;
    border-radius: 10px;
    margin-right: auto;
    text-align: left;
    transform: translateX(5%);
}

.right-chat {
    position: relative;
    width: 35%;
    background-color: green;
    padding: 10px;
    border-radius: 10px;
    margin-left: auto;
    text-align: right;
    transform: translateX(-20%);
}

.horn {
    width: 20px;
    height: 20px;
    transform: translateY(-10px) rotate(45deg);
    background: green;
    position: absolute;
    right: -5px;
    top: 50%;
    z-index: -1;
}

.right {
    border-radius: 20% 15% 15% 20%;
    margin-right: 10px;
    position: absolute;
    right: 0;
}

.username{
    font-weight: bold;
    margin-bottom: 5px;
}

@media screen and (min-width:1024px){
    .font{
        font-size: 100%;
    }
}

@media screen and (max-width:1024px) and (min-width:960px){
    .font{
        font-size: 95%;
    }
}

@media screen and (max-width:960px) and (min-width:876px){
    .font{
        font-size: 90%;
    }
}

@media screen and (max-width:876px) and (min-width:800px){
    .font{
        font-size: 90%;
    }
}

@media screen and (max-width: 800px){
    .font{
        font-size: 80%;
    }
}


.message-content {
    text-align: left;
    word-wrap: break-word;
}

/* 聊天右键功能样式 */
.right_click {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 10%;
    height: 10%;
    background-color: white;
}

.right_click div {
    display: flex;
    /*flex-direction: column;*/
    justify-content: center;
    align-items: center;
    height: 100%;
    border: 1px solid black;
}

.right_click div:hover {
    font-weight: bold;
}

/* 聊天消息输入盒样式 */
.chatBox {
    display: flex;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 13%;
    background-color: yellowgreen;
    align-items: center;
}

/* 聊天消息输入样式 */
.chatroom input {
    display: flex;
    outline: none;
    width: 87%;
    height: 100%;
    max-font-size: 3em;
    text-indent: 15px;
    font-size: 3em;
    /* 控制input输入框的文本换行 */
    /*overflow: scroll;*/
    /*word-wrap: break-word;*/
    /*overflow-wrap: break-word;*/
}

/* 发送按钮样式 */
.chatroom button {
    position: fixed;
    right: 0;
    bottom: 0;
    outline: none;
    width: 13%;
    height: 13%;
    border: 1px solid black;
    background-color: green;
}

@media screen and (min-width: 1024px) {
    .button_font{
        font-size: 2em;
    }
}

@media screen and (max-width: 1024px) and (min-width: 960px){
    .button_font{
        font-size: 1.75em;
    }
}

@media screen and (max-width: 960px) and (min-width: 800px){
    .button_font{
        font-size: 1.5em;
    }
}

@media screen and (max-width: 800px){
    .button_font{
        font-size: 1em;
    }
}

</style>