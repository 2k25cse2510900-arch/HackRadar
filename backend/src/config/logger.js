const morgan = require("morgan");
const env = require("./env");

module.exports = morgan(env.nodeEnv === "production" ? "combined" : "dev");
