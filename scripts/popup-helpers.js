function extractRootDomain(url) {
    var domain;
    if (url.indexOf('//') > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    // remove port number if it's there
    domain = domain.split(':')[0];
    // remove queries if they're there
    domain = domain.split('?')[0];

    domainArr = domain.split('.');

    domain = domainArr[(domainArr.length - 1) - 1] + '.' + domainArr[domainArr.length - 1];

    return domain;
}

// switch UI from login page to site page
function switchUIToSite(mpwdata) {
    // switch to site screen
    document.getElementById('login').innerHTML = "Logged in!";
    document.getElementById('identity').style.display = "none";
    document.getElementById('site').style.display = "block";
    document.getElementById('bottomInfo').style.display = "flex";
    document.getElementById('version').style.display = "none";
    document.getElementById('loggedInAs').innerHTML = "Logged in as: <b>" + mpwdata.username + "</b>";
    document.getElementById('loggedInVersion').style.display = "block";
    document.getElementById('loggedInVersion').innerHTML = "Version: " + mpwdata.version;
    document.getElementById('error').style.display = "none";
}

// switch UI from site page to login page
function switchUIToLogin() {
    // switch to site screen
    document.getElementById('login').innerHTML = "Login";
    document.getElementById('identity').style.display = "block";
    document.getElementById('site').style.display = "none";
    document.getElementById('bottomInfo').style.display = "none";
    document.getElementById('version').style.display = "block";
    document.getElementById('loggedInVersion').style.display = "none";
    document.getElementById('spinner').style.display = "none";
    document.getElementById('error').style.display = "none";
    document.getElementById('username').value = "";
    document.getElementById('masterpass').value = "";
}