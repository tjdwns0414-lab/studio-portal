export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Notion-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'path required' });

  const notionUrl = `https://api.notion.com/v1/${Array.isArray(path) ? path.join('/') : path}`;

  try {
    const response = await fetch(notionUrl, {
      method: req.method,
      headers: {
        'Authorization': req.headers['authorization'],
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
