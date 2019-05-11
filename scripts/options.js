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
        buildSavedSiteHTML(site);
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
function doneEdit(sitename) {
    document.getElementById('edit' + sitename.replace('.', '')).style.display = 'block';
    document.getElementById('done' + sitename.replace('.', '')).style.display = 'none';
    document.getElementById('cancel' + sitename.replace('.', '')).style.display = 'none';
    document.querySelectorAll('.' + sitename.replace('.', '')).forEach((input) => {
        if (!input.disabled) {
            input.disabled = true;
            input.style.borderColor = '#222';
        }
    });

    var site = {
        'username': document.getElementById('username' + sitename.replace('.', '')).value,
        'type': document.getElementById('type' + sitename.replace('.', '')).value,
        'counter': document.getElementById('counter' + sitename.replace('.', '')).value,
        'prefix': document.getElementById('prefix' + sitename.replace('.', '')).value
    };

    storage.updateSavedSite(site);
}

/*
 * Cancel Edit
 * makes site details uneditable again
*/
function cancelEdit(sitename) {
    document.getElementById('edit' + sitename.replace('.', '')).style.display = 'block';
    document.getElementById('done' + sitename.replace('.', '')).style.display = 'none';
    document.getElementById('cancel' + sitename.replace('.', '')).style.display = 'none';
    document.querySelectorAll('.' + sitename.replace('.', '')).forEach((input) => {
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
function removeSavedSite(sitename) {
    console.log('removing', sitename);
    storage.removeSavedSite(sitename);
    document.getElementById(sitename).remove();
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