const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = 3000;

// CORS middleware configuration
app.use(cors());

// Middleware for parsing JSON bodies
app.use(express.json());

// Use morgan for request logging
app.use(morgan('dev'));

// Custom middleware to capture raw request body
app.use((req, res, next) => {
    let requestData = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body,
        timestamp: new Date().toISOString()
    };
    
    // Log the complete request data
    console.log('Incoming Request:', JSON.stringify(requestData, null, 2));
    
    // Attach the request data to the response
    res.locals.requestData = requestData;
    next();
});

// Echo route - returns the request data
app.all('*', (req, res) => {
    res.json({
        message: "Request received and logged",
        request: res.locals.requestData
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});