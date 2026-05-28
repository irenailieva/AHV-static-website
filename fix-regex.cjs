const fs = require('fs');

const files = [
  'src/pages/adopt/[...page].astro',
  'src/pages/en/adopt/[...page].astro',
  'src/pages/de/adopt/[...page].astro',
  'src/pages/adopt/dogs/[...page].astro',
  'src/pages/en/adopt/dogs/[...page].astro',
  'src/pages/de/adopt/dogs/[...page].astro',
  'src/pages/adopt/cats/[...page].astro',
  'src/pages/en/adopt/cats/[...page].astro',
  'src/pages/de/adopt/cats/[...page].astro'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(
    /Astro\.url\.pathname\.match\(\/\^\\\\\/adopt\\\\(?:\/\(\?\:\[0-9\]\+\)\?\$\/)\)/g, 
    "Astro.url.pathname.startsWith('/adopt') && !Astro.url.pathname.includes('/dogs') && !Astro.url.pathname.includes('/cats')"
  );
  // Also need to match the actual regex I wrote which was:
  // Astro.url.pathname.match(/^\\/adopt\\/(?:[0-9]+)?$/)
  // Let's use a simpler replace
  content = content.replace(
    "Astro.url.pathname.match(/^\\\\/adopt\\\\/(?:[0-9]+)?$/)",
    "Astro.url.pathname.startsWith('/adopt') && !Astro.url.pathname.includes('/dogs') && !Astro.url.pathname.includes('/cats')"
  );
  content = content.replace(
    "Astro.url.pathname.match(/^\\\\/en\\\\/adopt\\\\/(?:[0-9]+)?$/)",
    "Astro.url.pathname.startsWith('/en/adopt') && !Astro.url.pathname.includes('/dogs') && !Astro.url.pathname.includes('/cats')"
  );
  content = content.replace(
    "Astro.url.pathname.match(/^\\\\/de\\\\/adopt\\\\/(?:[0-9]+)?$/)",
    "Astro.url.pathname.startsWith('/de/adopt') && !Astro.url.pathname.includes('/dogs') && !Astro.url.pathname.includes('/cats')"
  );
  fs.writeFileSync(f, content);
});

console.log('done regex fix');
