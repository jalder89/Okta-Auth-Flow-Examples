const axios = require("axios");

async function getTokens(req, pkceObject) {
  const response = await axios({
    method: "post",
    url: `https://${process.env.OKTA_ORG_URI}/oauth2/${req.query.state}/v1/token`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    params: {
      grant_type: "authorization_code",
      client_id: process.env.CLIENT_ID,
      redirect_uri: "http://localhost:8080/login/callback",
      code: req.query.code,
      code_verifier: pkceObject.verifier,
    },
  })
    .then(async (response) => {
      return response;
    })
    .catch((error) => {
      console.log(
        `Error: ${error.response.data.error} \nDescription: ${error.response.data.error_description}`
      );
      return error.response.data;
    });

  if (response.data) {
    const identity_token = JSON.parse(
      Buffer.from(response.data.id_token.split(".")[1], "base64").toString()
    );
    return response.data;
  }
}

module.exports = {
  getTokens,
};
