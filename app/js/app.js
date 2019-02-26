const { shell, ipcRenderer } = require('electron');

const { BrowserWindow } = require('electron').remote;

let webView;

ipcRenderer.on('login', () => {
  if (webView) webView.loadURL('https://www.onenote.com/hrd');
});

ipcRenderer.on('personal', () => {
  if (webView) webView.loadURL('https://www.onenote.com/notebooks?auth=1');
});

ipcRenderer.on('work', () => {
  if (webView) webView.loadURL('https://www.onenote.com/notebooks?auth=2');
});

ipcRenderer.on('reload', () => {
  if (webView) webView.reload();
});

ipcRenderer.on('devtools', () => {
  if (webView) webView.openDevTools();
});

function isMsftAddress(addr) {
  let url = new URL(addr);
  if (url.hostname.endsWith('.live.com') || 
      url.hostname.endsWith('.sharepoint.com') || 
      url.hostname.endsWith('.onenote.com')) {
    return true;
  } else {
    return false;
  }
}

window.loaded = () => {
  webView = document.createElement('webview');
  webView.src = 'https://www.onenote.com/notebooks';
  // This is necessary to allow us to modify the style sheet. Even though this allows XSS attacks
  // to happen, the security risk should be low as we never navigate to non-Microsoft websites (
  // apart from federated login if any, which shouldn't be risky either).
  webView.setAttribute('disablewebsecurity', '');
  webView.setAttribute('preload', 'file://' + __dirname + '/inject/onenote.js');
  document.getElementsByTagName('body')[0].appendChild(webView);

  webView.addEventListener('new-window', function(event) {
    if (isMsftAddress(event.url)) {
      webView.loadURL(event.url);
    } else {
      shell.openExternal(event.url);
    }
  });

  webView.addEventListener("dom-ready", event => {
    // Remove this once https://github.com/electron/electron/issues/14474 is fixed
    webView.blur();
    webView.focus();
  });
}
