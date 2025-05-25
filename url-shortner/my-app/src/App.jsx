import React, { useState } from 'react';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  async function handleShorten() {
    setError('');
    setShortUrl('');
    try {
      const response = await fetch('http://localhost:5000/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),  // send the URL from input state
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <input
        type="text"
        value={originalUrl}
        onChange={e => setOriginalUrl(e.target.value)}
        placeholder="https://www.example.com"
      />
      <button onClick={handleShorten}>Shorten URL</button>

      {shortUrl && (
        <p>
          Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </p>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;