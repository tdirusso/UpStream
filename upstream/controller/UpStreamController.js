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
            createBudget: '#/createBudget'
        };

        if (!fs.existsSync(this.paths.home)) fs.mkdirSync(this.paths.home);
        if (!fs.existsSync(this.paths.budget)) fs.writeFileSync(this.paths.budget, JSON.stringify({}));

        this.budget = this.getBudget();
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

    createBudget(budgetData) {
        console.log(budgetData);
    }

    getBudget() {
        
    }
};

module.exports = new UpStreamController();