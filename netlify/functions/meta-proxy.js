exports.handler = async function(event) {
  const TOKEN = process.env.META_TOKEN;
  const BASE = 'https://graph.facebook.com/v19.0';

  const { path, params } = JSON.parse(event.body || '{}');
  if (!path) return { statusCode: 400, body: JSON.stringify({ error: 'Missing path' }) };

  const url = new URL(`${BASE}/${path}`);
  url.searchParams.set('access_token', TOKEN);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  try {
    const r = await fetch(url.toString());
    const data = await r.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
