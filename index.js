require("dotenv").config();
const cors = require('cors');
const express = require("express");
const { connectDB } = require("./src/config/db");
const mainRoutes = require("./src/api/routes/main.routes");

connectDB();

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

//app.use("/", router);
app.use('/api/v1', mainRoutes);

app.use('*', (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err.message || 'unexpected error');
});

app.listen(port, () =>
  console.log(`Server running on port http://localhost:${port}`)
);