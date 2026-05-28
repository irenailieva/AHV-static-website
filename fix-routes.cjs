const fs = require('fs');

const files = [
  { src: 'src/pages/adopt/[...page].astro', dest: 'src/pages/adopt/dogs/[...page].astro', species: 'dog' },
  { src: 'src/pages/adopt/[...page].astro', dest: 'src/pages/adopt/cats/[...page].astro', species: 'cat' },
  { src: 'src/pages/en/adopt/[...page].astro', dest: 'src/pages/en/adopt/dogs/[...page].astro', species: 'dog' },
  { src: 'src/pages/en/adopt/[...page].astro', dest: 'src/pages/en/adopt/cats/[...page].astro', species: 'cat' },
  { src: 'src/pages/de/adopt/[...page].astro', dest: 'src/pages/de/adopt/dogs/[...page].astro', species: 'dog' },
  { src: 'src/pages/de/adopt/[...page].astro', dest: 'src/pages/de/adopt/cats/[...page].astro', species: 'cat' }
];

files.forEach(f => {
  let content = fs.readFileSync(f.src, 'utf8');
  content = content.replace(/import Layout from '\.\.\/\.\.\/layouts\/Layout\.astro';/g, "import Layout from '../../../layouts/Layout.astro';");
  content = content.replace(/import { fetchAnimals } from '\.\.\/\.\.\/lib\/fetchAnimals\.js';/g, "import { fetchAnimals } from '../../../lib/fetchAnimals.js';");
  content = content.replace(/const animals = await fetchAnimals\(\);/, `const animals = await fetchAnimals();\n    const filtered = animals.filter(a => a.species === '${f.species}');`);
  content = content.replace(/return paginate\(animals, { pageSize: 12 }\);/, `return paginate(filtered, { pageSize: 12 });`);
  
  const dir = f.dest.split('/').slice(0, -1).join('/');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(f.dest, content);
});

console.log('done copy and replace');
