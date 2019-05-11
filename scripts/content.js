var rt = browser.runtime;
var storage = new MPWStorage();

var rootDomain = null;
var prefs = null;
var sitename, counter, type;

init();

async function init() {
    console.log('initializing content.js');
    // find out if we're logged in
    let isLoggedInResponse = await rt.sendMessage({ action: 'isLoggedIn' });

    if(isLoggedInResponse.body.isLoggedIn) {
        console.log('logged in');
        savedSites = await storage.getSavedSites();
        prefs = await storage.getPrefs();
        let site = savedSites[rootDomain];

        if(prefs.autofillPasswords) {
            console.log('autofilling password');
            rootDomain = extractRootDomain(window.location.href);
            if(site) {
                // this site has specific defaults
                console.log('   using site prefs');
                sitename = site.prefix + rootDomain;
                counter  = site.counter;
                type     = site.type;
            }
            else {
                // use global defaults
                console.log('   using global prefs');
                sitename = prefs.defaultPrefix + rootDomain;
                counter  = prefs.defaultSiteCounter;
                type     = prefs.defaultSiteType;
            }
            let pword = generate(sitename, counter, type);
            fillPassword(pword);
        }
        else {
            console.log('autofill is off');
        }
    }
    else {
        console.log('Not logged in');
    }
}

function fillPassword(password) {
    document.querySelectorAll('input[type="password"]').forEach((pbox) => {
        if (pbox.style.display !== 'none' && pbox) {
            pbox.value = password;
        }
    });
}


function handleMessage(message) {
    if (message.action === 'fill') {
        fillPassword(message.body.password);
        return Promise.resolve({ success: true, body: null });
    }
}

rt.onMessage.addListener(handleMessage);