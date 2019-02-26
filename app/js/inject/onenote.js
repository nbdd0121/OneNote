const electron = require('electron');
window.electron = electron;

function scanFrame(frame) {
  // Iterate through all subframes
  for (let child = frame.firstChild; child; child = child.nextSibling) {
    if (!child.processed) {
      child.processed = true;
      console.log('Insert into ' + child.context.location);
      child.insertCSS(`
#AppHeaderPanel {
  display: none;
}
#btnPrint-Medium, #jbtnGiveFeedback-Medium {
  display:none;
}
`);
    }
    scanFrame(child);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  scanFrame(electron.webFrame);
  // Register events on iframes so we will have a second chance to re-visit all frames
  for (let frame of document.querySelectorAll('iframe')) {
    frame.addEventListener('load', () => {
      scanFrame(electron.webFrame);
    });
  }
});


