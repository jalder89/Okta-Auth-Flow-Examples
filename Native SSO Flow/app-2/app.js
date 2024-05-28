// Use Authorization Code with PKCE to obtain the authorization code for client 1.
// Exchange the code for tokens.
// Exchange existing tokens that are obtained from client 1 for a new set of tokens for client 2.
// Validate the device secret.
// Revoke the device secret to end the session.
require("dotenv").config();
const axios = require("axios");
const express = require("express");

const app = express();
let session = {};

app.use(express.json());
app.post("/app-1/sso/callback", async (req, res) => {
    res.sendStatus(200);
    console.log("SSO Callback Received!");
    console.log(req.body);
    await axios({
      method: "post",
      url: `https://${process.env.OKTA_ORG_URI}/oauth2/default/v1/token`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        client_id: process.env.CLIENT_ID,
        grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
        actor_token: req.body.session.tokenBundle.device_secret,
        actor_token_type: "urn:x-oath:params:oauth:token-type:device-secret",
        subject_token: req.body.session.tokenBundle.id_token,
        subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
        scope: "openid offline_access",
        audience: "api://default",
      },
    })
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
})

// App listener converts to Number before binding to PORT or 3000. Number() avoids binding issues with Heroku.
app.listen(Number(process.env.PORT || 3000));
console.log(`App listening on ${process.env.PORT || 3000}`);