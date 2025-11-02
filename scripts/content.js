(function () {
    const BROWSER = chrome || browser;

    function injectScript(file) {
        try {
            var s = document.createElement('script');
            s.setAttribute('type', 'text/javascript');
            s.setAttribute('src', file);
            s.onerror = function() {
                console.error('[Formik Devtools] Error loading script:', file);
            };
            document.documentElement.appendChild(s);
        } catch (error) {
            console.error('[Formik Devtools] Error injecting script:', error);
        }
    }
    
    try {
        injectScript(BROWSER.runtime.getURL('/scripts/war.js'));
    } catch (error) {
        console.error('[Formik Devtools] Error getting script URL:', error);
    }

    let messagesList = [];
    let port = undefined;

    function tryToConnect() {
        if (port) {
            sendMessages();
        }
    }

    function sendMessages() {
        if (!port) {
            return;
        }
        
        try {
            messagesList.forEach((message) => {
                port.postMessage(message);
            });
            messagesList = [];
        } catch (error) {
            console.error('[Formik Devtools] Error sending messages:', error);
            // Reset port if it's disconnected
            if (error.message && error.message.includes('disconnected')) {
                port = undefined;
            }
        }
    }

    function handlePortDisconnect() {
        port = undefined;
        console.info('[Formik Devtools] Port disconnected');
    }

    document.addEventListener('FORMIK_DEVTOOLS_EVENT', ({ detail: formikProps }) => {
        if (formikProps) {
            messagesList.push({ formikProps });
            tryToConnect();
        }
    });

    BROWSER.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.message === 'start') {
            try {
                port = BROWSER.runtime.connect(BROWSER.runtime.id, { name: 'content' });
                
                // Handle port disconnection
                port.onDisconnect.addListener(handlePortDisconnect);
                
                sendMessages();

                console.info('[FORMIK:DEVTOOLS] connected to extension');
            } catch (error) {
                console.error('[Formik Devtools] Error connecting to background:', error);
            }
        }
        
        // Return true to indicate we will send a response asynchronously if needed
        return true;
    });
})();
