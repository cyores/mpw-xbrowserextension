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

    if (loginResponse.success) {
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