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
            generate(sitename, counter, type);
        }
        else {
            console.log('autofill is off');
        }
    }
    else {
        console.log('Not logged in');
    }
}