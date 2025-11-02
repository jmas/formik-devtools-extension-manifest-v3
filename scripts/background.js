const BROWSER = chrome || browser;

let portToDevtoolsScript = null;
let portToContentScript = null;

// Handle port disconnections
function handlePortDisconnect(port) {
    if (port === portToDevtoolsScript) {
        portToDevtoolsScript = null;
    }
    if (port === portToContentScript) {
        portToContentScript = null;
    }
}

BROWSER.runtime.onConnect.addListener((port) => {
    // Handle port disconnection
    port.onDisconnect.addListener(() => {
        handlePortDisconnect(port);
    });

    if (port.name === 'devtools') {
        portToDevtoolsScript = port;

        portToDevtoolsScript.onMessage.addListener((request) => {
            if (request.tabId) {
                BROWSER.tabs.sendMessage(request.tabId, { message: 'start' }).catch((error) => {
                    // Handle errors when tab is not accessible or no longer exists
                    console.error('[Formik Devtools] Error sending message to tab:', error);
                });
            }
        });
    }

    if (portToDevtoolsScript && port.name === 'content') {
        portToContentScript = port;

        portToContentScript.onMessage.addListener((request) => {
            if (request.formikProps && portToDevtoolsScript) {
                try {
                    portToDevtoolsScript.postMessage(request);
                } catch (error) {
                    console.error('[Formik Devtools] Error posting message to devtools:', error);
                }
            }
        });
    }
});

BROWSER.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (portToDevtoolsScript && changeInfo.status === 'complete') {
        try {
            portToDevtoolsScript.postMessage({ action: 'restart' });
        } catch (error) {
            console.error('[Formik Devtools] Error posting restart message:', error);
        }
    }
});
