require("dotenv").config();
// const axios = require("axios");
const auth = require("./api/auth.js")

// function displayResults(responseData) {
//   const access_token = JSON.parse(
//     Buffer.from(responseData.access_token.split(".")[1], "base64").toString()
//   );
//   console.log(access_token);
// }

async function main() {
  const responseData = await auth.authorizeDevice();
  console.log(responseData);
  auth.verifyDevice(responseData)
}

main();

// {
//     "device_code": "4ebdb4de-1f8b-4497-be01-ddfaf83c4e9c",
//     "user_code": "MHXTFRPK",
//     "verification_uri": "https://{yourOktaDomain}/activate",
//     "verification_uri_complete": "https://{yourOktaDomain}/activate?user_code=MHXTFRPK",
//     "expires_in": 600,
//     "interval": 5
// }