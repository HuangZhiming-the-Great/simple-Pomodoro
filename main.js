const { app, BrowserWindow, ipcMain, dialog } = require('electron');

// 尝试使用electron-store
const Store = require('electron-store');

const store = new Store();
// 这个store的存储结构是：
/*
{
  "music":{
    breakMusic:'', 
    sessionMusic:''
  }
}
*/
let musicData = store.get('music') || {breakMusic:'', sessionMusic:''};

// see the file's path
console.log(app.getPath('userData'));

store.set('music', musicData);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // disable the menu bar.
  mainWindow.setMenu(null);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // load the music files.
  mainWindow.webContents.on("did-finish-load",()=>{
    mainWindow.send("init-music-files",store.get("music"));
  })

  ipcMain.on("change-breakMusic",(event,data)=>{
    musicData=Object.assign({},musicData,{breakMusic:data});
    store.set("music",musicData);
    /* just a test
    console.log("break");
    console.log(store.get("music"));
    */
  })

  ipcMain.on("change-sessionMusic",(event,data)=>{
    musicData = Object.assign({},musicData,{sessionMusic:data});
    store.set("music",musicData);
    /* just a test
    console.log(store.get("music"));
    */
  })
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', ()=>{
  createWindow();

  if(musicData.sessionMusic=="" || musicData.breakMusic ==""){
    dialog.showMessageBox({
      type: "info",
      title: '提示',
      message: '第一次使用请选择切换时的2个音乐文件',
      buttons: ['OK']
    })
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
