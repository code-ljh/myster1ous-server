import * as libTemplate from '#library/template.js';

export default async function handler(request, response) {
    return response.status(200).send(libTemplate.get("home"));
}