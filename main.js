const electron = require('electron')
// const customTitlebar = require('custom-electron-titlebar')


const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow
let addSong

// let title = new customTitlebar.Titlebar({
//     backgroundColor: customTitlebar.Color.fromHex('#444'),
//     drag : true,
//     minimizable : true,
//     maximizable : true,
//     closeable : true,
//     shadow : true
// })

// First instantiate the class
// const store = new Store({
//     // We'll call our data file 'user-preferences'
//     configName: 'user-preferences',
//     defaults: {
//         // 800x600 is the default size of our window
//           windowBounds: { width: 800, height: 600 }
//     }
// })

function createWindow() {
    mainWindow = new BrowserWindow({ show: false, titleBarStyle: 'hidden' })
    mainWindow.maximize()



    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })
    
    mainWindow.loadFile('index.html')

    mainWindow.on('closed', () => {
        app.quit()
        mainWindow = null
    })

    //build from menu template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    //insert menu
    Menu.setApplicationMenu(mainMenu)
}

//handle create add window
function createAddSong() {
    addSong = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Add Song For Karaoke",
        frame: false,
        show: false
    })

    addSong.once('ready-to-show', () => {
        addSong.show()
    })

    addSong.loadFile('addSong.html')

    addSong.on('closed', () => {
        addSong = null
    })
}

//catch the form submission for adding a song
ipcMain.on('song:add', (e, item) => {
    console.log(item)
    mainWindow.webContents.send('song:add', item)
    addSong.close()
})


function macOrWindowsShortcut(letter) {
    if(process.platform == 'darwin') {
        return 'Command+' + letter
    } else {
        return 'Ctrl+' + letter
    }
}

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Song',
                accelerator: macOrWindowsShortcut('N'),
                click() {
                    createAddSong()
                }
            },
            {
                label: 'Edit Song'
            },
            {
                label: 'Quit',
                accelerator: macOrWindowsShortcut('Q'),
                click() {
                    app.quit()
                }
            }
        ]
    }
]


//if mac, add empty object to menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({})
}


//add developer tools if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: macOrWindowsShortcut('Shift+I'),
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                },
            },
            {
                role: 'reload'
            }
        ]
    })
}




//app functions
app.on('ready', createWindow)


app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})


app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})