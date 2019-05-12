var storage = new MPWStorage();
init();

var prefs = null;
var savedSites = null;

async function init() {
    
    let getPrefsResponse = await storage.getPrefs();
    console.log('prefs', getPrefsResponse);
    prefs = getPrefsResponse;
    if (prefs.autofillPasswords) {
        document.getElementById('turnOnAutofill').style.display = "none";
        document.getElementById('turnOffAutofill').style.display = "block";
    }
    document.getElementById('sitetype').value = prefs.defaultSiteType;
    document.getElementById('sitecounter').value = prefs.defaultSiteCounter;
    document.getElementById('defaultprefix').value = prefs.defaultPrefix;

    // gssr = get saved sites response
    let gssr = await storage.getSavedSites();
    console.log('saved sites', gssr);
    savedSites = gssr;
    for (var site in savedSites) {
        console.log('site', site);
        buildSavedSiteHTML(savedSites[site]);
    }
    
}

/*
 * Start Edit
 * makes site details editable
*/
function startEdit(sitename) {
    document.getElementById('edit' + sitename.replace('.', '')).style.display = 'none';
    document.getElementById('done' + sitename.replace('.', '')).style.display = 'block';
    document.getElementById('cancel' + sitename.replace('.', '')).style.display = 'block';
    document.querySelectorAll('.' + sitename.replace('.', '')).forEach((input) => {
        if (input.disabled) {
            input.disabled = false;
            input.style.borderColor = '#fff';
        }
    });
}

/*
 * Done Edit
 * saves edited site details
*/
function doneEdit(siteDomain) {
    document.getElementById('edit' + siteDomain.replace('.', '')).style.display = 'block';
    document.getElementById('done' + siteDomain.replace('.', '')).style.display = 'none';
    document.getElementById('cancel' + siteDomain.replace('.', '')).style.display = 'none';
    document.querySelectorAll('.' + siteDomain.replace('.', '')).forEach((input) => {
        if (!input.disabled) {
            input.disabled = true;
            input.style.borderColor = '#222';
        }
    });

    var site = {
        'domain': siteDomain,
        'username': document.getElementById('username' + siteDomain.replace('.', '')).value,
        'type': document.getElementById('type' + siteDomain.replace('.', '')).value,
        'counter': document.getElementById('counter' + siteDomain.replace('.', '')).value,
        'prefix': document.getElementById('prefix' + siteDomain.replace('.', '')).value
    };

    console.log('updating site', site);

    if(savedSites[site.domain]) {
        savedSites[site.domain] = site;
        storage.setSavedSites(savedSites);
        return true;
    }
    else {
        return false;
    }
}

/*
 * Cancel Edit
 * makes site details uneditable again
*/
function cancelEdit(siteDomain) {
    document.getElementById('edit' + siteDomain.replace('.', '')).style.display = 'block';
    document.getElementById('done' + siteDomain.replace('.', '')).style.display = 'none';
    document.getElementById('cancel' + siteDomain.replace('.', '')).style.display = 'none';
    document.querySelectorAll('.' + siteDomain.replace('.', '')).forEach((input) => {
        if (!input.disabled) {
            input.disabled = true;
            input.style.borderColor = '#222';
        }
    });
}

/*
 * Remove Saved Site
 * removes a saved site from chrome storage
*/
function removeSavedSite(siteDomain) {
    console.log('removing', siteDomain);
    if (savedSites[siteDomain]) {
        delete savedSites[siteDomain];
        storage.setSavedSites(savedSites);
        document.getElementById(siteDomain).remove();
        return true;
    }
    else {
        return false;
    }
}

/*
 * Turn On Autofill
*/
function turnOnAutofill() {
    prefs.autofillPasswords = true;
    document.getElementById('turnOnAutofill').style.display = "none";
    document.getElementById('turnOffAutofill').style.display = "block";
    storage.setPrefs(prefs);
}

/*
 * Turn Off Autofill
*/
function turnOffAutofill() {
    prefs.autofillPasswords = false;
    document.getElementById('turnOnAutofill').style.display = "block";
    document.getElementById('turnOffAutofill').style.display = "none";
    storage.setPrefs(prefs);
}

/*
 * Set Default Site Type
*/
function setDefaultSiteType() {
    prefs.defaultSiteType = document.getElementById('sitetype').value;
    storage.setPrefs(prefs);
}

/*
 * Set Default Site Counter
*/
function setDefaultSiteCounter() {
    prefs.defaultSiteCounter = document.getElementById('sitecounter').value;
    storage.setPrefs(prefs);
}

/*
 * Set Default Site Prefix
*/
function setDefaultPrefix() {
    prefs.defaultPrefix = document.getElementById('defaultprefix').value;
    storage.setPrefs(prefs);
}

// Register listeners
document.getElementById('turnOnAutofill').addEventListener('click', turnOnAutofill);
document.getElementById('turnOffAutofill').addEventListener('click', turnOffAutofill);
document.getElementById('sitetype').addEventListener('input', setDefaultSiteType);
document.getElementById('sitecounter').addEventListener('input', setDefaultSiteCounter);
document.getElementById('defaultprefix').addEventListener('input', setDefaultPrefix);