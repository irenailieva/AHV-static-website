# Animal Hope Varna Website

Този проект е официалният уебсайт на Animal Hope Varna, изграден с [Astro](https://astro.build/).

## 🚀 Проектна структура

- `src/pages/`: Всички страници на сайта.
- `src/layouts/`: Общият шаблон (Layout) на сайта.
- `src/lib/`: Помощни функции (напр. извличане на данни от Google Sheets).
- `public/`: Статични ресурси (лого, икони).

## 📊 Интеграция с Google Sheets

Данните за животните (Осинови ме) се извличат директно от Google Sheets. Тъй като сайтът е статичен (SSG), данните се обновяват само по време на "Build".

### Автоматично обновяване (Webhook)

За да се обновява сайтът автоматично при промяна в таблицата:

1. **Създайте Build Hook** във вашия хостинг (Vercel/Netlify).
2. **Отворете Google Sheets** > Extensions > Apps Script.
3. **Поставете следния код** (заменете `YOUR_URL` с вашия Hook):

```javascript
function triggerWebsiteRebuild(e) {
  var deployHookUrl = "YOUR_URL";
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify({ "message": "Google Sheets update" })
  };
  UrlFetchApp.fetch(deployHookUrl, options);
}
```

4. **Настройте Trigger** в Apps Script:
   - Function: `triggerWebsiteRebuild`
   - Event Source: `From spreadsheet`
   - Event Type: `On change`

## 🛠 Команди

| Команда | Действие |
| :--- | :--- |
| `npm install` | Инсталиране на зависимости |
| `npm run dev` | Стартиране на локален сървър |
| `npm run build` | Компилиране на сайта за продукция |

---

## 📧 Контактна форма

Формата за контакти използва **Web3Forms**. За да работи, трябва да има валиден `access_key` в `src/pages/contact.astro`.
