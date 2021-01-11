import * as fs from 'fs';
import * as ld from 'lodash';
import * as util from 'util';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

let files = [];

async function parseDir(path: string) {
    const root = await readdir(path);

    for (let i of root) {
        const item = await stat(`${path}/${i}`);
        
        if (item.isFile()) files.push({
            path: path,
            type: ld.last(i.split('.')),
            name: i,
            value: (await readFile(`${path}/${i}`, 'utf8'))
        });
        else await parseDir(`${path}/${i}`);
    }
}

async function main(path: string) {
    console.log('Reading');
    await parseDir(path);
    console.log('Writing');
    await writeFile('./input.json', JSON.stringify(files));
    console.log('Done');
}

main('./bsc/input');