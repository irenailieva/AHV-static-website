Task: Initialize a modern, static website for "Animal Hope Varna" using Astro.js and Tailwind CSS.

Project Structure:

    High-performance informational site (no database, no adoption filtering).

    Pages to create:

        index.astro (Home): Mission statement and Facebook integration link.

        donate.astro: Crucial page with the IBAN (BG56 FINV 9150 1215 7665 63), PayPal, and Econt info found in our synthesis.

        volunteer.astro: Details about the Sunday meetings at the Cathedral (8:30 AM).

        contact.astro: Official emails, phone (0876 570 311), and links to the Facebook page.

Requirements:

    Use a clean, mobile-friendly design (optimized for 4G/LTE users).

    Implement a "Hero" section on the home page with a clear CTA (Call to Action) for donations.

    Use Bulgarian for all public-facing text.

    Ensure the build is ready for a traditional hosting deployment (static output).

Action: Please generate the file structure, configuration files, and the Donate page content first to ensure the banking details are correctly formatted.


Role: Senior Frontend Developer

Objective: Add a paginated "Adopt" page to the Astro project that fetches data from a public Google Sheet.

Technical Requirements:

    Data Fetching:

        Create a utility src/lib/fetchAnimals.js to fetch data from a Google Sheet CSV export URL.

        The script should parse the CSV and return an array of objects: { name, description, imageUrl }.

        Include logic to transform Google Drive share links into direct image URLs.

    Page Structure (src/pages/adopt/[...page].astro):

        Use Astro's getStaticPaths with the paginate function.

        Set pageSize: 12 (to ensure 3 full rows of 4 animals).

    UI & Layout (Tailwind CSS):

        Grid: Implement a responsive grid: grid-cols-1 (mobile), grid-cols-2 (tablet), and grid-cols-4 (desktop).

        Animal Card: Each card should have a fixed-aspect-ratio image (aspect-square or aspect-[4/3]) with object-cover, the animal's name in a bold font (Montserrat/Poppins), and a "Learn More" button.

        Styling: Use the orange accent color (#f97316) from our CTA banner for buttons and highlights.

    Pagination Controls:

        Add "Previous" and "Next" buttons at the bottom.

        Style the active page number and ensure buttons are disabled when on the first/last page.

    Design Consistency:

        Use the font family and color palette established in the Hero section. Ensure 100/100 accessibility (contrast ratios).

Action: Please generate the fetchAnimals.js utility and the [...page].astro component with the grid and pagination logic. Use placeholder Google Sheet ID for now.

Role: Agentic AI Assistant

Objective: Maintain Localization and Feature Parity Across Languages.

Technical Requirements:

    Localization & Feature Sync:
    When modifying any page or component, systematically check if the exact same feature, bug fix, or UI change needs to be applied to all language versions.

    The project currently supports three languages:
    - Bulgarian (BG): `src/pages/` (default)
    - English (EN): `src/pages/en/`
    - German (DE): `src/pages/de/`

    Critical Workflow Checklist:
    1. Identify the Scope: Does this change affect a page that has localized versions?
    2. Apply Systematically: If yes, apply the exact same logic, HTML structure, or Astro component updates to the corresponding `en` and `de` pages.
    3. Preserve Translations: When syncing structural or logic changes to localized files, be extremely careful to preserve the existing localized text (do not accidentally paste Bulgarian text into English or German files).
    4. Final Verification: Before committing or concluding your task, double-check that all three language versions (`bg`, `en`, `de`) have the newest features and load assets correctly.