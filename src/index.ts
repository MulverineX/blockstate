import fetch from 'node-fetch';
import { data, execute, functionCmd, raw, say } from 'sandstone/commands';
import { MCFunction, Tag } from 'sandstone/core';
import { BLOCKS, LiteralUnion } from 'sandstone/types';
import { relative } from 'sandstone/_internals';

type serial_file = {
  path: string,
  type: 'mcfunction' | 'group',
  name: string,
  value: string
}

type state_format = { id: serial_file[], out: serial_file[] };

let exported = false;

export async function get_read(do_nbt: boolean = false) {
  if (!exported) {
    const states: state_format = await (await fetch('https://raw.githubusercontent.com/MulverineX/smc-blockstate/states/json/1.16.json')).json();

    exported = true;

    require('util').inspect.defaultOptions.depth = 0

    for (const file of states.id as serial_file[]) {
      if (file.type === 'mcfunction') MCFunction(`blockstate:${file.path}/${file.name}`, () => {
        for (const cmd of file.value.split('\n')) {
          raw(cmd);
        }
      });
      else Tag('blocks', `blockstate:${file.name}`, JSON.parse(file.value).values as LiteralUnion<BLOCKS>[])
    }
  }

  if (!do_nbt) return () => functionCmd('blockstate:read/l9/l9_0');
  else return MCFunction('blockstate:read_real', () => {
    raw('data remove storage bsc nbt');
    raw('execute if data block ~ ~ ~ {} run data modify storage bsc nbt set from block ~ ~ ~');
    functionCmd('blockstate:read/l9/l9_0');
  })
}