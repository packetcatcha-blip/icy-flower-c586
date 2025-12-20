export default {
  async fetch(request, env, ctx) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SellerCo - Security Research Lab</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        ul { list-style-type: none; }
        li { margin: 10px 0; }
        footer { margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; color: #666; }
    </style>
</head>
<body>
    <h1>SellerCo Security Research Lab</h1>
    <ul>
        <li>Live Attack Map - Real-time global cyber attack visualization</li>
        <li>Hall of Fame - Top performers leaderboard</li>
        <li>Multi-Colo Trace - View your connection path through global edge network</li>
        <li>Pro Tip: Enable Chaos Mode for AI-randomized security challenges.</li>
    </ul>
    <footer>
        © 2025 SellerCo - Security Research Lab
    </footer>
</body>
</html>
    `;
    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html',
        'Content-Security-Policy-Report-Only': "default-src 'self'; script-src 'self' https://icy-flower-c586.jsellers.workers.dev; frame-ancestors 'self';"
      },
    });
  },
};