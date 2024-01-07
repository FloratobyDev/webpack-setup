const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
// Serve static files from the React app
if(process.env.NODE_ENV === 'development') {
  app.use(cors());
}

if(process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
