const fs = require('fs');
const f = 'node_modules/expo-router/build/static/html.js';
let c = fs.readFileSync(f, 'utf8');
if (c.includes('overflow:hidden')) {
  c = c.replace('body{overflow:hidden}', 'body{overflow:auto}');
  fs.writeFileSync(f, c);
  console.log('PATCH OK: overflow:hidden -> overflow:auto');
} else {
  console.log('PATCH SKIP: already patched or not found');
}