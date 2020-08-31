const electron = require('electron');
const fs = require('fs');
const { app, BrowserWindow } = electron;

const appData = app.getPath('appData');

class UpStream {
    constructor() {
        this.paths = {
            home: `${appData}/${app.name}`,
            globals: `${appData}/${app.name}/globals.json`,
            users: `${appData}/${app.name}/users`
        };

        this.views = {
            createUser: '#/createUser'
        };
        
        this.window;
        this.users = this.initUsers();

        if (!fs.existsSync(this.paths.home)) {
            fs.mkdirSync(this.paths.home);
            fs.mkdirSync(this.paths.users);
            fs.writeFileSync(this.paths.globals, JSON.stringify({}));
        }

        if (!fs.existsSync(this.paths.users)) {
            fs.mkdirSync(this.paths.users);
        }

        if (!fs.existsSync(this.paths.globals)) {
            fs.writeFileSync(this.paths.globals, JSON.stringify({}));
        }
    };

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
    };

    close() {
        app.quit();
    }

    initUsers() {
        const userFolders = fs.readdirSync(this.paths.users, { withFileTypes: true });
        return userFolders.filter(dirent => dirent.isDirectory()).map(dirent => ({ name: dirent.name }));
    }

    showView(view) {
        this.window.webContents.executeJavaScript(`location.assign('${view}')`);
        this.window.focus();
    }
};

module.exports = new UpStream();