<template>
    <div class="login_item">
        <div class="input">
            <div>
                <input type="text" name="user"
                       placeholder="请输入用户名/邮箱："
                       v-model="username">
            </div>
            <template v-if="ButtonText === '登录'">
                <div class="pwd">
                    <input :type="form_type" name="password"
                           placeholder="请输入密码："
                           v-model="password"
                           @keydown.enter="specification()">
                    
                </div>
            </template>
            <template v-else>
                <div class="captcha">
                    <div>
                        <input type="text" placeholder="请输入验证码："
                               v-model="captcha" @keydown.enter="specification()">
                    </div>

                    <div class="tab_captcha">
                        <button v-if="!IsClick" @click="getCaptchaImage()">
                            {{ text }}
                        </button>
                        <button v-else style="font-size: 20px;color: white">
                            {{ TimeRemainder }}
                        </button>

                    </div>
                </div>
            </template>
        </div>
        <div class="button">
            <slot name="login"></slot>
            <div class="btn">
                <button @click="specification()">
                    {{ ButtonText }}
                </button>
            </div>
            <slot name="manner"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const emit = defineEmits(['CloseOrOn', 'GetDate'])

const props = defineProps({
    ButtonText: {
        required: true,
        type: String,
        validator(value) {
            return value === '登录' || value === '注册'
        }
    }
})


const form_type = ref('password')
const username = ref('')
const text = ref('获取验证码')
const password = ref('')
const captcha_image = ref('')
const fontSize = ref(15)
const captcha = ref('')
const IsClick = ref(false)
const TimeRemainder = ref('60S')


/**
 * 进行登录
 */
const login = () => {
    let user_val = username.value
    axios.post('http://127.0.0.1:5000/login/', {
        user: username.value,
        password: password.value
    }).then((res) => {
        let dialog_msg
        if (res.data.msg === 'fail') {
            password.value = ''
            dialog_msg = '密码输入错误'
        } else if (res.data.msg === 'success') {
            emit('CloseOrOn', user_val)
            window.ipcRenderer.invoke(
                'Cookie', {
                    objective: 'create',
                    cookie_name:'access_token',
                    data: res.data.access_token,
                }
            ).then(()=> {
                console.log('开启连接')
                window.socket.connect()
                router.push('/Home').then(()=>{
                    window.parent.auth_status = true
                })
                window.root.refresh_token = res.data.refresh_token
            })
        } else {
            username.value = ''
            password.value = ''
            dialog_msg = '没有该账号,请重新输入!'
        }
        if (dialog_msg) window.ipcRenderer.invoke('dialog', dialog_msg)
    }).catch((err) => {
        console.log(err)
    })
}

/**
 * 注册用户
 */
const register = () => {
    let prompt_message = "";
    if (username.value === "" || captcha.value === "") {
        prompt_message = "请输入用户名或验证码"
    }
    else if (!window.parent.checked) {
        prompt_message = '请阅读用户协议'
    }
    else {
        axios.post('http://localhost:5000/Register/', {
            user: username.value,
            captcha: captcha.value
        }).then((res) => {
            let data = res.data
            captcha.value = ''
            if (data.msg === 'err') {
                prompt_message = '验证码错误!'
            } else if (data.msg === 'fail') {
                username.value = ''
                prompt_message = '账号已存在'
            } else {
                username.value = ''
                // 存储用户认证
                window.ipcRenderer.invoke('Cookie', {
                    objective: 'create',
                    cookie_name: 'access_token',
                    data: data.access_token
                }).then(() => {
                    console.log('开启连接')
                    window.socket.connect() 
                    router.push('/Home').then(() => {
                        window.parent.auth_status = true
                    })
                    window.root.refresh_token = data.refresh_token
                })
                prompt_message = `注册成功, 你的初始密码为${data.pwd}, 请前往登录!`
                emit('GetDate', data.date)
            }
        }).catch((err) => {
            console.log(err)
        })
    }
    alert(prompt_message)
    // if (prompt_message) window.ipcRenderer.invoke('dialog', prompt_message)
}

/**
 * 校验输入
 */
const specification = () => {
    let prompt_msg = "";
    alert(props.ButtonText === '注册')
    if (props.ButtonText === '注册'){
        register()
        return 
    } 
    let re = /[\-0-9a-z,~@$%^&*+{}\\';/.<>·`!#￥（）()]{5,}/
    if (username.value === '' || password.value === '') {
        prompt_msg = '请输入用户或密码'
    } else if (!re.test(password.value)) {
        password.value = ''
        prompt_msg = '密码输入不规范,密码长度至少5位'
    }
    if (!window.parent.checked) {
        prompt_msg = '请阅读用户协议'
    } else {
        login()
    }
    alert(prompt_msg)
    // if (prompt_msg) window.ipcRenderer.invoke('dialog', prompt_msg)
}

/**
 * 获取验证码
 */
const getCaptchaImage = () => {
    let msg = "";
    if (!username.value) {
        msg = '请输入邮箱地址'
    }
    else {
        axios.post('http://localhost:5000/captcha/', {
            mail: username.value,
        }).then((res)=>{
            let TimeRemainderVal = 59
            if (res.data.code === 400) {
                msg = '用户已存在'
            }
            else if (res.data.code === 404) {
                username.value = ''
                msg = '邮箱地址错误'
            }
            else if (res.data.code === 200){
                IsClick.value = true
                const timer = setInterval(() => {
                    if (TimeRemainderVal > 0) {
                        TimeRemainder.value = TimeRemainderVal-- + 'S'
                    } else {
                        text.value = '重新获取验证码'
                        IsClick.value = false
                        clearInterval(timer)
                    }
                }, 1000)
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    alert(msg)
    // if (msg) window.ipcRenderer.invoke('dialog', msg)
}
</script>

<style scoped>
/* 登录表单 */

.login_item {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: yellowgreen;
}

.login_item > div {
    margin: auto;
    width: 45%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.input > div {
    display: flex;
    width: 100%;
    height: 50%;
    align-items: center;
}

.input div > input {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 60%;
    text-indent: 0.4em;
    font-size: 1.2em;
}

.login_item .pwd {
    position: relative;
}

.login_item .pwd > i {
    position: absolute;
    right: 10%;
    top: 50%;
    font-size: 1.25em;
    transform: translateY(-50%);
}


/* 验证码输入与显示框 */
.captcha {
    display: flex;
    position: relative;
    align-items: center;
}

.captcha div{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
}

.captcha .tab_captcha {
    width: 30%;
    height: 100%;
}

.captcha .tab_captcha>img{
    width: 100%;
    height: 60%;
}

.captcha .tab_captcha>button {
    width: 100%;
    height: 60%;
    font-size: 12px;
    background-color: cadetblue;
    border: none;
}

/* 登录按钮样式 */
.login_item .button > .btn {
    width: 100%;
    height: 25%;
    border: none;
}

.button > .btn button {
    width: 100%;
    height: 100%;
    background: coral;
    border: none;
    font-size: 1.5em;
}

</style>
