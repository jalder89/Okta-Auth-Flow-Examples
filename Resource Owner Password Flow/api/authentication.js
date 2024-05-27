const axios = require("axios");

async function login(credentials) {
    const response = await axios({
      method: "post",
      url: `https://${process.env.OKTA_ORG_URI}/oauth2/aus1q4mt5yrAtbMLf1d8/v1/token`,
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        grant_type: "password",
        username: credentials.username,
        password: credentials.password,
        scope: "openid",
      },
    })
      .then(async (response) => {
        return response;
      })
      .catch((error) => {
        console.log(`Error: ${error} \nDescription: ${error}`);
        return error.response.data;
      });
  
  if (response.data) {
    const identity_token = JSON.parse(
      Buffer.from(response.data.id_token.split(".")[1], "base64").toString()
    );

    const access_token = JSON.parse(
      Buffer.from(response.data.access_token.split(".")[1], "base64").toString()
    );
    console.log('Access: ');
    console.log(access_token);
    console.log('Identity: ');
    console.log(identity_token);
  }
}

module.exports = {
    login
}