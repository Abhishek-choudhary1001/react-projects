const http = require('http');
const fetch = require('node-fetch');

const PORT = 3000;
const SERVICE_ID = 'service_2uapjq9';
const TEMPLATE_ID = 'template_1i6hso9';
const PUBLIC_KEY = 'WvcaDbG0CWLj5Ig3L';

const Server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    if (req.method === 'POST' && req.url === '/send-email') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            (async () => {
                try {
                    let data;
                    try {
                        data = JSON.parse(body);
                    } catch {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ error: 'Invalid JSON' }));
                    }

                    const { to_name, from_name, message, reply_to } = data;

                    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Origin': 'http://localhost'
                        },
                        body: JSON.stringify({
                            service_id: SERVICE_ID,
                            template_id: TEMPLATE_ID,
                            user_id: PUBLIC_KEY,
                            template_params: {
                                to_name,
                                from_name,
                                message,
                                reply_to
                            }
                        })
                    });

                    const resultText = await response.text();

                    if (response.ok) {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Email sent successfully', result: resultText }));
                    } else {
                        throw new Error(resultText);
                    }
                } catch (e) {
                    console.error('Error sending email:', e.message);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to send email', details: e.message }));
                }
            })();
        });

    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

Server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
