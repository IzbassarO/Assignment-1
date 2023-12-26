const express = require('express');
const path = require('path');
const bmiRoutes = require('./routes/bmiRoutes');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', bmiRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
