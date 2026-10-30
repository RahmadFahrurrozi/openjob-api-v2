require("dotenv").config();
const createApp = require("./app");

const host = process.env.HOST || "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = createApp();

const server = app.listen(port, host, () => {
  console.log(`Server Running on Port http://${host}:${port}`);
});

module.exports = server;
