require("dotenv").config();
// const axios = require("axios");
const auth = require("./api/auth.js")

async function main() {
  const responseData = await auth.authorizeDevice();
  console.log(responseData);
  auth.verifyDevice(responseData)
}

main();