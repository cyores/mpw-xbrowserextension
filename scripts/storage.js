/*
 * Storage
 * This script is a browser storage helper.
 * It makes getting things from storage a little cleaner for
 * all the other scripts
*/

class MPWStorage {
    constructor() {
        this.prefs = null;
        this.savedSites = null;
        this.storage = browser.storage.local;
        // get prefs and saved sites with those default values
        return this.storage.get({
            prefs: {
                autofillPasswords: false,
                defaultSiteType: 'long',
                defaultSiteCounter: 1,
                defaultPrefix: ''
            },
            savedSites: []
        })
        .then((items) => {
            this.prefs = items.prefs;
            this.savedSites = items.savedSites;
        })
        .catch((err) => {
            console.log('error getting storage', err);
        });
    }

    getPrefs() {
        return this.prefs;
    }

    getSavedSites() {
        return this.savedSites;
    }

    setPrefs(prefs) {
        this.prefs = prefs;
        this.storage.set({ 'prefs': prefs });
        return true;
    }

    addSavedSite(newSite) {
        if(!this.savedSites.includes(site)) {
            this.savedSites.push(newSite);
            this.storage.set({ 'savedSites': this.savedSites });
            return true;
        }
        else {
            return false;
        }
    }
}