import { useEffect, useState } from 'react';
import './App.css';
import { motion } from 'framer-motion';

function App() {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const res = await fetch('https://geeked-server.onrender.com/get-links');
    const data = await res.json();
    setLinks(data);
  };

  const handleUpload = async () => {
    setError('');
    setSuccess('');
  
    if (!newName || !newUrl.startsWith('https://docs.google.com/spreadsheets')) {
      setError('Please enter a valid name and Google Sheets URL');
      return;
    }
  
    console.log('Uploading:', { name: newName, url: newUrl });
  
    const res = await fetch('https://geeked-server.onrender.com/submit-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, url: newUrl }),
    });
  
    const data = await res.json();
    if (res.ok) {
      setSuccess('Link uploaded!');
      setNewName('');
      setNewUrl('');
      setShowUpload(false);
      fetchLinks();
    } else {
      setError(data.error || 'Upload failed');
    }
  };

  const filtered = links.filter(link =>
    link.name.toLowerCase().includes(search.toLowerCase())
  );

  const extractPreviewUrl = (url) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) return null;
    return `https://docs.google.com/spreadsheets/d/${match[1]}/preview`;
  };

  return (
    <div className="app-container">
      <div className="content-box">
        <div className="image-row">
          <motion.img
            src="data:image/png;base64,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"
            alt="Logo 1"
            className="pop-image"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.img
            src="data:image/jpeg;base64,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"
            alt="Logo 2"
            className="pop-image"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        <h1 className="title animated-title">
          {'GEEKED Sheet Finder'.split('').map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>


        <div className="search-row">
          <input
            type="text"
            placeholder="Search sheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setShowUpload(true)}>Upload</button>
        </div>

        {showUpload && (
          <div className="upload-panel">
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Google Sheets link"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <div className="upload-buttons">
              <button onClick={handleUpload}>Submit</button>
              <button className="cancel" onClick={() => setShowUpload(false)}>Cancel</button>
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
          </div>
        )}

      <div className="preview-list">
      {filtered.map((link, index) => {
        const preview = extractPreviewUrl(link.url);
        return preview ? (
          <div key={index} className="preview-card" onClick={() => window.open(link.url, '_blank')}>
            <h3>{link.name}</h3>
            <iframe
              title={link.name}
              src={preview}
              className="preview-frame"
              frameBorder="0"
            />
          </div>
        ) : null;
      })}
      </div>
      </div>
    </div>
  );
}

export default App;
