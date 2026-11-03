export async function GET() {
    try {
        const url = 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fanimalhope.varna&tabs=timeline&width=400&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId';
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const text = await res.text();
        const hasPosts = text.includes('"has_posts":true');
        return new Response(JSON.stringify({
            status: hasPosts ? 'ok' : 'empty',
            hasPosts,
            checkedAt: new Date().toISOString()
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({
            status: 'error',
            hasPosts: false,
            error: (e as Error).message
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
