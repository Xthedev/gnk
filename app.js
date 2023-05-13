const express = require('express');
const Web = require('./routes/web');
const Api = require('./routes/api');
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: true }));





Web(app);
Api(app);
const port = 3000||process.env.PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})