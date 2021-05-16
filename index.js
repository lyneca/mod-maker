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
    updateOrbColors('inner');
    updateOrbColors('outer');
    updateOrbColors('sphere');
    updateOrbColors('rune');
}

function updateOrbColors(color) {
    getElement('color-' + color + '-1').setAttribute('stop-color', getField(color + '-1'));
    getElement('color-' + color + '-2').setAttribute('stop-color', getField(color + '-2'));
}

function colorToComponents(color) {
    return {
        r: parseInt("0x" + color.substr(1, 2)) * 2 / 255,
        g: parseInt("0x" + color.substr(3, 2)) * 2 / 255,
        b: parseInt("0x" + color.substr(5, 2)) * 2 / 255,
    }
}

document.getElementById('generate').onclick = () => {
    const data = {
        item_spell: {
            id: "Spell" + camelCase(getField('spell')),
            orb: {
                id: "SpellOrb" + camelCase(getField('spell')),
                outer_1: colorToComponents(getField('outer-1')),
                outer_2: colorToComponents(getField('outer-2')),
                inner_1: colorToComponents(getField('inner-1')),
                inner_2: colorToComponents(getField('inner-2')),
                sphere_1: colorToComponents(getField('sphere-1')),
                sphere_2: colorToComponents(getField('sphere-2')),
                rune_1: colorToComponents(getField('rune-1')),
                rune_2: colorToComponents(getField('rune-2')),
                rune: getField('rune-name-other') || getField('rune-name'),
                particleAddress: getField('particle-address-other') || getField('particle-address'),
                selectSoundContainer: getField('sound-address-other') || getField('sound-address'),
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
            version: getField('version'),
            namespace: camelCase(getField('mod')),
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
        {
            template: 'orb',
            name: `Effects/Effect_Spell_SpellOrb${data.spell.id}.json`
        },
        
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
    console.log(`Creating ${filename}`);
    const text = await renderTemplate(template, data);
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
