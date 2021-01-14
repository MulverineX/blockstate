import fetch from 'node-fetch';
import { raw, say } from 'sandstone/commands';
import { MCFunction } from 'sandstone/core';

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

  for (const func of states.id as serial_file[]) {
    if (func.type === 'mcfunction') MCFunction(`blockstate:${func.path}/${func.name}`, () => {
      for (const cmd of func.value.split('\n')) {
        raw(cmd);
      }
    })
  }
}

MCFunction('root', async () => {
  say('foo');
  await initialize();
})