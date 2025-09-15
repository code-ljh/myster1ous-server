import fs from 'fs'

export function get(templateName) {
    return fs.readFileSync(`library/template/${templateName}.html`, 'utf-8');
}