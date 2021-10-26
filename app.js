const express = require('express');
const app = express();
const port = process.env.HTTP_PORT || 3000;

app.use('/api', require('./route/route.js'));

app.listen(port, () => {
    console.log('Server listening on port ' + port);
})
