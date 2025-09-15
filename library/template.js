import fs from 'fs'
import path from 'path'

export function get(templateName) {
    const filePath = path.join(process.cwd(), 'library', 'template', templateName + '.html');
    return fs.readFileSync(filePath, 'utf-8');
}