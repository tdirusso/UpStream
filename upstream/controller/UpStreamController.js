const electron = require('electron');
const fs = require('fs');
const { app, BrowserWindow } = electron;

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

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

    createBudget(budgetData) {
        const { categories, income } = budgetData;

        const budget = {};
        const now = new Date();

        budget.created = now;
        budget.entries = {};

        const initialEntryKey = months[now.getMonth()].toLowerCase() + '-' + now.getFullYear();

        budget.entries[initialEntryKey] = { income, categories };
        budget.entries[initialEntryKey].expenses = [];

        fs.writeFileSync(this.paths.budget, JSON.stringify(budget));
        this.budget = budget;
    }

    saveIncome(income, key) {
        const entriesObj = this.budget.entries[key];

        if (entriesObj) {
            entriesObj.income = income;
            this.budget.entries[key] = entriesObj;
        } else {
            this.budget.entries[key] = {
                income: income,
                categories: [],
                expenses: []
            }
        }

        fs.writeFileSync(this.paths.budget, JSON.stringify(this.budget));
        return true;
    }

    updateCategory(oldName, newName, allocation, key) {
        const entriesObj = this.budget.entries[key];
        const categories = entriesObj.categories;
        const expenses = entriesObj.expenses;

        categories.some(category => {
            if (category.name === oldName) {
                category.allocation = allocation;
                if (newName !== oldName) {
                    category.name = newName;
                }
                return true;
            }
        });

        expenses.forEach(expense => {
            if (expense.category === oldName) {
                expense.category = newName;
            }
        });

        this.budget.entries[key].categories = categories;
        this.budget.entries[key].expenses = expenses;

        fs.writeFileSync(this.paths.budget, JSON.stringify(this.budget));
        return true;
    }
};

module.exports = new UpStreamController();