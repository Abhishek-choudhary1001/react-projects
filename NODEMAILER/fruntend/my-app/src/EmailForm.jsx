import React, { useState } from 'react';

const EmailForm = () => {
  const [formData, setFormData] = useState({
    to_name: '',
    from_name: '',
    message: '',
    reply_to: ''
  });

  const [response, setResponse] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok) {
        setResponse('✅ Email sent successfully!');
      } else {
        setResponse(`❌ Error: ${result.error}`);
      }
    } catch (err) {
        console.log(err);
        
      setResponse('❌ Failed to connect to server.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Send Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="to_name"
          placeholder="Recipient's Name"
          value={formData.to_name}
          onChange={handleChange}
          required
        /><br />

        <input
          type="text"
          name="from_name"
          placeholder="Your Name"
          value={formData.from_name}
          onChange={handleChange}
          required
        /><br />

        <input
          type="email"
          name="reply_to"
          placeholder="Recipient's Email"
          value={formData.reply_to}
          onChange={handleChange}
          required
        /><br />

        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        /><br />

        <button type="submit">Send Email</button>
      </form>
      {response && <p>{response}</p>}
    </div>
  );
};

export default EmailForm;