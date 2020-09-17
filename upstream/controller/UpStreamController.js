const electron = require('electron');
const fs = require('fs');
const { app, BrowserWindow } = electron;

const appData = app.getPath('appData');

class UpStreamController {
    constructor() {
        this.window;
        this.paths = {
            home: `${appData}/${app.name}`,
            budget: `${appData}/${app.name}/budget.json`,
        };

        this.views = {
            createBudget: '#/createBudget',
            dashboard: '#/dashboard'
        };

        if (!fs.existsSync(this.paths.home)) fs.mkdirSync(this.paths.home);
        if (!fs.existsSync(this.paths.budget)) fs.writeFileSync(this.paths.budget, JSON.stringify({}));

        this.budget = JSON.parse(fs.readFileSync(this.paths.budget, 'utf-8'));
    }

    start({ startURL, width, height, preferences }) {
        const window = new BrowserWindow({
            width: width,
            height: height,
            webPreferences: preferences
        });

        window.loadURL(startURL);
        const self = this;
        window.on('closed', () => self.close());

        window.toggleDevTools();

        this.window = window;
    }

    close() {
        app.quit();
    }

    showView(view) {
        this.window.webContents.executeJavaScript(`location.assign('${view}')`);
        this.window.focus();
    }

    createBudget(budget) {
        if (!budget.incomeRemaining) budget.incomeRemaining = budget.income;
        if (!budget.incomeSpent) budget.incomeSpent = '0.00';
        budget.created = new Date();
        budget.entries = {};
        fs.writeFileSync(this.paths.budget, JSON.stringify(budget));
        this.budget = budget;
    }
};

module.exports = new UpStreamController();