// 路由配置文件

// 导入路由库
import { createRouter, createWebHashHistory} from "vue-router";


// 直接在path属性上配置路由地址, 在components属性上跳转的组件
const routes = [
    {
        path: "/",
        // component: () => import("../App.vue"),
        redirect: "/Home", // 重定向到/auth
    },
    {
        path: "/auth",
        component: () => import("../view/auth.vue"),
    },
    {
        path: "/Home",
        component: () => import("../view/Home.vue"),
    },
    {
        path: "/SendMsg",
        component: () => import("../view/SendMsg.vue"),
    },
    {
        path: "/settings",
        component: () => import("../view/settings.vue"),
    },
    {
        // 匹配所有未定义的路由
        path: "/:pathMatch(.*)*",
        component: () => import("../view/not_found.vue"),
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// // 添加守护路由
// router.beforeEach(async (to, from, next)=>{
//     console.log(from.path)
//     // window.ipcRenderer.send('ipc', to.path)
//     if (to.path === '/auth' && document.cookie) return
//     next()           // 继续跳转
// })
export default router