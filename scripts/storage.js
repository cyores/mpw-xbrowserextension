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
    }

    async getPrefs() {
        if(this.prefs) return this.prefs;

        // get prefs and saved sites with those default values
        let data = await this.storage.get({
            prefs: {
                autofillPasswords: false,
                defaultSiteType: 'long',
                defaultSiteCounter: 1,
                defaultPrefix: ''
            },
            savedSites: {}
        });

        return data.prefs;
    }

    async getSavedSites() {
        if (this.savedSites) return this.savedSites;

        // get prefs and saved sites with those default values
        let data = await this.storage.get({
            prefs: {
                autofillPasswords: false,
                defaultSiteType: 'long',
                defaultSiteCounter: 1,
                defaultPrefix: ''
            },
            savedSites: {}
        });

        return data.savedSites;
    }

    setPrefs(prefs) {
        this.prefs = prefs;
        this.storage.set({ 'prefs': prefs });
        return true;
    }

    setSavedSites(savedSites) {
        this.savedSites = savedSites;
        this.storage.set({ 'savedSites': savedSites });
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

    removeSavedSite(siteName) {
        delete this.savedSites[sitename];
        return true;

    }

    updateSavedSite(site) {
        if(this.savedSites[site.name]) {
            this.savedSites[site.name] = site;
            this.storage.set({ 'savedSites': this.savedSites });
            return true;
        }
        else {
            return false;
        }
    }
}