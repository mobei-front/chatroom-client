const {ipcMain, Menu, MenuItem} = require('electron')
const { Tray } = require('electron/main')
const isMacOS = process.platform === 'darwin'

class ChatroomMenu {
	constructor() {
		this.menu_template = [
			// { role: 'fileMenu' }
			{
				label: 'File',
				id: 'file',
				submenu: [
					isMacOS?{
						role: 'close',
						id: 'close',
						accelerator: 'Ctrl+W',
					}:{
						role: 'close',
						id: 'close',
						accelerator: 'Ctrl+W'
					},{
						label: 'create_room',
						id: 'create_room',
						accelerator: 'Ctrl+N',
						visible: false,
						click: () => {
							console.log('start')
							ipcMain.emit('create', 'create')
						}
					}]
			},
			// { role: 'editMenu' }
			{
				label: 'Edit',
				id: 'Edit',
				submenu: [
					{role: 'undo'},
					{role: 'redo'},
					{type: 'separator'},
					{role: 'cut'},
					{role: 'copy'},
					{role: 'paste'},
					...(isMacOS
						? [
							{role: 'pasteAndMatchStyle'},
							{role: 'Delete', accelerator: 'Ctrl+D'},
							{role: 'selectAll'},
							{type: 'separator'},
							{
								label: 'Speech',
								submenu: [
									{role: 'startSpeaking'},
									{role: 'stopSpeaking'}
								]
							}
						]
						: [
							{role: 'Delete', accelerator: 'Ctrl+D'},
							{type: 'separator'},
							{role: 'selectAll'}
						])
				]
			},
			// { role: 'viewMenu' }
			{
				label: 'View',
				id: 'view',
				submenu: [
					{role: 'toggleDevTools'},
					{type: 'separator'},
					{role: 'resetZoom'},
					{role: 'togglefullscreen'}
				]
			},
			// { role: 'windowMenu' }
			{
				label: 'Window',
				id: 'window',
				submenu: [
					{role: 'minimize'},
					{role: 'zoom'},
					...(isMacOS?[
							{type: 'separator'},
							{role: 'front'},
							{type: 'separator'},
							{role: 'window'}
						]:[{role: 'window'}])
				]
			},
			// { role: 'helpMenu' }
			{
				role: 'help',
				id: 'help',
				submenu: [
					{
						label: 'Learn More',
						accelerator: 'Ctrl+H',
						click: async () => {
							const {shell} = require('electron')
							await shell.openExternal('https://electronjs.org')
						}
					}
				]
			}
		]
		let menu = Menu.buildFromTemplate(this.menu_template)
		Menu.setApplicationMenu(menu)
		this.get_menu = Menu.getApplicationMenu()
	}
	// 添加菜单
	addMenu(label, accelerator, click, isvisible){
		let new_menu = new MenuItem(
			{
				label: label, id: label, accelerator: accelerator, click: click,
				visible: isvisible,
			}
		)
		this.get_menu.getMenuItemById('view').submenu.insert(0, new_menu)
	}
}

class TrayMenu{
	constructor(tray, app){
		const tray_menu = Menu.buildFromTemplate([
			{
				label: 'quit',
				type:'normal',
				click() {
					tray.destroy()
					app.quit()
				}
			}
		])
		tray.setToolTip('this a menu')
		tray.setContextMenu(tray_menu)
		
	}
}

module.exports = {
	chatroom_menu: ChatroomMenu,
	tray_menu: TrayMenu
}
