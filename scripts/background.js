/*
 * Backgound script
 * This script handles logging in/out and password generation
 * It creates the MPW object and keeps it for the fduration of its life
 * Persistence is set to true, meaning this script (and therefore the MPW object)
 * should last until the browser is closed or the extension is refreshed
 * The master password and username are never stored, only cached
*/

var mpw = null;
var mpwdata = null;

function handleMessage(request, sender, sendResponse) {

    if(request.action === 'login') {
        if(mpw) {
            console.log('already logged in');
            sendResponse({ success: true, body: 'logged in' });
        }
        else {
            console.log('logging in');
            let rb = request.body;
            mpw = new MPW(rb.username, rb.masterpass, rb.version);
            mpwdata = {
                username: rb.username,
                version: rb.version
            }
            sendResponse({ success: true, body: 'logged in' });
            mpw.key
                // .then(() => {
                //     console.log('done mpw key');
                //     sendResponse({ success: true, body: 'logged in' });
                // })
                // .catch((err) => {
                //     mpw = null;
                //     sendResponse({ success: false, body: 'There was an error logging in: ' + err });
                // });

        }
    }

    else if(request.action === 'generate') {
        console.log('generating password');
        let rb = request.body;
        mpw.generateAuthentication(rb.site, rb.counter, '', rb.type)
            .then((password) => {
                sendResponse({ success: true, body: { password: password }});
            })
            .catch((err) => {
                console.log('Generation error', err);
                sendResponse({ success: false, body: 'There was an error generating the password: ' + err });
            });
    }

    else if(request.action === 'logout') {
        mpw = null;
        mpwdata = null;
        sendResponse({ success: true, body: null });
    }

    else if(request.action === 'isLoggedIn') {
        let isLoggedIn = mpw ? true : false;
        sendResponse({ success: true, body: { isLoggedIn: isLoggedIn, mpwdata: mpwdata }});
    }

    else {
        console.log('Background received message it doesnt know what to do with', request);
        sendResponse({ success: false, body: 'I dont know what to do with that request' });
    }

    return true;

}

browser.runtime.onMessage.addListener(handleMessage);