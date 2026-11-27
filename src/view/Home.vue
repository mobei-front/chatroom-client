<template>
    <!--
        聊天室主页
        1、加入聊天室
        2、创建聊天室
        -->
    <el-header height="10%">
        <el-text>聊天室</el-text>
        <userinfo></userinfo>
    </el-header>
    <div class="chatroomHome" @click="disable = true; create = false">
        <!-- 显示聊天室列表页面的：向后端发送获取聊天室列表页面 -->
        <div class="chatroomList">
            <div class="room_list_title">
                <div>聊天室名字</div>
                <div>是否有密码</div>
                <div>当前人数</div>
                <div>按钮</div>
            </div>
            <div class="room_list" v-for="(info, index) in room_list" :id="index" @click.stop="disable = false"
                v-if="room_list.length > 0">
                <div>{{ info.room_name }}</div>
                <!-- <div>
                    <i class="bi bi-lock" style="width: 20px; height: 20px;"></i>-
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="40" height="30" fill="currentColor"
                         viewBox="0 0 40 30" v-if="info.room_pwd">
                        <image xlink:href="node_modules/bootstrap-icons/icons/lock.svg"
                               width="100%" height="100%"
                               alt="加载失败"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="40" height="30" fill="currentColor"
                         viewBox="0 0 40 30" v-else>
                        <image xlink:href="node_modules/bootstrap-icons/icons/unlock.svg"
                               width="100%" height="100%"
                               alt="加载失败"/>
                    </svg>
                </div> -->
                <div>{{ info.room_num_people }}</div>
                <button @click.stop="enter_room(info.room_name, index, info.room_pwd)">
                    进入
                </button>
            </div>
            <div v-else class="no_data">暂无聊天室</div>
        </div>
        <!--  聊天室列表页码  -->
        <div class="page" v-if="page_num > 0">
            <button :disabled="current_page === 1" @click="current_page--; get_room(current_page)">上一页
            </button>
            <template v-for="(page, index) in page_num" :key="index">
                <button :class="{
                    page_btn: true,
                    default: page === current_page
                }" @click="get_room(page)">{{ page }}
                </button>
            </template>
            <button :disabled="current_page === page_num" @click="current_page++; get_room(current_page)">下一页
            </button>
        </div>
    </div>
    <!-- 创建聊天室的页面 -->
    <div class="create" v-if="create">
        <p>创建聊天室</p>
        <input type="text" placeholder="请输入房间名：" v-model="room_name">
        <input type="password" placeholder="请输入密码：" v-model="room_pwd">
        <button @click="create_room()">创建聊天室</button>
    </div>

    <el-container class="action">
        <el-button @click="create = true">创建房间</el-button>
        <el-button @click="reflush()">刷新</el-button>
    </el-container>

</template>

<script setup>
import { ref, onMounted, onBeforeMount, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ws, request, sse } from '../API/request'
import { ElMessage } from 'element-plus'
import userinfo from "../components/userInfo.vue";

// 响应式数据
const router = useRouter()
const room_name = ref('')
const room_pwd = ref('')
const pwd = ref('')
const create = ref(false)
const enter = ref(false)
const room_list = ref([])
const disable = ref(true)
const position_room = ref('')
const current_page = ref(1)
const page_num = ref(0)

// const getRoomList = () => { 

// }



onBeforeMount(() => {

    request.get('/chatroomList/')
    sse.connect();

    // ws.connect();
    // 监听主进程发送的信息
    // ipcRenderer.on('room', (event, res) => {
    //     // 判断是否存在
    //     if (res !== 200) return
    //     create.value = true
    // })
    // ws.on("connect", (data) => {
    //     // 连接成功后获取房间列表
    //     console.log(data);

    //     ws.emit("get_room", {
    //         page: 1,
    //     })
    // })
    // ws.on("connected", (data) => {
    //     console.log('开始存在的元素', data)
    //     room_list.value = data
    //     page_num.value = data[0].page
    // })
})

onMounted(() => {
    // 监听主进程发送的信息
    // ipcRenderer.on('room', (event, res) => {
    //     // 判断是否存在
    //     if (res !== 200) return
    //     create.value = true
    // })
    sse.on("room_list", (event) => {
        console.log(event.data);
        const data = JSON.parse(event.data)
        room_list.value = data
        page_num.value = data[0].page
    })
    ws.on("connected", (data) => console.log("连接成功"));



    // 分页逻辑
    ws.on("room_list", (res) => {
        console.log(res)
        // 增加人数
        if ('cid' in res) {
            room_list.value[res.cid].room_num_people = res.room_num_people
            console.log(room_list.value);
            // 当超过10条记录时给页面多渲染一个页码
        } else if ('nid' in res) {
            console.log(res.page);
            // 新创建的聊天室
            console.log('新建的数据', res)
            room_list.value.push({
                'room_name': res.room_name,
                'room_num_people': res.room_num_people,
            })
            page_num.value = res.page
            console.log(room_list.value);
        } else {
            room_list.value = res
            page_num.value = res[0].page
        }
    })
})

onUnmounted(() => {
    ws.disconnect()
    // 监听断开连接事件
    ws.once('disconnect', () => {
        router.push('/auth')
    })
    sse.disconnect();
})

const reflush = () => {
    sse.disconnect();
    sse.connect();
    router.back()
    router.push('/Home')
}

// /**
//  * 获取房间列表
//  * @param page 页数
//  */
// const get_room = (page) => {
//     current_page.value = page
//     ws.emit('get_room', {
//         page: page,
//     })
//     room_list.value.splice(0, 10)
// }

/**
 * 创建房间
 */
const create_room = () => {
    // 规范限制
    const re = /0-9a-zA-z/
    let msg = '创建成功'
    if (!room_name.value) msg = '房间号不能为空'
    else if (re.test(room_name.value)) msg = '房间号不能有任何符号'
    // 发送创建路由请求
    else {
        request.post('/chatroomList/', {
            room_name: room_name.value.trim(),
            room_pwd: room_pwd.value.trim(),
            room_owenr: window.localStorage.getItem('username'),
        }).then((res) => {
            if (res.data.code === 200) {
                ElMessage.success(res.data.msg)
                // ipcRenderer.invoke('dialog', '创建成功')
            } else {
                ElMessage.error(res.data.msg)
                // ipcRenderer.invoke('dialog', '创建失败')
            }
        })
    }
    // ipcRenderer.invoke('dialog', msg)
}

/**
 * 进入房间
 * @param room_name 房间名
 * @param index 房间索引
 * @param Pwd 房间密码
 */
const enter_room = (room_name, index, Pwd = true) => {
    if (!Pwd || pwd.value === Pwd) {
        position_room.value = index
        ws.emit('enter', {
            room_name: room_name,
            room_pwd: pwd.value
        })
    } else if (Pwd) {
        return enter.value = true
    }
    // 进入聊天室后+1显示
    ws.connect()
    router.push({
        path: '/SendMsg',
        query: {
            name: room_name,
        },
    })
    enter.value = !enter.value
}
</script>

<style scoped>
.chatroomHome {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    margin: auto;
}

.chatroomList {
    width: 80vw;
    height: 70vh;
    background: lawngreen;
    opacity: 0.5;
    display: flex;
    flex-direction: column;
    margin: auto;
    box-sizing: border-box;
}

.room_list_title {
    display: flex;
    justify-content: space-around;
    border: 3px solid black;
    text-align: center;
    font-weight: bold;
}

.room_list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 3px solid black;
    text-align: center;
    height: calc(70vh / 10);
    overflow: hidden;
}

.room_list:hover {
    background: red;
}

/* 用户输入房间密码样式 */
.enter {
    position: absolute;
    top: 10%;
    left: 35%;
    width: 30%;
    height: 30%;
}

/* 页码样式 */
.page {
    display: flex;
    width: 30%;
    height: min-content;
    margin: auto;
    background: grey;
    justify-content: space-around;
    align-items: center;
}

.page_btn {
    display: flex;
    font-size: 20px;
}

.default {
    background: blue !important;
    color: white;
}

.page_btn:hover {
    background: coral;
}

.room_btn {
    display: flex;
    justify-content: space-around;
    width: 80%;
    height: 20%;
    align-items: center;
}

.create {
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 30%;
    top: 30%;
    width: 40%;
    height: 40%;
    background: red;
    align-items: center;
    justify-content: space-around;
}

.create input,
.create button {
    display: flex;
    width: 50%;
    height: 15%;
    text-indent: 0.5em;
    font-size: 20px;
}
</style>