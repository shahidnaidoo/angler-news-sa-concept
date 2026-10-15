import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
const config=JSON.parse(await readFile('vercel.json','utf8'));
if(config.outputDirectory!=='dist')throw new Error('Unexpected output directory');
