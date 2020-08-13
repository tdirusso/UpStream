const electron = require('electron');
const { app, BrowserWindow, screen, ipcMain } = electron;
const path = require('path');

const isDev = true;

const paths = {
    newUser: '#/newUser'
};

let window;

app.on('ready', () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    window = new BrowserWindow({
        width: width - 500,
        height: height - 200,
        webPreferences: {
            nodeIntegration: true
        }
    });

    const startURL = isDev ? 'http://localhost:3000/' : `file://${path.join(__dirname, '../build/index.html')}`;

    window.loadURL(startURL);

    window.webContents.openDevTools();

    window.on('closed', () => {
        app.quit();
    });
});

ipcMain.on('intro:done', () => {
    setTimeout(() => {
        window.webContents.executeJavaScript(`location.assign('${paths.newUser}')`);
        window.focus();
    }, 3500);
});