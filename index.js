var $ = window.jsrender;

const camelCase = string => string ? string
    .toLowerCase()
    .trim()
    .split(/[.\-_\s]/g)
    .reduce((string, word) => string + word[0].toUpperCase() + word.slice(1), '')
    : "";

const getField = (id) => document.getElementById(id).value;
const getElement = (id) => document.getElementById(id);
const getBool = (id) => document.getElementById(id).checked;
updateSpellFields();

getElement('settings-spell').oninput = updateSpellFields;

function updateSpellFields() {
    getElement('addressable').innerHTML = `${getField('modder')}.${getField('mod')}.Spell${camelCase(getField('spell'))}ChargeEffect`
    for (let item of document.getElementsByClassName("spell-name")) {
        item.innerHTML = camelCase(getField('spell'));
    }
}

document.getElementById('generate').onclick = () => {
    const data = {
        item_spell: {
            id: "Spell" + camelCase(getField('spell')),
            orb: {
                id: "SpellOrb" + camelCase(getField('spell'))
            }
        },
        spell: {
            id: camelCase(getField('spell')),
            name: getField('spell'),
            finger_effect: null,
            charge_effect: 'Spell' + camelCase(getField('spell')) + 'ChargeEffect',
            imbue: getBool('imbue'),
            throw: getBool('throw'),
            spray: getBool('spray'),
        },
        mod: {
            name: getField('mod'),
            description: getField('description'),
            modder: getField('modder'),
        }
    }
    const files = [
        {
            template: 'spell',
            name: `Spells/Spell_${data.spell.id}.json`
        },
        {
            template: 'item',
            name: `Items/Item_Spell_Spell${data.spell.id}.json`
        },
        {
            template: 'container',
            name: 'Container_PlayerDefault.json'
        },
        /* {
         *     template: 'orb',
         *     name: `Effects/Effect_Spell_SpellOrb${data.spell.id}.json`
         * },
         */
        {
            template: 'manifest',
            name: 'manifest.json'
        }
    ]
    downloadZipFile(files, data);
}

async function renderTemplate(name, data) {
    const tmplFile = await fetch(`template-${name}.json`);
    const tmpl = $.templates(await tmplFile.text());
    return tmpl.render(data);
}

function showTemplate(name, rendered) {
    document.getElementById(`output-${name}`).innerHTML = rendered;
}

async function createFile(zipWriter, template, data, filename) {
    const text = await renderTemplate(template, data);
    console.log(`Creating ${filename}`);
    await zipWriter.add(filename, new zip.TextReader(text));
}

async function downloadZipFile(files, data) {
    const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
    
    for (file of files) {
        await createFile(zipWriter, file.template, data, file.name);
    }

    const zipFile = await zipWriter.close();
    const url = window.URL.createObjectURL(zipFile);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = `${data.mod.name}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}
