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

async function login() {
    // clear any error messages
    document.getElementById('error').style.display = "none";

    // collect the inputs
    var usr = document.getElementById('username').value;
    var mp = document.getElementById('masterpass').value;
    var v = document.getElementById('version').value;

    // input validation
    if (!usr || !mp || !v) {
        document.getElementById('error').style.display = "block";
        document.getElementById('error').innerHTML = "Please provide all inputs";
        return;
    }

    document.getElementById('spinner').style.display = "block";
    document.getElementById('login').innerHTML = "Logging in";

    mpwdata = {
        username: usr,
        masterpass: mp,
        version: v
    }

    let loginResponse = await rt.sendMessage({ action: 'login', body: mpwdata });

    if(loginResponse.success) {
        console.log('login successful');
        switchUIToSite(mpwdata);
        loggedIn = true;
        generate();
    }
    else {
        document.getElementById('error').style.display = "block";
        document.getElementById('error').innerHTML = loginResponse.body;
    }

}

// get background.js to generate the password
async function generate() {

    // clear any error messages
    document.getElementById('error').style.display = "none";

    // collect the inputs
    var sitename = document.getElementById('sitename').value;
    var counter = document.getElementById('sitecounter').valueAsNumber;
    var type = document.getElementById('sitetype').value;

    // input validation
    if (!sitename || !counter || !type || sitename === '' || sitename === ' ') {
        document.getElementById('error').style.display = "block";
        document.getElementById('error').innerHTML = "Please provide all inputs";
        return;
    }

    let site = {
        site: sitename,
        counter: counter,
        type: type
    }

    let generateResponse = await rt.sendMessage({ action: 'generate', body: site });

    if (generateResponse.success) {
        console.log('password generation successful');
        document.getElementById('password').value = generateResponse.body.password;
    }
    else {
        document.getElementById('error').style.display = "block";
        document.getElementById('error').innerHTML = generateResponse.body
    }

}

// register click listeners
document.getElementById('login').addEventListener('click', login);

// register on change for site inputs
document.getElementById('sitename').addEventListener('input', generate);
document.getElementById('sitecounter').addEventListener('input', generate);
document.getElementById('sitetype').addEventListener('input', generate);