const fs = require('fs');

['src/pages/adopt/dogs/[...page].astro', 'src/pages/adopt/cats/[...page].astro'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import Layout from '.*?\/layouts\/Layout\.astro';/, "import Layout from '../../../layouts/Layout.astro';");
    content = content.replace(/import { fetchAnimals } from '.*?\/lib\/fetchAnimals\.js';/, "import { fetchAnimals } from '../../../lib/fetchAnimals.js';");
    fs.writeFileSync(f, content);
});

[
  'src/pages/en/adopt/dogs/[...page].astro',
  'src/pages/en/adopt/cats/[...page].astro',
  'src/pages/de/adopt/dogs/[...page].astro',
  'src/pages/de/adopt/cats/[...page].astro'
].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/import Layout from '.*?\/layouts\/Layout\.astro';/, "import Layout from '../../../../layouts/Layout.astro';");
    content = content.replace(/import { fetchAnimals } from '.*?\/lib\/fetchAnimals\.js';/, "import { fetchAnimals } from '../../../../lib/fetchAnimals.js';");
    fs.writeFileSync(f, content);
});

console.log('Paths fixed.');
