import fetch from 'node-fetch';
import { raw, say } from 'sandstone/commands';
import { MCFunction, Tag } from 'sandstone/core';
import { BLOCKS, LiteralUnion } from 'sandstone/types';

type serial_file = {
  path: string,
  type: 'mcfunction' | 'group',
  name: string,
  value: string
}

export async function initialize() {
  const states = await (await fetch('https://raw.githubusercontent.com/MulverineX/smc-blockstate/states/json/1.16.json')).json();

  require('util').inspect.defaultOptions.depth = 0

  console.log(states.id.length);

  for (const file of states.id as serial_file[]) {
    if (file.type === 'mcfunction') MCFunction(`blockstate:${file.path}/${file.name}`, () => {
      for (const cmd of file.value.split('\n')) {
        raw(cmd);
      }
    });
    else Tag('blocks', `blockstate:${file.name}`, JSON.parse(file.value).values as LiteralUnion<BLOCKS>[])
  }
}

MCFunction('root', async () => {
  say('foo');
  await initialize();
})