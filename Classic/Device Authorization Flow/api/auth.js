const axios = require("axios");
const opener = require("opener");

async function authorizeDevice() {
    return await axios({
      method: "post",
      url: `https://${process.env.OKTA_ORG_URI}/oauth2/default/v1/device/authorize`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: { 
        'client_id': process.env.CLIENT_ID, 
        'scope': 'openid profile offline_access' 
      },
    })
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        console.log(error);
    });
}

async function getToken(device_code) {
  return await axios({
    method: "post",
    url: `https://${process.env.OKTA_ORG_URI}/oauth2/default/v1/token`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      client_id: process.env.CLIENT_ID,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      device_code: device_code,
    },
  })
  .then((response) => {
    return response;
  })
  .catch((error) => {
    console.log(error);
  });
}

// Revoke a given access token
async function revokeToken(access_token) {
  return await axios({
    method: "post",
    url: `https://${process.env.OKTA_ORG_URI}/oauth2/default/v1/revoke`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: {
      token: access_token,
      token_type_hint: "access_token",
      client_id: process.env.CLIENT_ID,
    },
  })
  .then((response) => {
    console.log("Revocation Response: " + response.status);
  })
  .catch((error) => {
    console.log(error);
  });
}

async function verifyDevice(authorizeData) {
  opener(authorizeData.verification_uri_complete);
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const tokenResponse = await getToken(authorizeData.device_code);
  await revokeToken(tokenResponse.data.access_token);
}

module.exports = {
    authorizeDevice,
    verifyDevice,
}