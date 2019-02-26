'use strict';

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const configstore = require('configstore');
const pkg = require('./package.json');
const conf = new configstore(pkg.name, {
  "windowBounds": {
    "x": 100,
    "y": 100,
    "width": 800,
    "height": 600,
  }
});

const template = [
  {
    label: 'Home',
    submenu: [
      {
        label: 'Personal',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send('personal')
        }
      },
      {
        label: 'Work',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send('work')
        }
      },
      {
        label: 'Login',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send('login')
        }
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload Page',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send('reload')
        }
      },
      {
        label: 'Restart Application',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Page Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.send('devtools')
        }
      },
      {
        label: 'Toggle Application Developer Tools',
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  }
]

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    // Hand over control to the application
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webviewTag: true,
      preload: path.join(__dirname, 'app/js/app.js'),
    },
    icon: path.join(__dirname, 'app/images/onenote.png'),
    title: 'OneNote'
  });

  mainWindow.setBounds(conf.get('windowBounds'));
  mainWindow.loadURL('file://' + path.join(__dirname, 'app/index.html'));

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.on('close', function () {
    conf.set('windowBounds', mainWindow.getBounds());
  });
}

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
