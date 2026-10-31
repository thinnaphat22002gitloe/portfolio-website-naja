import sharp from 'sharp'; import fs from 'fs';
const f = fs.readdirSync('out').filter(x=>x.endsWith('.png')&&x.includes('-real-')).sort();
const W=400,H=250,cols=8; const rows=Math.ceil(f.length/cols);
const comps=await Promise.all(f.map(async(x,i)=>({input:await sharp('out/'+x).resize(W,H).toBuffer(),left:(i%cols)*(W+8)+8,top:Math.floor(i/cols)*(H+8)+8})));
await sharp({create:{width:cols*(W+8)+8,height:rows*(H+8)+8,channels:3,background:'#cbd5e1'}}).composite(comps).png().toFile('contact-sheet.png'); console.log(f.length);
