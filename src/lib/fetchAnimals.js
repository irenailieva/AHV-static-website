import fs from 'fs';
import path from 'path';

async function downloadImage(fileId, localPath) {
    if (fs.existsSync(localPath)) {
        return true; // Вече съществува
    }

    const apiKey = typeof process !== 'undefined' ? process.env.GOOGLE_DRIVE_API_KEY : null;
    if (apiKey) {
        console.log(`[Image Downloader] Using API Key for file ${fileId}`);
    } else {
        console.warn(`[Image Downloader] NO API KEY FOUND. Falling back to public link for file ${fileId}. This might fail on Vercel!`);
    }
    const url = apiKey
        ? `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`
        : `https://drive.google.com/uc?export=download&id=${fileId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Грешка: сървърът върна ${response.status} за файл ${fileId}`);
            return false;
        }

        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(localPath, Buffer.from(arrayBuffer));
        return true;
    } catch (e) {
        console.error("Грешка при изтегляне на изображение:", e.message);
        return false;
    }
}

export async function fetchAnimals() {
    const SHEET_ID = '1crxL8WwDDgkKMA8TerCoy2ZVJG7hfIF8UD6Ek4uq-1E'; // Реално ID на таблицата
    const IMAGES_GID = '1836292053'; // Въведете GID-а на таб "Images"

    const MAIN_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
    const IMAGES_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${IMAGES_GID}`;

    try {
        // 1. Fetch main data
        const mainResponse = await fetch(MAIN_CSV_URL);
        if (!mainResponse.ok) {
            throw new Error(`Грешка при изтегляне на главната таблица: ${mainResponse.statusText}`);
        }
        const mainCsvText = await mainResponse.text();
        const mainRows = csvToArray(mainCsvText);

        // Map to objects
        let animals = mainRows.slice(1).filter(line =>
            line.length > 1 &&
            line[1] &&
            line[0].trim() !== '' &&
            !isNaN(Number(line[0].trim()))
        ).map(line => {
            let fbLink = line[10] || 'https://facebook.com/animalhope.varna';
            if (fbLink.length < 15 && !fbLink.includes('http')) {
                fbLink = 'https://facebook.com/animalhope.varna';
            }

            return {
                name: line[1] || 'Неизвестно',
                nameEn: line[2] || line[1] || 'Unknown',
                sex: line[3] || 'Не е посочен',
                birthday: line[4] ? line[4].slice(-4) : 'Неизвестна',
                facebookLink: fbLink,
                imageUrl: null
            };
        });

        // 2. Fetch images mapping
        const imageMap = new Map();
        try {
            const imgResponse = await fetch(IMAGES_CSV_URL);
            if (imgResponse.ok) {
                const imgCsvText = await imgResponse.text();
                const imgRows = csvToArray(imgCsvText);
                imgRows.slice(1).forEach(line => {
                    if (line.length >= 2 && line[0] && line[1]) {
                        const name = line[0].trim().toLowerCase();
                        const fileId = extractDriveId(line[1].trim());
                        if (fileId) imageMap.set(name, fileId);
                    }
                });
            }
        } catch (imgError) {
            console.warn("Неуспешно извличане на снимките от втория таб.");
        }

        // 3. Prepare directory for images
        const publicDir = path.join(process.cwd(), 'src', 'assets', 'animals');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        // 4. Merge and download
        const downloadPromises = [];
        animals = animals.map(animal => {
            const nameKey = animal.name.trim().toLowerCase();
            if (imageMap.has(nameKey)) {
                const fileId = imageMap.get(nameKey);
                const localFileName = `${fileId}.jpg`;
                const localFilePath = path.join(publicDir, localFileName);

                downloadPromises.push(downloadImage(fileId, localFilePath));
                animal.imageUrl = `/src/assets/animals/${localFileName}`;
            }
            return animal;
        });

        await Promise.all(downloadPromises);

        // 5. Sort - Animals with images first, then alphabetically
        animals.sort((a, b) => {
            if (a.imageUrl && !b.imageUrl) return -1;
            if (!a.imageUrl && b.imageUrl) return 1;
            return a.name.localeCompare(b.name, 'bg');
        });

        return animals;

    } catch (error) {
        console.error("Грешка при извличане на данните:", error);
        return [];
    }
}

function extractDriveId(url) {
    if (!url) return null;
    try {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) return match[1];
        return null;
    } catch (e) {
        return null;
    }
}

function csvToArray(csvText) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let insideQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        if (char === '"') {
            if (insideQuotes && csvText[i + 1] === '"') {
                currentField += '"';
                i++;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            currentLine.push(currentField.trim());
            currentField = '';
        } else if (char === '\n' && !insideQuotes) {
            currentLine.push(currentField.trim());
            lines.push(currentLine);
            currentLine = [];
            currentField = '';
        } else if (char !== '\r') {
            currentField += char;
        }
    }

    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField.trim());
        lines.push(currentLine);
    }

    return lines;
}
