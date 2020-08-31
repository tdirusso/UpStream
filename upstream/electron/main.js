const electron = require('electron');
const { app, screen, ipcMain } = electron;
const path = require('path');
const UpStream = require('./UpStream');

const isDev = true;

app.on('ready', () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    UpStream.start({
        startURL: isDev ? 'http://localhost:3000/' : `file://${path.join(__dirname, '../build/index.html')}`,
        width: width - 500,
        height: height - 200,
        preferences: {
            nodeIntegration: true
        }
    });
});

ipcMain.on('intro:done', () => {
    setTimeout(() => {
        if (UpStream.users.length > 0) {
            //pick user
        } else {
            UpStream.showView(UpStream.views.createUser);
        }
    }, 3500);
});