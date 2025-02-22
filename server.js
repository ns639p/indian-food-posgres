const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const express = require('express');
const dishRouter = require('./routes/dishRoutes.js');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1/dishes', dishRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
