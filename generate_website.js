const fs = require('fs');
const path = require('path');

const inputHtmlPath = path.join(__dirname, 'index.html');
const inputCssPath = path.join(__dirname, 'style.css');
const inputJsPath = path.join(__dirname, 'script.js');
const outputDirPath = path.join(__dirname, 'dist');
const outputHtmlPath = path.join(outputDirPath, 'index.html');

// Ensure output directory exists
if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath);
}

// Read files
const htmlContent = fs.readFileSync(inputHtmlPath, 'utf8');
const cssContent = fs.readFileSync(inputCssPath, 'utf8');
const jsContent = fs.readFileSync(inputJsPath, 'utf8');

// Inline CSS and JS
const finalHtml = htmlContent
    .replace('<!-- Inlined CSS will go here -->', `<style>${cssContent}</style>`)
    .replace('<!-- Inlined JavaScript will go here -->', `<script>${jsContent}</script>`);

// Write the combined HTML to the output file
fs.writeFileSync(outputHtmlPath, finalHtml, 'utf8');

console.log(`Successfully generated single HTML file: ${outputHtmlPath}`);
