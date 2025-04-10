const fs = require('node:fs/promises');

// Leer todos las publicaciones
async function getStoredPublications() {
    const rawFileContent = await fs.readFile('publications.json', { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    return data.publications ?? [];
}

// Escribir una nueva publicación
function storePublications(publication) {
    return fs.writeFile('publications.json', JSON.stringify({ publications: publication || [] }));
}

exports.getStoredPublications = getStoredPublications;
exports.storePublications = storePublications;