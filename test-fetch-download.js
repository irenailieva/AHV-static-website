import fs from 'fs';

async function test() {
    const fileId = '1b0xZFkFlglTU35SkJCsJ3CwoDLypxTr5'; // Lucky's ID
    const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
    console.log("Fetching from:", url);
    try {
        const res = await fetch(url);
        console.log("Status:", res.status, res.statusText);
        if (res.ok) {
            const arr = await res.arrayBuffer();
            fs.writeFileSync('test-lucky.jpg', Buffer.from(arr));
            console.log("Saved test-lucky.jpg, size:", arr.byteLength);
        } else {
            const text = await res.text();
            console.log("Error body:", text.substring(0, 200));
        }
    } catch (e) {
        console.log("Fetch error:", e.message);
    }
}
test();
