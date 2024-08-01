import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Enable CORS for all origins

// Serve the static HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Proxy route to fetch content
app.post('/webparser', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/xml', // Expected content type
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text(); // Expect raw text for RSS feeds
        res.setHeader('Content-Type', 'application/xml'); // Ensure correct content type
        res.send(data); // Send raw RSS content
    } catch (error) {
        console.error('Error fetching article content:', error);
        res.status(500).json({ error: 'Unable to load content.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
