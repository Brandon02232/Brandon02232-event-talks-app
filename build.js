const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'src', 'index.html.template');
const cssPath = path.join(__dirname, 'src', 'styles.css');
const scriptPath = path.join(__dirname, 'src', 'script.js');
const talksDataPath = path.join(__dirname, 'src', 'talks.js');
const outputPath = path.join(__dirname, 'index.html');

// Read source files
const htmlTemplate = fs.readFileSync(templatePath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
const talksDataContent = fs.readFileSync(talksDataPath, 'utf8');

// Combine everything
let finalHtml = htmlTemplate
    .replace('/* INJECT_CSS_HERE */', cssContent)
    .replace('/* INJECT_TALKS_DATA_HERE */', talksDataContent)
    .replace('/* INJECT_JS_HERE */', scriptContent);

// Write the final HTML to index.html
fs.writeFileSync(outputPath, finalHtml, 'utf8');

console.log('index.html generated successfully!');
