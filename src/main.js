const {
	app,
	BrowserWindow,
	Menu,
	ipcMain,
	session, dialog, BrowserView, nativeImage,
	Tray
} = require('electron')

const allMenu = require("./menuitem.js")
const path = require('path')

let url = 'http://localhost:5173/t';
let icon = './src/assets/image/logo.png';

let tray;

function createWindow() {
	const win = new BrowserWindow({
		width: 1000,
		height: 800,
		icon: icon,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,  // 启用node集成
			contextIsolation: true, // 开启上下文隔离
			webSecurity: true,      // 开启web安全策略
			enableRemoteModule: false // 关闭remote模块
		},
	})

	// 加载界面内容
	win.loadURL(url).then()

	win.on('close', () => {
		if (tray) tray.destroy
	})

	// 创建菜单
	let chatroom_menu = new allMenu.chatroom_menu()
	chatroom_menu.addMenu('forward', 'Ctrl+Right', () => {
		ipcMain.emit('GoForward',)
	}, true)
	chatroom_menu.addMenu('back', `Ctrl+Left`, () => {
		ipcMain.send('GoBack', '发送')
	}, true)
	chatroom_menu.addMenu('reload', 'Ctrl+R', () => {
		console.log('reload')
		win.reload()
	}, true)



	// let view = new BrowserWindow({
	// 	width: 1500,
	// 	height: 200,
	// })

	// win.addBrowserView(view)

}


ipcMain.handle('dialog', (Event, dialog_msg) => {
	dialog.showMessageBoxSync(win, {
		message: dialog_msg,
		type: 'warning',
		title: '账号输入提示'
	})
})

// 监听页面位置, 如果已登录那么在file菜单有create_room选项
ipcMain.on('ipc', (event, location) => {
	let create = Menu.getApplicationMenu().getMenuItemById('file').submenu
	if ('/Home' === location) {
		create.getMenuItemById('create_room').visible = true
		ipcMain.on('create', () => {
			event.sender.send('room', 200)
		})
	}
})

// 获取后端传来的cookie值
ipcMain.handle('Cookie', (event, data) => {
	let name = data.cookie_name
	if (data.objective === 'del') {
		session.defaultSession.cookies.remove(url, name).then()
	} else {
		let cookie = {
			url,
			name,
			value: data.data
		} 	// 创建一个新的 cookie
		session.defaultSession.cookies.set(cookie).then(() => {
			console.log('Login Success')
		}).catch((err) => {
			console.log('err Message:', err)
		})
	}
})


// 初始化并调用上述方法创建窗口
app.on('ready', ()=>{
	createWindow()
	const tray = new Tray(icon)
	new allMenu.tray_menu(tray, app)
})

app.on('before-quit', () => {
	console.log('关闭应用程序');
})

// 监听关闭应用程序事件
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		console.log('关闭应用程序');
		app.quit()
	}
})

// 关闭窗口时销毁托盘
app.on('quit', () => {
	if (tray) tray.destroy()
})

