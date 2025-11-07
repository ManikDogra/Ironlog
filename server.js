// Convenience entrypoint to run the backend locally:
// From project root run: node server.js
// This simply imports the real server implementation located in amplify/backend/server.js
import './amplify/backend/server.js';

// No exports — importing the file will start the Express app (it calls app.listen internally).
