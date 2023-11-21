const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json()); 

app.post('/', async function(req, res, next) {
  try {
    if (!Array.isArray(req.body.developers)) {
      return res.status(400).send('Invalid data format: developers should be an array');
    }

    const results = await Promise.all(req.body.developers.map(async d => {
      const res = await axios.get(`https://api.github.com/users/${d}`);
      return { name: res.data.name, bio: res.data.bio };
    }));

    return res.send(JSON.stringify(results));
  } catch (err) {
    next(err); 
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

