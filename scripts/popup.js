var rt = browser.runtime;
var tabs = browser.tabs;
var storage = new MPWStorage();

var rootDomain = null;
var prefs = null;
var savedSites = null;
var mpwdata = null;

init();

async function init() {
    console.log('initializing');
    // get the root domain
    let currentTab = await tabs.query({ active: true, currentWindow: true });
    currentTab = currentTab[0];
    rootDomain = extractRootDomain(currentTab.url);
    document.getElementById('sitename').value = rootDomain;
    console.log('root domain', rootDomain);

    // find out if we're logged in
    let isLoggedInResponse = await rt.sendMessage({action: 'isLoggedIn'});

    if (isLoggedInResponse.body.isLoggedIn) {
        console.log('logged in');
        mpwdata = isLoggedInResponse.body.mpwdata;
        switchUIToSite(mpwdata);
        savedSites = await storage.getSavedSites();
        prefs = await storage.getPrefs();
        let site = savedSites[rootDomain];

        console.log('prefs', prefs);
        console.log('saved sites', savedSites);

        if (site) {
            // set the inputs to this site's defaults
            document.getElementById('sitetype').value = site.type;
            document.getElementById('sitecounter').value = site.counter;
            document.getElementById('sitename').value = site.prefix + document.getElementById('sitename').value;
            generate();
        }
        else {
            // set the inputs to the user's global defaults
            document.getElementById('sitetype').value = prefs.defaultSiteType;
            document.getElementById('sitecounter').value = prefs.defaultSiteCounter;
            document.getElementById('sitename').value = prefs.defaultPrefix + document.getElementById('sitename').value;
            generate();
        }
    }
    else {
        console.log('not logged in');
    }

}

// ask background.js to logout
async function logout() {
    let logoutResponse = await rt.sendMessage({ action: 'logout'});
    if(logoutResponse.success) {
        switchUIToLogin();
    }
}

// copy password to clipboard
function copyToClipboard() {    
    var ele = document.getElementById('password');
    ele.toggleAttribute('disabled');
    ele.select();
    document.execCommand('copy');
    ele.toggleAttribute('disabled');
    document.getElementById('copied').style.display = "block";
    setTimeout(() => { document.getElementById('copied').style.display = "none"; }, 2000);
}

function openOptions() {
    if(rt.openOptionsPage) {
        rt.openOptionsPage();
    }
    else {
        window.open(rt.getURL('options.html'));
    }
}

// ask content.js to autofill the password
async function fillPasswords() {
    var pword = document.getElementById('password').value;

    let currentTab = await tabs.query({ active: true, currentWindow: true });
    currentTab = currentTab[0];
    tabs.sendMessage(currentTab.id, { action: 'fill', body: {password: pword }});

}

function saveSiteDetails() {
    console.log('saving site details');
    var domain = document.getElementById('sitename').value;
    var type = document.getElementById('sitetype').value;
    var counter = document.getElementById('sitecounter').valueAsNumber;
    var newSite = {};
    newSite.domain   = rootDomain;
    newSite.username = '';
    newSite.type     = type;
    newSite.counter  = counter;
    newSite.prefix   = '';
    console.log('new site', newSite);
    if(!savedSites[rootDomain]) {
        savedSites[rootDomain] = newSite;
        storage.setSavedSites(savedSites);
        document.getElementById('saved').style.display = "block";
        setTimeout(() => { document.getElementById('saved').style.display = "none"; }, 2000);
    }

}


// register click listeners
document.getElementById('login').addEventListener('click', login);
document.getElementById('copy').addEventListener('click', copyToClipboard);
document.getElementById('logout').addEventListener('click', logout);
document.getElementById('options').addEventListener('click', openOptions);
document.getElementById('autofill').addEventListener('click', fillPasswords);
document.getElementById('savedetails').addEventListener('click', saveSiteDetails);

// register on change for site inputs
document.getElementById('sitename').addEventListener('input', () => { generate(); });
document.getElementById('sitecounter').addEventListener('input', () => { generate(); });
document.getElementById('sitetype').addEventListener('input', () => { generate(); });