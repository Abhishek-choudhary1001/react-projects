const Url = require('./model/model');
const axios = require('axios');
const { parse } = require('url');
const BITLY_ACCESS_TOKEN = '3189d42f60e8c4f351878e0384ef756a5ecf4c08';

async function handleRequest(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/shorten') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { originalUrl } = JSON.parse(body);
        console.log('Received originalUrl:', originalUrl);

        if (!originalUrl) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'originalUrl is required' }));
        }

        // Check if URL is already shortened in DB
        let url = await Url.findOne({ originalUrl });
        if (url) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(url));
        }

        // Call Bitly API to shorten URL
        try {
          const response = await axios.post(
            'https://api-ssl.bitly.com/v4/shorten',
            { long_url: originalUrl },
            {
              headers: {
                Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
              },
            }
          );

          const shortUrl = response.data.link;
          url = new Url({ originalUrl, shortUrl });
          await url.save();

          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(url));
        } catch (bitlyError) {
          console.error('Bitly API error:', bitlyError.response?.data || bitlyError.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Bitly API error', details: bitlyError.response?.data || bitlyError.message }));
        }
      } catch (e) {
        console.error('JSON parse or DB error:', e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error', details: e.message }));
      }
    });
  } else if (req.method === 'GET') {
    const parsedUrl = parse(req.url);
    const shortParam = parsedUrl.pathname.slice(1);
    const fullShortUrl = `http://localhost:5000/${shortParam}`;

    try {
      const url = await Url.findOne({ shortUrl: fullShortUrl });
      if (url) {
        res.writeHead(302, { Location: url.originalUrl });
        return res.end();
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('URL not found');
      }
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

module.exports = { handleRequest };