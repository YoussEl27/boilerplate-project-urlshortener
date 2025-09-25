require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3001;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.use(express.urlencoded({extended: true}));

let urlDB = {};
let idCounter = 1;

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;

  try {
    new URL(url);
  } catch {
    return res.json({ error: "invalid url" });
  }


  dns.lookup(new URL(url).host, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }


    urlDB[idCounter] = url;
    res.json({
      original_url: url,
      short_url: idCounter
    });

    idCounter++;
  });
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const short_url = req.params.short_url;
  const originalUrl = urlDB[short_url];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: "invalid url" });
  }
});
