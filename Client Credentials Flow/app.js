require("dotenv").config();
const axios = require("axios");

function displayResults(responseData) {
    const access_token = JSON.parse(
        Buffer.from(responseData.access_token.split(".")[1], "base64").toString()
    );
    console.log(access_token);
}

async function main() {
    await axios({
      method: "post",
      url: `https://${process.env.OKTA_ORG_URI}/oauth2/default/v1/token`,
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")}`,
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        grant_type: "client_credentials",
        scope: "app:region app:name",
      }
    })
    .then((response) => {
        displayResults(response.data);
    })
    .catch((error) => {
        console.log(error.response.data);
    })
    
}

main();

