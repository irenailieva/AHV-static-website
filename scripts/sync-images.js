import { fetchAnimals } from '../src/lib/fetchAnimals.js';

console.log('🚀 Starting pre-build image synchronization...');
fetchAnimals()
    .then(animals => {
        const withImages = animals.filter(a => a.imageUrl && a.imageUrl.startsWith('/images/animals/')).length;
        console.log(`✅ Sync complete. Found ${animals.length} animals, ${withImages} have local images.`);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Sync failed:', err);
        process.exit(1);
    });
