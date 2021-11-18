import * as fs from 'fs';
import * as path from 'path';

const env = fs.readFileSync(path.resolve(__dirname, '../.env.example'), {
  encoding: 'utf-8',
});

fs.writeFileSync(path.resolve(__dirname, '../.env'), env, {
  encoding: 'utf-8',
});
