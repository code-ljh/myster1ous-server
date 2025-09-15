import * as libTemplate from '#library/template.js';
import * as libDatabase from '#library/database.js';

export default async function handler(request, response) {
    var data = await libDatabase.readDb();
    console.log(data);
    return response.status(200).send(libTemplate.get("home"));
}