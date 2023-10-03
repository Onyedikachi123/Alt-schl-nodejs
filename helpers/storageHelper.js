const fs = require('fs');
const path = require('path');

const readFile = (filePath) => {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, filePath), 'utf8'));
};

const writeFile = (filePath, data) => {
    fs.writeFileSync(path.resolve(__dirname, filePath), JSON.stringify(data, null, 2));
};

module.exports = {
    readFile,
    writeFile
};
