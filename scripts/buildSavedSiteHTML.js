/*
 * Build Saved Site HTML
 * builds the HTML elements for displaying a saved site
 * Inputs: site details
 * Output: HTML representing a saved site's details for the options page
*/
function buildSavedSiteHTML(site) {
    var row = document.createElement('div');
    row.id = site['domain'];
    row.classList.add('row');

    console.log('building site', site);

    var attrs = ['domain', 'username', 'type', 'counter', 'prefix'];

    for (var i = 0; i < attrs.length; i++) {
        var col = document.createElement('div');
        col.classList.add('two');
        col.classList.add('columns');
        var colData;
        if (attrs[i] === 'domain') {
            colData = document.createElement('p');
            colData.style.paddingTop = '10px';
            colData.innerText = site['domain'];
        }
        else if (attrs[i] === 'username') {
            colData = document.createElement('input');
            colData.id = 'username' + site['domain'].replace('.', '');
            colData.type = 'text';
            colData.disabled = true;
            colData.value = site['username'];
        }
        else if (attrs[i] === 'type') {
            colData = document.createElement('select');
            colData.id = 'type' + site['domain'].replace('.', '');
            var types = ['PIN', 'Short', 'Basic', 'Medium', 'Long', 'Maximum', 'Name', 'Phrase'];
            types.forEach((type) => {
                var opt = document.createElement('option');
                opt.value = type.toLowerCase();
                opt.innerHTML = type;
                colData.appendChild(opt);
            });
            colData.value = site['type'];
            colData.disabled = true;
        }
        else if (attrs[i] === 'counter') {
            colData = document.createElement('input');
            colData.id = 'counter' + site['domain'].replace('.', '');
            colData.type = 'number';
            colData.min = 1;
            colData.max = 100;
            colData.disabled = true;
            colData.value = site['counter'];
        }
        else if (attrs[i] === 'prefix') {
            colData = document.createElement('input');
            colData.id = 'prefix' + site['domain'].replace('.', '');
            colData.type = 'text';
            colData.disabled = true;
            colData.value = site['prefix'];
        }
        else {
            colData = document.createElement('p');
            colData.innerText = '';
        }

        colData.style.borderColor = '#222';
        colData.classList.add(site['domain'].replace('.', ''));

        col.appendChild(colData);
        row.appendChild(col);
    }

    var actions = document.createElement('div');
    actions.classList.add('two');
    actions.classList.add('columns');

    var edit = document.createElement('img');
    edit.id = 'edit' + site['domain'].replace('.', '');
    edit.src = 'images/edit.svg';
    edit.width = '16';
    edit.style.cssFloat = 'left';
    edit.style.cursor = 'pointer';
    edit.style.paddingTop = '20px';
    edit.addEventListener('click', () => { startEdit(site['domain']); });

    var done = document.createElement('img');
    done.id = 'done' + site['domain'].replace('.', '');
    done.src = 'images/done.svg';
    done.width = '16';
    done.style.cssFloat = 'left';
    done.style.cursor = 'pointer';
    done.style.paddingTop = '20px';
    done.style.display = 'none';
    done.addEventListener('click', () => { doneEdit(site['domain']); });

    var cancel = document.createElement('img');
    cancel.id = 'cancel' + site['domain'].replace('.', '');
    cancel.src = 'images/cancel.svg';
    cancel.width = '16';
    cancel.style.cssFloat = 'left';
    cancel.style.cursor = 'pointer';
    cancel.style.paddingTop = '20px';
    cancel.style.paddingLeft = '20px';
    cancel.style.display = 'none';
    cancel.addEventListener('click', () => { cancelEdit(site['domain']); });

    var del = document.createElement('img');
    del.id = 'del' + site['domain'].replace('.', '');
    del.src = 'images/delete.svg';
    del.width = '16';
    del.style.cssFloat = 'right';
    del.style.cursor = 'pointer';
    del.style.paddingTop = '20px';
    del.addEventListener('click', () => { removeSavedSite(site['domain']); });

    actions.appendChild(edit);
    actions.appendChild(done);
    actions.appendChild(cancel);
    actions.appendChild(del);
    row.appendChild(actions);

    document.getElementById('savedsites').appendChild(row);

}