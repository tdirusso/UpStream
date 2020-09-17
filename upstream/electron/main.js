const electron = require('electron');
const { app, screen, ipcMain } = electron;
const path = require('path');
const USController = require('../controller/UpStreamController');

const isDev = true;

app.on('ready', () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    USController.start({
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
        const budgetExists = Object.keys(USController.budget).length > 0;
        if (budgetExists) {
            USController.showView(USController.views.dashboard);
        } else {
            USController.showView(USController.views.createBudget);
        }
    }, 3500);
});

ipcMain.on('budget:create', (_, budgetData) => {
    USController.createBudget(budgetData);
    USController.showView(USController.views.dashboard);
});

ipcMain.handle('budget:get', () => USController.budget);