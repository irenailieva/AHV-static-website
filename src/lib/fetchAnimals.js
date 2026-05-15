export async function fetchAnimals() {
    // TODO: ПРЕДИ КАЧВАНЕ В ПРОДУКЦИЯ (DEPLOYMENT)
    // Тъй като сайтът е статичен (SSG), данните се изтеглят само по време на билд.
    // За да се отразяват новите записи автоматично, трябва да се настрои Webhook.
    // 1. Създайте Google Apps Script в таблицата, който слуша за "On Edit" събития.
    // 2. Скриптът трябва да изпраща POST заявка към Build Hook URL-а на хостинга (Netlify/Vercel).
    // 3. Така при всяко добавяне на ново животно, сайтът ще се прегенерира сам.

    const SHEET_ID = '1crxL8WwDDgkKMA8TerCoy2ZVJG7hfIF8UD6Ek4uq-1E'; // Реално ID на таблицата
    const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

    // Ако сме с placeholder ID, връщаме примерни данни за тест на пагинацията
    if (SHEET_ID === 'PLACEHOLDER_SHEET_ID') {
        return Array.from({ length: 26 }, (_, i) => ({
            name: `Животно ${i + 1}`,
            description: `Това е прекрасно животно номер ${i + 1}, което си търси своя завинаги дом. Обича внимание и е много дружелюбно.`,
            imageUrl: `https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`,
            facebookLink: `https://facebook.com/animalhope.varna`
        }));
    }

    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) {
            throw new Error(`Грешка при изтегляне: ${response.statusText}`);
        }
        
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error("Грешка при извличане на данните от Google Sheets:", error);
        return [];
    }
}

// Помощна функция за конвертиране на Google Drive линкове към директни
function transformDriveUrl(url) {
    if (!url) return '';
    // Проверка за линк от тип /file/d/ID/view
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    // Проверка за линк от тип ?id=ID
    const paramIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    
    const fileId = fileIdMatch ? fileIdMatch[1] : (paramIdMatch ? paramIdMatch[1] : null);
    
    if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
    
    return url;
}

// Опростен CSV парсър, който се справя с кавички и запетаи вътре в полетата
function parseCSV(csvText) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let insideQuotes = false;
    
    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        
        if (char === '"') {
            if (insideQuotes && csvText[i + 1] === '"') {
                currentField += '"';
                i++; // Прескачаме втората кавичка
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
    
    // Добавяме последното поле и ред
    if (currentField || currentLine.length > 0) {
        currentLine.push(currentField.trim());
        lines.push(currentLine);
    }
    
    // Първият ред са заглавията
    const headers = lines[0].map(h => h.toLowerCase());
    
    return lines.slice(1).filter(line => line.length > 1).map(line => {
        const obj = {};
        headers.forEach((header, index) => {
            let val = line[index] || '';
            // Търсим основните колони (може да варират според езика)
            if (header.includes('name') || header.includes('име')) {
                obj.name = val;
            } else if (header.includes('desc') || header.includes('описан')) {
                obj.description = val;
            } else if (header.includes('image') || header.includes('снимка') || header.includes('снимк')) {
                obj.imageUrl = transformDriveUrl(val);
            } else if (header.includes('facebook') || header.includes('фейсбук')) {
                obj.facebookLink = val;
            }
        });
        
        // Ако колоните не са намерени по имена, вземаме първите 4 (Име, Описание, Снимка, Facebook)
        if (!obj.name) obj.name = line[0] || 'Неизвестно';
        if (!obj.description) obj.description = line[1] || '';
        if (!obj.imageUrl) obj.imageUrl = transformDriveUrl(line[2] || '');
        if (!obj.facebookLink) obj.facebookLink = line[3] || 'https://facebook.com/animalhope.varna';
        
        return obj;
    });
}
